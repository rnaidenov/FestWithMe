const fetch = require('node-fetch');
const geocoder = require('geocoder');
const config = require('../config');
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2//airports/nearest-relevant?apikey=${config.amadeusAPIKey}`;

// Returns a 3-letter code of city, where nearest airport is located
function getCityCode (location) {
  return new Promise((resolve, reject) => {
    getCoordinates(location).then(geocode => {
      const {lat, lng} = geocode;
      fetch(`${amadeusAPI}&latitude=${lat}&longitude=${lng}`).then(response => {
        response.json()
          .then(data => {
            const {city : cityCode} = data[0];
            resolve(cityCode)
          })
      });
    });
  });
}

// Gets latitude and longitude of location
function getCoordinates (location) {
  return new Promise ((resolve, reject) => {
    geocoder.geocode(location, (err, data) => {
      const {results} = data;
      const {geometry : {location : {lat, lng}}} = results[0];
      resolve({
        lat,
        lng
      });
    })
  })
}

module.exports = {
  getCityCode
}
