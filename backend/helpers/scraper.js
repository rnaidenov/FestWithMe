'use strict';

const request = require ('request');
const cheerio = require('cheerio');

// Get price of the ticket for the event
function getPrice(url) {
  return new Promise ((resolve, reject) => {

    request(url, (err,resp,body) => {
      const $ = cheerio.load(body);
      const event = $('.onsale');
      const eventSale = event.children().children().children().text();
      if (eventSale) {
        const priceBreakdown = eventSale.split(/[£*$*€*\+*]/);
        const currencyBreakdown = eventSale.split(/\d/);

        let ticketPrice = priceBreakdown[1];
        let bookingFee = priceBreakdown[3];
        let currency = currencyBreakdown[0];

        // Euro symbol is placed after price in the RA website
        if (eventSale.includes('€')) {
          ticketPrice = priceBreakdown[0];
          bookingFee = priceBreakdown[2];
          currency = currencyBreakdown[currencyBreakdown.length -1].trim();
        }
        let ticketPrice_total;
        bookingFee ? ticketPrice_total = parseInt(ticketPrice) + parseInt(bookingFee) : ticketPrice_total = parseInt(ticketPrice)

        resolve({
          ticketPrice_total,
          currency
        });
      } else {
        resolve('Event has probably sold out.');
      }
    })
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

// Get the date of the event
function getDate (url) {
  return new Promise((resolve,reject) => {
    request(url, (err, resp, body) => {
      const $ = cheerio.load(body);
      const mainHtml = $('#detail','.clearfix');
      const parentTag = mainHtml.children().children()['0'].children;

      for (const tag of parentTag) {
        if (tag.name == 'a') {
          const eventDate = tag.children[0].data;
          resolve(eventDate);
          break;
        }
      }
    })
  })
}

// Get the event details
function getEventDetails (url) {
  return new Promise((resolve, reject) => {
    Promise.all([getPrice(url),getCity(url),getCountry(url),getDate(url)]).then(data => {
      const [price, city, country, date] = data;
      resolve({
        price,
        city,
        country,
        date
      })
    })
  })

}

module.exports = {
  getEventDetails
};
