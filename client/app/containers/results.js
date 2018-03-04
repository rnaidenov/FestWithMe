import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import PriceBreakdown from '../components/priceBreakdown';
import { changeCurrency } from '../actions/priceBreakdownActions';
import { updateTicketPrice } from '../actions/priceUpdateActions';
import CurrencyConverter from './currencyConverter';
import CurrencyDropdown from '../components/currencyDropdown';
import { Loader } from '../components/loader';
import '../../dist/styles/results.css';


@connect(store => {
  return {
    searchResults: store.searchResults
  }
})

class Results extends React.Component {

  constructor(props) {
    super(props);
    this.DEFAULT_CURRENCY = '$';
    this.state = { carret: 'arrow_drop_up', isPricebreakdownSelected: false };
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
    if (this.wrapperRef && !this.wrapperRef.contains(e.target) && screenSize === 'phone') {
      if (isPricebreakdownSelected) {
        this.closePriceBreakdown();
      }
    }
  }

  componentWillReceiveProps(newProps) {
    const { screenSize: newScreenSize } = newProps;
    const { screenSize } = this.state;

    if (screenSize !== newScreenSize) {
      this.setState({ screenSize: newScreenSize });
    }
  }

  render() {

    const { searchResults, festivalName, screenSize } = this.props;
    const { carret, isPricebreakdownSelected, priceDetails } = this.state;
    const { searching, prices, currency, searchDetails, isActive } = searchResults || {};
    const { totalPrice } = prices || {};
    let results;



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


    const finishedPhase = (
      <div className='finishedResultsWrap'>
        <CurrencyConverter
          prices={prices || {}}
          currency={currency || this.DEFAULT_CURRENCY}
        />
        <div className='resultWrap'>
          <p id='resultsLabel'>
            <span className="resultText">Going to </span>
            <span className="festivalNameLabel">{festivalName}</span>
            <span className="resultText"> will cost you </span>
            <span className="totalPriceLabel">{currency || this.DEFAULT_CURRENCY}{totalPrice}</span>
          </p>
          <div className="priceBreakdownWrap">
            {screenSize !== 'desktop' ? priceBreakdownCarret : null}
          </div>
        </div>
        <div ref={(wrapper) => { this.wrapperRef = wrapper }} className='breakdownContainerWrap'>
          <PriceBreakdown
            prices={prices || {}}
            isSelected={isPricebreakdownSelected}
            currency={currency || this.DEFAULT_CURRENCY}
            updateTicketPrice={updateTicketPrice}
            screenSize={screenSize}
            searchDetails={searchDetails}
          />
        </div>
      </div>
    )



    if (!searchResults) {
      results = null;
    } else if (searching) {
      results = <Loader />;
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
