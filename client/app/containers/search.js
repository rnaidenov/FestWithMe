import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadFestivals, searchFestival, getLocation } from '../actions/searchActions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import PeopleSelector from './peopleSelector';
import NightsSelector from './nightsSelector';
import FestivalInput from './festivalInput';
import LocationInput from './locationInput';
import '../styles/search.css';


import Results from './results';

@connect(store => {
  return {
    searchResults: store.searchResults
  }
})

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = { nightsOfStay: '1', numPeople: 1, missingFestival:'', missingLocation:'', locationOrigin:'Sofia', festivalName:'Len Faki, Francois X, ATEQ'}
  }

  updateWindowWidth() {
    this.setState({ width: window.innerWidth });
  }

  updateNumPeople(numPeople) {
    this.setState({ numPeople: numPeople + 1 })
  };

  updateFestivalInput(festivalName) {
    this.setState({ festivalName });
  }

  updateNightsField(nightsOfStay) {
    this.setState({ nightsOfStay });
  }

  updateLocationInput(locationOrigin) {
    this.setState({ locationOrigin });
  }

  lookUpFestival() {
    const { numPeople, festivalName, nightsOfStay, locationOrigin } = this.state;
    
    if (locationOrigin == null || locationOrigin.trim() === '') {
      this.setState({ missingLocation: true });
    } else {
      this.setState({ missingLocation: false });
    }
    if (festivalName == null || festivalName.trim() === '') {
      this.setState({ missingFestival: true });
    } else {
      this.setState({ missingFestival: false });
    }
    
    setTimeout(() => {
      
      if (this.state.missingLocation===false && this.state.missingFestival===false) {
        this.setState({ festivalToSearch: festivalName });
        this.props.dispatch(searchFestival(locationOrigin, festivalName, nightsOfStay, numPeople));
      }
    },500);
  }

  render() {
    const { locationInput, location, festivalHint,
            locationHint, hintStyle, missingFestival, missingLocation } = this.state;
    const { festivalInput } = this.props;
    const inputStyle = {
      paddingLeft: '12px',
      fontFamily: "'Abel', sans-serif",
      fontSize: '18px',
      zIndex:'2'
    };
    const errorStyle = { fontSize: '14px', color: '#841f26',marginTop:'-7%',zIndex:'1'}

    return (
        <MuiThemeProvider>
          <div>
            <div className="searchWrap">
              <PeopleSelector
                updateNumPeople={(numPeople) => this.updateNumPeople(numPeople)}
                inputStyle={inputStyle}
              />
              <p className="inlineLabel" id="goingToLabel">going to</p>
              <FestivalInput
                updateFestivalInput={(festivalName) => this.updateFestivalInput(festivalName)}
                inputStyle={inputStyle}
                errorStyle={errorStyle}
                missingFestival={missingFestival}
              />
              <p className="inlineLabel" id="fromLabel">from</p>
              <LocationInput
                updateLocationInput={(location) => this.updateLocationInput(location)}
                inputStyle={inputStyle}
                errorStyle={errorStyle}
                missingLocation={missingLocation}
              />
              <p className="inlineLabel" id="forLabel">for</p>
              <NightsSelector
                updateNightsField={(numOfNights) => { this.updateNightsField(numOfNights) }}
                inputStyle={inputStyle}
              />
              <div className="btnWrap">
                <IconButton className='searchBtn' onClick={() => this.lookUpFestival()}>
                  <i class="material-icons searchBtnIcon">search</i>
                </IconButton>
              </div>
            </div>

            <Results festivalName={this.state.festivalToSearch} />
          </div>
        </MuiThemeProvider>
    )
  }

}

export default Search;
