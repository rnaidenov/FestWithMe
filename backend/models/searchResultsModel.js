const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const SearchResults = new Schema ({
  eventName : String,  
  priceDetails: Object
})

module.exports = mongoose.model('SearchResults', SearchResults);
