'use strict';

const request = require ('request');
const cheerio = require('cheerio');


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

module.exports = {
  getPrice
};
