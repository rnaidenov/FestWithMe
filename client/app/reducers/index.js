import { combineReducers } from 'redux';
import FestivalReducer from './reducer-festivals';
import SearchResults from './reducer-searchResults';
import SearchInput from './reducer-searchInput';
import LocationLookup from './reducer-locationLookup'


const allReducers = combineReducers({
  festivals : FestivalReducer,
  festivalInput : SearchInput,
  searchResults : SearchResults,
  location : LocationLookup
});

export default allReducers;
