const airbnb = require('airapi');
const priceGenerator = require('./randomPriceGenerator');
const formatter = require('./formatter');
const fetch = require('node-fetch');

// Fix getPrice method
function getPrice(destination, checkInDate, checkOutDate, numPeople) {
  const checkInDateFormat = formatter.formatDate(checkInDate);
  const checkOutDateFormat = formatter.formatDate(checkOutDate);
  return getPropertiesDetails(destination, checkInDate, checkOutDate, numPeople)
}

getPrice('London','26 Nov 2017','29 Nov 2017',2).then(res => {
  console.log(res);
});

// Returns an array of property objects
function getPropertiesDetails(destination, checkInDate, checkOutDate, numPeople) {
  return new Promise((resolve, reject) => {
    const types = ['Shared room', 'Private room', 'Entire home/apt'];
    const icons = ['sharedRoom.svg', 'privateRoom.svg', 'entireHome.svg'];
    const accommodationTypes = [];
    const prices = [];

    types.forEach((propertyType, idx) => {
      const property = {
        type: propertyType,
        icon: icons[idx],
      }
      prices.push(getAveragePrice(destination, checkInDate, checkOutDate, roomType = types[idx], numPeople));
      accommodationTypes.push(property);
    });

    Promise.all(prices).then(avgPrices => {
      avgPrices.forEach((price, idx) => {
        accommodationTypes[idx].price = price;
      });
      resolve(accommodationTypes);
    });
  });
}

module.exports = {
  getPrice
}

//Private+room
//Plovdiv%2C+Bulgaria
//2017-12-31
function getAveragePrice(destination, checkInDate, checkOutDate, roomType, numPeople) {
  return new Promise((resolve, reject) => {
    const airbnbApiUrl = `https://www.airbnb.co.uk/api/v2/explore_tabs?version=1.3.1&_format=for_explore_search_web&items_per_grid=18&experiences_per_grid=20&guidebooks_per_grid=20&fetch_filters=true&is_guided_search=false&is_new_cards_experiment=true&supports_for_you_v3=true&screen_size=large&timezone_offset=60&auto_ib=true&luxury_pre_launch=false&metadata_only=true&is_standard_search=false&tab_id=home_tab&location=${destination}&checkin=${checkInDate}&checkout=${checkOutDate}&guests=${numPeople}&adults=${numPeople}&infants=0&children=0&allow_override%5B%5D=&s_tag=D0coxDKI&room_types%5B%5D=${roomType}&federated_search_session_id=b9600a40-c003-4ea3-bfe0-7f63bae93db0&_intents=p1&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=USD&locale=en-GB`;
    fetch(airbnbApiUrl).then(response => {
      response.json().then(json_results => {
        const avgPrice = json_results.explore_tabs[0].home_tab_metadata.price_histogram.average_price;
        
        console.log(avgPrice);
        resolve(avgPrice)
      })
    });
  });
}

getPropertiesDetails('Plovdiv', '20 Oct 2017', '24 Oct 2017', 2).then(types => {console.log(types)});