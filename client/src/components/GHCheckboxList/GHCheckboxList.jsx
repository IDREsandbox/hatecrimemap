import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

import ghFilters from '../../globals/ghFilters';
import groupsHarassed from '../../globals/groupsHarassed';
import './GHCheckboxList.css';

const styles = {
  size: {
    width: 40,
    height: 30,
  },
  sub_group: {
    marginLeft: 16
  },
  hide: {
    display: 'none'
  }
};

const createCheckbox = (name, label, key, sub_groups, onClick, classes, groupsChecked) => {
  const labelSVG = (
    <div>
      {label}
      {/*showSVGs &&
        <svg height="12" width="12">
          <circle cx="6" cy="6" r="6" stroke="white" opacity="1" id="meeting" fill={color} />
        </svg>*/}
    </div>
  );
  const checked = groupsChecked.has(name);

  if(sub_groups) {
    return (
      <React.Fragment key={"fragment" + key}>
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
        <div className={`${classes.sub_group} ${!checked ? classes.hide : ''}`} key={"sub_group" + key}>
          {sub_groups.map(({name, label, key}) => createCheckbox(name, label, key, undefined, onClick, classes, groupsChecked))}
        </div>
      </React.Fragment>
    )
  } else {
    // Test if a hidden (but previously checked) box passes through. We want Japanese American IFF Asian American is checked
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
  }
}

const GHCheckboxList = ({ onClick, groupsChecked, classes, showSVGs }) => {


  const labels = Object.values(groupsHarassed).map(category => category.map(({name, label, key, sub_groups}) =>
                   createCheckbox(name, label, key, sub_groups, onClick, classes, groupsChecked)));
  console.log(labels);
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
