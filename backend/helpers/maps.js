const config = require('../config');
const googleMaps = require('@google/maps').createClient({
    key: config.googleMapsKey
});


// Gets latitude and longitude of location
const getCoordinates = location => {
    return new Promise((resolve, reject) => {
        googleMaps.geocode({ address: location }, (err, response) => {
            const { geometry: { location: { lat, lng } } } = response.json.results[0];
            resolve({ lat, lng });
        });
    });
}

// Reverse geocodes the lat and lng and returns the location
const getLocationBasedOnCoordinates = ({ lat, lng }) => {
    return new Promise((resolve, reject) => {
        googleMaps.reverseGeocode({ latlng: [lat, lng] }, (err, response) => {
            const results = response.json.results;
            if (results) {
                city = results[0].address_components[2].long_name;
                country = results[0].address_components[3].long_name;
                resolve(`${city}, ${country}`)
            }
            resolve(false);
        });
    });
}


module.exports = {
    getCoordinates,
    getLocationBasedOnCoordinates
}