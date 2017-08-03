import React from 'react';
import Paper from 'material-ui/Paper';
import Price from './price';
import CustomCarousel from './customCarousel';


function PriceBreakdown ({cssClass ,ticketPrice, flightDetails, accommodation,currency,totalPrice}) {

  const {flightPriceAmount,flightPriceCurrency, origin, destination} = flightDetails;
  const {housingCurrency,sharedRoom,privateRoom,entireHome} = accommodation;

  const noInfo = (
    <p id='noInfoLabel'>No information</p>
  )

  //TODO: Figure out why property values are messed up
  const accommodationTypes = accommodation.map((propertyType,key) => {
    let price;
    propertyType.currency ? price = `${propertyType.currency} ${propertyType.price}` : price = undefined;
    console.log("Icon is : " + propertyType.icon);
    return (
      <div key={key} className='accommodationTypeWrap'>
        <img src={require(`../public/${propertyType.icon}`)} className='homeTypeIcon'/>
        <div className='typeAndPriceWrap'><p>{propertyType.type}</p></div>
        <div className='typeAndPriceWrap'><p>{price || noInfo}</p></div>
      </div>
    )
  });

  const festival = (
    <div className="priceDetailsWrap">
      <h1 className='priceBreakdownHeading'>Festival ticket</h1>
      <img src={require('../public/ticket.svg')} id='ticketIcon'/>
      <p className='priceLabel'>{ticketPrice}</p>
    </div>
  )



  const travel = (
    <div className="priceDetailsWrap">
      <h1 className='priceBreakdownHeading'>Plane ticket</h1>
        <div className="routeWrap">
          <span className='iataCodes'>{origin}</span>
          <img src={require('../public/airplane.svg')} className='planeIcon'/>
          <span className='iataCodes'>{destination}</span>
        </div>
      <p className='priceLabel'><Price amount={flightPriceAmount} currency={currency}/> </p>
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
