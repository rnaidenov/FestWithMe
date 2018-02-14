import React from 'react';


function FlightPrice ({details,currency}) {

  const {flightPriceAmount : amount, origin, destination} = details;

  // <div>
  //   <div className="routeWrap">
  //     <span className='iataCodes'>SOF</span>
  //     <img src={require('../../dist/public/airplane.svg')} className='planeIcon'/>
  //     <span className='iataCodes'>LON</span>
  //   </div>
  //   <p className='priceLabel'>$25</p>
  // </div>

  // add amount
  if (amount) {
    return (
      <div className='contentWrap'>
        <div className="mainContent">
          <div className="routeWrap">
            <span className='iataCodes'>{origin}</span>
            <img src={require('../../dist/public/airplane.svg')} className='planeIcon'/>
            <span className='iataCodes'>{destination}</span>
          </div>
        </div>
        <p className='priceLabel'>{currency} {amount}</p>
      </div>
    )
  }
  return (
    <div className='contentWrap'>
      <div className="mainContent">
        <img src={require('../../dist/public/cross.svg')} className='contentIcon'/>
      </div>
      <p className='flightDetailsError'>Unfortunately something went wrong when trying to get the flight details</p>
    </div>
  )

}

export default FlightPrice;
