import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import PriceBreakdown from '../components/priceBreakdown';
import '../styles/search.css';


@connect(store => {
  return {
    searchResults: store.searchResults
  }
})

class Results extends React.Component {

  constructor(props) {
    super(props);
    this.DEFAULT_CURRENCY = '$';
    this.state = { priceBreakdownClass: 'priceBreakdownContainer', carret: 'arrow_drop_up', currency: this.DEFAULT_CURRENCY };
    this.SMARTPHONE_MAX_WIDTH_PIXELS = 500;
    this.closePriceBreakdownMobile = this.closePriceBreakdownMobile.bind(this);
  }

  componentDidMount() {
    window.changeCurrency=this.changeCurrency;
    document.addEventListener('mousedown', this.closePriceBreakdownMobile);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closePriceBreakdownMobile);
  }

  closePriceBreakdown() {
    this.setState({ priceBreakdownClass: 'priceBreakdownContainer unselected', carret: 'arrow_drop_up' }, () => {
      setTimeout(() => {
        this.setState({ priceBreakdownClass: 'priceBreakdownContainer' })
      }, 1000)
    });
  }

  togglePriceBreakdown() {
    if (this.state.carret.includes('down')) {
      this.closePriceBreakdown();
    } else {
      this.setState({ priceBreakdownClass: 'priceBreakdownContainer selected', carret: 'arrow_drop_down' });
    }
  }

  closePriceBreakdownMobile(e) {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target) && window.innerWidth < this.SMARTPHONE_MAX_WIDTH_PIXELS) {
      if (this.state.carret.includes('down')) {
        this.closePriceBreakdown();
      }
    }
  }

  render() {

    const { searchResults, festivalName } = this.props;
    const { carret, priceBreakdownClass, currency } = this.state;
    const { text, color, loaderValue, prices } = searchResults || {};
    const { details } = prices || {};
    const { flight, ticketPrice, housingDetails, totalPrice } = details || {};


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
        <div className='loaderSmileyWrap'>
          <CircularProgress
            mode="determinate"
            value={100}
            size={100}
            thickness={3}
            color="#47140e"
            className='determinateCircle'
          />
          <p className='smiley' id='happy'>:D</p>
        </div>
        <p id='resultsLabel'>
          <span className="resultText">Going to </span>
          <span className="festivalNameLabel">{festivalName}</span>
          <span className="resultText"> will cost you </span>
          <span className="totalPriceLabel">{currency}{totalPrice}</span>.
       </p>
        <div className="priceBreakdownWrap">
          <p
            className="priceBreakdown"
            id="priceBreakdownLabel"
          >
            Price breakdown
           </p>
          <i class="material-icons priceBreakdown"
            id='carretDropdown'
            onClick={() => this.togglePriceBreakdown()}>
            {carret}
          </i>
          <div ref={(wrapper) => { this.wrapperRef = wrapper }}>
            <PriceBreakdown
              cssClass={priceBreakdownClass}
              flightDetails={flight || {}}
              ticketPrice={ticketPrice}
              accommodation={housingDetails || {}}
              currency={currency || ''}
            />
          </div>
        </div>
      </div>
    )



    if (!searchResults) {
      results = null;
    } else if (searchResults.status == 'searching') {
      results = loadingPhase;
    } else {
      typeof (searchResults.prices) == 'string' ? results = soldOutEvent : results = finishedPhase;
    }


    return (
      <div>
        {results}
      </div>
    )
  }

}

export default Results;
