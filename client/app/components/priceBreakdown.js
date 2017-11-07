import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import FlightPrice from './flightPrice';
import CustomCarousel from './customCarousel';
import { updateTicketPrice } from '../actions/priceUpdateActions';


@connect(store => {
  return {
    updatedPrices: store.priceUpdater
  }
})

class PriceBreakdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = { priceBreakdownClass: 'priceBreakdownContainer' };
  }

  componentWillUpdate(newProps) {

    if (newProps.priceDetails!==this.state.priceDetails) {
      const { priceDetails, currency } = newProps;
      this.setState({priceDetails, currency })
    }

    const breakdownIsShown = this.state.priceBreakdownClass === 'priceBreakdownContainer selected';

    if (newProps.isSelected) {
      if (!breakdownIsShown) {
        this.setState({ priceBreakdownClass: 'priceBreakdownContainer selected' });
      }
    } else {
      if (breakdownIsShown) {
        this.setState({ priceBreakdownClass: 'priceBreakdownContainer unselected' }, () => {
          setTimeout(() => {
            this.setState({ priceBreakdownClass: 'priceBreakdownContainer' });
          }, 1000);
        })
      }
    }
  }

  updateTicketPrice() {
    this.props.dispatch(updateTicketPrice(this.state.priceDetails,20));
  }

  render() {

    const { priceDetails, defaultCurrency } = this.props;
    const { flightDetails, ticketPrice, housingDetails: { properties }, totalPrice } = priceDetails || {};
    const { priceBreakdownClass, currency } = this.state;

    const noInfo = (
      <span id='noInfoLabel'>No information</span>
    )

    const accommodationTypes = properties.map((propertyType, key) => {
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


    const soldOutFestival = (
      <div>
        <h1 className='priceBreakdownHeading'>Festival ticket</h1>
        <p className='soldOutLabel'>
          Unfortunately, the event seems to be sold out on Resident Advisor. 
          If you have purchased a ticket already, you can enter the price amount in the input box below.
        </p>
        <input/> <button onClick={() => this.updateTicketPrice()}>Okay</button>
      </div>
    )

    const activeFestival = (
      <div>
        <h1 className='priceBreakdownHeading'>Festival ticket</h1>
        <img src={require('../public/ticket.svg')} id='ticketIcon' />
        <p className='priceLabel'>{currency}{ticketPrice}</p>
      </div>
    )

    const festival = ticketPrice ? activeFestival : soldOutFestival

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
