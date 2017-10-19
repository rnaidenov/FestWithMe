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
    this.state = { searchQuery: '', hintStyle: '', location: 'location_off', locationField: '',
                   festivalHint: 'Festival', locationHint: 'City', nightsOfStay: '1',numPeople:0}
  }

  componentDidMount() {
    this.props.dispatch(loadFestivals());
  }

  selectNumPeople (event, index, numPeople) {
      console.log(index)
      this.setState({numPeople})
  };

  updateSearchInput(festivalName) {
    this.setState({ searchQuery: festivalName });
    this.props.dispatch(updateInput(festivalName));
  }

  toggleLocation() {
    if (this.state.location === 'location_on') {
      this.setState({ location: 'location_off' })
    } else {
      this.props.dispatch(getLocation());
      this.setState({ location: 'location_on' });
      setTimeout(() => {
        this.setState({ locationField: this.props.location });
      }, 400);
    }
  }

  hoverLocation() {
    this.state.location == 'location_off' ? this.setState({ hoverLocation: true }) : null;
  }

  hoverOutLocation() {
    this.setState({ hoverLocation: false });
  }

  updateLocationField(e) {
    this.setState({ locationField: e.target.value });
  }

  updateNightsField(e) {
     this.setState({ nightsOfStay: e.target.value });
  }

  lookUpFestival(locationInput, festivalInput) {
    if (!locationInput && !festivalInput) {
      this.setState({ locationHint: 'Please enter a valid location', festivalHint: 'Please select a festival' });
    } else if (!locationInput && festivalInput) {
      this.setState({ locationHint: 'Please enter a valid location' });
    } else if (locationInput && !festivalInput) {
      this.setState({ festivalHint: 'Please select a festival' });
    } else {
      this.setState({ festivalToSearch: festivalInput });
      this.props.dispatch(searchFestival(locationInput, festivalInput));
    }
  }

  render() {
    const { locationField: locationInput, location, festivalHint, locationHint, hintStyle } = this.state;
    const { festivalInput } = this.props;
    const inputStyle = { paddingLeft: '12px' };


    return (
      <div >
        <MuiThemeProvider>
          <div>
            <div className="searchWrap">
              <PeopleSelector
                numPeople={this.state.numPeople}
                selectNumPeople={(event, idx, value) => this.selectNumPeople(event, idx, value)}
              />
              <p className="inlineLabel" id="goingToLabel">going to</p>
              <FestivalInput
                festivals={this.props.festivals}
                updateSearchInput={(festivalName) => this.updateSearchInput(festivalName)} 
                style={inputStyle}
              />
              <p className="inlineLabel" id="fromLabel">from</p>
              <LocationInput
                locationField={locationInput}
                location={location}
                updateLocationField={() => this.updateLocationField}
                toggleLocation={() => this.toggleLocation}
                hoverLocation={() => this.hoverLocation}
                hoverOutLocation={() => this.hoverOutLocation}
                style={inputStyle}
              />
              <p className="inlineLabel" id="forLabel">for</p>
              <NightsSelector 
                nightsOfStay={this.state.nightsOfStay} 
                changeNights={(e) => this.updateNightsField(e)}  
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
