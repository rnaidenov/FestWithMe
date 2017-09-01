import React from 'react';
import Paper from 'material-ui/Paper';
import FlightPrice from './flightPrice';
import CustomCarousel from './customCarousel';


function PriceBreakdown ({cssClass ,ticketPrice, flightDetails, accommodation,currency,totalPrice}) {


  const {sharedRoom,privateRoom,entireHome} = accommodation;

  const noInfo = (
    <p id='noInfoLabel'>No information</p>
  )

  const accommodationTypes = accommodation.map((propertyType,key) => {
    let price;
    if(propertyType.price) {
       price = `${propertyType.price.currency} ${propertyType.price.amount}`
    }
    return (
      <div key={key} className='accommodationTypeWrap'>
        <img src={require(`../public/${propertyType.icon}`)} className='homeTypeIcon'/>
        <div className='typeAndPriceWrap'><p>{propertyType.type}</p></div>
        <div className='typeAndPriceWrap'><p>{price || noInfo}</p></div>
      </div>
    )
  });

  const festival = (
    <div>
      <h1 className='priceBreakdownHeading'>Festival ticket</h1>
      <img src={require('../public/ticket.svg')} id='ticketIcon'/>
      <p className='priceLabel'>{ticketPrice}</p>
    </div>
  )

  const travel = (
    <div>
      <h1 className='priceBreakdownHeading'>Plane ticket</h1>
      <FlightPrice details={flightDetails} currency={currency}/>
    </div>
  )

  const housing = (
    <div className="accomodationWrap">
        <h1 className='priceBreakdownHeading'>Accommodation</h1>
        {accommodationTypes}
    </div>
  )

  const content = [
    festival,
    travel,
    housing
  ]


  return (
    <Paper zDepth={1} className={cssClass}>
      <CustomCarousel
        slideWidth={1}
        content={content}
      />
    </Paper>
  )
}


export default PriceBreakdown;
