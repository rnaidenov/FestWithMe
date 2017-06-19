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
    this.state={searchQuery:''}
  }

  componentDidMount() {
    injectTapEventPlugin();
    this.props.dispatch(loadFestivals());
  }

  updateSearchInput (festivalName) {
    this.setState({searchQuery:festivalName});
    this.props.dispatch(updateInput(festivalName));
  }

  render () {


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
                        onUpdateInput = {(festivalName) => {this.updateSearchInput(festivalName)}}
                      />
                    </Paper>
                  </Col>
                  <Col mdHidden={true} lgHidden={true}>
                    <div>&nbsp;</div>
                  </Col>
                  <Col md={2} sm={2}>
                    <IconButton className='searchBtn' onClick = {() => this.props.dispatch(searchFestival(this.props.festivalInput))}>
                      <i class="material-icons">search</i>
                    </IconButton>
                  </Col>
                  <Col md = {12} >
                    <Results festivalName={this.state.searchQuery}/>
                  </Col>
              </Row>
          </MuiThemeProvider>
        </Grid>
      </div>
    )
  }

}

export default Search;
