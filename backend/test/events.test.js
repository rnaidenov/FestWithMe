const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const events = require('../helpers/events');
const Utils = require('./utils/utilities');


const _checkEventNameIsCorrect = (body, expectedEventName) => {
    it("Scraped event name is correct.", async () => {
        try {
            const actualEventName = await events.getEventName(body);
            expect(actualEventName).to.be.a('String', `The scrape event name shold have been a String, however it is a ${typeof (actualEventName)}.`);
            expect(actualEventName).to.be.equal(expectedEventName, `The expected event name  the one returned in the response.`);
        } catch (err) {
            assert(false, err.message)
        };
    })
}

const _verifyActiveEventPrice = (body, currencyToConvertTo, expectedPriceAmount) => {
    it("Scraped price is correct.", async () => {
        try {
            const actualPriceAmount = await events.getPrice(body, currencyToConvertTo);
            expect(actualPriceAmount).to.be.a('Number', `The price amount of the ticket should have been a number, however it is a ${typeof (expectedPriceAmount)}.`);
            expect(actualPriceAmount).to.be.equal(actualPriceAmount, `The expected price for the ticket does not match the actual price.`);
        } catch (err) {
            assert(false, err.message)
        };
    })
}


const _verifyActiveEventWithoutPriceDetails = (eventDetails) => {
    it("Price details are correct.", async () => {
        try {
            const priceDetailsResponse = await events.determineIsActive(eventDetails);
            expect(priceDetailsResponse).to.have.keys(['name', 'city', 'country', 'soldOut', 'isActive']);
            const { soldOut, isActive } = priceDetailsResponse;
            assert(soldOut, `The response for an active event without a price should include a property "soldOut" set to true`);
            assert(isActive, `The response for an active event without a price should include a property "isActive" set to true`);
        } catch (err) {
            assert(false, err.message);
        }
    });
}


const _verifyInactiveEventPriceDetails = (eventDetails) => {
    it("Price details are correct.", async () => {
        try {
            const priceDetailsResponse = await events.determineIsActive(eventDetails);
            expect(priceDetailsResponse).to.have.keys(['name', 'city', 'country', 'soldOut', 'isActive']);
            const { isActive, soldOut } = priceDetailsResponse;
            assert(soldOut === true, `The response for an inactive event should include a property "soldOut" set to true, but its value is ${soldOut}`);
            assert(isActive === false, `The response for an inactive event should include a property "isActive" set to false, but its value is ${isActive}`);
        } catch (err) {
            assert(false, err.message);
        }
    });
}

const _checkCityIsCorrect = (body, expectedCity) => {
    it("Scraped city name is correct.", () => {
        return events.getCity(body)
            .then(cityName => {
                expect(cityName).to.equal(expectedCity, 'Incorrect city name is returned from data scraper.');
            })
            .catch(err => {
                assert(false, err.message);
            })
    });
}

const _checkCountryIsCorrect = (body, expectedCountry) => {
    it("Scraped country name is correct.", () => {
        return events.getCountry(body)
            .then(countryName => {
                expect(countryName).to.equal(expectedCountry, 'Incorrect country name is returned from data scraper.');
            })
            .catch(err => {
                assert(false, err.message);
            })
    });
}

const _checkDateIsCorrect = (body, expectedDate) => {
    it("Scraped date is correct.", () => {
        return events.getDate(body)
            .then(eventDate => {
                expect(eventDate).to.equal(expectedDate, 'Incorrect date is returned from data scraper.');
            })
            .catch(err => {
                assert(false, err.message);
            })
    });
}


describe("RA scraper", () => {

    describe("Getting details for active event with price.", () => {
        const eventHTMLBody = Utils.getMockResponse('activeEvent-price.txt');
        const eventDetails = {
            name: 'Junction 2 Festival 2018',
            city: 'London',
            country: 'United Kingdom',
            date: '9 Jun 2018',
            priceDetails: 80
        }

        _checkEventNameIsCorrect(eventHTMLBody, eventDetails.name);
        _checkCityIsCorrect(eventHTMLBody, eventDetails.city);
        _checkCountryIsCorrect(eventHTMLBody, eventDetails.country);
        _checkDateIsCorrect(eventHTMLBody, eventDetails.date);
        _verifyActiveEventPrice(eventHTMLBody, '€', 80);
    });


    describe("Getting ACTIVE event details, for which the price cannot be retrieved.", () => {
        const eventHTMLBody = Utils.getMockResponse('activeEvent-no-price.txt');
        const eventDetails = {
            name: 'Awakenings & Time Warp present Connect',
            city: 'Düsseldorf',
            country: 'Germany',
            date: '13 Oct 2018',
            priceDetails: { soldOut: true }
        }

        _checkCityIsCorrect(eventHTMLBody, eventDetails.city);
        _checkCountryIsCorrect(eventHTMLBody, eventDetails.country);
        _checkDateIsCorrect(eventHTMLBody, eventDetails.date);
        _verifyActiveEventWithoutPriceDetails(eventDetails);
    });


    describe("Getting details inactive / past event.", () => {
        const eventHTMLBody = Utils.getMockResponse('inactiveEvent.txt');
        const eventDetails = {
            name: 'Time Warp 2018',
            city: 'Mannheim',
            country: 'Germany',
            date: '7 Apr 2018',
            priceDetails: { soldOut: true }
        }

        _checkEventNameIsCorrect(eventHTMLBody, eventDetails.name)
        _checkCityIsCorrect(eventHTMLBody, eventDetails.city);
        _checkCountryIsCorrect(eventHTMLBody, eventDetails.country);
        _checkDateIsCorrect(eventHTMLBody, eventDetails.date);
        _verifyInactiveEventPriceDetails(eventDetails);
    });

});



