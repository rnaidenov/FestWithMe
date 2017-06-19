'use strict';

const User = require('../models/user');
const bodyParser = require('body-parser');
const scraper = require ('../helpers/scraper');
const google = require ('../helpers/google');
const flights = require('../helpers/flights');
const amadeus = require('../helpers/amadeus');
const airbnb = require('../helpers/airbnb');
const Festivals = require('../models/festivalModel');



module.exports = (app) => {


  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({extended: true}));


  app.get("/api/festivals/",(req,res) => {
    Festivals.find({},function (err,todos) {
        if(err) throw err;
        res.send(todos);
      });
  });

  app.get("/api/prices/housing",(req,res) => {
    airbnb.getPrice(req.query.location, req.query.checkInDate).then(housingDetails => {
      res.send(housingDetails)
    });
  })

  app.get("/api/prices/flights",(req, res) => {
    amadeus.getFlightPrices("Sofia,Bulgaria","London,United Kingdom","21 June 2017").then(flightDetails => {
      res.send(flightDetails)
    });
  });


  app.get("/api/prices/events",(req,res) => {
    google.getEventLink(req.query.eventName).then(url => {
      scraper.getEventDetails(url).then(eventDetails => {
        console.log(eventDetails);
        res.send(eventDetails);
      });
    });
  });

}
