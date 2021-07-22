import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import './FilterBar.css';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = (theme) => ({

});

const FilterBar = (props) => {
  const [published, filterPublished] = useState(false);

  return (
    <div className="filterBar">
      <FormControlLabel
        control={(
          <Checkbox
            checked={published}
            onChange={(e, v) => { filterPublished(v); props.filterfn(v); }}
            name="published"
            color="primary"
          />
        )}
        label="View only incidents that have been published"
      />
      {/* <ToggleButtonGroup
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
      </ToggleButtonGroup> */}
    </div>
  );
};

FilterBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterBar);
