const fetch = require('node-fetch');
const config = require('../config');
const Formatter = require('./formatter');
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2//airports/nearest-relevant?apikey=${config.amadeusAPIKey}`;
const googleMaps = require('@google/maps').createClient({
  key: config.googleMapsKey
});
const SKYSCANNER_BASE_URL =  `https://www.skyscanner.net/transport/flights`




// Returns a 3-letter code of city, where nearest airport is located
// const getCityCode = location => {
  //   return new Promise(async (resolve, reject) => {
    //     try {
      //       const  { lat, lng } = await getCoordinates(location);
      //       const data = await fetch(`${amadeusAPI}&latitude=${lat}&longitude=${lng}`).then(res => res.json());
      //       const { city } = data[0];
      //       resolve(city);
      //     } catch(err) {
        //       reject(`Unable to fetch IATA code for ${location}`);
        //     }
//   });
// }



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
      const  { lat, lng } = await _getCoordinates(location);
      const data = await fetch(`${amadeusAPI}&latitude=${lat}&longitude=${lng}`).then(res => res.json());
      const { city } = data[0];
      resolve(city);
    } catch(err) {
      reject(`Unable to fetch IATA code for ${location}`);
    }
  });
}




// https://www.skyscanner.net/transport/flights/lon/sof/180430?adults=1&currency=EUR

// Generates the body for the amadeus search query
// function generateSearchQuery (origin,destination,date) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const originIata = await airports.getCityCode(origin);
//       const destinationIata = await airports.getCityCode(destination);
//       const flightDate = formatter.formatDate(date,{more:false,days:1});
//       resolve({
//         link: `${SKYSCANNER_BASE_URL}/${originIata}/${destinationIata}/${flightDate}/`,
//         origin: originIata,
//         destination: destinationIata
//       });
//     } catch(err) {
//       reject(`Unable to generate search query for Amadeus. Error: ${err}`);
//     }
//   })
// }


const generateSearchQuery = (origin, destination, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const originIata = await _getCityIATACode(origin);
      const destinationIata = await _getCityIATACode(destination);
      const flightDate = Formatter.formatDate(date,false,true);
      resolve({
        link: `${SKYSCANNER_BASE_URL}/${originIata}/${destinationIata}/${flightDate}/`,
        origin: originIata,
        destination: destinationIata
      });
    } catch(err) {
      reject(`Unable to generate search query for Amadeus. Error: ${err}`);
    }
  })
}

generateSearchQuery('London, United Kingdom','Mannheim','28 June 2018').then(res => console.log(res));


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
  _getCityIATACode
}