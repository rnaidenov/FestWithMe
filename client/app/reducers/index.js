import { combineReducers } from 'redux';
import FestivalReducer from './reducer-festivals';
import SearchResults from './reducer-searchResults';
import SearchInput from './reducer-searchInput';


const allReducers = combineReducers({
  festivals : FestivalReducer,
  festivalInput : SearchInput,
  searchResults : SearchResults
});

export default allReducers;
