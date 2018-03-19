const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const SearchResults = new Schema ({
  eventName: String,
  eventDetails : Object,  
  flightDetails: Object,
  housingDetails: Object
})

module.exports = mongoose.model('SearchResults', SearchResults);
