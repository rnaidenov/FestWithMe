import React from 'react';


function FlightPrice ({details,currency}) {

  const {flightPriceAmount : amount, origin, destination} = details;

  if (amount) {
    return (
      <div>
        <div className="routeWrap">
          <span className='iataCodes'>{origin}</span>
          <img src={require('../public/airplane.svg')} className='planeIcon'/>
          <span className='iataCodes'>{destination}</span>
        </div>
        <p className='priceLabel'>{currency} {amount}</p>
      </div>
    )
  }
  return (
    <div>
      <img src={require('../public/cross.svg')} className='errorIcon'/>
      <p className='flightDetailsError'>Unfortunately something went wrong when trying to get the flight details</p>
    </div>
  )

}

export default FlightPrice;
