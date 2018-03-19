'use strict';

const bodyParser = require('body-parser');
const scraper = require('../helpers/scraper');
const amadeus = require('../helpers/amadeus');
const airbnb = require('../helpers/airbnb');
const currencies = require('../helpers/currencies');
const location = require('../helpers/iplocation');
const SearchResults = require('../models/searchResultsModel');
const MongoClient = require('../helpers/mongoClient');
const CachedDataLoader = require('../helpers/cachedDataLoader');


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

  app.put('/api/cachedResults', async (req, res) => {
    const { eventName, eventDetails, flightDetails, housingDetails } = req.body;
    try {
      const cachedData = await CachedDataLoader.saveEventData({ eventName, eventDetails, flightDetails, housingDetails });
      res.status(200).send(cachedData);
    } catch (err) {
      res.status(500).send(err)
    }
  });


  app.get('/api/cachedResults', (req, res) => {
    const { festivalName } = req.query;
    SearchResults.find({ eventName: festivalName }, (err, data) => {
      !err ? res.status(200).send(data) : res.status(500).send(err);
    });
  });

  app.get("/api/prices/housing", (req, res) => {
    airbnb.getPrice(req.query.location, req.query.date, req.query.nights, req.query.numPeople)
      .then(housingDetails => {
        res.send(housingDetails)
      })
      .catch(error => {
        res.status(500).send(error);
      })
  })

  app.get("/api/prices/flights", async (req, res) => {
    const { origin, destination, date, isDemo, eventName } = req.query;
    try {
      const flightDetails = Boolean(isDemo) 
                              ?  await CachedDataLoader.loadEventData({ eventName, dataType: CachedDataLoader.DataType.FLIGHT_DETAILS })
                              :  await amadeus.getFlightPrices(origin, destination, date);
      res.status(200).send(flightDetails);
    } catch(err){
      res.status(500).send(error);
    }
   

    // amadeus.getFlightPrices(req.query.origin, req.query.destination, req.query.date)
    //   .then(flightDetails => {
    //     res.send(flightDetails)
    //   })
    //   .catch(error => {
        
    //   })
  });


  app.get("/api/prices/events", async (req, res) => {
    const { eventName, isDemo } = req.query;
    try {
      const eventDetails = Boolean(isDemo)
                              ? await CachedDataLoader.loadEventData({ eventName, dataType: CachedDataLoader.DataType.EVENT_DETAILS })
                              : await scraper.lookUpEvent({ eventName });
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
