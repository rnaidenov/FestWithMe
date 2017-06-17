const fetch = require('node-fetch');
const API = require('qpx-express');
const airports = require('airport-codes');
const apiKey = 'AIzaSyBtSws0VCIlzHDhXOpn9KR_3Juw9pIxe1Q';
const formatter = require ('./formatter');
const apiKey2 = 'AIzaSyD8yemJXcjTgYV7d_goyxKuwKNpd35VhXw';
const qpx = new API(apiKey2);


// Get the capital of desired country
function getCapitalCity (countryName) {
  return new Promise ((resolve, reject) => {
    const response = fetch(`https://restcountries.eu/rest/v2/name/${countryName}`);
    response.then(data => {
      data.json().then(data_json => {
        resolve(data_json[0].capital);
      })
    })
  })
}

// Get a list of airports based on city and country name
function getAirports (cityName, countryName) {
  return new Promise ((resolve, reject) => {
    const airportsArr = airports.where({city: cityName, country: countryName});

    // If there is no airport in required city
    // look for airports in the capital of the country
    if (!airportsArr.length) {
      const capitalCityPromise = getCapitalCity(countryName);
      capitalCityPromise.then(capitalCity => {
        const capitalAirportsArr = airports.where({city: capitalCity, country: countryName});
        resolve(capitalAirportsArr);
      })
    } else {
      resolve(airportsArr);
    }
  });
}


// Get the iata code based on city and country names
function getIataCode (cityName, countryName) {

  return new Promise ((resolve, reject) => {

    let airportsArrPromise = getAirports(cityName, countryName);

    airportsArrPromise.then(airportsArr => {
      let firstAirport = airportsArr[0].attributes.iata;
      if (airportsArr.length > 1) {
        for (let airportInfo of airportsArr) {
          const {attributes : airport} = airportInfo;
          if (airport.name == 'All Airports') {
            firstAirport = airport.iata;
            break;
          }
        }
      }
      resolve(firstAirport);
    })
  })
}

// Generates the body for the qpx search query
function generateSearchQuery (origin, destination, date) {
  return new Promise ((resolve, reject) => {
    const [cityOrigin, countryOrigin] = origin.split(",");
    const [cityDest, countryDest] = destination.split(",");
    const originIataPromise = getIataCode(cityOrigin,countryOrigin);
    const destinationIataPromise = getIataCode(cityDest, countryDest);
    const flightDate = formatter.formatDate(date,'flights');

    originIataPromise.then(originIata => {
      destinationIataPromise.then(destinationIata => {
        const body = {
          "request": {
            "passengers": { "adultCount": 1 },
            "slice": [{
              "origin": originIata,
              "destination": destinationIata,
              "date": flightDate  // yyyy-mm-dd
            }]
          }
        };
        resolve(body);
      })
    })
  });
}

// Getting data for flights from qpx api
function getFlightPrices (origin, destination, date) {

  return new Promise ((resolve, reject) => {
    generateSearchQuery(origin, destination, date).then(body => {
        qpx.getInfo(body, (err,data) => {
          const {trips : { tripOption : tripsArr } } = data;
          const cheapestFlight = tripsArr[0];
          let duration = tripsArr[0].slice[0].duration;
          let flightPrice = tripsArr[0].pricing[0].saleTotal;

          for (let trip of tripsArr) {
            let stops = trip.slice[0].segment;

            // If there is a direct flight, return that one, otherwise return cheapest
            // TODO: add option for user to select
            if (stops.length == 1) {
              duration = trip.slice[0].duration;
              flightPrice = trip.pricing[0].saleTotal;
              let flight = stops[0].flight;
              break;
            }
          }
          
          const {origin, destination} = body.request.slice[0];
          resolve({
            duration,
            price : flightPrice,
            origin,
            destination
          });
        });
      });
    });
}

module.exports = {
  getFlightPrices
}
