import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadFestivals, updateInput, searchFestival, getLocation } from '../actions/searchActions';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import '../styles/search.css';
import { Grid, Col, Row} from 'react-bootstrap';
import IconButton from 'material-ui/IconButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import {geolocated} from 'react-geolocated';


import Results from './results';

@connect(store => {
  return {
    festivals : store.festivals,
    festivalInput : store.festivalInput,
    searchResults : store.searchResults,
    location : store.location
  }
})

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state={searchQuery:'',location:'location_off',locationField:''}
  }

  componentDidMount() {
    injectTapEventPlugin();
    this.props.dispatch(loadFestivals());
  }

  updateSearchInput (festivalName) {
    this.setState({searchQuery:festivalName});
    this.props.dispatch(updateInput(festivalName));
  }

  toggleLocation () {
    if (this.state.location === 'location_on') {
      this.setState({location:'location_off'})
    } else {
      this.props.dispatch(getLocation());
      this.setState({location:'location_on'});
      setTimeout(() => {
        this.setState({locationField:this.props.location});
      },400);
    }
  }

  hoverLocation () {
    this.state.location == 'location_off' ? this.setState({hoverLocation:true}) : null;
  }

  hoverOutLocation () {
    this.setState({hoverLocation:false});
  }

  updateLocationField (e) {
    this.setState({locationField:e.target.value});
  }


  render () {

    const hintStyle = {marginLeft:'2%'};

    const {locationField : locationInput,location} = this.state;
    const festivalInput = this.props.festivalInput;

    const toolTip = (
      <div class="toolTipBox">
        <div class="body">
          <span class="tip tip-down"></span>
          <p className="toolTipMessage">Click here to automatically detect and add your location</p>
        </div>
      </div>
    )

    return (
      <div >
          <MuiThemeProvider>
            <div>
            <div className="searchWrap">
              <p className="inlineLabel" id="goingToLabel">Going to</p>
              <Paper zDepth={1} className = 'searchContainer' id="festivalField">
                <AutoComplete
                  dataSource={this.props.festivals}
                  filter={AutoComplete.caseInsensitiveFilter}
                  hintText="Festival"
                  hintStyle={hintStyle}
                  fullWidth={true}
                  onUpdateInput = {(festivalName) => {this.updateSearchInput(festivalName)}}
                />
              </Paper>
              <p  className="inlineLabel" id="fromLabel">from</p>
              <Paper  zDepth={1} className = 'searchContainer' id="cityField">
                <TextField
                  hintText='City'
                  className='locationTextField'
                  hintStyle={hintStyle}
                  fullWidth={true}
                  onChange={(e) => this.updateLocationField(e)}
                  value={this.state.locationField}
                />
                <i className="material-icons locationIcon" id={location}
                  onMouseEnter={() => this.hoverLocation()}
                  onClick = {() => this.toggleLocation()}
                  onMouseLeave = {() => this.hoverOutLocation()}
                >
                  {location}
                  {this.state.hoverLocation ? toolTip : null}
                </i>
              </Paper>
              <div className="btnWrap">
                <IconButton className='searchBtn' onClick = {() => this.props.dispatch(searchFestival(locationInput,festivalInput))}>
                  <i class="material-icons">search</i>
                </IconButton>
              </div>
            </div>

            <Results festivalName={this.state.searchQuery}/>
          </div>
          </MuiThemeProvider>
      </div>
    )
  }

}

export default Search;
