const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const Festival = new Schema ({
  name : String,
  date: String
})

module.exports = mongoose.model('Festival', Festival);
