import React from 'react';
import {

  Button,
} from '@material-ui/core';

import withStyles from '@material-ui/styles/withStyles';

const styles = {
  myButton: {
    margin: '1em',
  },
};

const ColorButton = withStyles((theme) => ({
  root: {
    color: 'white',
    borderColor: 'white',
  },
}))(Button);

const OutlineButton = (props) => {
  const { onClick, classes } = props;
  return (
    <ColorButton
      variant="outlined"
      className={classes.myButton}
      onClick={onClick}
    >
      {props.children}
    </ColorButton>
  );
};

export default withStyles(styles)(OutlineButton);
