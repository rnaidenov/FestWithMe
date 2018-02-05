import { combineReducers } from 'redux';
import FestivalReducer from './reducer-festivals';
import SearchResults from './reducer-searchResults';
import LocationLookup from './reducer-locationLookup';


const allReducers = combineReducers({
  festivals : FestivalReducer,
  searchResults : SearchResults,
  location : LocationLookup
});

export default allReducers;