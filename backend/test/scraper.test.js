const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Scrapper = require('../helpers/scraper');
const Utils = require('./utils/utilities');

describe("RA scraper", () => {

    describe("Getting details for active event.", () => {  
        const activeEventBody = Utils.getMockResponse('activeEvent.txt');
        _checkCityIsCorrect(activeEventBody, 'London');
        _checkCountryIsCorrect(activeEventBody,'United Kingdom');
        _checkDateIsCorrect(activeEventBody, '3 Nov 2017');
        _checkPriceIsCorrect(activeEventBody,'£',43);
    });


    describe("Getting details for sold out event.", () => {  
        const activeEventBody = Utils.getMockResponse('soldOutEvent.txt');
        _checkCityIsCorrect(activeEventBody, 'Amsterdam');
        _checkCountryIsCorrect(activeEventBody,'Netherlands');
        _checkDateIsCorrect(activeEventBody, '21 Oct 2016');
        _ensureEventIsSoldOut(activeEventBody);
    });
});


function _checkPriceIsCorrect(body, expectedPriceCurrency, expectedPriceAmount) {
    it("Scraped price is correct." ,() => {
        return Scrapper.getPrice(body)
                            .then(ticketPriceAmount => { 
                                expect(ticketPriceAmount).to.be.a('number',`Price was supposed to be a number, but it is a ${typeof(ticketPriceAmount)}.`)
                                expect(ticketPriceAmount).to.equal(expectedPriceAmount,`The scraper should have returned ${expectedPriceAmount} for the price amount, however it returned ${ticketPriceAmount}.`);
                            })
                            .catch(err =>{
                                assert(false,err.message);
                            })
    });
}

function _ensureEventIsSoldOut(body) {
    it("Event is sold out." ,() => {
        return Scrapper.getPrice(body)
                            .then(priceDetails => { 
                                expect(priceDetails).equal(false,'Price details should have been equal to false as the event is sold out.');
                            })
                            .catch(err =>{
                                assert(false,err.message);
                            })
    });
}

function _checkCityIsCorrect(body, expectedCity) {
    it("Scraped city name is correct.",() => {
        return Scrapper.getCity(body)
                            .then(cityName => {
                                expect(cityName).to.equal(expectedCity,'Incorrect city name is returned from data scraper.');
                            })
                            .catch(err => {
                                assert(false,err.message);
                            })
    });  
}

function _checkCountryIsCorrect(body, expectedCountry) {
    it("Scraped country name is correct.", () => {
        return Scrapper.getCountry(body)
                            .then(countryName => {
                                expect(countryName).to.equal(expectedCountry,'Incorrect country name is returned from data scraper.');
                            })
                            .catch(err => {
                                assert(false,err.message);
                            })
    });
}


function _checkDateIsCorrect(body, expectedDate) {
    it("Scraped date is correct.", () => {
        return Scrapper.getDate(body)
                            .then(eventDate => {
                                expect(eventDate).to.equal(expectedDate,'Incorrect date is returned from data scraper.');
                            })
                            .catch(err => {
                                assert(false,err.message);
                            })
    });
}


