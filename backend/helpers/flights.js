const API = require('qpx-express');
const airports = require('airport-codes');


const apiKey = 'AIzaSyBtSws0VCIlzHDhXOpn9KR_3Juw9pIxe1Q';
const apiKey2 = 'AIzaSyD8yemJXcjTgYV7d_goyxKuwKNpd35VhXw';

// Get the iata code based on city and country names
function getIataCode (cityName, countryName) {
  const airportsArr = airports.where({city: cityName, country: countryName});
  const firstAirport = airportsArr[0].attributes.iata;
  if (airportsArr.length > 1) {
    for (let airportInfo of airportsArr) {
        const {attributes : airport} = airportInfo;
        if (airport.name == 'All Airports') {
          return airport.iata;
        }
        else {
          return firstAirport;
        }
    }
  }
  else {
    return firstAirport;
  }
}

module.exports = {
  getCityCode
}


    // const qpx = new API(apiKey2);
    //
    // const body = {
    //     "request": {
    //         "passengers": { "adultCount": 1 },
    //         "slice": [{
    //             "origin": sofiaIata,
    //             "destination": parisIata,
    //             "date": '2017-12-05'
    //           }
    //         ]
    //       }
    //     };
    //
    //
    // qpx.getInfo(body, (err,data) => {
    //   const {trips : { tripOption : tripsArr } } = data;
    //   for (let trip of tripsArr) {
    //     let stops = trip.slice[0].segment;
    //     let pricing = trip.pricing[0];
    //     if (stops.length == 1) {
    //       let {saleTotal : flightPrice} = pricing;
    //       let flight = stops[0].flight;
    //
    //       console.log(`Flight ${flight.carrier} ${flight.number} costs ${flightPrice}`);
    //     }
    //   }
    // })
