const fetch = require('node-fetch');
const config = require('../config');
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=${config.amadeusAPIKey}`;
const CurrencyConverter = require('./currencies');
const Formatter = require('./formatter');
const DataCacheUtil = require('./cachedDataLoader');
const SKIPLAGGED_DEFAULT_CURRENCY_SYMBOL = '$';
const SKIPLAGGED_BASE_URL = 'https://skiplagged.com/flights';
const KIWI_API_BASE_URL = 'https://api.skypicker.com/flights?partner=picky';
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


const _composeSearchLink = (origin, destination, date, daysOfStay, currencySymbol) => {
  return new Promise(async (resolve, reject) => {
    try {
      const originIata = await _getIATACode(origin);
      const destinationIata = await _getIATACode(destination);
      const inboundDate = Formatter.formatDate(date, { more: false, days: 1 }, true);
      const outboundDate = Formatter.formatDate(date, { more: true, days: Number(daysOfStay) - 1 }, true);
      const currencyCode = CurrencyConverter.getCurrencyCode(currencySymbol);
      resolve(`${KIWI_API_BASE_URL}&flyFrom=${originIata}&to=${destinationIata}&dateFrom=${inboundDate}&dateTo=${inboundDate}&returnFrom=${outboundDate}&returnTo=${outboundDate}&curr=${currencyCode}`)
    } catch (err) {
      reject(`Error when composing flight search url: Reason: ${err}`);
    }
  });
}


_composeSearchLink('London', 'Sofia', '18 July 2018', 7, '£').then(console.log).catch(console.log)


const _getCheapestFlightDetails = (origin, destination, date, daysOfStay, currencySymbol) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = await _composeSearchLink(origin, destination, date, daysOfStay, currencySymbol);
      const flightSearchDetails = await fetch(url).then(res => res.json());
      resolve(flightSearchDetails);
    } catch(err){
      reject(`Unable to get flight details for ${origin} - ${destination} on ${date}. Reason: ${err}`);
    }
  });
}

_getCheapestFlightDetails('London','Sofia','19 May 2018',5,'£').then(console.log);


// _getCheapestFlightDetails({ originIata: 'SOF', destinationIata: 'LON', departureDate: '2018-06-09' }).then(console.log);


const _formatResponse = ({ inboundFlightDetails, outboundFlightDetails, originIata, destinationIata, inboundDate, outboundDate, currency }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { price: inboundFlightPrice, flightCode: inboundFlightCode } = inboundFlightDetails;
      const { price: outboundFlightPrice, flightCode: outboundFlightCode } = outboundFlightDetails;
      const totalPriceInDollars = Number(inboundFlightPrice) + Number(outboundFlightPrice);
      const totalPrice = await CurrencyConverter.convert(SKIPLAGGED_DEFAULT_CURRENCY_SYMBOL, currency, totalPriceInDollars);
      resolve({
        flightPriceAmount: totalPrice.convertedAmount,
        origin: originIata,
        destination: destinationIata,
        url: `${SKIPLAGGED_BASE_URL}/${originIata}/${destinationIata}/${inboundDate}/${outboundDate}#trip=${inboundFlightCode},${outboundFlightCode}`
      })
    } catch (err) {
      reject(`Unable format flight details response. Most probably issue with currency conversion. Error: ${err}`);
    }
  });
}

const getFlightPrices = (origin, destination, date, daysOfStay, currency) => {
  return new Promise(async resolve => {
    try {
      const originIata = await _getIATACode(origin);
      const destinationIata = await _getIATACode(destination);
      const inboundDate = Formatter.formatDate(date, { more: false, days: 1 });
      const outboundDate = Formatter.formatDate(date, { more: true, days: Number(daysOfStay) });
      const inboundFlightDetails = await _getCheapestFlightDetails({ originIata, destinationIata, departureDate: inboundDate });
      const outboundFlightDetails = await _getCheapestFlightDetails({ originIata: destinationIata, destinationIata: originIata, departureDate: outboundDate });
      const flightPriceDetails = await _formatResponse({ inboundFlightDetails, outboundFlightDetails, originIata, destinationIata, inboundDate, outboundDate, currency });
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
