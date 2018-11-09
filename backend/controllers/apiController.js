'use strict';

const bodyParser = require('body-parser');
const events = require('../helpers/events');
const flights = require('../helpers/flights');
const airbnb = require('../helpers/airbnb');
const currencies = require('../helpers/currencies');
const googleMaps = require('../helpers/maps');
const location = require('../helpers/iplocation');
const SearchResults = require('../models/searchResultsModel');
const MongoClient = require('../helpers/mongoClient');
const DataCacheUtil = require('../helpers/cachedDataLoader');


module.exports = (app) => {


  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/api/festivals/", async (req, res) => {
    try {
      await MongoClient.removePastEvents();
      const events = await MongoClient.getSavedEvents();
      res.status(200).send(events);
    } catch (err) {
      res.status(500).send(err)
    }
  });

  app.get("/api/prices/housing", async (req, res) => {
    const { location, date, nights, numPeople, currency, isDemo } = req.query;
    try {
      const housingDetails = isDemo == 'true'
        ? await DataCacheUtil.loadCachedHousingResult(location, date, numPeople)
        : await airbnb.getPrice(location, date, nights, numPeople, currency);
      res.status(200).send(housingDetails);
    } catch (error) {
      res.status(500).send(error);
    }
  })

  app.get("/api/prices/flights", async (req, res) => {
    const { origin, destination, date, nights, currency, isDemo } = req.query;
    try {
      const flightDetails = isDemo == 'true'
        ? await DataCacheUtil.loadCachedFlightResult(origin, destination)
        : await flights.getFlightPrices(origin, destination, date, nights, currency);
      res.status(200).send(flightDetails);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get("/api/prices/events", async (req, res) => {
    const { eventName, currency, isDemo } = req.query;
    try {
      const eventDetails = isDemo == 'true'
        ? await DataCacheUtil.loadCachedEventResult(eventName)
        : await events.lookUpEvent(eventName, currency);
      res.status(200).send(eventDetails);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/api/currencies", (req, res) => {
    currencies.convert(req.query.from, req.query.to, req.query.amount).then(convertedAmount => {
      res.send(convertedAmount);
    });
  });

  app.get("/api/location", (req, res) => {
    googleMaps.getLocationBasedOnCoordinates({ lat: req.query.lat, lng: req.query.lng }).then(location => {
      console.log(location)
      res.send({ location })
    }).catch(err => console.err(err))
  });

}
