const fetch = require('node-fetch');
const airports = require('./airports');
const formatter = require ('./formatter');
const config = require('../config')
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${config.amadeusAPIKey}`;
const DataCacheUtil = require('./cachedDataLoader');


// Generates the body for the amadeus search query
function generateSearchQuery (origin,destination,date) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("GENERATING SEARCH QUERY ... ");
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

const _getFlightPriceDetails = (searchQuery, results) => {

  const {fare : {total_price : ticketPrice}} = results[0]; 
  return {
      flightPriceAmount : parseInt(ticketPrice),
      origin : searchQuery.origin,
      destination : searchQuery.destination
  }
}

// Looks up low-fare flights tickets and returns cheapest option
function getFlightPrices (origin,destination,date) {
  return new Promise(async (resolve, reject) => {
    try {
      const searchQuery = await generateSearchQuery(origin,destination,date);
      const { results } = await fetch(searchQuery.link).then(res => res.json());
      const flightPriceDetails = _getFlightPriceDetails(searchQuery, results);
      DataCacheUtil.cacheResults({ type: DataCacheUtil.DataType.FLIGHT_DETAILS, data: {origin, destination, ...flightPriceDetails} });
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
