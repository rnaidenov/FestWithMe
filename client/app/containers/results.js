import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import PriceBreakdown from '../components/priceBreakdown';
import { changeCurrency } from '../actions/priceBreakdownActions';
import CurrencyConverter from './currencyConverter';
import CurrencyDropdown from '../components/currencyDropdown';
import '../styles/results.css';


@connect(store => {
  return {
    searchResults: store.searchResults,
    convertedPrices: store.currencyChanger
  }
})

class Results extends React.Component {

  constructor(props) {
    super(props);
    this.DEFAULT_CURRENCY = '$';
    this.state = { carret: 'arrow_drop_up', isPricebreakdownSelected:false };
    this.SMARTPHONE_MAX_WIDTH_PIXELS = 500;
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
    this.setState({ isPricebreakdownSelected:false, carret: 'arrow_drop_up' });
  }

  togglePriceBreakdown() {
    if (this.state.isPricebreakdownSelected) {
      this.closePriceBreakdown();
    } else {
      this.setState({ isPricebreakdownSelected:true, carret: 'arrow_drop_down' });
    }
  }

  closePriceBreakdownMobile(e) {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target) && window.innerWidth < this.SMARTPHONE_MAX_WIDTH_PIXELS) {
      if (this.state.isPricebreakdownSelected) {
        this.closePriceBreakdown();
      }
    }
  }

  render() {


    const { searchResults, festivalName, convertedPrices } = this.props;
    const { carret, isPricebreakdownSelected } = this.state;
    const { text, color, loaderValue, searching, prices, isActive } = searchResults || {};
    const { details } = prices || {};
    const { totalPrice } = details || {};
    const { isConverted, details: convertedDetails } = convertedPrices || {};
    const { currencySymbol: convertedCurrency, totalPrice: totalPriceConverted  } = convertedDetails || {}; 
    let results;


    const loadingPhase = (
      <div className="loaderWrap">
        <CircularProgress
          size={100}
          mode="determinate"
          thickness={3}
          value={loaderValue}
          color={color}
          className='determinateCircle' />
        <CircularProgress
          size={100}
          thickness={3}
          color="#7c5652"
          className='indeterminateCircle' />
        <p>
          {text || ''}
        </p>
      </div>
    )

    const soldOutEvent = (
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
        <p id='soldOutLabel'>{prices || null}</p>
      </div>
    )

    let finishedPhase = (
      <div className='finishedResultsWrap'>
       <CurrencyConverter defaultCurrency = { this.DEFAULT_CURRENCY }/>
        <p id='resultsLabel'>
          <span className="resultText">Going to </span>
          <span className="festivalNameLabel">{festivalName}</span>
          <span className="resultText"> will cost you </span>
          <span className="totalPriceLabel">{convertedCurrency || this.DEFAULT_CURRENCY}{totalPriceConverted || totalPrice}</span>
       </p>
        <div className="priceBreakdownWrap"> 
          <p className="priceBreakdown" id="priceBreakdownLabel">
            Price breakdown
           </p>
          <i class="material-icons priceBreakdown"
            id='carretDropdown'
            onClick={() => this.togglePriceBreakdown()}>
            {carret}
          </i>
          <div  ref={(wrapper) => { this.wrapperRef = wrapper }}>
            <PriceBreakdown
              priceDetails = { convertedDetails || details }
              isSelected = { isPricebreakdownSelected }
              defaultCurrency = { this.DEFAULT_CURRENCY }
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
      results = isActive ? finishedPhase : soldOutEvent
    }


    return (
      <div>
        {results}
      </div>
    )
  }

}

export default Results;
