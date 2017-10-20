import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadFestivals, updateInput, searchFestival, getLocation } from '../actions/searchActions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import PeopleSelector from '../components/peopleSelector';
import NightsSelector from '../components/nightsSelector';
import FestivalInput from '../components/festivalInput';
import LocationInput from '../components/locationInput';
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
    this.state = { nightsOfStay: '1', numPeople: 1}
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
    const { numPeople, festivalName, nightsOfStay, locationOrigin, missingLocation, missingFestival } = this.state;
    
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
    console.log(missingFestival,missingLocation);
    if (missingLocation===false && missingFestival===false) {
      this.setState({ festivalToSearch: festivalName });
      console.log("bratle");
      this.props.dispatch(searchFestival(locationOrigin, festivalName, nightsOfStay, numPeople));
    }
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
      <div >
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
                <IconButton className='searchBtn' onClick={() => this.lookUpFestival(locationInput, festivalInput)}>
                  <i class="material-icons searchBtnIcon">search</i>
                </IconButton>
              </div>
            </div>

            <Results festivalName={this.state.festivalToSearch} />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }

}

export default Search;
