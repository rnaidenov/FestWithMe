const fetch = require('node-fetch');
// const geocoder = require('geocoder');
const config = require('../config');
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=${config.amadeusAPIKey}`;
const FlightScanner = require('skiplagged-node-api');
const CurrencyConverter = require('./currencies');
const Formatter = require('./formatter');
const DataCacheUtil = require('./cachedDataLoader');
const SKIPLAGGED_DEFAULT_CURRENCY_SYMBOL = '$';
const SKIPLAGGED_BASE_URL = 'https://skiplagged.com/flights';
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
const _getCityIATACode = location => {
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



const _formatResponse = async ({ inboundFlightDetails, outboundFlightDetails, originIata, destinationIata, inboundDate, outboundDate, currency }) => {
  const { price: inboundFlightPrice, flightCode: inboundFlightCode } = inboundFlightDetails;
  const { price: outboundFlightPrice, flightCode: outboundFlightCode } = outboundFlightDetails;
  const inboundPriceDetails = await CurrencyConverter.convert(SKIPLAGGED_DEFAULT_CURRENCY_SYMBOL, currency, inboundFlightPrice);
  const outboundPriceDetails = await CurrencyConverter.convert(SKIPLAGGED_DEFAULT_CURRENCY_SYMBOL, currency, outboundFlightPrice);
  return {
    flightPriceAmount: inboundPriceDetails.convertedAmount + outboundPriceDetails.convertedAmount,
    origin: originIata,
    destination: destinationIata,
    url: `${SKIPLAGGED_BASE_URL}/${originIata}/${destinationIata}/${inboundDate}/${outboundDate}#trip=${inboundFlightCode},${outboundFlightCode}`
  }
}


const _getCheapestFlightDetails = ({ from, to, departureDate }) => {
  return new Promise(async (resolve, reject) => {
    const searchOptions = { from, to, departureDate };
    console.log(searchOptions);
    const flightsResults = await FlightScanner(searchOptions);
    console.log(flightsResults);
    const { price: priceWithCurrency, legs: flightDetails } = flightsResults[0];
    const { flightCode } = flightDetails[0];
    const price = Number(priceWithCurrency.split(SKIPLAGGED_DEFAULT_CURRENCY_SYMBOL)[1]);
    resolve({ price, flightCode });
  });
}



const _getFlightPriceDetails = async (searchQuery, results, currency) => {
  const { fare: { total_price: ticketPrice } } = results[0];
  const flightPrice = await CurrencyConverter.convert(AMADEUS_DEFAULT_CURRENCY_SYMBOL, currency, parseInt(ticketPrice))
  return {
    flightPriceAmount: flightPrice.convertedAmount,
    origin: searchQuery.origin,
    destination: searchQuery.destination
  }
}


const getFlightPrices = (origin, destination, date, daysOfStay, currency) => {
  return new Promise(async (resolve, reject) => {
    try {
      const originIata = await _getCityIATACode(origin);
      const destinationIata = await _getCityIATACode(destination);
      const formattedInboundDate = Formatter.formatDate(date);
      const inboundFlightDetails = await _getCheapestFlightDetails({ from: originIata, to: destinationIata, departureDate: formattedInboundDate });
      const formattedOutboundDate = Formatter.formatDate(date, { more: true, days: Number(daysOfStay) });
      const outboundFlightDetails = await _getCheapestFlightDetails({ from: destinationIata, to: originIata, departureDate: formattedOutboundDate });
      const flightPriceDetails = await _formatResponse({ inboundFlightDetails, outboundFlightDetails, originIata, destinationIata, formattedInboundDate, formattedOutboundDate, currency });
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



// function getFlightPrices(origin, destination, date, currency) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const searchQuery = await generateSearchQuery(origin, destination, date);
//       const { results } = await fetch(searchQuery.link).then(res => res.json());
//       const flightPriceDetails = _getFlightPriceDetails(searchQuery, results, currency);
//       DataCacheUtil.cacheResults({ type: DataCacheUtil.DataType.FLIGHT_DETAILS, data: { origin, destination, flightPriceDetails } });
//       resolve(flightPriceDetails);
//     } catch (err) {
//       resolve({
//         flightPriceAmount: 0,
//         error: `Unable to fetch price details for flight ticket. Error: ${err}`
//       })
//     }
//   });
// }



module.exports = {
  getFlightPrices
}
