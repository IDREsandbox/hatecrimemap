import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import {
//   FormGroup,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
// } from '@material-ui/core';
import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';
import './SideMenu.css';
import { Bar } from 'react-chartjs-2';

function getShowReportsValue(layers) {
  if (layers.has('verified')) return 'verified';
  if (layers.has('unverified')) return 'unverified';
  return 'all';
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

const SideMenu = (props) => {
  return (
    <div className="sideMenu">
      <h2 className="sideMenu__header">{props.header}</h2>
      {props.children}
    </div>
  );
  };

  SideMenu.propTypes = {
  // updateMapData: PropTypes.func.isRequired,
  // resetMapData: PropTypes.func.isRequired,
  // currentLayers: PropTypes.instanceOf(Set).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideMenu);
