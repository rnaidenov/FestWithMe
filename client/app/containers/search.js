import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchFestival, handleInput } from '../actions/searchActions';
import { coroutine as co} from 'bluebird';


const apiKey = 'AIzaSyBtSws0VCIlzHDhXOpn9KR_3Juw9pIxe1Q';
const apiKey2 = 'AIzaSyD8yemJXcjTgYV7d_goyxKuwKNpd35VhXw';



class Search extends React.Component {



  componentDidMount() {
    co(function * (){
      let eventDetails = yield fetch('http://localhost:3000/api/prices/events?eventName=Afterlife Barcelona');
      const eventDetails_json = yield eventDetails.json();
      let destination = `${eventDetails_json.city},${eventDetails_json.country}`;
      console.log(eventDetails_json);
      const origin = 'Sofia,Bulgaria';
      let date = eventDetails_json.date;
      console.log(date);
      let flightDetails = yield fetch(`http://localhost:3000/api/prices/flights?origin=${origin}&destination=${destination}&date=${date}`);
      const flightDetails_json = yield flightDetails.json();
      let housingDetails = yield fetch(`http://localhost:3000/api/prices/housing?location=${destination}&checkInDate=${date}`);
      const housingDetails_json = yield housingDetails.json();
      const obj = {
        eventDetails_json,
        flightDetails_json,
        housingDetails_json
      }

      console.log(obj);
    }).bind(this)();
  }

  render () {


    // ---- Getting data from database ----- //

    // const users = fetch('/api/users');

    // users.then(data => {
    //   data.json().then(what => {
    //     console.log(what);
    //   })
    // })






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
