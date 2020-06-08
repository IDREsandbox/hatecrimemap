import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import './FilterBar.css';

// import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab/';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({

});

const FilterBar = (props) => {
  return (
    <div className="filterBar">
      {/*<ToggleButtonGroup
        size="small"
        aria-label="text alignment"
      >
        <ToggleButton value="published" aria-label="left aligned">
          Published
        </ToggleButton>
        <ToggleButton value="verified" aria-label="centered">
          Verified
        </ToggleButton>
        <ToggleButton value="validUrl" aria-label="right aligned">
          Valid URL
        </ToggleButton>
      </ToggleButtonGroup>
      Placeholder for filter*/}
      <Grid component="label" container alignItems="center">
        <Grid item>Published Only</Grid>
        <Grid item>
          <Switch checked={true} name="checkedC" />
        </Grid>
        <Grid item>All</Grid>
      </Grid>
    </div>
  )
};

FilterBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterBar);