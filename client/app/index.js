import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from './components/app';
import { Provider } from 'react-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import store from './store';

render(
  <Provider store = {store}>
    <BrowserRouter>
      <Route path="/" component={App}/>
    </BrowserRouter>
 </Provider>,document.getElementById('root')
)
