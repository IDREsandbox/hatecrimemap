import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';

/* Props

noIcon - pass if no arrow icon should be places
notOutlined - pass if non outlined variant desired
backButton - used to control if forward/backward arrow should be placed
id? - optional prop to pass the id
*/
const ColorButton = withStyles((theme) => ({
  root: {
    color: 'white',
    borderColor: 'white',
  },
}))(Button);

const ColoredButton = (props) => {
  const { noIcon } = props;

  return (
    <ColorButton
      variant={props.notOutlined ? '' : 'outlined'}
      size="small"
      aria-label={props.backButton ? 'back' : 'next'}
      id="chartbackButton"
      onClick={props.buttonClick}
      startIcon={props.backButton && !noIcon ? <ArrowBack /> : null}
      endIcon={!props.backButton && !noIcon ? <ArrowForward /> : null}
      id={props.id ? props.id : null}
    >
      {props.children}
    </ColorButton>
  );
};

export default ColoredButton;
