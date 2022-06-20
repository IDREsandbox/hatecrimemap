import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { FOOTER } from '../../res/values/string';

const styles = {
  footer: {
    textAlign: 'center',
    backgroundColor: '#cccccc',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: 'white',
  },
  reportIncidentButton: {
    color: 'white',
  },
  link: {
    textDecoration: 'none',
  },
};

const Footer = ({ classes }) => (
  <div className={classes.footer}>
    <Typography variant="caption" color="inherit" className={classes.flex}>
      {FOOTER.TEXT}
      {' '}
      <a href="mailto:aisc@ucla.edu">{FOOTER.EMAIL}</a>
      .
    </Typography>
  </div>
);

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
