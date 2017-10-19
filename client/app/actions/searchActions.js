import { coroutine as co } from 'bluebird';

const handleInput = (e) => {
  return {
    type: 'FESTIVAL_LOOKUP_INPUT',
    payload: e.target.value
  }
};



function _getFlightDetails(origin, destination, date) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/api/prices/flights?origin=${origin}&destination=${destination}&date=${date}`).then(response => {
      response.json()
        .then(flightDetails => {
          resolve(flightDetails)
        })
        .catch(err => {
          reject("Fetching flight details failed.", err);
        })
    })
  });
}

function _getHousingDetails(destination, date, nights, numPeople) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/api/prices/housing?location=${destination}&date=${date}&nights=${nights}&numPeople=${numPeople}`).then(response => {
      try {
        response.json()
          .then(housingDetails => {
            resolve(housingDetails);
          })
      }
      catch (e) {
        reject("Fetching accommodation details failed.");
      }
    });
  });
}


function _getEventDetails(festivalName) {
  return new Promise((resolve, reject) => {
    try {
      fetch(`http://localhost:3000/api/prices/events?eventName=${festivalName}`).then(response => {
        response.json()
          .then(eventDetails => {
            resolve(eventDetails);
          })
      })
    }
    catch (e) {
      reject("Fetching event details failed.");
    }
  });
}



export function searchFestival(origin, festivalName) {
  return function (dispatch) {
    _increaseLoader(dispatch, 'FESTIVAL_SEARCH_START');
    co(function* () {

      const eventDetails = yield _getEventDetails(festivalName);
      if (eventDetails.price) {
        const destination = `${eventDetails.city},${eventDetails.country}`;
        const date = eventDetails.date;
        _increaseLoader(dispatch, 'FLIGHTS_SEARCH_START', eventDetails.city);
        const flightDetails = yield _getFlightDetails(origin, destination, date);
        _increaseLoader(dispatch, 'HOUSING_SEARCH_START');
        const housingDetails = yield _getHousingDetails(destination, date);
        const details = yield _getTotalPrice(eventDetails, flightDetails, housingDetails);
        const pricingDetails = {
          details
        }
        dispatch({
          type: 'FESTIVAL_SEARCH_FINISHED',
          payload: pricingDetails
        });
      } else {
        dispatch({
          type: 'EVENT_SOLD_OUT',
          payload: 'Unfortunately, the event has been sold out'
        });
      }
    }).bind(this)();
  }
}

function _getTotalPrice(eventDetails, flightDetails, housingDetails) {
  const { flightPriceCurrency, flightPriceAmount } = flightDetails;
  const [, privateRoom,] = housingDetails;

  return new Promise((resolve, reject) => {
    const { price: ticketPrice } = eventDetails;
    const ticketCurrency = ticketPrice.charAt(0);
    const ticketPriceAmount = ticketPrice.split(ticketCurrency)[1];
    fetch(`http://localhost:3000/api/currencies?from=${ticketCurrency}&to=$&amount=${ticketPriceAmount}`).then(conversionRes => {
      conversionRes.json().then(data => {
        const ticketPriceUSD = data.convertedAmount;
        const totalPrice = ticketPriceUSD + flightPriceAmount + privateRoom.price.amount;
        resolve({
          ticketPrice: `$${ticketPriceUSD}`,
          flight: flightDetails,
          housingDetails,
          totalPrice,
          currency: '$'
        })
      })
    })
  });
}


function _increaseLoader(dispatch, type, payload) {
  dispatch({ type: `${type}1`, payload });
  setTimeout(() => {
    dispatch({ type: `${type}2`, payload });
  }, 500);
  setTimeout(() => {
    dispatch({ type: `${type}3`, payload });
  }, 800);
  setTimeout(() => {
    dispatch({ type: `${type}4`, payload });
  }, 900);
}

export const updateInput = (festivalName) => {
  return {
    type: 'FESTIVAL_INPUT_UPDATE',
    payload: festivalName
  }
}

export function getLocation() {
  return function (dispatch) {
    fetch("http://localhost:3000/api/location")
      .then(data => {
        data.json().then(location => {
          const { city, country } = location;
          dispatch({ type: 'SEARCHING_LOCATION_FINISH', payload: `${city},${country}` });
        })
      })
  }
}


export function loadFestivals() {
  return function (dispatch) {
    dispatch({ type: 'LOAD_FESTIVALS_START' });

    fetch("http://localhost:3000/api/festivals")
      .then(data => {
        data.json().then(festivals => {
          dispatch({ type: 'LOAD_FESTIVALS_FINISH', payload: festivals });
        })
      })
      .catch(err => {
        dispatch({ type: 'LOAD_FESTIVALS_ERROR', payload: err });
      })
  }
}