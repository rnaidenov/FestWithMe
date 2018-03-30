import { isDate } from "util";

const { APPLICATION_API_BASE_URL } = process.env;


const _getFlightDetails = (origin, cityDestination, fullDestination, date, isDemo = false, dispatch) => {
  dispatch({ type: 'FLIGHTS_SEARCH_START', destination: cityDestination });
  _increaseLoader(dispatch, 60);
  return new Promise(async (resolve, reject) => {
    try {
      const flightDetails = await fetch(`${APPLICATION_API_BASE_URL}api/prices/flights?origin=${origin}&destination=${fullDestination}&date=${date}&isDemo=${isDemo}`)
        .then(res => res.json());
      resolve(flightDetails);
    } catch (err) {
      reject(`Fetching flight details failed.`, err);
    }
  })
}

const _getHousingDetails = (destination, date, nights, numPeople, isDemo, dispatch) => {
  dispatch({ type: 'HOUSING_SEARCH_START' });
  _increaseLoader(dispatch, 80);
  return new Promise(async (resolve, reject) => {
    try {
      const housingDetails = await fetch(`${APPLICATION_API_BASE_URL}api/prices/housing?location=${destination}&date=${date}&nights=${nights}&numPeople=${numPeople}&isDemo=${isDemo}`)
        .then(res => res.json());
      resolve(housingDetails);
    } catch (err) {
      reject(`Fetching accommodation details failed.`, err);
    }
  });
}


const _getEventDetails = (festivalName, isDemo = false, dispatch) => {
  _increaseLoader(dispatch, 0);
  return new Promise(async (resolve, reject) => {
    try {
      const eventDetails = await fetch(`${APPLICATION_API_BASE_URL}api/prices/events?eventName=${festivalName}&isDemo=${isDemo}`).then(res => res.json())
      resolve(eventDetails);
    } catch (err) {
      reject(`Fetching event details failed.`, err);
    }
  });
}


export const searchFestival = (origin, festivalName, nights, numPeople, isDemo) => {
  return async dispatch => {
    dispatch({ type: 'FESTIVAL_SEARCH_START', search: { origin, festivalName, nights, numPeople } });
    const eventDetails = await _getEventDetails(festivalName, isDemo, dispatch);
    if (eventDetails.isActive) {
      const destination = `${eventDetails.city},${eventDetails.country}`;
      const date = eventDetails.date;
      const flightDetails = await _getFlightDetails(origin, eventDetails.city, destination, date, isDemo, dispatch);
      const housingDetails = await _getHousingDetails(destination, date, nights, numPeople, isDemo, dispatch);
      const details = getTotalPrice(eventDetails, flightDetails, housingDetails, nights, numPeople);
      dispatch({ type: 'FESTIVAL_SEARCH_FINISHED', priceDetails: details });
    } else {
      dispatch({ type: 'EVENT_NOT_ACTIVE', payload: 'Unfortunately, the event has been sold out' });
    }
  }
}

const doDemoSearch = ({ festivalName }) => {

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
      const location = await fetch(`${APPLICATION_API_BASE_URL}api/location`).then(data => data.json());
      const { city, country } = location;
      dispatch({ type: 'SEARCHING_LOCATION_FINISH', payload: `${city},${country}` });
    } catch (err) { console.log(err) }
  }
}

export const loadFestivals = () => {


  return async dispatch => {
    try {
      const festivals = await fetch(`${APPLICATION_API_BASE_URL}api/festivals`).then(data => data.json());
      dispatch({ type: 'LOAD_FESTIVALS_FINISH', festivals });
    } catch (err) {
      dispatch({ type: 'LOAD_FESTIVALS_ERROR' });
    }
  }
}