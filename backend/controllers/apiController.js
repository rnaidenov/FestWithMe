'use strict';

const bodyParser = require('body-parser');
const scraper = require('../helpers/scraper');
const amadeus = require('../helpers/amadeus');
const airbnb = require('../helpers/airbnb');
const currencies = require('../helpers/currencies');
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
    const { location, date, nights, numPeople, isDemo } = req.query;
    try {
      const housingDetails = isDemo == 'true'
                            ? await DataCacheUtil.loadCachedHousingResult(location, date, numPeople)
                            : await airbnb.getPrice(location, date, nights, numPeople);
      res.status(200).send(housingDetails);                 
    } catch(error) {
      res.status(500).send(error);
    }
  })

  app.get("/api/prices/flights", async (req, res) => {
    const { origin, destination, date, isDemo } = req.query;
    try {
      const flightDetails = isDemo == 'true'
                              ?  await DataCacheUtil.loadCachedFlightResult(origin,destination)
                              :  await amadeus.getFlightPrices(origin, destination, date);
      res.status(200).send(flightDetails);
    } catch(err){
      res.status(500).send(error);
    }
  });


  app.get("/api/prices/events", async (req, res) => {
    const { eventName, isDemo } = req.query;
    console.log(isDemo == 'true')
    try {
      const eventDetails = isDemo == 'true'
                              ? await DataCacheUtil.loadCachedEventResult(eventName)
                              : await scraper.lookUpEvent(eventName);
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
    location.findLocaton().then(location => {
      res.send(location);
    })
  });

}
