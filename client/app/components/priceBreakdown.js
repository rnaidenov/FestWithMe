import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlightPrice from './flightPrice';
import CustomCarousel from './customCarousel';
import { updateTicketPrice } from '../actions/priceUpdateActions';

@connect(store => {
  return {
    searchResults: store.searchResults
  }
})

class PriceBreakdown extends React.Component {

  constructor(props) {
    super(props);
    this.openResultLink = this.openResultLink.bind(this);
    this.state = { showContent: false, newPriceMissing: true, priceBreakdownClass: 'priceBreakdownContainer' };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showContent: true });
    }, 1000);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.priceDetails !== this.state.priceDetails) {
      const { priceDetails, currency } = newProps;
      this.setState({ priceDetails, currency })
    }
    this.togglePriceBreakdown(newProps.isSelected);
  }

  togglePriceBreakdown(isSelected) {
    const breakdownIsShown = this.state.priceBreakdownClass === 'priceBreakdownContainer selected';

    if (isSelected) {
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

  updatePriceAmt = (e, newPriceAmount) => {
    this.setState({ newPriceAmount, newPriceMissing: false });
  }

  updateTicketPrice = () => {
    const { dispatch, prices, searchDetails } = this.props;
    const { newPriceAmount } = this.state;
    dispatch(updateTicketPrice(prices, newPriceAmount, searchDetails));
  }

  openResultLink = (e,url) => {
    const inactiveTicketInput = ReactDOM.findDOMNode(this.refs['InactiveTicketInput']);
    if(inactiveTicketInput===null || !inactiveTicketInput.contains(e.target)) window.open(url, "_blank");
  }

  render() {

    const { prices, currency, screenSize } = this.props;
    const { flightDetails, eventDetails, housingDetails, totalPrice } = prices;
    const { priceBreakdownClass, newPriceAmount, newPriceMissing, showContent } = this.state;


    const accommodationTypes = housingDetails.properties.map((propertyType, key) => {
      return (
        <div key={key} className='accommodationTypeWrap'>
          <div className="accomodationInfo">
            <img src={require(`../../dist/public/${propertyType.icon}`)} className='homeTypeIcon' />
          </div>
          <div className='accomodationInfo' id='typeAndPrice'><p>{propertyType.type}</p></div>
          <div className='accomodationInfo' id='typeAndPrice'><p>{currency}{propertyType.price}</p></div>
        </div>
      )
    });

    const soldOutFestival = (
      <div>
        <h1 className='priceBreakdownHeading'>Festival ticket</h1>
        <div className="contentWrap">
          <div className="mainContent">
            <img src={require('../../dist/public/inactiveTicket.svg')} className='contentIcon inactive' />
            <p className='price-update-text'>
              Unfortunately, the event seems to be sold out on Resident Advisor.
              <br />
              <span className='price-update-text prompt'>If you have purchased a ticket already, you can enter the price amount in the input box below.</span>
            </p>
          </div>
          <div className='inputWrap' ref='InactiveTicketInput'>
            <Paper className='price-update-input'>
              <TextField
                underlineShow={false}
                style={{ width: '50px' }}
                value={newPriceAmount}
                onChange={this.updatePriceAmt}
                id='priceInputField'
              />
            </Paper>
            <RaisedButton
              className='price-update-btn'
              disabled={newPriceMissing}
              onClick={this.updateTicketPrice}><p className='price-update-btn-text'>OK</p></RaisedButton>
          </div>
        </div>
      </div>
    )

    const activeFestival = (
      <div>
        <h1 className='priceBreakdownHeading'>Festival ticket</h1>
        <div className='contentWrap'>
          <div className="mainContent">
            <img src={require('../../dist/public/ticket.svg')} className='contentIcon' />
          </div>
          <p className='priceLabel'>{currency}{eventDetails.price}</p>
        </div>
      </div>
    )

    const festival = eventDetails.price != null ? activeFestival : soldOutFestival

    const travel = (
      <div className='flexWrap'>
        <h1 className='priceBreakdownHeading'>Plane ticket</h1>
        <FlightPrice details={flightDetails} currency={currency} />
      </div>
    )

    const housing = (
      <div className="flexWrap">
        <h1 className='priceBreakdownHeading'>Accommodation</h1>
        <div className="contentWrap">
          {accommodationTypes}
        </div>
      </div>
    )

    const priceBreakdownContent = [{ element: festival, ref: eventDetails.url }, { element: travel, ref: flightDetails.url }, { element: housing, ref: housingDetails.url }];

    const content = priceBreakdownContent.map((content, idx) => (
      <Paper className='contentType' id={`content${idx}`} key={idx} onClick={(e) => this.openResultLink(e, content.ref)}>
        {content.element}
      </Paper>
    ));

    const priceBreakdownBigScreen = (
      <div>{content}</div>
    )

    const priceBreakdownMobileScreen = (
      <Paper zDepth={1} className={priceBreakdownClass}>
        <CustomCarousel
          onClick={this.openResultLink}
          slideWidth={1}
          content={priceBreakdownContent}
        />
      </Paper>
    )


    return (
      screenSize !== 'desktop' ? priceBreakdownMobileScreen : priceBreakdownBigScreen
    )


  }
}

export default PriceBreakdown;
