import { combineReducers } from 'redux';
import FestivalReducer from './reducer-festivals';
import SearchResults from './reducer-searchResults';
import SearchInput from './reducer-searchInput';
import LocationLookup from './reducer-locationLookup';
import CurrencyChanger from './reducer-currencyChange';


const allReducers = combineReducers({
  festivals : FestivalReducer,
  festivalInput : SearchInput,
  searchResults : SearchResults,
  location : LocationLookup,
  currencyChanger : CurrencyChanger
});

export default allReducers;