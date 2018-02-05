import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import PriceBreakdown from '../components/priceBreakdown';
import { changeCurrency } from '../actions/priceBreakdownActions';
import { updateTicketPrice } from '../actions/priceUpdateActions';
import CurrencyConverter from './currencyConverter';
import CurrencyDropdown from '../components/currencyDropdown';
import { Loader } from '../components/loader';

import '../styles/results.css';


@connect(store => {
  return {
    searchResults: store.searchResults,
    convertedPrices: store.currencyChanger,
    priceUpdate: store.priceUpdater,
  }
})

class Results extends React.Component {

  constructor(props) {
    super(props);
    this.DEFAULT_CURRENCY = '$';
    this.state = { carret: 'arrow_drop_up', isPricebreakdownSelected: false, priceDetails: null, currency: this.DEFAULT_CURRENCY }; 
    this.closePriceBreakdownMobile = this.closePriceBreakdownMobile.bind(this);
  }

  componentDidMount() {
    window.changeCurrency = this.changeCurrency;
    document.addEventListener('mousedown', this.closePriceBreakdownMobile);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closePriceBreakdownMobile);
  }

  closePriceBreakdown() {
    this.setState({ isPricebreakdownSelected: false, carret: 'arrow_drop_up' });
  }

  togglePriceBreakdown() {
    if (this.state.isPricebreakdownSelected) {
      this.closePriceBreakdown();
    } else {
      this.setState({ isPricebreakdownSelected: true, carret: 'arrow_drop_down' });
    }
  }

  closePriceBreakdownMobile(e) {
    const { isPricebreakdownSelected, screenSize } = this.state;
    if (this.wrapperRef && !this.wrapperRef.contains(e.target) && screenSize==='phone') {
      if (isPricebreakdownSelected) {
        this.closePriceBreakdown();
      }
    }
  }

  componentWillReceiveProps(newProps) {
    const { searchResults, festivalName, convertedPrices, priceUpdate, screenSize:newScreenSize } = newProps;
    const { priceDetails, currency, screenSize } = this.state;

    if(screenSize!==newScreenSize){
      this.setState({ screenSize: newScreenSize });
    }

    if (priceDetails != null && priceDetails.ticketPrice == null && priceUpdate) {
      const { details } = priceUpdate;
      this.setState({ priceDetails: details });
      this.setState({ totalPrice: details.totalPrice });
    }

    if (!convertedPrices) {
      const { prices } = searchResults || {};
      const { details } = prices || {};
      if (priceDetails != details && details != null) {
        this.setState({ priceDetails: details });
        this.setState({ totalPrice: details.totalPrice });
      }
    } else {
      const { details } = convertedPrices;
      const { totalPrice, currencySymbol } = details;
      if (currency !== currencySymbol) {
        this.setState({ priceDetails: details, totalPrice, currency: currencySymbol });
      }
    }

  }

  render() {


    const { searchResults, festivalName, convertedPrices, screenSize } = this.props;
    const { carret, isPricebreakdownSelected, priceDetails, totalPrice, currency } = this.state;
    const { loadedValue, maxLoadValue, text, color, loaderValue, searching, isActive } = searchResults || {};
    let results;

    const loadingPhase = (
      <Loader loadedValue={loadedValue} maxLoadValue={maxLoadValue} text={text || ''}  color={color}/>
    )

    const pastEvent = (
      <div className='soldOutWrap'>
        <div className='loaderSmileyWrap'>
          <CircularProgress
            size={100}
            mode="determinate"
            thickness={3}
            value={100}
            color="#7f3e5d"
            className='determinateCircle' />
          <p className='smiley' id='sad'>:(</p>
        </div>
        <p className='waitingMsg' id='soldOutLabel'>It seems that this event has finished.</p>
      </div>
    )

    const priceBreakdownCarret = (
      <div>
        <p className="priceBreakdown" id="priceBreakdownLabel">
          Price breakdown
        </p>
        <i class="material-icons priceBreakdown"
          id='carretDropdown'
          onClick={() => this.togglePriceBreakdown()}>
          {carret}
        </i>
      </div>
    )


    let finishedPhase = (
      <div className='finishedResultsWrap'>
        <CurrencyConverter
          priceDetails={priceDetails || {}}
          currency={currency}
        />
        <p id='resultsLabel'>
          <span className="resultText">Going to </span>
          <span className="festivalNameLabel">{festivalName}</span>
          <span className="resultText"> will cost you </span>
          <span className="totalPriceLabel">{currency}{totalPrice}</span>
        </p>
        <div className="priceBreakdownWrap">
          {screenSize !== 'desktop' ? priceBreakdownCarret : null}
          <div ref={(wrapper) => { this.wrapperRef = wrapper }} className='breakdownContainerWrap'>
            <PriceBreakdown
              priceDetails={priceDetails || {}}
              isSelected={isPricebreakdownSelected}
              currency={currency}
              updateTicketPrice={updateTicketPrice}
              screenSize={screenSize}
            />
          </div>
        </div>
      </div>
    )

    if (!searchResults) {
      results = null;
    } else if (searching) {
      results = loadingPhase;
    } else {
      results = isActive ? finishedPhase : pastEvent
    }

    return (
      <div>
        {results}
      </div>
    )
  }

}

export default Results;
