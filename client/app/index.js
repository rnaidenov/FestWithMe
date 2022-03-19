import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { render } from 'react-dom';
import { Search } from './containers/Search';
import { Provider } from 'react-redux';
import store from './store';



render(
  <Provider store = {store}>
    <Router>
      <Routes>
        <Route index path="/" element={ <Search/> } />
      </Routes>
    </Router>
  </Provider>,
  document.getElementById('root')
)
