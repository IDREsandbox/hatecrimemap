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

  return (
    <div>
     	<p>Race/Ethnicity: {props.data['Race/Ethnicity'] || 0}</p>
		<p>Religion: {props.data['Religion'] || 0}</p>
		<p>Gender/Sexuality: {props.data['Gender/Sexuality'] || 0}</p>
		<p>Misc: {props.data['Miscellaneous'] || 0}</p>
    </div>
  )
};

ChartText.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChartText);