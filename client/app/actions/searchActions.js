import { coroutine as co } from 'bluebird';
export let LAST_EVENT_DETAILS;

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


export function searchFestival(origin, festivalName, nights, numPeople) {
  return function (dispatch) {
    _increaseLoader(dispatch, 'FESTIVAL_SEARCH_START');
    co(function* () {

      const eventDetails = yield _getEventDetails(festivalName);
      console.log(eventDetails);
      if (eventDetails.isActive) {
        const destination = `${eventDetails.city},${eventDetails.country}`;
        const date = eventDetails.date;
        _increaseLoader(dispatch, 'FLIGHTS_SEARCH_START', eventDetails.city);
        const flightDetails = yield _getFlightDetails(origin, destination, date);
        console.log(flightDetails)
        _increaseLoader(dispatch, 'HOUSING_SEARCH_START');
        const housingDetails = yield _getHousingDetails(destination, date, nights, numPeople);
        console.log(housingDetails);
        const details = getTotalPrice(eventDetails, flightDetails, housingDetails);
        console.log(details);
        dispatch({
          type: 'FESTIVAL_SEARCH_FINISHED',
          payload: { details }
        });
      } else {
        dispatch({
          type: 'EVENT_NOT_ACTIVE',
          payload: 'Unfortunately, the event has been sold out'
        });
      }
    }).bind(this)();
  }
}


export function getTotalPrice(eventDetails, flightDetails, housingDetails) {
  const { flightPriceCurrency, flightPriceAmount } = flightDetails;
  const { average_price: accommodationAvgPrice } = housingDetails;
  const eventTicketPrice = eventDetails.price;
  const { soldOut, price: eventPrice } = eventDetails;
  
  const totalPrice = !soldOut ?  eventPrice + flightPriceAmount + accommodationAvgPrice : flightPriceAmount + accommodationAvgPrice;
  console.log("total price is ",totalPrice);
  return {
              ticketPrice: eventPrice,
              flightDetails,
              housingDetails:housingDetails,
              totalPrice
         };
}


function _increaseLoader(dispatch, type, payload) {
  dispatch({ type: `${type}1`, payload });
  setTimeout(() => {
    dispatch({ type: `${type}2`, payload });
  }, 200);
  setTimeout(() => {
    dispatch({ type: `${type}3`, payload });
  }, 300);
  setTimeout(() => {
    dispatch({ type: `${type}4`, payload });
  }, 500);
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