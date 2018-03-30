'use strict';

const request = require('request');
const cheerio = require('cheerio');
const google = require('../helpers/google');
const CurrencyConverter = require('./currencies');
const DEFAULT_CURRENCY_SYMBOL = '$';
const MongoClient = require('./mongoClient');
const DataCacheUtil = require('./cachedDataLoader');

// Get price of the ticket for the event
function getPrice(body) {
  return new Promise((resolve, reject) => {
    _scrapePrice(body).then(details => {
      const { soldOut, price, isActive } = details;
      if (!soldOut && isActive) {
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
        resolve({ isActive: false });
      }
      else {
        // Getting the different types of tickets wrapped within <li/>
        tickets.children().get(2).children.forEach(item => {
          if (item.type == 'tag' && item.name == 'li' && item.attribs.class !== 'closed') {
            resolve({ soldOut: false, price: item, isActive: true });
          }
        })
      }
      resolve({ soldOut: true });
    }
    catch (err) {
      resolve({ soldOut: true })
    }
  })
}


const _scrapeEventName = (body) => {
  return new Promise((resolve, reject) => {
    try {
      const $ = cheerio.load(body);
      const eventDetails = $('#sectionHead');
      const eventName = eventDetails[0].children[3].children[0].data;
      // console.log("event name is : ", eventName);
      resolve(eventName);
    } catch (err) {
      reject('Unable to scrape event name. ', err);
    }
  });
}

const _formatPrice = (price) => {
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
    CurrencyConverter.convert(currency, DEFAULT_CURRENCY_SYMBOL, ticketPrice_total).then(price => {
      // console.log("price is : ", price.convertedAmount);
      resolve(price.convertedAmount);
    })
  });
}

// Get the name of the city, where the event will be held
const getCity = (body) => {
  return new Promise((resolve, reject) => {
    try {
      const $ = cheerio.load(body);
      const city = $('.circle-left')[0].children[0].children[0].data;
      // console.log("city is : ", city);
      resolve(city);
    } catch (err) {
      reject('Unable to get the city name for the event. ', err);
    }
  })
}

// Get the name of the country, where the event will be held
const getCountry = (body) => {
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
const getDate = (body) => {
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




const _getEventBody = (url) => {
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
const getEventDetails = (url) => {
  // console.log("url is ", url);
  return new Promise(async (resolve, reject) => {
    try {
      const eventInfo = await _getEventBody(url).then(body => Promise.all([_scrapeEventName(body), getPrice(body), getCity(body), getCountry(body), getDate(body)]));
      const [name, priceDetails, city, country, date] = eventInfo;
      MongoClient.saveIfNotExist({ name, date });
      let eventDetails = {
        name,
        city,
        country,
        date,
        isActive: true
      };
      const eventDate = new Date(date);
      const todaysDate = new Date();
      eventDetails = eventDate < todaysDate ? Object.assign(eventDetails, { isActive: false }) : eventDetails
      !isNaN(priceDetails) ? eventDetails.price = priceDetails : eventDetails = Object.assign(eventDetails, priceDetails);
      resolve(eventDetails)
    } catch (err) {
      reject(err);
    }
  })
}


const lookUpEvent = (eventName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const eventDetails = await google.getEventLink(eventName).then(url => getEventDetails(url)).then(eventDetails => eventDetails);
      DataCacheUtil.cacheResults({ type: DataCacheUtil.DataType.EVENT_DETAILS, data: {eventDetails}});
      resolve(eventDetails);
    } catch (err) {
      reject(err);
    }
  });
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
  lookUpEvent,
  getPrice,
  getCity,
  getCountry,
  getDate
};
