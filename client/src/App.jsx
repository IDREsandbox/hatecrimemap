import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import HomePage from './containers/HomePage/HomePage';
import Header from './components/Header/Header';
import SubmitClaimPage from './containers/SubmitClaimPage/SubmitClaimPage';
import './App.css';

const App = () => (
  <Router>
    <div className="app">
      <Header />
      <Route exact path="/" component={HomePage} />
      <Route exact path="/submitclaim" component={SubmitClaimPage} />
    </div>
  </Router>
);

export default App;
