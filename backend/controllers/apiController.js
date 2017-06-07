'use strict';

const User = require('../models/user');
const bodyParser = require('body-parser');
const airbnb = require('airapi');
// const google = require('google');
const scraper = require ('../helpers/scraper');
const google = require ('../helpers/google');


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
    google.getEventLink('Junction 2 ra').then(url => {
      scraper.getPrice(url);
    });
  })

}
