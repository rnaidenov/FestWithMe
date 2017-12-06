'use strict';

const request = require('request');
const cheerio = require('cheerio');
const CurrencyConverter = require('./currencies');
const DEFAULT_CURRENCY_SYMBOL='$';

// Get price of the ticket for the event
function getPrice(body) {
  return new Promise((resolve, reject) => {
    _scrapePrice(body).then(details => {
      const { soldOut, price } = details;
      if (!soldOut) {
        const ticketAndBookingFee = price.children[1].children[0].children[0].children[0].data;
        resolve(_formatPrice(ticketAndBookingFee));
      } else {
        resolve(details);
      }
    })
  })
}

function _scrapePrice(body) {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(body);
    const tickets = $('#tickets');
    try {
      if (tickets.children().attr().id == 'ticket-sales-have-ended') {
        resolve({isActive:false});
      }
      else {
        // Getting the different types of tickets wrapped within <li/>
        tickets.children().get(2).children.forEach(item => {
          if (item.type == 'tag' && item.name == 'li' && item.attribs.class !== 'closed') {
            resolve({soldOut: false, price: item});
          }
        })
      }
      resolve({ soldOut: true });
    }
    catch (err) {
      resolve({ soldOut:true })
    }
  })
}

function _formatPrice(price) {
  return new Promise((resolve, reject) => {
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
    CurrencyConverter.convert(currency,DEFAULT_CURRENCY_SYMBOL,ticketPrice_total).then(price => {
      resolve(price.convertedAmount);
    })
  });
}

// Get the name of the city, where the event will be held
function getCity(body) { 
  return new Promise((resolve, reject) => {
    try {
      const $ = cheerio.load(body);
      const city = $('.circle-left')[0].children[0].children[0].data;
      resolve(city);
    } catch (err) {
      reject('Unable to get the city name for the event. ', err);
    }
  })
}

// Get the name of the country, where the event will be held
function getCountry(body) {
  return new Promise((resolve, reject) => {
    try {
      const $ = cheerio.load(body);
      const countryTag = $('.fl');
      const countryName = countryTag[1].next.data.trim();
      resolve(countryName);
    } catch (err) {
      reject('Unable to get the country name for the event. ', err);
    }
  })
}

// Get the date of the event
function getDate(body) {
  return new Promise((resolve, reject) => {
    try {
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
    } catch (err) {
      reject('Unable to get the date of the event. ', err);
    }
  })
}

function _getEventBody(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, resp, body) => {
      if (!err) {
        resolve(body)
      } else {
        reject(`Unable to get html body for "${url}". ${err}`);
      }
    });
  });
}

// Get the event details
function getEventDetails(url) {
  return new Promise((resolve, reject) => {
    _getEventBody(url).then(body => {
      Promise.all([getPrice(body), getCity(body), getCountry(body), getDate(body)])
        .then(data => {
          const [priceDetails, city, country, date] = data;
          let eventDetails = {
            city,
            country,
            date,
            isActive:true
          };  
          const eventDate = new Date(date);
          const todaysDate = new Date();
          console.log(eventDate, todaysDate, eventDate < todaysDate)
          eventDetails = eventDate < todaysDate ? Object.assign(eventDetails,{isActive:false}) : eventDetails
          !isNaN(priceDetails) 
          ? eventDetails.price = priceDetails 
          : eventDetails = Object.assign(eventDetails, priceDetails);
          console.log(priceDetails);
          console.log(eventDetails)
          resolve(eventDetails)
        })
        .catch(err => {
          reject(err)
        })
    })
  })
}


// active event
// getEventDetails("https://www.residentadvisor.net/events/1010741").then(res => {
//   console.log(res);
// })


// // sold out event, still active
// getEventDetails("https://www.residentadvisor.net/events/1016589").then(res => {
//   console.log(res);
// })


// // sold out event, not active
// getEventDetails("https://www.residentadvisor.net/events/864800").then(res => {
//   console.log(res);
// })


module.exports = {
  getEventDetails,
  getPrice,
  getCity,
  getCountry,
  getDate
};
