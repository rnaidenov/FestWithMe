import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadFestivals, updateInput, searchFestival } from '../actions/searchActions';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import '../styles/search.css';
import { Grid, Col, Row} from 'react-bootstrap';
import IconButton from 'material-ui/IconButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';

import Results from './results';

@connect(store => {
  return {
    festivals : store.festivals,
    festivalInput : store.festivalInput,
    searchResults : store.searchResults
  }
})

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state={searchQuery:'',location:'location_off'}
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
    this.state.location === 'location_on' ? this.setState({location:'location_off'}) : this.setState({location:'location_on'})
  }


  render () {

    const hintStyle = {marginLeft:'2%'};

    const location= this.state.location;
    console.log(location);

    return (
      <div >
          <MuiThemeProvider>
            <div className="searchWrap">
              <p className="inlineLabel">Going to</p>
              <Paper zDepth={1} className = 'searchContainer'>
                <AutoComplete
                  dataSource={this.props.festivals}
                  filter={AutoComplete.caseInsensitiveFilter}
                  hintText="Festival"
                  hintStyle={hintStyle}
                  fullWidth={true}
                  onUpdateInput = {(festivalName) => {this.updateSearchInput(festivalName)}}
                />
              </Paper>
              <p  className="inlineLabel">from</p>
              <Paper  zDepth={1} className = 'searchContainer'>
                <TextField
                  hintText="City"
                  hintStyle={hintStyle}
                  fullWidth={true}
                />
                <i className="material-icons locationIcon" id={location} onClick = {() => this.toggleLocation()}>{location}</i>
              </Paper>

              <Results festivalName={this.state.searchQuery}/>
            </div>
          </MuiThemeProvider>
      </div>
    )
  }

}

export default Search;
