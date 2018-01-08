const fetch = require('node-fetch');
// const geocoder = require('geocoder');
const config = require('../config');
const amadeusAPI = `https://api.sandbox.amadeus.com/v1.2//airports/nearest-relevant?apikey=${config.amadeusAPIKey}`;
const googleMaps = require('@google/maps').createClient({
  key: config.googleMapsKey
});

// Returns a 3-letter code of city, where nearest airport is located
const getCityCode = location => {
  return new Promise(async (resolve, reject) => {
    try {
      const  { lat, lng } = await getCoordinates(location);
      const data = await fetch(`${amadeusAPI}&latitude=${lat}&longitude=${lng}`).then(res => res.json());
      const { city } = data[0];
      resolve(city);
    } catch(err) {
      reject(`Unable to fetch IATA code for ${location}`);
    }
  });
}



// Gets latitude and longitude of location
function getCoordinates(location) {
  return new Promise((resolve, reject) => {
    googleMaps.geocode({ address: location }, (err, response) => {
      const { geometry: { location: { lat, lng } } } = response.json.results[0];
      resolve({
        lat,
        lng
      });
    });
  });
}

module.exports = {
  getCityCode
}
