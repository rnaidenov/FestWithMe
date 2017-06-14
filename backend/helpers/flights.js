const API = require('qpx-express');
const airports = require('airport-codes');
const apiKey = 'AIzaSyBtSws0VCIlzHDhXOpn9KR_3Juw9pIxe1Q';
const formatter = require ('./formatter');
const apiKey2 = 'AIzaSyD8yemJXcjTgYV7d_goyxKuwKNpd35VhXw';
const qpx = new API(apiKey2);



// Get the iata code based on city and country names
function getIataCode (cityName, countryName) {

  const airportsArr = airports.where({city: cityName, country: countryName});
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
  return firstAirport;
}


function getFlightPrices (origin, destination, date) {
  const [cityOrigin, countryOrigin] = origin.split(",");
  const [cityDest, countryDest] = destination.split(",");

  const originIata = getIataCode(cityOrigin,countryOrigin);
  const destinationIata = getIataCode(cityDest, countryDest);
  const flightDate = formatter.formatDate(date,'flights');
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


  // Getting data for flights from qpx api
  return new Promise ((resolve, reject) => {
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

      resolve({
        duration,
        price : flightPrice,
        origin : originIata,
        destination : destinationIata
      });
    })
  });
}

module.exports = {
  getFlightPrices
}
