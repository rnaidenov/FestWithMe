const config = require('../config');
const Formatter = require('./formatter');
const CurrencyConverter = require('./currencies');
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2//airports/nearest-relevant?apikey=${config.amadeusAPIKey}`;
const googleMaps = require('@google/maps').createClient({
  key: config.googleMapsKey
});
const fetch = require('node-fetch')
const request = require('request');
const cheerio = require('cheerio');
const HtmlParser = require('./htmlParser');
const SKYSCANNER_BASE_URL = `https://www.skyscanner.net/transport/flights`


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
      const data = await fetch(`${amadeusAPI}&latitude=${lat}&longitude=${lng}`).then(res => {res.json()});
      const { city } = data[0];
      resolve(city);
    } catch (err) {
      console.log(err);
      reject(`Unable to fetch IATA code for ${location}`);
    }
  });
}




// https://www.skyscanner.net/transport/flights/lon/sof/180430?adults=1&currency=EUR





// https://www.skyscanner.net/transport/flights/lond/fra/180628/180703?adults=3
// https://www.skyscanner.net/transport/flights/LON/FRA/180628/180703?adults=3&currency=GBP

// const _getFlightPriceDetails = async (searchQuery, results, currency) => {

//   const { fare: { total_price: ticketPrice } } = results[0];
//   const flightPrice = await CurrencyConverter.convert(AMADEUS_DEFAULT_CURRENCY_SYMBOL, currency, parseInt(ticketPrice))
//   return {
//     flightPriceAmount: flightPrice.convertedAmount,
//     origin: searchQuery.origin,
//     destination: searchQuery.destination
//   }
// }



const getCheapestFlightPrice = pageBody => {
  return new Promise((resolve, reject) => {
    try {
      const $ = cheerio.load(body);
      console.log($);
      const mainHtml = $('#detail', '.clearfix');
      const parentTag = mainHtml.children().children()['0'].children;

     
    } catch (err) {
      reject('Unable to get cheapest flight price. ', err);
    }
  })
}

const _generateSearchQuery = (origin, destination, date, numPeople, nightsOfStay, currencySymbol) => {
  return new Promise(async (resolve, reject) => {
    try {
      const originIata = await _getCityIATACode(origin);
      const destinationIata = await _getCityIATACode(destination);
      const outboundDate = Formatter.formatDate(date, false, true);
      const inboundDate = Formatter.formatDate(date, { more: true, days: Number(nightsOfStay) }, true);
      const currencyCode = CurrencyConverter.getCurrencyCode(currencySymbol);
      resolve({
        link: `${SKYSCANNER_BASE_URL}/${originIata}/${destinationIata}/${outboundDate}/${inboundDate}?adultsv2=${numPeople}&currency=${currencyCode}`,
        origin: originIata,
        destination: destinationIata
      });
    } catch (err) {
      reject(`Unable to generate search query for Skyscanner. Error: ${err}`);
    }
  })
}


const getFlightPrices = (origin, destination, date, numPeople, nights, currency) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("generating link ...")
      const searchQuery = await _generateSearchQuery(origin, destination, date, numPeople, nights, currency);
      console.log(searchQuery.link)
      const flightsDetails = await HtmlParser.getEventBody(searchQuery.link).then(pageBody => getCheapestFlightPrice(pageBody));
      DataCacheUtil.cacheResults({ type: DataCacheUtil.DataType.FLIGHT_DETAILS, data: { origin, destination, flightPriceDetails } });
    } catch (err) {
      resolve({
        flightPriceAmount: 0,
        error: `Unable to fetch price details for flight ticket. Error: ${err}`
      })
    }
  });
}


_generateSearchQuery('Sofia', 'Moscow', '5 August 2018', '8', '3', '£');

// Looks up low-fare flights tickets and returns cheapest option
// function getFlightPrices(origin, destination, date, currency) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const searchQuery = await _generateSearchQuery(origin, destination, date);
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
  _getCityIATACode
}