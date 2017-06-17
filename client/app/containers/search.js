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


@connect(store => {
  return {
    festivals : store.festivals,
    festivalInput : store.festivalInput,
    searchResults : store.searchResults
  }
})

class Search extends React.Component {



  componentDidMount() {
    injectTapEventPlugin();

    this.props.dispatch(loadFestivals());
  }

  updateSearchInput (e) {
    this.props.dispatch(updateInput(e));
  }

  bratle(e) {
    console.log(e.target.value);
  }



  render () {
    console.log(this.props.searchResults);
    const {searchResults} = this.props;
    const {text, color} = searchResults || {};

    const loadingPhase = (
      <div>
        <CircularProgress
          size={100}
          thickness={3}
          color={color || {}}
          className='loadingCircle'/>
        <p>{text || ''}</p>
      </div>
    )

    const finishedPhase = (
      <div>
        <Paper zDepth={1}>
          <img
            src={require('../public/success.svg')}
            className = 'successCircle'
          />
        </Paper>
      </div>
    )

    const getResults = () => {
      if (!searchResults) {
        return null;
      } else if (searchResults.status = 'loading') {
        return (
          loadingPhase
        )
      } else if (searchResults.status = 'finished') {
        return (
          finishedPhase
        )
      }
    }

    return (
      <div >
        <Grid className = 'searchWrap'>
            <MuiThemeProvider>
               <Row>
                <Col md={4} sm={10} mdOffset={3}>
                   <Paper zDepth={1} className = 'searchContainer'>
                      <AutoComplete
                        id="festivals_textInput"
                        dataSource={this.props.festivals}
                        filter={AutoComplete.caseInsensitiveFilter}
                        fullWidth={true}
                        onBlur = {(e) => {this.updateSearchInput(e)}}
                      />
                    </Paper>
                  </Col>
                  <Col md={2} sm={2}>
                    <IconButton className='searchBtn' onClick = {() => this.props.dispatch(searchFestival(this.props.festivalInput))}>
                      <i class="material-icons">search</i>
                    </IconButton>
                  </Col>
                  <Col md = {12} >
                    {getResults()}
                  </Col>
              </Row>
          </MuiThemeProvider>
        </Grid>
      </div>
    )
  }

}

export default Search;
