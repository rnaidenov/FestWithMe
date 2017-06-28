const airbnb = require('airapi');
const formatter = require('./formatter');

function getPrice (location, date) {

  const checkInDate = formatter.formatDate(date,'housing');
  return new Promise ((resolve,reject) => {
    airbnb.search({
      location: location,
      checkin: checkInDate,
      guests: 1,
      page: 1,
      currency: 'USD'
    }).then(function(searchResults) {
      const {avg_price : avgPrice} = searchResults.results_json.metadata.avg_price_by_room_type;
      const {'Shared room' : sharedRoom, 'Private room' : privateRoom, 'Entire home/apt' : entireHome} = avgPrice;

      // If there is no information about a particular room, don't return currency symbol
      sharedRoom ? `$${sharedRoom}` : sharedRoom
      privateRoom ? `$${privateRoom}` : privateRoom
      entireHome ? `$${entireHome}` : entireHome

      resolve({
        sharedRoom,
        privateRoom,
        entireHome
      });
    });
  });
}

module.exports = {
  getPrice
}
