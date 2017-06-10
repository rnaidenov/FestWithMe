'use strict';

const User = require('../models/user');
const bodyParser = require('body-parser');
// const airbnb = require('airapi');
const scraper = require ('../helpers/scraper');
const google = require ('../helpers/google');
const flights = require('../helpers/flights');


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

  app.get("/api/prices/flights",(req, res) => {
    flights.getFlightPrices('SOF','NYC','2017-09-03').then(data => {
      console.log(data);
    });
  });


  app.get("/api/prices/events",(req,res) => {
    google.getEventLink(req.query.eventName).then(url => {
      scraper.getEventDetails(url).then(eventDetails => {
        res.send(eventDetails);
      });
    });
  });

}
