const fetch = require('node-fetch');
const airports = require('./airports');
const formatter = require ('./formatter');
const config = require('../config')
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${config.amadeusAPIKey}`;


// Generates the body for the amadeus search query
function generateSearchQuery (origin,destination,date) {
  return new Promise((resolve, reject) => {
    console.log("MADAFAKA : ", origin);
    const originIataPromise = airports.getCityCode(origin);
    const destinationIataPromise = airports.getCityCode(destination);
    const flightDate = formatter.formatDate(date,'flights');

    originIataPromise.then(originIata => {
      destinationIataPromise.then(destinationIata => {
        resolve({
          link: `${amadeusAPI}&origin=${originIata}&destination=${destinationIata}&departure_date=${flightDate}`,
          origin: originIata,
          destination: destinationIata
        });
      })
    })
  })
}

// Looks up low-fare flights tickets and returns cheapest option
function getFlightPrices (origin,destination,date) {
  return new Promise ((resolve, reject) => {
    generateSearchQuery(origin,destination,date).then(searchQuery => {
      fetch(searchQuery.link).then(response => {
        response.json().then(data => {
          const {results} = data;
          const {fare : {total_price : ticketPrice}} = results[0];
          resolve({
            flightPrice : `$${parseInt(ticketPrice)}`,
            origin : searchQuery.origin,
            destination : searchQuery.destination
          });
        });
      });
    });
  });
}

module.exports = {
  getFlightPrices
}
