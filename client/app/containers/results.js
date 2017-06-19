import React from 'react';
import { connect } from 'react-redux';
// import { loadFestivals, updateInput, searchFestival } from '../actions/searchActions';
import Paper from 'material-ui/Paper';
import '../styles/search.css';
import { Grid, Col, Row} from 'react-bootstrap';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';


@connect(store => {
  return {
    searchResults : store.searchResults
  }
})

class Results extends React.Component {

  render () {

    const {searchResults, festivalName} = this.props;
    const {text, color, loaderValue} = searchResults || {};

    let results;

    const loadingPhase = (
      <div>
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

    let finishedPhase = (
      <div>
        <CircularProgress
         mode="determinate"
         value={100}
         size={100}
         thickness={3}
         color="#603248"
         className='determinateCircle'
       />
       <p id='resultsLabel'>
         Going to {festivalName} will cost you loads.
       </p>
       <div>
         <p
           className="priceBreakdown"
           id="priceBreakdownLabel">
           Price breakdown
         </p>
         <span className="priceBreakdown" id='carretDropdown'> &#9660;</span>
       </div>
      </div>
    )

    if (!searchResults) {
      results = null;
    } else if (searchResults.status == 'searching') {
      results = loadingPhase;
    } else {
      results = finishedPhase;
    }


    return (
      <div>
        {results}
      </div>
    )
  }

}

export default Results;
