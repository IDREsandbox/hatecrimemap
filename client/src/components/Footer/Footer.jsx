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
  footer: {
    textAlign: 'center',
    backgroundColor: '#cccccc'
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


const Footer = ({ classes }) => (
  <div className={classes.footer}>
    <Typography variant="caption" color="inherit" className={classes.flex}>
      This map is maintained by the UCLA American Indian Studies Center under the 
      Institute of American Cultures. To contact us, email <a href="mailto:aisc@ucla.edu">aisc@ucla.edu</a>.
    </Typography>
  </div>
);

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
