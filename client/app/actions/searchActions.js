import { coroutine as co} from 'bluebird';

const handleInput = (e) => {
  return {
    type: 'FESTIVAL_LOOKUP_INPUT',
    payload: e.target.value
  }
};


export function searchFestival (origin, festivalName) {
  return function (dispatch) {
    dispatch({type: 'FESTIVAL_SEARCH_START'});

    co(function * () {
      const eventDetails_response = yield fetch(`http://localhost:3000/api/prices/events?eventName=${festivalName}`);
      const eventDetails = yield eventDetails_response.json();
      if (typeof(eventDetails.price) == 'object') {
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
        console.log(housingDetails);
        const details = yield getTotalPrice(eventDetails,flightDetails,housingDetails);

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

function getTotalPrice (eventDetails, flightDetails, housingDetails) {
  const {flightPriceCurrency, flightPriceAmount} = flightDetails;
  const {sharedRoom, privateRoom, entireHome} = housingDetails;

  return new Promise ((resolve, reject) => {
    const {price : {ticketPrice_total : ticketPrice} } = eventDetails;
    const ticketCurrency = ticketPrice.charAt(0);
    const ticketPriceAmount = ticketPrice.split(ticketCurrency)[1];
    fetch(`http://localhost:3000/api/currencies?from=${ticketCurrency}&to=$&amount=${ticketPriceAmount}`).then(conversionRes => {
      conversionRes.json().then(data => {
        const ticketPriceUSD = data.convertedAmount;
        const totalPrice = ticketPriceUSD + flightPriceAmount + privateRoom;
        resolve({
          ticketPrice : `$${ticketPriceUSD}`,
          flight : flightDetails,
          housingDetails,
          totalPrice,
          currency:'$'
        })
      })
    })
  });
}

export const updateInput = (festivalName) => {
  return {
    type: 'FESTIVAL_INPUT_UPDATE',
    payload: festivalName
  }
}

export function getLocation () {
  return function(dispatch) {
    fetch("http://localhost:3000/api/location")
    .then(data => {
        data.json().then(location => {
          const {city, country} = location;
          dispatch({type:'SEARCHING_LOCATION_FINISH',payload:`${city},${country}`});
        })
    })
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
