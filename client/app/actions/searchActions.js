import { coroutine as co} from 'bluebird';

const handleInput = (e) => {
  return {
    type: 'FESTIVAL_LOOKUP_INPUT',
    payload: e.target.value
  }
};



function getFlightDetails (origin,destination,date) {
  return new Promise ((resolve, reject) => {
      fetch(`http://localhost:3000/api/prices/flights?origin=${origin}&destination=${destination}&date=${date}`).then(response => {
          response.json()
            .then(flightDetails => {
              resolve(flightDetails)
            })
            .catch(err => {
                reject("Fetching flight details failed.",err);
            })
        })
    });
}

function getHousingDetails (dispatch,destination,date) {
  return new Promise ((resolve,reject) => {
    fetch(`http://localhost:3000/api/prices/housing?location=${destination}&checkInDate=${date}`).then(response => {
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


function getEventDetails (festivalName) {

  return new Promise ((resolve,reject) => {
    fetch(`http://localhost:3000/api/prices/events?eventName=${festivalName}`).then(response => {
      try {
        response.json()
          .then(housingDetails => {
            resolve(housingDetails);
          })
      }
      catch (e) {
        reject("Fetching event details failed.");
      }
    });
  });
}


export function searchFestival (origin, festivalName) {
  return function (dispatch) {
    dispatch({type: 'FESTIVAL_SEARCH_START1'});
    setTimeout(() => {
      dispatch({type: 'FESTIVAL_SEARCH_START2'});
    },500);
    setTimeout(() => {
      dispatch({type: 'FESTIVAL_SEARCH_START3'});
    },800);


    co(function * () {

      const eventDetails = yield getEventDetails(festivalName);
      if (eventDetails.price) {
        const destination = `${eventDetails.city},${eventDetails.country}`;
        const date = eventDetails.date;
        dispatch({type: 'FLIGHTS_SEARCH_START',payload: eventDetails.city});
        const flightDetails = yield getFlightDetails(origin,destination,date);
        dispatch({type: 'HOUSING_SEARCH_START'});
        const housingDetails = yield getHousingDetails(destination,date);
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
  const [sharedRoom, privateRoom, entireHome] = housingDetails;

  return new Promise ((resolve, reject) => {
    const {price : {ticketPrice_total : ticketPrice} } = eventDetails;
    const ticketCurrency = ticketPrice.charAt(0);
    const ticketPriceAmount = ticketPrice.split(ticketCurrency)[1];
    fetch(`http://localhost:3000/api/currencies?from=${ticketCurrency}&to=$&amount=${ticketPriceAmount}`).then(conversionRes => {
      conversionRes.json().then(data => {
        const ticketPriceUSD = data.convertedAmount;
        const totalPrice = ticketPriceUSD + flightPriceAmount + privateRoom.price;
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
