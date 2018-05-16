import React from 'react';
import { connect } from 'react-redux';
import FinishedPhase from './FinishedPhase';
import { Loader } from '../components/Loader';
import { PastEvent } from '../components/PastEvent';
import '../../dist/styles/results.css';


@connect(store => {
  return {
    searchResults: store.searchResults
  }
})

class Results extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {

    const { searchResults, festivalName, screenSize } = this.props;
    const { searching, prices, currency, searchDetails, isActive, destination } = searchResults || {};


    if (!searching && !prices) {
      return null;
    } else if (searching) {
      return <Loader />;
    } else {
      return isActive ? <FinishedPhase
                          currency={currency}
                          festivalName={festivalName}
                          priceDetails={prices}
                          searchDetails={searchDetails}
                          destination={destination}
                          screenSize={screenSize}
                        />
                      : <PastEvent />
    }
  }

}

export default Results;
