const airbnb = require('airapi');
const priceGenerator = require('./randomPriceGenerator');
const formatter = require('./formatter');

// Gets the details for the accommodation
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
      const average_price = searchResults.results_json.metadata.price_histogram.average_price;
      resolve(getPropertiesDetails(null));
    });
  });
}

// Returns an array of property objects
function getPropertiesDetails (average_price) {
  const types = ['Shared room','Private room','Entire home'];
  const icons = ['sharedRoom.svg','privateRoom.svg','entireHome.svg'];
  const accommodationTypes = [];

  types.forEach((propertyType,index) => {
      const property = {
        type: propertyType,
        icon: icons[index],
        price: priceGenerator.getPriceEstimate(propertyType,average_price,'$')
      }
      accommodationTypes.push(property);
  });
  
  return accommodationTypes;
}

module.exports = {
  getPrice
}
