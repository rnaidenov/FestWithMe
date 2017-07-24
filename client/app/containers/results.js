import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import '../styles/search.css';
import { Grid, Col, Row} from 'react-bootstrap';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import PriceBreakdown  from '../components/priceBreakdown';


@connect(store => {
  return {
    searchResults : store.searchResults
  }
})

class Results extends React.Component {

  constructor (props) {
    super(props);
    this.state = {priceBreakdownClass:'priceBreakdownContainer',carret:'arrow_drop_up'}
  }

  togglePriceBreakdown () {
    console.log("click");
      if (this.state.carret.includes('down')) {
        console.log("mnogo laina");
        this.setState({priceBreakdownClass: 'priceBreakdownContainer unselected',carret:'arrow_drop_up'}, () => {
          setTimeout(() => {
            this.setState({priceBreakdownClass:'priceBreakdownContainer'})
          },1000)
        });
      } else {
        console.log("laina");
        this.setState({priceBreakdownClass: 'priceBreakdownContainer selected',carret:'arrow_drop_down'});
      }
  }

  render () {

    const {searchResults, festivalName} = this.props;
    const {carret} = this.state;
    const {text, color, loaderValue, prices} = searchResults || {};
    const {details} = prices || {};
    const {flight, ticketPrice, housingDetails,currency, totalPrice} = details || {};


    let results;

    const loadingPhase = (
      <div className="loaderWrap">
        <CircularProgress
          size={100}
          mode="determinate"
          thickness={3}
          value={loaderValue}
          color="#7f3e5d"
          className='determinateCircle'/>
          <CircularProgress
            size={100}
            thickness={3}
            color="#b27290"
            className='indeterminateCircle'/>
        <p
          style={{color:`${color}`}}>
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
            className='determinateCircle'/>
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
           color="#603248"
           className='determinateCircle'
         />
         <p className='smiley' id='happy'>:D</p>
       </div>
       <p id='resultsLabel'>
         Going to <span className="festivalNameLabel">{festivalName}</span> will cost you <span className="totalPriceLabel">{currency}{totalPrice}</span>.
       </p>
        <div>
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

           <PriceBreakdown
             cssClass = {this.state.priceBreakdownClass}
             flightDetails={flight || {}}
             ticketPrice={ticketPrice }
             accommodation={housingDetails || {}}
             totalPrice = {totalPrice || ''}
             currency = {currency || ''}
           />
       </div>
      </div>
    )



    if (!searchResults) {
      results = null;
    } else if (searchResults.status == 'searching') {
      results = loadingPhase;
    } else {
      typeof(searchResults.prices) == 'string' ? results = soldOutEvent : results = finishedPhase;
    }


    return (
      <div>
        {results}
      </div>
    )
  }

}

export default Results;
