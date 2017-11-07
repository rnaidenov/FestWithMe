import { combineReducers } from 'redux';
import FestivalReducer from './reducer-festivals';
import SearchResults from './reducer-searchResults';
import LocationLookup from './reducer-locationLookup';
import CurrencyChanger from './reducer-currencyChange';
import PriceUpdater from './reducer-priceUpdate';


const allReducers = combineReducers({
  festivals : FestivalReducer,
  searchResults : SearchResults,
  location : LocationLookup,
  currencyChanger : CurrencyChanger,
  priceUpdater: PriceUpdater
});

export default allReducers;