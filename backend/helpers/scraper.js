'use strict';

const request = require('request');
const cheerio = require('cheerio');

// Get price of the ticket for the event
function getPrice(url) {
  return new Promise((resolve, reject) => {
    _scrapePrice(url).then(price => {
      if (price) {
        const ticketAndBookingFee = price.children[1].children[0].children[0].children[0].data;
        resolve(_formatPrice(ticketAndBookingFee));
      } else {
        resolve(price);
      }
    })
  })
}

function _scrapePrice(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, resp, body) => {
      const $ = cheerio.load(body);
      const tickets = $('#tickets');
      try {
        if (tickets.children().attr().id == 'ticket-sales-have-ended') {
          resolve(false);
        }
        else {
          // Getting the different types of tickets wrapped within <li/>
          tickets.children().get(1).children.forEach(item => {
            if (item.type == 'tag' && item.name == 'li' && item.attribs.class !== 'closed') {
              resolve(item);
            }
          })
        }
        resolve(false);
      }
      catch (err) {
        resolve(false)
      }
    })
  })
}

function _formatPrice(price) {
  const priceBreakdown = price.split(/[£*$*€*\+*]/);
  const currencyBreakdown = price.split(/\d/);

  let ticketPrice = priceBreakdown[1];
  let bookingFee = priceBreakdown[3];
  let currency = currencyBreakdown[0];

  // Euro symbol is placed after price in the RA website
  if (price.includes('€')) {
    ticketPrice = priceBreakdown[0];
    bookingFee = priceBreakdown[2];
    currency = currencyBreakdown[currencyBreakdown.length - 1].trim();
  }
  let ticketPrice_total;
  bookingFee ? ticketPrice_total = parseInt(ticketPrice) + parseInt(bookingFee) : ticketPrice_total = parseInt(ticketPrice)
  return {
    ticketCurrency:currency,
    ticketPriceAmount:ticketPrice_total
  };
}

// Get the name of the city, where the event will be held
function getCity(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, resp, body) => {
      const $ = cheerio.load(body);
      const eventListings = $('.circle-left').children().text();
      const city = eventListings.replace('Listings', '');
      resolve(city);
    })
  })
}

// Get the name of the country, where the event will be held
function getCountry(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, resp, body) => {
      const $ = cheerio.load(body);
      const countryTag = $('.fl');
      const countryName = countryTag[0].next.data.trim();
      resolve(countryName);
    })
  })
}

// Get the date of the event
function getDate(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, resp, body) => {
      const $ = cheerio.load(body);
      const mainHtml = $('#detail', '.clearfix');
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
function getEventDetails(url) {
  return new Promise((resolve, reject) => {
    Promise.all([getPrice(url), getCity(url), getCountry(url), getDate(url)])
      .then(data => {
        const [price, city, country, date] = data;
        resolve({
          price,
          city,
          country,
          date
        })
          .catch(err => {
            reject('Unable to fetch event details.', err)
          })
      })
  })

}

module.exports = {
  getEventDetails
};
