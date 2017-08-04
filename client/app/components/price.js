import React from 'react';


function FlightPrice ({amount, currency}) {

  if (amount) {
    return (
      <div className='flightPriceWrap'>
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
        <p>Unfortunately something went wrong when fetching your flight details.</p>
    </div>
  )


}

export default FlightPrice;
