const fetch = require('node-fetch');
const airports = require('./airports');
const formatter = require ('./formatter');
const CurrencyConverter = require('./currencies');
const config = require('../config')
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${config.amadeusAPIKey}`;
const DataCacheUtil = require('./cachedDataLoader');
const AMADEUS_DEFAULT_CURRENCY_SYMBOL = '$';


// Generates the body for the amadeus search query
function generateSearchQuery (origin,destination,date) {
  return new Promise(async (resolve, reject) => {
    try {
      const originIata = await airports.getCityCode(origin);
      const destinationIata = await airports.getCityCode(destination);
      const flightDate = formatter.formatDate(date,{more:false,days:1});
      resolve({
        link: `${amadeusAPI}&origin=${originIata}&destination=${destinationIata}&departure_date=${flightDate}`,
        origin: originIata,
        destination: destinationIata
      });
    } catch(err) {
      reject(`Unable to generate search query for Amadeus. Error: ${err}`);
    }
  })
}

const _getFlightPriceDetails = async (searchQuery, results, currency) => {

  const {fare : {total_price : ticketPrice}} = results[0]; 
  const flightPrice = await CurrencyConverter.convert(AMADEUS_DEFAULT_CURRENCY_SYMBOL,currency,parseInt(ticketPrice))
  return {
      flightPriceAmount : flightPrice.convertedAmount,
      origin : searchQuery.origin,
      destination : searchQuery.destination
  }
}

// Looks up low-fare flights tickets and returns cheapest option
function getFlightPrices (origin,destination,date,currency) {
  return new Promise(async (resolve, reject) => {
    try {
      const searchQuery = await generateSearchQuery(origin,destination,date);
      const { results } = await fetch(searchQuery.link).then(res => res.json());
      const flightPriceDetails = _getFlightPriceDetails(searchQuery, results, currency);
      DataCacheUtil.cacheResults({ type: DataCacheUtil.DataType.FLIGHT_DETAILS, data: {origin, destination, flightPriceDetails} });
      resolve(flightPriceDetails);
    } catch(err) {
      resolve({
        flightPriceAmount:0,
        error:`Unable to fetch price details for flight ticket. Error: ${err}`
      })
    }   
  });
}

module.exports = {
  getFlightPrices
}
