import { createStore } from 'redux';
import allReducers from './reducers';
import thunk from "redux-thunk";
import { applyMiddleware } from 'redux';


const middleware = applyMiddleware(thunk);
const store = createStore (allReducers, middleware);

export default store;
