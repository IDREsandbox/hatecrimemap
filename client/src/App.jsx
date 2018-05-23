import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HomePage from './containers/HomePage/HomePage';
import Header from './components/Header/Header';
import ReportIncidentPage from './containers/ReportIncidentPage/ReportIncidentPage';
import ManageIncidentsPage from './containers/ManageIncidentsPage/ManageIncidentsPage';
import './App.css';

const App = () => (
  <MuiThemeProvider>
    <Router>
      <div className="app">
        <Header />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/reportincident" component={ReportIncidentPage} />
        <Route exact path="/ManageIncidents" component={ManageIncidentsPage} />
      </div>
    </Router>
  </MuiThemeProvider>
);

export default App;
