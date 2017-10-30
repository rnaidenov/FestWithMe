const assert = require('chai').assert;
const expect = require('chai').expect;
const AirBnb = require('../helpers/airbnb');
const Utils = require('./utils/utilities');
const config = require('../config');


describe("AirBnb details", () => {
    const checkInDate = Utils.getDate({days: {moreDays:true,amount: 17}});
    _checkAirBnbDetails('Sofia',checkInDate,'3','4');
    _checkAirBnbDetails('Berlin',checkInDate,'7','3');
    _checkAirBnbDetails('London',checkInDate,'10','2');
});

function _checkAirBnbDetails (destination, checkInDate, numNights, numPeople) {
    it(`Getting details for ${numPeople} people in ${destination} for ${checkInDate} for ${numNights} nights.`, function () {
        this.timeout(config.testsMaxTimeout);

        return AirBnb.getPrice(destination,checkInDate,numNights,numPeople)
            .then(details => {
                expect(details).length(3,'There should have been 3 objects in the response returned.');
                details.forEach(property => {
                    const propertyPrice = property.price;
                    assert(propertyPrice!=null,`${property.type} should have a price, but it is ${propertyPrice}`);
                });
            })
            .catch(err => {
                assert(false,err.message);
            })
    });
}