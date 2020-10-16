import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
  if(props.header != 'none') {
    return (
      <div className="sideMenu">
        <h2 className="sideMenu__header">{props.header}</h2>
        {props.children}
      </div>
    );
  }

  return (
    <div className="sideMenu">
      <h2 className="sideMenu__header">How to Use</h2>
      <div className="sideMenu__info">
        <p>Hover over a state to show hate crime data</p>
        <p>Click on a state to lock on it to interact with the chart</p>
        <p>Click away from the state to unlock or switch states</p>
        <br />
        <hr />
        <br />
        <p>Report incident(s) by navigating to the report page on the top-right</p>
      </div>
    </div>
  )
};

SideMenu.propTypes = {
  // updateMapData: PropTypes.func.isRequired,
  // resetMapData: PropTypes.func.isRequired,
  // currentLayers: PropTypes.instanceOf(Set).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideMenu);
