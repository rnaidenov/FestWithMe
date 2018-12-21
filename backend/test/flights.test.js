const assert = require('chai').assert;
const expect = require('chai').expect;
const flights = require('../helpers/flights');
const Utils = require('./utils/utilities');
const config = require('../config');

const checkCityIata = (city, expectedIata) => {
    it(`Gets correct IATA code for ${city}.`, () => {
        return flights.getIATACode(city)
            .then(cityCode => {
                expect(cityCode).to.equal(expectedIata, `The IATA code for ${city} should have been '${expectedIata}', but is '${cityCode}'.`);
            })
            .catch(err => {
                assert(false, err.message);
            })
    });
}


const getFlightData = (origin, destination, date, daysOfStay, currency, shouldFail) => {
    it(`Getting flight data for flights between ${origin} and ${destination} on ${date} for ${daysOfStay} days`, function () {
        this.timeout(config.testsMaxTimeout);

        return flights.getFlightPrices(origin, destination, date, daysOfStay, currency)
            .then(flightDetails => {
                expect(flightDetails).to.have.property('flightPriceAmount')
                    .least(1, 'The price of the flight ticket should have been more than 0');

                expect(flightDetails).to.have.property('origin')
                    .to.be.an('string', 'The response should have contained a IATA code for the origin city.');

                expect(flightDetails).to.have.property('destination')
                    .to.be.an('string', 'The response should have contained a IATA code for the destination city.');

                expect(flightDetails).to.have.property('url')
                    .to.be.an('string', 'The response should have returned the url to the Kiwi.com website.');
            })
            .catch(err => {
                if (shouldFail) {
                    const { flightPriceAmount, error } = err;
                    assert.include(error, 'Unable to fetch price details for flight ticket. Error:', 'An incorrect error message was returned.');
                    assert.equal(flightPriceAmount, 0, 'The flight price amount should have been 0.');
                } else {
                    assert(false, err.message);
                }
            })
    })
}


describe('Flight details', () => {

    describe('Check for correct IATA codes', () => {
        checkCityIata('Sofia', 'SOF');
        checkCityIata('Reading, United Kingdom', 'LON');
        checkCityIata('Amsterdam', 'AMS');
        checkCityIata('Parco Dora, Turin', 'TRN');
        checkCityIata('Lausanne', 'GVA');
    });

    describe('Ensure Kiwi API is giving back flight data.', () => {
        const flightDate = Utils.getDate({ days: { moreDays: true, amount: 60 } });
        getFlightData('Sofia', 'London', flightDate, 7, '$', false);
    });
});






