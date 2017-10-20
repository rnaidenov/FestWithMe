import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadFestivals, updateInput, searchFestival, getLocation } from '../actions/searchActions';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import '../styles/search.css';
import { Grid, Col, Row } from 'react-bootstrap';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import { geolocated } from 'react-geolocated';
import PeopleSelector from '../components/peopleSelector';
import NightsSelector from '../components/nightsSelector';
import FestivalInput from '../components/festivalInput';
import LocationInput from '../components/locationInput';


import Results from './results';

@connect(store => {
  return {
    festivals: store.festivals,
    festivalInput: store.festivalInput,
    searchResults: store.searchResults,
    location: store.location
  }
})

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = { nightsOfStay: '1',numPeople:0 }
  }

  updateNumPeople(numPeople) {
      this.setState({ numPeople })
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
  
  //locationInput, festivalInput
  lookUpFestival() {
    const { numPeople, festivalName, nightsOfStay, locationOrigin } = this.state;
    console.log( numPeople + "  "+ festivalName + "  "+ nightsOfStay + "  "+ locationOrigin);
    // if (!locationInput && !festivalInput) {
    //   this.setState({ locationHint: 'Please enter a valid location', festivalHint: 'Please select a festival' });
    // } else if (!locationInput && festivalInput) {
    //   this.setState({ locationHint: 'Please enter a valid location' });
    // } else if (locationInput && !festivalInput) {
    //   this.setState({ festivalHint: 'Please select a festival' });
    // } else {
    //   this.setState({ festivalToSearch: festivalInput });
    //   this.props.dispatch(searchFestival(locationInput, festivalInput));
    // }
  }


  render() {
    const { locationInput, location, festivalHint, locationHint, hintStyle } = this.state;
    const { festivalInput } = this.props;
    const inputStyle = { paddingLeft: '12px' };


    return (
      <div >
        <MuiThemeProvider>
          <div>
            <div className="searchWrap">
              <PeopleSelector
                updateNumPeople={(numPeople) => this.updateNumPeople(numPeople)}
              />
              <p className="inlineLabel" id="goingToLabel">going to</p>
              <FestivalInput
                updateFestivalInput={(festivalName) => this.updateFestivalInput(festivalName)} 
                inputStyle={inputStyle}
              />
              <p className="inlineLabel" id="fromLabel">from</p>
              <LocationInput
                updateLocationInput={(location) => this.updateLocationInput(location)}
                inputStyle={inputStyle}
              />
              <p className="inlineLabel" id="forLabel">for</p>
              <NightsSelector
                 updateNightsField={(numOfNights) => {this.updateNightsField(numOfNights)}}
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
