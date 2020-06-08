import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import './ChartText.css';

const styles = theme => ({
});

const ChartText = (props) => {

  if(!props.data) {
    return null;
  }

  console.log(props.data)
  const counts = Object.entries(props.data).filter(([key, x]) => x && x.count)

  return (
    <div>
     	{counts.map(([key, obj]) => <p key={key}>{key}: {obj.count}</p>)}
    </div>
  )
};

ChartText.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChartText);