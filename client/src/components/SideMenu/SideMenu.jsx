import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import './SideMenu.css';

function getShowReportsValue(layers) { // eslint-disable-line no-unused-vars
  if (layers.has('verified')) return 'verified';
  if (layers.has('unverified')) return 'unverified';
  return 'all';
}

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
  },
});

const SideMenu = (props) => (
  <div className={props.covid ? "sideMenu sideMenu-covid" : "sideMenu"}>
    {props.children}
  </div>
);

SideMenu.propTypes = {
  // updateMapData: PropTypes.func.isRequired,
  // resetMapData: PropTypes.func.isRequired,
  // currentLayers: PropTypes.instanceOf(Set).isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export default withStyles(styles)(SideMenu);
