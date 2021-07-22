import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faChevronRight, faChevronLeft,
          faChevronDown, faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'

import HomePage from './containers/HomePage/HomePage';
import CovidPage from './containers/CovidPage/CovidPage.jsx';
import { Header, Footer } from './components';
import ReportIncidentPage from './containers/ReportIncidentPage/ReportIncidentPage';
import VerifyIncidentsPage from './containers/VerifyIncidentsPage/VerifyIncidentsPage';
import './App.css';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

library.add(faCheckSquare, faChevronRight, faChevronLeft, faChevronDown, faPlusSquare, faMinusSquare)

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      colorTextSecondary: {
        color: '#000000'
      }
    },
    MuiDialogContent: {
      root: {
        'padding-top': 0
      }
    },
  }
});

const App = () => (
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
);

export default App;
