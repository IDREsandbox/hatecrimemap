/* Entry point for App, do not rename from index.js */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import Header from './components/Header/Header';
import registerServiceWorker from './registerServiceWorker';

render(
  <Router>
    <div>
      <Header />
      <Route exact path="/" component={App} />
    </div>
  </Router>,
  document.getElementById('root'),
);
registerServiceWorker();
