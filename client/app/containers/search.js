import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import API from 'qpx-express';
import { searchFestival, handleInput } from '../actions/searchActions';
import airports from 'airport-codes';
import airbnb  from 'airapi';


const apiKey = 'AIzaSyBtSws0VCIlzHDhXOpn9KR_3Juw9pIxe1Q';
const apiKey2 = 'AIzaSyD8yemJXcjTgYV7d_goyxKuwKNpd35VhXw';



class Search extends React.Component {

  render () {


    // ---- Getting data from database ----- //

    // const users = fetch('/api/users');

    // users.then(data => {
    //   data.json().then(what => {
    //     console.log(what);
    //   })
    // })




      // ---- Getting iata code ----- //

    function getCityCode (cityName, countryName) {
      const londonAirports = airports.where({city: cityName, country: countryName});

      if (londonAirports.length > 1) {
        for (let airport of londonAirports) {
            const {attributes : result} = airport;
            if (result.name == 'All Airports') {
              return result.iata;
            }
        }
      }
      else {
        // console.log(londonAirports[0].attributes);
        return londonAirports[0].attributes.iata;
      }
    }

    const sofiaIata = getCityCode('Sofia','Bulgaria');
    const parisIata = getCityCode('Paris','France');
    // console.log(barcelonaIata);

    // ---- Getting data from flights ----- //

    // const qpx = new API(apiKey2);
    //
    // const body = {
    //     "request": {
    //         "passengers": { "adultCount": 1 },
    //         "slice": [{
    //             "origin": sofiaIata,
    //             "destination": parisIata,
    //             "date": '2017-12-05'
    //           }
    //         ]
    //       }
    //     };
    //
    //
    // qpx.getInfo(body, (err,data) => {
    //   const {trips : { tripOption : tripsArr } } = data;
    //   for (let trip of tripsArr) {
    //     let stops = trip.slice[0].segment;
    //     let pricing = trip.pricing[0];
    //     if (stops.length == 1) {
    //       let {saleTotal : flightPrice} = pricing;
    //       let flight = stops[0].flight;
    //
    //       console.log(`Flight ${flight.carrier} ${flight.number} costs ${flightPrice}`);
    //     }
    //   }
    // })


    const airbnbSearch = fetch('/api/airbnb');


    const airBnbImg = () => {

      let imgSrc;

      airbnbSearch.then(res => {
        res.json().then(data => {
          const {results_json : {search_results : properties } } = data;
          imgSrc = "'" + properties[0].listing.picture_url + "'" ;
          console.log(imgSrc);
        })
      })
      

      }




    const festivalName = this.props.festivalInput;

    let selectedFestival;

    if (!this.props.selectedFestival) {
      selectedFestival = "Search for a festival";
    } else {
      selectedFestival = JSON.stringify(this.props.selectedFestival);
    }

    return (
      <div>
        <input placeholder = 'Search for a festival' onBlur = {(e) => this.props.handleInput(e)}></input>
        <button onClick = {() => this.props.searchFestival({festivalName})}> Go </button>
        {airBnbImg()}
        {selectedFestival}

      </div>
    )
  }

}

function mapStateToProps (state) {
  return {
    festivalInput : state.festivalInput,
    selectedFestival : state.selectedFestival
  }
}

function matchDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      handleInput : handleInput,
      searchFestival : searchFestival
    },dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Search);
