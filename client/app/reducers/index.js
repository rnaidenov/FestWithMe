import { combineReducers } from 'redux';
import FestivalReducer from './reducer-festivals';
import SearchResults from './reducer-searchResults';
import LocationLookup from './reducer-locationLookup';
import CurrencyChanger from './reducer-currencyChange';


const allReducers = combineReducers({
  festivals : FestivalReducer,
  searchResults : SearchResults,
  location : LocationLookup,
  currencyChanger : CurrencyChanger
});

export default allReducers;