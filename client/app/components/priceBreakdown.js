import React from 'react';
import Paper from 'material-ui/Paper';
import FlightPrice from './flightPrice';
import CustomCarousel from './customCarousel';


class PriceBreakdown extends React.Component {


  constructor(props) {
    super(props);
    this.state = { priceBreakdownClass: 'priceBreakdownContainer' };
  }

  componentWillUpdate(newProps) {
    const breakdownIsShown = this.state.priceBreakdownClass === 'priceBreakdownContainer selected';

    if(newProps.isSelected) {
      if (!breakdownIsShown) {
        this.setState({ priceBreakdownClass: 'priceBreakdownContainer selected' });
      }
    } else {
      if (breakdownIsShown) {
        this.setState({ priceBreakdownClass: 'priceBreakdownContainer unselected'}, () => {
          setTimeout(() => {
            this.setState({ priceBreakdownClass: 'priceBreakdownContainer' });
          },1000);
        })
      }
    }
  }

  render() {

    const { flightDetails, ticketPrice, housingDetails, totalPrice, currencySymbol: currency } = this.props.priceDetails || {};
    const { priceBreakdownClass } = this.state;

    const noInfo = (
      <span id='noInfoLabel'>No information</span>
    )

    const accommodationTypes = housingDetails.map((propertyType, key) => {
      return (
        <div key={key} className='accommodationTypeWrap'>
          <div className="propertyTypeIconWrap">
            <img src={require(`../public/${propertyType.icon}`)} className='homeTypeIcon' />
          </div>
          <div className='typeAndPriceWrap'><p>{propertyType.type}</p></div>
          <div className='typeAndPriceWrap'><p>{currency}{propertyType.price}</p></div>
        </div>
      )
    });

    const festival = (
      <div>
        <h1 className='priceBreakdownHeading'>Festival ticket</h1>
        <img src={require('../public/ticket.svg')} id='ticketIcon' />
        <p className='priceLabel'>{currency}{ticketPrice}</p>
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
      <Paper zDepth={1} className={priceBreakdownClass}>
        <CustomCarousel
          slideWidth={1}
          content={[festival, travel, housing]}
        />
      </Paper>
    )


  }
}

  export default PriceBreakdown;
