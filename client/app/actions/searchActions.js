import { coroutine as co} from 'bluebird';

const handleInput = (e) => {
  return {
    type: 'FESTIVAL_LOOKUP_INPUT',
    payload: e.target.value
  }
};


// co(function * (){
//   let eventDetails = yield fetch('http://localhost:3000/api/prices/events?eventName=Afterlife Barcelona');
//   const eventDetails_json = yield eventDetails.json();
//   let destination = `${eventDetails_json.city},${eventDetails_json.country}`;
//   console.log(eventDetails_json);
//   const origin = 'Sofia,Bulgaria';
//   let date = eventDetails_json.date;
//   console.log(date);
//   let flightDetails = yield fetch(`http://localhost:3000/api/prices/flights?origin=${origin}&destination=${destination}&date=${date}`);
//   const flightDetails_json = yield flightDetails.json();
//   let housingDetails = yield fetch(`http://localhost:3000/api/prices/housing?location=${destination}&checkInDate=${date}`);
//   const housingDetails_json = yield housingDetails.json();
//   const obj = {
//     eventDetails_json,
//     flightDetails_json,
//     housingDetails_json
//   }
//
//   console.log(obj);
// }).bind(this)();

export function searchFestival (festivalName) {
  return function (dispatch) {
    dispatch({type: 'FESTIVAL_SEARCH_START'});

    co(function * () {
      const eventDetails_response = yield fetch(`http://localhost:3000/api/prices/events?eventName=${festivalName}`);
      const eventDetails = yield eventDetails_response.json();
      const origin = 'Sofia,Bulgaria';
      const destination = `${eventDetails.city},${eventDetails.country}`;
      const date = eventDetails.date;
      const flightDetails_response = yield fetch(`http://localhost:3000/api/prices/flights?origin=${origin}&destination=${destination}&date=${date}`);
      const flightDetails = yield flightDetails_response.json();
      const housingDetails_response = yield fetch(`http://localhost:3000/api/prices/housing?location=${destination}&checkInDate=${date}`);
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

export const updateInput = (e) => {
  return {
    type: 'FESTIVAL_INPUT_UPDATE',
    payload: e.target.value
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
