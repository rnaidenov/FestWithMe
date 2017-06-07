const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const User = new Schema ({
  username : String,
  firstName : String,
  lastName : String,
  likedFestivals : [{
    festivalId : Number,
    festivalName : String
  }]
})

module.exports = mongoose.model('User', User);
