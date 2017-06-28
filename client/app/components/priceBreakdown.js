import React from 'react';
import { Grid, Col, Row} from 'react-bootstrap';
import Paper from 'material-ui/Paper';
import CustomCarousel from '../components/customCarousel';


function PriceBreakdown ({ticketPrice, flightDetails, accommodation}) {


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
      <Row className='pathWrap'>
        <Col md={4}>
          <span className='iataCodes'>{flightDetails.origin}</span>
        </Col>
        <Col md={4}>
          <span className='wind-wave'></span>
          <span className='wind-wave second'></span>
          <img src={require('../public/airplane.svg')} className='planeIcon'/>
          <span className='wind-wave'></span>
          <span className='wind-wave second'></span>
        </Col>
        <Col md={4}>
          <span className='iataCodes'>{flightDetails.destination}</span>
        </Col>
      </Row>
      <p className='priceLabel'>{flightDetails.flightPrice}</p>
    </div>
  )

  const noInfo = (
    <p id='noInfoLabel'>No information</p>
  )

  const housing = (
    <div>
        <h1 className='priceBreakdownHeading'>Accommodation</h1>
        <Row>
          <Col md={12} sm={3}>
            <Row className='accommodationTypeWrap'>
              <Col md={4}><img src={require('../public/privateRoom.svg')} className='homeTypeIcon'/></Col>
                <Col md={4} className='typeAndPriceWrap'><p>Private room</p></Col>
                <Col md={4} className='typeAndPriceWrap'><p>{accommodation.privateRoom || noInfo}</p></Col>
            </Row>
            <Row className='accommodationTypeWrap'>
              <Col md={4}><img src={require('../public/sharedRoom.svg')} className='homeTypeIcon'/></Col>
                <Col md={4}  className='typeAndPriceWrap'><p>Shared room</p></Col>
                <Col md={4}  className='typeAndPriceWrap'><p>{accommodation.sharedRoom || noInfo}</p></Col>
            </Row>
            <Row className='accommodationTypeWrap'>
              <Col md={4}><img src={require('../public/entireHome.svg')} className='homeTypeIcon'/></Col>
              <Col md={4}  className='typeAndPriceWrap'><p>Entire home</p></Col>
              <Col md={4}  className='typeAndPriceWrap'><p>{accommodation.entireHome || noInfo}</p></Col>
            </Row>
          </Col>
        </Row>
    </div>
  )

  const content = [
    festival,
    travel,
    housing
  ]


  return (
    <Paper zDepth={1} className='priceBreakdownContainer'>
      <CustomCarousel
        slideWidth={1}
        content={content}
      />
    </Paper>
  )
}


export default PriceBreakdown;
