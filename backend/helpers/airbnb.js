const formatter = require('./formatter');
const fetch = require('node-fetch');
const DataCacheUtil = require('./cachedDataLoader');
const CurrencyConverter = require('./currencies');
const AIRBNB_BASE_URL = 'https://www.airbnb.co.uk/s/all?query';



const getAveragePrice = (destination, checkInDate, checkOutDate, numPeople, currencyCode, roomType) => {
  return new Promise((resolve, reject) => {
    let airbnbAPIUrl = `https://www.airbnb.co.uk/api/v2/explore_tabs?version=1.3.1&_format=for_explore_search_web&items_per_grid=18&experiences_per_grid=20&guidebooks_per_grid=20&fetch_filters=true&is_guided_search=false&is_new_cards_experiment=true&supports_for_you_v3=true&screen_size=large&timezone_offset=60&auto_ib=true&luxury_pre_launch=false&metadata_only=true&is_standard_search=false&tab_id=home_tab&location=${destination}&checkin=${checkInDate}&checkout=${checkOutDate}&guests=${numPeople}&adults=${numPeople}&infants=0&children=0&allow_override%5B%5D=&s_tag=D0coxDKI&room_types%5B%5D=${roomType}&federated_search_session_id=b9600a40-c003-4ea3-bfe0-7f63bae93db0&_intents=p1&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=${currencyCode}&locale=en-GB`;
    if (!roomType) {
      airbnbAPIUrl = `https://www.airbnb.co.uk/api/v2/explore_tabs?version=1.3.1&_format=for_explore_search_web&items_per_grid=18&experiences_per_grid=20&guidebooks_per_grid=20&fetch_filters=true&is_guided_search=true&is_new_cards_experiment=true&supports_for_you_v3=true&screen_size=large&timezone_offset=60&auto_ib=true&luxury_pre_launch=false&metadata_only=true&is_standard_search=false&tab_id=home_tab&location=${destination}&checkin=${checkInDate}&checkout=${checkOutDate}&guests=${numPeople}&adults=${numPeople}&infants=0&children=0&allow_override%5B%5D=&ib=false&s_tag=djaZS3SU&federated_search_session_id=1a547173-59ba-4856-a472-29245673ba62&_intents=p1&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=${currencyCode}&locale=en-GB`;
    }
    fetch(airbnbAPIUrl).then(response => {
        response.json()
          .then(json_results => {
            const avgPrice = json_results.explore_tabs[0].home_tab_metadata.price_histogram.average_price;
            resolve(avgPrice)
          })
          .catch(err => {
            reject("Failed to fetch AirBnb data. ",err);
          })
      })
  });
}




const getPropertiesDetails = (destination, checkInDate, checkOutDate, numPeople, currencyCode) => {
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
      prices.push(getAveragePrice(destination, checkInDate, checkOutDate, numPeople, currencyCode, roomType = types[idx]));
      accommodationTypes.push(property);
    });

    Promise.all(prices)
      .then(avgPrices => {
        avgPrices.forEach((price, idx) => {
          accommodationTypes[idx].price = price;
        });
        resolve(accommodationTypes);
      })
      .catch(err => {
        reject("Failed to fetch AirBnb data. ",err);
      })
  });
}


// https://www.airbnb.co.uk/s/all?query=Berlin&adults=4&checkin=2018-05-09&checkout=2018-05-13
const _composeUrl = ({ destination, checkInDate, checkOutDate, numPeople, currencyCode  }) => {
  return `${AIRBNB_BASE_URL}=${destination}&adults=${numPeople}&checkin=${checkInDate}&checkout=${checkOutDate}&currency=${currencyCode}`
}
 


// Get price for different accommodation types and average price of stay
const getPrice = (destination, eventDate, nights, numPeople, currencySymbol) => {
  return new Promise((resolve, reject) => {
    const checkInDate = formatter.formatDate(eventDate, { more: false, days: 1 });
    const checkOutDate = formatter.formatDate(eventDate, { more: true, days: parseInt(nights) });
    const currencyCode = CurrencyConverter.getCurrencyCode(currencySymbol); 
    Promise.all([getPropertiesDetails(destination, checkInDate, checkOutDate, numPeople, currencyCode),
    getAveragePrice(destination, checkInDate, checkOutDate, numPeople, currencyCode)])
      .then(details => {
        const [properties, average_price] = details;
        const housingDetails = { properties, average_price };
        DataCacheUtil.cacheResults({ type: DataCacheUtil.DataType.HOUSING_DETAILS, data: { housingDetails, destination, numPeople, date: eventDate }});
        resolve(Object.assign(housingDetails, { url: _composeUrl({ destination, checkInDate, checkOutDate, numPeople, currencyCode })}));
      })
      .catch(err => {
        reject("Unable to get accommodation prices from AirBnb. ",err);
      })
  });
}




module.exports = {
  getPrice
}
