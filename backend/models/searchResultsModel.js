const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SearchResults = new Schema({
  type: String,
  data: Array
})

module.exports = mongoose.model('SearchResults', SearchResults);
