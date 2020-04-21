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
  link: {
    textDecoration: 'none',
  }
};


const Header = ({ classes }) => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Link to="/">
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <HomeIcon />
          </IconButton>
        </Link>
        <Typography variant="title" color="inherit" className={classes.flex}>
          Mapping Harassment in the US
        </Typography>
        <Link to="/reportincident" className={classes.link}>
          <Button className={classes.reportIncidentButton} color="inherit">Report Incident</Button>
        </Link>
        <AboutDialog classes={classes}></AboutDialog>
      </Toolbar>
    </AppBar>
  </div>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
