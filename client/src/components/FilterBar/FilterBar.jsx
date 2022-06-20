import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FilterBar.css';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = (theme) => ({ // eslint-disable-line no-unused-vars

});

const ColorFormControlLabel = withStyles((theme) => ({
  root: {
    color: 'white',
  },
}))(FormControlLabel);

const ColorCheckbox = withStyles((theme) => ({
  root: {
    color: 'white',
  },
}))(Checkbox);

const FilterBar = (props) => {
  const [published, filterPublished] = useState(false);

  return (
    <div className="filterBar">
      <ColorFormControlLabel
        control={(
          <ColorCheckbox
            checked={published}
            onChange={(e, v) => { filterPublished(v); props.filterfn(v); }}
            name="published"
          />
        )}
        label="View only incidents that have been published"
      />
    </div>
  );
};

FilterBar.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export default withStyles(styles)(FilterBar);
