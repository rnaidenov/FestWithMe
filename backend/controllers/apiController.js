'use strict';

const bodyParser = require('body-parser');
const scraper = require ('../helpers/scraper');
const google = require ('../helpers/google');
const amadeus = require('../helpers/amadeus');
const airbnb = require('../helpers/airbnb');
const currencies = require('../helpers/currencies');
const location = require('../helpers/iplocation');
const Festivals = require('../models/festivalModel');


module.exports = (app) => {


  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({extended: true}));

  app.get("/api/festivals/",(req,res) => {
    Festivals.find({},function (err,festivals) {
        if(err) throw err;
        res.send(festivals);
      });
  });

  app.get("/api/prices/housing",(req,res) => {
    airbnb.getPrice(req.query.location, req.query.date,req.query.nights,req.query.numPeople)
      .then(housingDetails => {
        console.log(housingDetails);
          res.send(housingDetails)
        })
      .catch(error => {
        res.status(500).send(error);
      })
  })

  app.get("/api/prices/flights",(req, res) => {
    amadeus.getFlightPrices(req.query.origin,req.query.destination,req.query.date)
      .then(flightDetails => {
        res.send(flightDetails)
      })
      .catch(error => {
        res.status(500).send(error);
      })
  });


  app.get("/api/prices/events",(req,res) => {
    google.getEventLink(req.query.eventName)
      .then(url => {
        scraper.getEventDetails(url).then(eventDetails => {
            res.send(eventDetails);
          })
      })
      .catch(error => {
        res.status(400).send(error);
      })
  });

  app.get("/api/currencies",(req, res) => {
    currencies.convert(req.query.from,req.query.to,req.query.amount).then(convertedAmount => {
      res.send(convertedAmount);
    });
  });

  app.get("/api/location",(req, res) => {
    location.findLocaton().then(location => {
      res.send(location);
    })
  });

}
