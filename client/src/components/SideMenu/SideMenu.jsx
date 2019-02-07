import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';

import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';
import './SideMenu.css';

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

const SideMenu = ({ updateMapData, resetMapData, statesdata, currentLayers, classes }) => {
  const showReportsValue = getShowReportsValue(currentLayers);

  return (
    <div className="sideMenu">
      <h2 className="sideMenu__header">Data</h2>
        {/* Insert react-chartJS stuff here */}
        {/* Don't forget to install and import the library here */}
        {/* and I think the statesdata looks like the pastebin on slack */}

    </div>
  );



  /////////// filtering side menu
  return (
    <div className="sideMenu">
      <h2 className="sideMenu__header">Filters</h2>
      <FormGroup className="sideMenu__form">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="showReports">Show Reports</InputLabel>
          <Select
            value={showReportsValue}
            onChange={updateMapData}
            inputProps={{
              name: 'reports',
              id: 'showReports',
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="verified">Verified Reports</MenuItem>
            <MenuItem value="unverified">Unverified Reports</MenuItem>
          </Select>
        </FormControl>
        <GHCheckboxList onClick={updateMapData} groupsChecked={currentLayers} showSVGs />
        <Button className={classes.button} variant="raised" onClick={resetMapData} color="primary">
          Reset Filters
        </Button>
      </FormGroup>
    </div>
  );
};

SideMenu.propTypes = {
  updateMapData: PropTypes.func.isRequired,
  resetMapData: PropTypes.func.isRequired,
  currentLayers: PropTypes.instanceOf(Set).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideMenu);
