import { coroutine as co} from 'bluebird';

const handleInput = (e) => {
  return {
    type: 'FESTIVAL_LOOKUP_INPUT',
    payload: e.target.value
  }
};


export function searchFestival (festivalName) {
  return function (dispatch) {
    dispatch({type: 'FESTIVAL_SEARCH_START'});

    co(function * () {
      const eventDetails_response = yield fetch(`http://localhost:3000/api/prices/events?eventName=${festivalName}`);
      const eventDetails = yield eventDetails_response.json();
      console.log(eventDetails);
      const origin = 'Sofia,Bulgaria';
      const destination = `${eventDetails.city},${eventDetails.country}`;
      const date = eventDetails.date;
      dispatch({type: 'FLIGHTS_SEARCH_START',payload: eventDetails.city});
      const flightDetails_response = yield fetch(`http://localhost:3000/api/prices/flights?origin=${origin}&destination=${destination}&date=${date}`);
      dispatch({type: 'FLIGHTS_SEARCH_FINISH'});
      const flightDetails = yield flightDetails_response.json();
      console.log(flightDetails);
      dispatch({type: 'HOUSING_SEARCH_START'});
      const housingDetails_response = yield fetch(`http://localhost:3000/api/prices/housing?location=${destination}&checkInDate=${date}`);
      dispatch({type: 'HOUSING_SEARCH_FINISH'});
      const housingDetails = yield housingDetails_response.json();

      const pricingDetails = {
        eventDetails,
        flightDetails,
        housingDetails
      }

      dispatch({
        type: 'FESTIVAL_SEARCH_FINISHED',
        payload: pricingDetails
      });
    }).bind(this)();
  }
}

export const updateInput = (festivalName) => {
  return {
    type: 'FESTIVAL_INPUT_UPDATE',
    payload: festivalName
  }
}

export function loadFestivals () {
  return function (dispatch) {
    dispatch({type: 'LOAD_FESTIVALS_START'});

    fetch("http://localhost:3000/api/festivals")
      .then(data =>{
        data.json().then(festivals => {
          dispatch({type: 'LOAD_FESTIVALS_FINISH', payload: festivals});
        })
      })
      .catch(err => {
        dispatch({type: 'LOAD_FESTIVALS_ERROR', payload: err});
      })
  }
}
