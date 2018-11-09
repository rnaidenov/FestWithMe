const fetch = require('node-fetch');
const config = require('../config');
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=${config.amadeusAPIKey}`;
const CurrencyConverter = require('./currencies');
const Formatter = require('./formatter');
const DataCacheUtil = require('./cachedDataLoader');
const KIWI_API_BASE_URL = 'https://api.skypicker.com/flights?partner=picky';
const GoogleMaps = require('./maps')





// Returns a 3-letter code of city, where nearest airport is located
const getIATACode = location => {
  return new Promise(async (resolve, reject) => {
    try {
      const { lat, lng } = await GoogleMaps.getCoordinates(location);
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

const _getDirectFlight = (allFlightOptions) => {
  for (let flightOption of allFlightOptions) {
    const { pnr_count: numFlights } = flightOption;
    if (Number(numFlights) === 2) return flightOption;
  }
  return null;
}

const _formatResponse = ({ originIata, destinationIata, flightSearchDetails, currencyCode }) => {
  return new Promise(async (resolve, reject) => {
    const { data } = flightSearchDetails;
    try {
      const directFlight =  _getDirectFlight(data);
      const cheapestFlight = data[0];
      const flightDetails = directFlight!==null ? directFlight : cheapestFlight;
      const { conversion, deep_link: bookingUrl } = flightDetails;
      const flightPriceAmount = conversion[currencyCode];
      resolve({ flightPriceAmount, origin: originIata, destination: destinationIata, url: bookingUrl })
    } catch(err){
      reject(err);
    }
  })
}


const _getCheapestFlightDetails = (origin, destination, date, daysOfStay, currencySymbol) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currencyCode = CurrencyConverter.getCurrencyCode(currencySymbol);
      const originIata = await getIATACode(origin);
      const destinationIata = await getIATACode(destination);
      const url = _composeSearchLink(originIata, destinationIata, date, daysOfStay, currencyCode);
      const flightSearchDetails = await fetch(url).then(res => res.json());
      const flightPriceDetails = _formatResponse({ originIata, destinationIata, flightSearchDetails, currencyCode });
      resolve(flightPriceDetails);
    } catch (err) {
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
  getFlightPrices,
  getIATACode
}
