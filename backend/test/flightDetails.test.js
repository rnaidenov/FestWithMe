const assert = require('chai').assert;
const expect = require('chai').expect;
const Airports = require('../helpers/airports');
const Amadeus = require('../helpers/amadeus');
const Utils = require('./utils/utilities');
const config = require('../config');


describe('Flight details', () => {

    describe('Check for correct IATA codes', () => {
        checkCityIata('Sofia', 'SOF');
        checkCityIata('Reading, United Kingdom', 'LON');
        checkCityIata('Amsterdam', 'AMS');
        checkCityIata('Parco Dora, Turin', 'TRN');
        checkCityIata('Lausanne', 'GVA');
    });


    describe('Ensure Amadeus is giving back flight data.', () => {
        const flightDate = Utils.getDate({ days: { moreDays: true, amount: 30 } });
        getFlightData('Sofia', 'London', flightDate, false);
    });

    describe('Ensure error is caught when searching for flight with invalid outbound date.', () => {
        const flightDate = Utils.getDate({ days: { moreDays: false, amount: 30 } });
        getFlightData('Sofia', 'London', flightDate, true);
    });
});

function checkCityIata(city, expectedIata) {
    it(`Gets correct IATA code for ${city}.`, () => {
        return Airports.getCityCode(city)
            .then(cityCode => {
                expect(cityCode).to.equal(expectedIata, `The IATA code for ${city} should have been '${expectedIata}', but is '${cityCode}'.`);
            })
            .catch(err => {
                assert(false, err.message);
            })
    });
}


function getFlightData(originCity, destinationCity, date, shouldFail) {
    it(`Getting flight data for flights between ${originCity} and ${destinationCity} for ${date}`, function () {
        this.timeout(config.testsMaxTimeout);

        return Amadeus.getFlightPrices(originCity, destinationCity, date)
            .then(flightDetails => {
                expect(flightDetails).to.have.property('flightPriceAmount')
                    .least(1, 'The price of the flight ticket should have been more than 0');

                expect(flightDetails).to.have.property('origin')
                    .to.be.an('string', 'The response should have contained a IATA code for the origin city.');

                expect(flightDetails).to.have.property('destination')
                    .to.be.an('string', 'The response should have contained a IATA code for the destination city.');
            })
            .catch(err => {
                if (shouldFail) {
                    const { flightPriceAmount, error } = err;
                    assert.equal(error, 'Unable to fetch price details for flight ticket.', 'An incorrect error message was returned.');
                    assert.equal(flightPriceAmount, 0, 'The flight price amount should have been 0.');
                } else {
                    assert(fail, err);
                }
            })
    })
}


