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
  Box,
} from '@material-ui/core';


import AboutDialog from '../AboutDialog/AboutDialog';
import AboutCovidDialog from '../AboutDialog/AboutCovidDialog';
import ColoredButton from 'components/Reusables/ColoredButton';

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
    margin: '0 1em',
  },
  titleLink: {
    color: 'inherit',
  },
  homeTitle: {
    color: 'white',
  },
  rightBox: {
    justifyContent: 'right',
    flexDirection: 'row',
  }
};

const CovidHeader = ({ classes }) => (
  <div className={classes.root}>
    <AppBar position="static" style={{ background: '#000000' }}>
      <Toolbar>
        <Link to="./home" target="_self">
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
        <Link to="/map" className={classes.link}>
          <Button className={classes.gotoOriginal} color="inherit" id="homepage-button">
            See All Other Hate Crimes
          </Button>
        </Link>
        <a
          href="https://stopaapihate.org/reportincident/"
          className={classes.link}
        >
          <Button className={classes.reportIncidentButton} color="inherit">
            Report Covid Incident
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: '#000000' }} >
        <Toolbar>
          <Link to="/home">
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <HomeIcon />
            </IconButton>
          </Link>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            Mapping Hate Crimes in the US #OneHateCrimeIsTooMany
          </Typography>
          <Box className={classes.flex} flexGrow={1} sx={{ flex: 1 }} />
          <Link to="/covid" className={classes.link}>
            <Button className={classes.gotoOriginal} color="inherit" id="homepage-button">
              See Covid Hate Crimes
            </Button>
          </Link>
          <Link to='/home' className={classes.link}>
            <ColoredButton noIcon>
              Return Home
            </ColoredButton>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);