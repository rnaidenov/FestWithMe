import { combineReducers } from 'redux';
import FestivalReducer from './reducer-festivals';
import SelectedFestivalReducer from './reducer-selectedFestival';
import SearchInput from './reducer-searchInput';


const allReducers = combineReducers({
  festivals : FestivalReducer,
  festivalInput : SearchInput,
  selectedFestival : SelectedFestivalReducer
});

export default allReducers;
