import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import ghFilters from '../../globals/ghFilters';
import './GHCheckboxList.css';

const styles = {
  size: {
    width: 40,
    height: 30,
  },
};

const GHCheckboxList = ({ onClick, groupsChecked, classes, showSVGs }) => {
  const labels = ghFilters.map(({
    name,
    label,
    key,
    color,
  }) => {
    const labelSVG = (
      <div>
        {label}
        {showSVGs &&
          <svg height="12" width="12">
            <circle cx="6" cy="6" r="6" stroke="white" opacity="1" id="meeting" fill={color} />
          </svg>}
      </div>
    );
    const checked = groupsChecked.has(name);
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onClick={onClick}
            name={name}
            className={classes.size}
          />
        }
        label={labelSVG}
        key={key}
      />
    );
  });
  return (
    <FormGroup className="ghCheckboxList">
      {labels}
    </FormGroup>
  );
};

GHCheckboxList.defaultProps = {
  showSVGs: false,
};

GHCheckboxList.propTypes = {
  onClick: PropTypes.func.isRequired,
  groupsChecked: PropTypes.instanceOf(Set).isRequired,
  classes: PropTypes.object.isRequired,
  showSVGs: PropTypes.bool,
};

export default withStyles(styles)(GHCheckboxList);
