const airbnb = require('airapi');
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
      const {avg_price : avgPrice} = searchResults.results_json.metadata.avg_price_by_room_type;
      
      console.log("Laina ? ",searchResults.results_json.metadata);
      const {'Shared room' : sharedRoom, 'Private room' : privateRoom, 'Entire home/apt' : entireHome} = avgPrice;
      const properties = [sharedRoom, privateRoom, entireHome];
      resolve(getPropertiesDetails(properties));
    });
  });
}

// Returns an array of property objects
function getPropertiesDetails (properties) {
  const types = ['Shared room','Private room','Entire home'];
  const icons = ['sharedRoom.svg','privateRoom.svg','entireHome.svg'];

  const accommodationTypes = [];

  for (let i=0;i<properties.length;i++) {
    const propertyPrice = properties[i];
    const propertyDetails = {
      type: types[i],
      icon: icons[i]
    };

    if (propertyPrice) {
      propertyDetails.price=propertyPrice;
      propertyDetails.currency='$'
    } else {
      propertyDetails.price=null;
      propertyDetails.currency=0;
    }
    accommodationTypes.push(propertyDetails);
  }
  return accommodationTypes;
}

module.exports = {
  getPrice
}
