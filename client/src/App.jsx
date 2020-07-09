import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faChevronRight, faChevronLeft,
          faChevronDown, faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'

import HomePage from './containers/HomePage/HomePage';
import Header from './components/Header/Header';
import ReportIncidentPage from './containers/ReportIncidentPage/ReportIncidentPage';
import VerifyIncidentsPage from './containers/VerifyIncidentsPage/VerifyIncidentsPage';
import './App.css';

library.add(faCheckSquare, faChevronRight, faChevronLeft, faChevronDown, faPlusSquare, faMinusSquare)

const App = () => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
  <Router>
    <div className="app">
      <Header />
      <Switch>
        <Route exact path="/reportincident" component={ReportIncidentPage} />
        <Route exact path="/verifyincidents" component={VerifyIncidentsPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </div>
  </Router>
  </MuiPickersUtilsProvider>
);

export default App;
