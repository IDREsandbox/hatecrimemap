import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HomePage from './containers/HomePage/HomePage';
import Header from './components/Header/Header';
import SubmitClaimPage from './containers/SubmitClaimPage/SubmitClaimPage';
import './App.css';

const App = () => (
  <MuiThemeProvider>
    <Router>
      <div className="app">
        <Header />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/submitclaim" component={SubmitClaimPage} />
      </div>
    </Router>
  </MuiThemeProvider>
);

export default App;
