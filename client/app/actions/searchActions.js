import { coroutine as co } from 'bluebird';
export let LAST_EVENT_DETAILS;

const _getFlightDetails = (origin, cityDestination, fullDestination, date, dispatch) => {
  dispatch({ type: 'FLIGHTS_SEARCH_START', destination: cityDestination });
  _increaseLoader(dispatch, 60);
  return new Promise(async (resolve, reject) => {
    try {
      const flightDetails = await fetch(`http://localhost:3000/api/prices/flights?origin=${origin}&destination=${fullDestination}&date=${date}`)
        .then(res => res.json());
      resolve(flightDetails);
    } catch (err) {
      reject("Fetching flight details failed.", err);
    }
  })
}

const _getHousingDetails = (destination, date, nights, numPeople, dispatch) => {
  dispatch({ type: 'HOUSING_SEARCH_START' });
  _increaseLoader(dispatch, 80);
  return new Promise(async (resolve, reject) => {
    try {
      const housingDetails = await fetch(`http://localhost:3000/api/prices/housing?location=${destination}&date=${date}&nights=${nights}&numPeople=${numPeople}`)
        .then(res => res.json());
      resolve(housingDetails);
    } catch (err) {
      reject("Fetching accommodation details failed.", err);
    }
  });
}


const _getEventDetails = (festivalName, dispatch) => {
  _increaseLoader(dispatch, 0);
  return new Promise(async (resolve, reject) => {
    try {
      const eventDetails = await fetch(`http://localhost:3000/api/prices/events?eventName=${festivalName}`).then(res => res.json())
      resolve(eventDetails);
    } catch (err) {
      reject("Fetching event details failed.", err);
    }
  });
}


export const searchFestival = (origin, festivalName, nights, numPeople) => {
  return async dispatch => {
    dispatch({ type: 'FESTIVAL_SEARCH_START', search: { origin, festivalName, nights, numPeople } });
    const eventDetails = await _getEventDetails(festivalName, dispatch);
    if (eventDetails.isActive) {
      const destination = `${eventDetails.city},${eventDetails.country}`;
      const date = eventDetails.date;
      const flightDetails = await _getFlightDetails(origin, eventDetails.city, destination, date, dispatch);
      const housingDetails = await _getHousingDetails(destination, date, nights, numPeople, dispatch);
      const details = getTotalPrice(eventDetails, flightDetails, housingDetails, nights, numPeople);
      dispatch({ type: 'FESTIVAL_SEARCH_FINISHED', payload: { details } });
    } else {
      dispatch({ type: 'EVENT_NOT_ACTIVE', payload: 'Unfortunately, the event has been sold out' });
    }
  }
}


export const getTotalPrice = (eventDetails, flightDetails, housingDetails, nights, numPeople) => {
  const { flightPriceCurrency, flightPriceAmount } = flightDetails;
  const { average_price: accommodationAvgPrice } = housingDetails;
  const eventTicketPrice = eventDetails.price;
  const { soldOut, price: eventPrice } = eventDetails;

  const totalPrice = !soldOut 
                                ? eventPrice + flightPriceAmount + accommodationAvgPrice * nights
                                : flightPriceAmount + accommodationAvgPrice * nights;
  return {
    ticketPrice: eventPrice,
    flightDetails,
    housingDetails: housingDetails,
    totalPrice: totalPrice * numPeople
  };
}





const _increaseLoader = (dispatch, loadedValue) => {
  const incrementBy = {
    0: 5,
    1: 12,
    2: 18,
    3: 20
  }
  let incrementIdx = 0;
  const loaderIncrease = setInterval(() => {
    dispatch({ type: 'INCREASE_LOADER', loaderValue: loadedValue + incrementBy[incrementIdx] });
    if (incrementIdx === Object.keys(incrementBy).length) {
      incrementIdx = 0;
      clearInterval(loaderIncrease);
    }
    incrementIdx++;
  }, 150);
}

export const getLocation = () => {
  return async dispatch => {
    try {
      const location = await fetch("http://localhost:3000/api/location").then(data => data.json());
      const { city, country } = location;
      dispatch({ type: 'SEARCHING_LOCATION_FINISH', payload: `${city},${country}` });
    } catch(err) { console.log(err) }
  }
}



export const loadFestivals = () => {
  return async dispatch => {
    dispatch({ type: 'LOAD_FESTIVALS_START' });
    try {
      const festivals = await fetch("http://localhost:3000/api/festivals").then(data => data.json());
      dispatch({ type: 'LOAD_FESTIVALS_FINISH', payload: festivals });
    } catch(err) {
      dispatch({ type: 'LOAD_FESTIVALS_ERROR', payload: err });
    }
  }
}