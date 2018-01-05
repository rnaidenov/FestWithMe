import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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
    this.state = { showContent: false, newPriceMissing: true, priceBreakdownClass: 'priceBreakdownContainer' };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showContent: true });
    }, 1000);
  }

  // componentWillReceiveProps(newProps) {
  //   // if (newProps.priceDetails!==this.state.priceDetails) {
  //   //   const { priceDetails, currency } = newProps;
  //   //   this.setState({priceDetails, currency })
  //   // }
  //   this.togglePriceBreakdown(newProps.isSelected);
  // }

  // togglePriceBreakdown(isSelected){
  //   const breakdownIsShown = this.state.priceBreakdownClass === 'priceBreakdownContainer selected';

  //     if (isSelected) {
  //       if (!breakdownIsShown) {
  //         this.setState({ priceBreakdownClass: 'priceBreakdownContainer selected' });
  //       }
  //     } else {
  //       if (breakdownIsShown) {
  //         this.setState({ priceBreakdownClass: 'priceBreakdownContainer unselected' }, () => {
  //           setTimeout(() => {
  //             this.setState({ priceBreakdownClass: 'priceBreakdownContainer' });
  //           }, 1000);
  //         })
  //       }
  //     }
  // }

  // updatePriceAmt = (e, newPriceAmount) => {
  //     this.setState({ newPriceAmount, newPriceMissing: false });
  // }

  // updateTicketPrice = () => {
  //   const { dispatch, priceDetails } = this.props;
  //   const { newPriceAmount } = this.state;

  //   dispatch(updateTicketPrice(priceDetails,newPriceAmount));
  // }

  render() {

    const { priceDetails, currency, screenSize } = this.props;
    const { flightDetails, ticketPrice, housingDetails: { properties }, totalPrice } = priceDetails;
    const { priceBreakdownClass, newPriceAmount, newPriceMissing, showContent } = this.state;

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


    // const activeFestival = (
    //   <div>
    //     <h1 className='priceBreakdownHeading'>Festival ticket</h1>
    //     <img src={require('../public/ticket.svg')} className='ticketIcon' />
    //     <p className='priceLabel'>$32</p>
    //   </div>
    // )

    const soldOutFestival = (
      <div>
        <h1 className='priceBreakdownHeading'>Festival ticket</h1>
        <img src={require('../public/inactiveTicket.svg')} className='ticketIcon inactive' />
        <p className='price-update-text'>
          Unfortunately, the event seems to be sold out on Resident Advisor.
          <br/>
          <span className='price-update-text prompt'>If you have purchased a ticket already, you can enter the price amount in the input box below.</span>
        </p>
        <div className='inputWrap'>
          <Paper className='price-update-input'>
            <TextField 
              underlineShow={false}
              style={{width:'50px'}}
              value={newPriceAmount}
              onChange={this.updatePriceAmt}
            />
          </Paper>
          <RaisedButton 
            className='price-update-btn' 
            disabled={newPriceMissing}
            onClick={this.updateTicketPrice}><p className='price-update-btn-text'>OK</p></RaisedButton>
        </div>
      </div>
    )

    const activeFestival = (
      <div>
        <h1 className='priceBreakdownHeading'>Festival ticket</h1>
        <img src={require('../public/ticket.svg')} className='ticketIcon' />
        <p className='priceLabel'>{currency}{ticketPrice}</p>
      </div>
    )

    const festival = ticketPrice!=null ? activeFestival : soldOutFestival

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

    const content = [activeFestival, activeFestival, activeFestival].map((content, idx) => {
      return (
        <Paper className='contentType' id={`content${idx}`}>
          {content}
        </Paper>
      )
    });

    const priceBreakdownBigScreen = (
      <div className="contentWrap">
        {content}
      </div>
    )

    const priceBreakdownMobileScreen = (
      <Paper zDepth={1} className={priceBreakdownClass}>
        <CustomCarousel
          slideWidth={1}
          content={[activeFestival, activeFestival, activeFestival]}
        />
      </Paper>
    )


    return (
        screenSize==='mobile' ? priceBreakdownMobileScreen : priceBreakdownBigScreen
    )


  }
}

export default PriceBreakdown;
