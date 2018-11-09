import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadFestivals, searchFestival, getLocation } from '../actions/searchActions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import PeopleSelector from './PeopleSelector';
import NightsSelector from './NightsSelector';
import FestivalInput from './FestivalInput';
import LocationInput from './LocationInput';
import Results from './Results';
import '../../dist/styles/search.css';

@connect(store => {
  return {
    searchResults: store.searchResults
  }
})

class Search extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    // change missingFestival and location
    this.SMARTPHONE_MAX_WIDTH_PIXELS = 500;
    this.MOBILE_MAX_WIDTH_PIXELS = 1100;
    this.demoParam = 'demo';
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
    this.state = { doneSearch: false, nightsOfStay: '3', numPeople: 6, missingFestival: false, missingLocation: false, festivalName: '', locationOrigin: '' }
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
    debugger;
    this.setState({ locationOrigin });
  }


  isDemo() {
    const { location: { search } } = this.props;
    if (search.length) {
      const [paramType, paramValue] = search.split('?')[1].split('=');
      if (paramType === this.demoParam && Boolean(paramValue)) return true;
    }
    return false;
  }


  lookUpFestival() {
    const { numPeople, festivalName, nightsOfStay, locationOrigin, missingLocation, missingFestival } = this.state;

    // if (locationOrigin == null || locationOrigin.trim() === '') {
    //   this.setState({ missingLocation: true });
    // } else {
    //   this.setState({ missingLocation: false });
    // }
    // if (festivalName == null || festivalName.trim() === '') {
    //   this.setState({ missingFestival: true });
    // } else {
    //   this.setState({ missingFestival: false });
    // }

    setTimeout(() => {
      if (!missingLocation && !missingFestival) {
        this.setState({ festivalToSearch: festivalName, doneSearch: true });
        const isDemo = this.isDemo();
        const { searchResults: { currency }, dispatch } = this.props;
        debugger;
        dispatch(searchFestival(locationOrigin, festivalName, nightsOfStay, numPeople, currency, isDemo));
      }
    }, 500);
  }

  componentDidMount() {
    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth);
  }

  updateWindowWidth() {
    this.setState({ windowWidth: window.innerWidth });
    if (window.innerWidth < this.SMARTPHONE_MAX_WIDTH_PIXELS) {
      this.setState({ screenSize: 'phone' });
    } else if (window.innerWidth > this.SMARTPHONE_MAX_WIDTH_PIXELS && window.innerWidth < this.MOBILE_MAX_WIDTH_PIXELS) {
      this.setState({ screenSize: 'tablet' });
    } else {
      this.setState({ screenSize: 'desktop' });
    }
  }

  render() {
    const { locationInput, location, festivalHint,
      locationHint, hintStyle, missingFestival, missingLocation, festivalToSearch, doneSearch, screenSize } = this.state;
    const { festivalInput } = this.props;

    const isOnline = navigator.onLine;
    const isPhone = screenSize === 'phone';
    const appTitle = (
      <div className={isOnline && !isPhone && doneSearch ? "appTitle noSearch" : "appTitle"}>FestWithMe</div>
    )

    const inputStyle = {
      paddingLeft: '12px',
      fontFamily: "'Teko', sans-serif",
      fontWeight: 300,
      fontSize: '26px',
      zIndex: 2
    };
    const errorStyle = { fontSize: '14px', color: '#841f26', marginTop: '-7%', zIndex: '1' }

    if (!screenSize) return null;

    return (
      <MuiThemeProvider>
        <div>
          {!isPhone ? appTitle : null}
          <div className='searchWrap'>
            <PeopleSelector
              updateNumPeople={(numPeople) => this.updateNumPeople(numPeople)}
              inputStyle={inputStyle}
            />
            <p className="searchText" id="goingToLabel">going to</p>
            <FestivalInput
              updateFestivalInput={(festivalName) => this.updateFestivalInput(festivalName)}
              inputStyle={inputStyle}
              errorStyle={errorStyle}
              missingFestival={missingFestival}
            />
            <p className="searchText" id="fromLabel">from</p>
            <LocationInput
              updateLocationInput={(location) => this.updateLocationInput(location)}
              inputStyle={inputStyle}
              errorStyle={errorStyle}
              missingLocation={missingLocation}
              screenSize={screenSize}
            />
            <p className="searchText" id="forLabel">for</p>
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
          <Results festivalName={festivalToSearch} screenSize={screenSize} />
        </div>
      </MuiThemeProvider>
    )
  }

}

export { Search };
