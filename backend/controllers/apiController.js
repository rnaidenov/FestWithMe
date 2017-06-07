'use strict';

const User = require('../models/user');
const bodyParser = require('body-parser');
const airbnb = require('airapi');
const request = require ('request');
const cheerio = require('cheerio');


module.exports = (app) => {


  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({extended: true}));


  app.get("/api/housing",(req,res) => {
    airbnb.search({
     location: req.query.location,
     checkin: req.query.checkIn,
     checkout: req.query.checkOut,
     guests: req.query.people || 1,
     page: 2,
     ib: true
    }).then(function(searchResults) {
      res.send(searchResults)
    });
  })


  app.get("/api/festival",(req,res) => {
    const url = "https://www.residentadvisor.net/event.aspx?934368";
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

        // Check if booking fee is specified
        bookingFee ? console.log(eval(`${ticketPrice} + ${bookingFee}`)) : console.log(ticketPrice)
      } else {
        console.log('Event has probably sold out.');
      }
    })
  })
  
}
