import React from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import blueGrey from "@material-ui/core/colors/blueGrey";

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MainContext } from './containers/context/joyrideContext';
import { AnimatePresence } from 'framer-motion'
import CommonHeader from 'components/Reusables/CommonHeader';
import AboutPage from './containers/AboutPage/AboutPage';
import WelcomePage from './containers/WelcomePage/WelcomePage'
import HomePage from 'containers/HomePage/HomePage';
import LandingPage from './containers/LandingPage/LandingPage'
import ReportIncidentPage from 'containers/ReportIncidentPage/ReportIncidentPage';
import CovidPage from './containers/CovidPage/CovidPage';


import './App.css';

const theme = createTheme({
  palette: {
    primary: blueGrey
  },
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#000000',
      }
    },
    MuiPickersModal: {
      dialogAction: {
        root: {
          backgroundColor: '#262626'
        }
      },
    },
    MuiTypography: {
      colorTextSecondary: {
        color: '#000000',
      },
    },
    MuiDialogContent: {
      root: {
        'padding-top': 0,
        backgroundColor: '#ffffff',
      },
    },
    MuiStepLabel: {
      iconContainer: {
        alignContent: 'center',
      }
    }
  },
});

const contextDefaultValue = {
  covidJoyrideRun: false,
  homePageJoyrideRestart: false,
  stepIndex: 0,
};

const App = () => {
  const location = useLocation();
  return (
    <MainContext.Provider value={contextDefaultValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div className='app'>
            <CommonHeader
              noShadow
            />
            <AnimatePresence exitBeforeEnter initial={true}>
              <Switch location={location} key={location.pathname}>
                <Route path="/about" component={AboutPage} />
                <Route path="/map" component={HomePage} />
                <Route path="/report" component={ReportIncidentPage} />
                <Route exact path="/covid" component={CovidPage} />
                <Route path="/home" component={LandingPage} />
                <Route path="/" component={WelcomePage} />
              </Switch>
            </AnimatePresence>
          </div>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </MainContext.Provider>
  );
}

export default App;

