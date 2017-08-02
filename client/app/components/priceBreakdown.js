import React from 'react';
import { Grid, Col, Row} from 'react-bootstrap';
import Paper from 'material-ui/Paper';
import CustomCarousel from '../components/customCarousel';


function PriceBreakdown ({cssClass ,ticketPrice, flightDetails, accommodation,currency,totalPrice}) {

  const {flightPriceAmount,flightPriceCurrency, origin, destination} = flightDetails;
  const {housingCurrency,sharedRoom,privateRoom,entireHome} = accommodation;

  const noInfo = (
    <p id='noInfoLabel'>No information</p>
  )

  //TODO: Figure out why property values are messed up
  const accommodationTypes = accommodation.map(propertyType => {
    let price;
    propertyType.currency ? price = `${propertyType.currency} ${propertyType.price}` : price = undefined;

    return (
      <div className='accommodationTypeWrap'>
        <img src={require(`../public/${propertyType.icon}`)} className='homeTypeIcon'/>
        <div className='typeAndPriceWrap'><p>propertyType.type</p></div>
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
      <p className='priceLabel'>{currency}{flightPriceAmount}</p>
    </div>
  )



  // <div className='accommodationTypeWrap'>
  //   <img src={require('../public/privateRoom.svg')} className='homeTypeIcon'/>
  //   <div className='typeAndPriceWrap'><p>Private room</p></div>
  //   <div className='typeAndPriceWrap'><p>{`${currency}${privateRoom}` || noInfo}</p></div>
  // </div>
  // <div className='accommodationTypeWrap'>
  //   <img src={require('../public/sharedRoom.svg')} className='homeTypeIcon'/>
  //   <div className='typeAndPriceWrap'><p>Shared room</p></div>
  //   <div className='typeAndPriceWrap'><p>{`${currency}${sharedRoom}`|| noInfo}</p></div>
  // </div>
  // <div className='accommodationTypeWrap'>
  //   <img src={require('../public/entireHome.svg')} className='homeTypeIcon'/>
  //   <div className='typeAndPriceWrap'><p>Entire home</p></div>
  //   <div className='typeAndPriceWrap'><p>{`${currency}${entireHome}`|| noInfo}</p></div>
  // </div>

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
