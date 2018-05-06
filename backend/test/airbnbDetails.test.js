const assert = require('chai').assert;
const expect = require('chai').expect;
const AirBnb = require('../helpers/airbnb');
const Utils = require('./utils/utilities');
const config = require('../config');


const _checkAirBnbDetails = (destination, checkInDate, numPeople, numNights, currencySymbol) => {
    it(`Getting details for ${numPeople} people in ${destination} for ${checkInDate} for ${numNights} nights in ${currencySymbol}`, function () {
        this.timeout(config.testsMaxTimeout);
        return AirBnb.getPrice(destination, checkInDate, numNights, numPeople, currencySymbol)
            .then(details => {
                expect(details).to.have.all.keys('properties', 'average_price', 'url');

                const { properties, average_price } = details;
                expect(properties).length(3, 'There should have been data for 3 accommodation types in the response returned.');
                properties.forEach(property => {
                    const propertyPrice = property.price;
                    assert(propertyPrice != null, `${property.type} should have a price, but it is ${propertyPrice}`);
                });

                assert(average_price != null, `An average price for the stay should have been returned, however average_price=${average_price}`);
            })
            .catch(err => {
                assert(false, err.message);
            })
    });
}


describe("AirBnb details", () => {
    const checkInDate = Utils.getDate({ days: { moreDays: true, amount: 17 } });
    _checkAirBnbDetails('Sofia', checkInDate, 3, '4', '$');
    _checkAirBnbDetails('Berlin', checkInDate, '7', '3', '£');
    _checkAirBnbDetails('London', checkInDate, '10', '2', '€');
});

