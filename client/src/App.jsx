import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckSquare, faChevronRight, faChevronLeft,
  faChevronDown, faPlusSquare, faMinusSquare,
} from '@fortawesome/free-solid-svg-icons';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MainContext } from './containers/context/joyrideContext';
import HomePage from './containers/HomePage/HomePage';
import CovidPage from './containers/CovidPage/CovidPage';
import { Header, Footer } from './components';
import ReportIncidentPage from './containers/ReportIncidentPage/ReportIncidentPage';
import VerifyIncidentsPage from './containers/VerifyIncidentsPage/VerifyIncidentsPage';
import './App.css';

library.add(faCheckSquare, faChevronRight, faChevronLeft, faChevronDown, faPlusSquare, faMinusSquare);

const unusedVar = 'test';

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      colorTextSecondary: {
        color: '#000000',
      },
    },
    MuiDialogContent: {
      root: {
        'padding-top': 0,
      },
    },
  },
});

const contextDefaultValue = {
  covidJoyrideRun: false,
  homePageJoyrideRestart: false,
  stepIndex: 0,
};

const App = () => (
  <MainContext.Provider value={contextDefaultValue}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          <div className="app">
            <Header />
            <Switch>
              <Route exact path="/reportincident" component={ReportIncidentPage} />
              <Route exact path="/verifyincidents" component={VerifyIncidentsPage} />
              <Route exact path="/covid" component={CovidPage} />
              <Route path="/" component={HomePage} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </MainContext.Provider>
);

export default App;




/*  DEV CHANGES
*  simple table fix - what colors should I make it? the dark black?
*  fix bug with spotlightModal not updating correctly when unlocking off of a state - DONE
*  refactor updatestate + updatecounty into one function to save space
*  refactor buttons to not be retarded and have like 3 diff ones
*  next to do - add mobile styling
*/