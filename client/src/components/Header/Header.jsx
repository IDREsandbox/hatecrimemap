import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';

import AboutDialog from '../AboutDialog/AboutDialog';
import AboutCovidDialog from '../AboutDialog/AboutCovidDialog';

const styles = {
  root: {},
  covidFlex: {
    flex: 1,
    color: '#fef900',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: 'white',
  },
  reportIncidentButton: {
    color: 'white',
  },
  gotoOriginal: {
    color: 'white',
  },
  gotoCovid: {
    color: 'white',
  },
  link: {
    textDecoration: 'none',
  },
  titleLink: {
    color: 'inherit',
  },
};

const CovidHeader = ({ classes }) => (
  <div className={classes.root}>
    <AppBar position="static" style={{ background: '#000000' }}>
      <Toolbar>
        <Link to="./" target="_self">
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <HomeIcon />
          </IconButton>
        </Link>
        <Typography variant="h6" color="inherit" className={classes.covidFlex}>
          Mapping COVID Hate Incidents in the US (Data from
          {' '}
          <a
            target="_blank"
            href="https://stopaapihate.org/reportincident/"
            className={classes.titleLink}
            rel="noreferrer"
          >
            Stop AAPI Hate
          </a>
          )
        </Typography>
        <Link to="/" className={classes.link}>
          <Button className={classes.gotoOriginal} color="inherit" id="homepage-button">
            See All Other Hate Crimes
          </Button>
        </Link>
        <a
          href="https://stopaapihate.org/reportincident/"
          className={classes.link}
        >
          <Button className={classes.reportIncidentButton} color="inherit">
            Report Incident
          </Button>
        </a>

        <AboutCovidDialog />
      </Toolbar>
    </AppBar>
  </div>
);

const Header = ({ classes }) => {
  const location = useLocation();

  if (location.pathname == '/covid') {
    return CovidHeader({ classes });
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: '#F8D34F' }}>
        <Toolbar>
          <Link to="/">
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <HomeIcon />
            </IconButton>
          </Link>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            Mapping Hate Crimes in the US #OneHateCrimeIsTooMany
          </Typography>
          <Link to="/covid" className={classes.link}>
            <Button
              id="covidButton"
              className={classes.gotoCovid}
              color="inherit"
            >
              See COVID Hate Incidents
            </Button>
          </Link>
          <Link to="/reportincident" className={classes.link}>
            <Button
              className={classes.reportIncidentButton}
              color="inherit"
              id="reportIncidentButton"
            >
              Report Incident
            </Button>
          </Link>
          <AboutDialog />
        </Toolbar>
      </AppBar>
    </div>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
