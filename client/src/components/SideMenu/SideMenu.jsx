import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
} from '@material-ui/core';

import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';
import './SideMenu.css';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

const SideMenu = ({ updateMapData, resetMapData, currentLayers, classes }) => {
  const toggled = currentLayers.has('verified');

  return (
    <div className="sideMenu">
      <h2 className="sideMenu__header">Filters</h2>
      <FormGroup className="sideMenu__form">
        <FormControlLabel
          control={
            <Switch
              checked={toggled}
              onClick={updateMapData}
              name="verified"
            />
          }
          label="Verified Reports"
        />
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
