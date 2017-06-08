'use strict';

const request = require ('request');
const cheerio = require('cheerio');

// Get price of the ticket for the event
function getPrice(url) {
  request(url, (err,resp,body) => {
    const $ = cheerio.load(body);
    const event = $('.onsale');
    const eventSale = event.children().children().children().text();
    if (eventSale) {
      const priceBreakdown = eventSale.split(/[£*$*€*\+*]/);
      let ticketPrice = priceBreakdown[1];
      let bookingFee = priceBreakdown[3];

      // Euro symbol is placed after price in the RA website
      if (eventSale.includes('€')) {
        ticketPrice = priceBreakdown[0];
        bookingFee = priceBreakdown[2];
      }
      bookingFee ? console.log(parseInt(ticketPrice) + parseInt(bookingFee)) : console.log(ticketPrice)
    } else {
      console.log('Event has probably sold out.');
    }
  })
}

// Get the name of the city, where the event will be held
function getCity (url) {
  return new Promise((resolve, reject) => {
    request(url, (err, resp, body) => {
      const $ = cheerio.load(body);
      const eventListings = $('.circle-left').children().text();
      const city = eventListings.replace('Listings','');
      resolve(city);
    })
  })
}

// Get the name of the country, where the event will be held
function getCountry (url) {
  return new Promise((resolve,reject) => {
    request(url, (err, resp, body) => {
      const $ = cheerio.load(body);
      const countryTag = $('.fl');
      const countryName = countryTag[0].next.data.trim();
      resolve(countryName);
    })
  })
}

module.exports = {
  getPrice,
  getCity,
  getCountry
};
