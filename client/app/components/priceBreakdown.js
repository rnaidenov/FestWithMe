import React from 'react';
import { Grid, Col, Row} from 'react-bootstrap';
import Paper from 'material-ui/Paper';
import CustomCarousel from '../components/customCarousel';


function PriceBreakdown ({cssClass ,ticketPrice, flightDetails, accommodation}) {


  const festival = (
    <div className="priceDetailsWrap">
      <h1 className='priceBreakdownHeading'>Festival ticket</h1>
      <img src={require('../public/ticket.svg')} id='ticketIcon'/>
      <p className='priceLabel'>{ticketPrice || '$42'}</p>
    </div>
  )

  const travel = (
    <div className="priceDetailsWrap">
      <h1 className='priceBreakdownHeading'>Plane ticket</h1>
        <div className="routeWrap">
          <span className='iataCodes'>{flightDetails.origin || 'SOF'}</span>
          <img src={require('../public/airplane.svg')} className='planeIcon'/>
          <span className='iataCodes'>{flightDetails.destination || 'LDN'}</span>
        </div>
      <p className='priceLabel'>{flightDetails.flightPrice || '$33'}</p>
    </div>
  )

  const noInfo = (
    <p id='noInfoLabel'>No information</p>
  )

  const housing = (
    <div className="accomodationWrap">
        <h1 className='priceBreakdownHeading'>Accommodation</h1>
            <div className='accommodationTypeWrap'>
              <img src={require('../public/privateRoom.svg')} className='homeTypeIcon'/>
              <div md={4} className='typeAndPriceWrap'><p>Private room</p></div>
              <div md={4} className='typeAndPriceWrap'><p>{accommodation.privateRoom || noInfo}</p></div>
            </div>
            <div className='accommodationTypeWrap'>
              <img src={require('../public/sharedRoom.svg')} className='homeTypeIcon'/>
              <div md={4}  className='typeAndPriceWrap'><p>Shared room</p></div>
              <div md={4}  className='typeAndPriceWrap'><p>{accommodation.sharedRoom || '$90'}</p></div>
            </div>
            <div className='accommodationTypeWrap'>
              <img src={require('../public/entireHome.svg')} className='homeTypeIcon'/>
              <div md={4}  className='typeAndPriceWrap'><p>Entire home</p></div>
              <div md={4}  className='typeAndPriceWrap'><p>{accommodation.entireHome || '$24'}</p></div>
            </div>
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
