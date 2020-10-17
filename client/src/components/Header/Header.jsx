import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from '@material-ui/core';

import AboutDialog from '../AboutDialog/AboutDialog';
import AboutCovidDialog from '../AboutDialog/AboutCovidDialog';


import { useLocation } from 'react-router-dom'; // change color... 

const styles = {
  root: {

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
  }
};

const CovidHeader = ({ classes }) => {
  return (
  <div className={classes.root}>
    <AppBar position="static" style={ {background: '#000000'} }>
      <Toolbar>
        <Link to="/">
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <HomeIcon />
          </IconButton>
        </Link>
        <Typography variant="h6" color="inherit" className={classes.flex}>
          Mapping COVID Hate Crimes in the US
        </Typography>
        <Link to="/" className={classes.link}>
          <Button className={classes.gotoOriginal} color="inherit">See All Other Hate Crimes</Button>
        </Link>
        <Link to="/reportincident" className={classes.link}>
          <Button className={classes.reportIncidentButton} color="inherit">Report Incident</Button>
        </Link>
        <AboutCovidDialog></AboutCovidDialog>
      </Toolbar>
    </AppBar>
  </div>
  );
}


const Header = ({ classes }) => {

  const location = useLocation();

  if (location.pathname=="/covid") {
    return CovidHeader({ classes });
  }

  return (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Link to="/">
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <HomeIcon />
          </IconButton>
        </Link>
        <Typography variant="h6" color="inherit" className={classes.flex}>
          Mapping Harassment in the US
        </Typography>
        <Link to="/covid" className={classes.link}>
          <Button className={classes.gotoCovid} color="inherit">See COVID Hate Crimes</Button>
        </Link>
        <Link to="/reportincident" className={classes.link}>
          <Button className={classes.reportIncidentButton} color="inherit">Report Incident</Button>
        </Link>
        <AboutDialog></AboutDialog>
      </Toolbar>
    </AppBar>
  </div>
  )
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
