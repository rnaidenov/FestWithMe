const fetch = require('node-fetch');
const config = require('../config');
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=${config.amadeusAPIKey}`;
const CurrencyConverter = require('./currencies');
const Formatter = require('./formatter');
const DataCacheUtil = require('./cachedDataLoader');
const KIWI_API_BASE_URL = 'https://api.skypicker.com/flights?partner=picky&directFlights=1';
const googleMaps = require('@google/maps').createClient({
  key: config.googleMapsKey
});


// Gets latitude and longitude of location
const _getCoordinates = location => {
  return new Promise((resolve, reject) => {
    googleMaps.geocode({ address: location }, (err, response) => {
      const { geometry: { location: { lat, lng } } } = response.json.results[0];
      resolve({ lat, lng });
    });
  });
}


// Returns a 3-letter code of city, where nearest airport is located
const _getIATACode = location => {
  return new Promise(async (resolve, reject) => {
    try {
      const { lat, lng } = await _getCoordinates(location);
      const data = await fetch(`${amadeusAPI}&latitude=${lat}&longitude=${lng}`).then(res => res.json());
      const { city } = data[0];
      resolve(city);
    } catch (err) {
      reject(`Unable to fetch IATA code for ${location}`);
    }
  });
}


const _composeSearchLink = (originIata, destinationIata, date, daysOfStay, currencyCode) => {
    const inboundDate = Formatter.formatDate(date, { more: false, days: 1 }, true);
    const outboundDate = Formatter.formatDate(date, { more: true, days: Number(daysOfStay) - 1 }, true);
    return `${KIWI_API_BASE_URL}&flyFrom=${originIata}&to=${destinationIata}&dateFrom=${inboundDate}&dateTo=${inboundDate}&returnFrom=${outboundDate}&returnTo=${outboundDate}&curr=${currencyCode}`;  
}



const _formatResponse = ({ originIata, destinationIata, flightSearchDetails, currencyCode }) => {
  return new Promise(async (resolve, reject) => {
      const { data } = flightSearchDetails;
      if(data.length){
        const cheapestFlight = data[0];
        const { conversion, deep_link: bookingUrl } = cheapestFlight;
        const flightPriceAmount = conversion[currencyCode];
        resolve({ flightPriceAmount, origin: originIata, destination: destinationIata, url: bookingUrl })
      } else{
        // TODO: Need to update this
        reject(`There are no direct flights from ${originIata} to ${destinationIata}. Maybe try searching for indirect flight options.`);
      }
  })
}

const _getCheapestFlightDetails = (origin, destination, date, daysOfStay, currencySymbol) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currencyCode = CurrencyConverter.getCurrencyCode(currencySymbol);
      const originIata = await _getIATACode(origin);
      const destinationIata = await _getIATACode(destination);
      const url = _composeSearchLink(origin, destination, date, daysOfStay, currencyCode);
      const flightSearchDetails = await fetch(url).then(res => res.json());
      const flightPriceDetails = _formatResponse({ originIata, destinationIata, flightSearchDetails, currencyCode });
      resolve(flightPriceDetails);
    } catch(err){
      reject(`Unable to get flight details for ${origin} - ${destination} on ${date}. Reason: ${err}`);
    }
  });
}


const getFlightPrices = (origin, destination, date, daysOfStay, currency) => {
  return new Promise(async resolve => {
    try {
      const flightPriceDetails = await _getCheapestFlightDetails(origin, destination, date, daysOfStay, currency);
      DataCacheUtil.cacheResults({ type: DataCacheUtil.DataType.FLIGHT_DETAILS, data: { origin, destination, flightPriceDetails } });
      resolve(flightPriceDetails);
    } catch (err) {
      resolve({
        flightPriceAmount: 0,
        error: `Unable to fetch price details for flight ticket. Error: ${err}`
      })
    }
  });
}

module.exports = {
  getFlightPrices
}
