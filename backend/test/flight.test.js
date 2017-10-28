const assert = require('chai').assert;
const expect = require('chai').expect;
const Airports = require('../helpers/airports');
const Amadeus = require('../helpers/amadeus');
const config = require('../config');


describe('Flight Details', () => {
    
    describe('Check for correct IATA codes', () => {
        checkCityIata('Sofia','SOFa');
        checkCityIata('Reading, United Kingdom','LON');
        checkCityIata('Amsterdam','AMS');
        checkCityIata('Berlin','BER');
        checkCityIata('Lausanne','GVA');
    });


    // describe('Ensure Amadeus is giving back flight data.', () => {
    //     const flightDate = _getNextMonthDate();
    //     getFlightData('Sofia','London',flightDate);
    // });
});

function checkCityIata (city, expectedIata) {
    it(`Gets correct IATA code for ${city}.`,() => {     
        return Airports.getCityCode(city)
            .then(cityCode => {
                expect(cityCode).to.equal(expectedIata,`The IATA code for ${city} should have been '${expectedIata}', but is '${cityCode}'.`);
            })
            .catch(err => {
                assert(false,err.message);
            })
    });
}


function getFlightData (originCity, destinationCity,date) {
    it(`Gets flight data for following month for flights between ${originCity} and ${destinationCity}`, function () {
        this.timeout(config.testsMaxTimeout);

        return Amadeus.getFlightPrices(originCity,destinationCity,date)
            .then(flightDetails => {
                expect(flightDetails).to.have.property('flightPriceAmount').to.be.an('number',"Should have been a string ..");
                // expect(flightDetails).to.have.property('origin').to.be.an('string').and.length;
                // expect(flightDetails).to.have.property('destination').to.be.an('string');
            })
            .catch(err => {
                console.log(err);
            })
    })
}


function _getNextMonthDate(){
    var monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct","Nov", "Dec"];

    const todaysDate = new Date();
    const currMonth = todaysDate.getMonth();
    todaysDate.setMonth(currMonth + 1);
    const nextMonth =  todaysDate.getMonth();
    const day = todaysDate.getDate();
    const year = todaysDate.getFullYear();

    return `${day} ${monthNames[nextMonth]} ${year}`;
}