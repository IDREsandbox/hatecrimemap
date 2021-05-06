import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

import './GHCheckboxList.css';
import axios from 'axios';

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
// ************https://github.com/jakezatecky/react-checkbox-tree
function getGroups() {  // TODO: Lazy load?
  return axios.get('/api/totals/query')  // change to /groups
  .then(res => { return res.data })
  .catch((err) => {
    alert(`API call failed: ${err}`);
    return {};
  });
}

const createCheckbox = (name, key, children, onClick, classes, groupsChecked) => {
  const labelSVG = (
    <div>
      {name}
      {/*showSVGs &&
        <svg height="12" width="12">
          <circle cx="6" cy="6" r="6" stroke="white" opacity="1" id="meeting" fill={color} />
        </svg>*/}
    </div>
  );
  const checked = groupsChecked.has(name);

  if(children) {
    return (
      <React.Fragment key={"fragment" + key}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onClick={onClick}
              name={name}
              className={classes.size}
              value={key}
            />
          }
          label={labelSVG}
          key={key}
        />
        <div className={`${classes.sub_group} ${!checked ? classes.hide : ''}`} key={"sub_group" + key}>
          {children.map(({name, key, children}) => createCheckbox(name, key, undefined, onClick, classes, groupsChecked))}
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

class GHCheckboxList extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }
  
  async componentDidMount() {
    getGroups().then(groups => {
      this.setState({
        groupsharassed: groups.ret
      })
    })
  }

  
  render() {
    if(this.state.groupsharassed) {
      const labels = this.state.groupsharassed.map(({name, key, children}) =>
         createCheckbox(name, key, children, this.props.onClick, this.props.classes, this.props.groupsChecked));

      return (
        <FormGroup className="ghCheckboxList">
          {labels}
        </FormGroup>
      );
    } else {
      return (
        <FormGroup className="ghCheckboxList"> </FormGroup>
      )
    }
  }
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
