import React from 'react';
import Paper from 'material-ui/Paper';
import FlightPrice from './flightPrice';
import CustomCarousel from './customCarousel';

class PriceBreakdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const noInfo = (
      <span id='noInfoLabel'>No information</span>
    )

    const { cssClass, ticketPrice, flightDetails, accommodation, currency } = this.props;
    const { sharedRoom, privateRoom, entireHome } = accommodation;


    const accommodationTypes = accommodation.map((propertyType, key) => {
      return (
        <div key={key} className='accommodationTypeWrap'>
          <div className="propertyTypeIconWrap">
            <img src={require(`../public/${propertyType.icon}`)} className='homeTypeIcon' />
          </div>
          <div className='typeAndPriceWrap'><p>{propertyType.type}</p></div>
          <div className='typeAndPriceWrap'><p>{propertyType.price || noInfo}</p></div>
        </div>
      )
    });

    // const accommodationTypes = (
    //   <div>
    //     <div key='1' className='accommodationTypeWrap'>
    //       <div className="propertyTypeIconWrap">
    //         <img src={require(`../public/sharedRoom.svg`)} className='homeTypeIcon' />
    //       </div>
    //       <div className='typeAndPriceWrap'><p>Shared room</p></div>
    //       <div className='typeAndPriceWrap'><p>32</p></div>
    //     </div>
    //     <div key='2' className='accommodationTypeWrap'>
    //       <div className="propertyTypeIconWrap">
    //         <img src={require(`../public/privateRoom.svg`)} className='homeTypeIcon' />
    //       </div>
    //       <div className='typeAndPriceWrap'><p>Private room</p></div>
    //       <div className='typeAndPriceWrap'><p>45</p></div>
    //     </div>
    //     <div key='3' className='accommodationTypeWrap'>
    //       <div className="propertyTypeIconWrap">
    //         <img src={require(`../public/entireHome.svg`)} className='homeTypeIcon' />
    //       </div>
    //       <div className='typeAndPriceWrap'><p>Entire home/apt</p></div>
    //       <div className='typeAndPriceWrap'><p>78</p></div>
    //     </div>
    //   </div>
    // )

    const festival = (
      <div>
        <h1 className='priceBreakdownHeading'>Festival ticket</h1>
        <img src={require('../public/ticket.svg')} id='ticketIcon' />
        <p className='priceLabel'>{ticketPrice}</p>
      </div>
    )

    const travel = (
      <div>
        <h1 className='priceBreakdownHeading'>Plane ticket</h1>
        <FlightPrice details={flightDetails} currency={currency} />
      </div>
    )

    const housing = (
      <div className="accomodationWrap">
        <h1 className='priceBreakdownHeading'>Accommodation</h1>
        {accommodationTypes}
      </div>
    )

    return (
      <Paper zDepth={1} className={cssClass}>
        <CustomCarousel
          slideWidth={1}
          content={[festival, travel, housing]}
        />
      </Paper>
    )
  }
}

export default PriceBreakdown;
