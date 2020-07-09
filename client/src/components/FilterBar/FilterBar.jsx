import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import './FilterBar.css';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';



const styles = theme => ({

});

const FilterBar = (props) => {

  const [published, filterPublished] = useState('published');

  return (
    <div className="filterBar">
      <ToggleButtonGroup
        value={published}
        size="small"
        exclusive
        onChange={(e, v) => {filterPublished(v); props.filterfn(v)}}
        aria-label="filter published sources"
      >
        <ToggleButton value={'published'} aria-label="published">
          Published Sources
        </ToggleButton>
        <ToggleButton value={'all'} aria-label="all">
          All Sources
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
};

FilterBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterBar);