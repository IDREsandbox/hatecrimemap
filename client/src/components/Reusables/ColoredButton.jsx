import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';

/* Props
noIcon - pass if no arrow icon should be places
notOutlined - pass if non outlined variant desired
backButton - used to control if forward/backward arrow should be placed
id? - optional prop to pass the id
size - "small", "medium", "large"
*/

const ColorButton = withStyles((theme) => ({
  root: {
    margin: '0 1em',
    color: 'white',
    borderColor: 'white',
    "&:hover": {
      background: "white",
      borderColor: 'white',
      color: 'black'
    },
  },
}))(Button);

const LightColorButton = withStyles((theme) => ({
  root: {
    margin: '0 1em',
    color: 'black',
    borderColor: 'black',
    "&:hover": {
      background: "black",
      borderColor: 'black',
      color: 'white'
    },
  },
}))(Button);

const DisabledColorButton = withStyles((theme) => ({
  root: {
    margin: '0 1em',
    color: 'gray',
    borderColor: 'gray',
    cursor: 'default'
  },
}))(Button);

const ColoredButton = (props) => {
  const { noIcon } = props;

  if (props.disabled) {
    return (
      <DisabledColorButton
        className={props.className}
        variant={props.notOutlined ? 'contained' : 'outlined'}
        size={props.size ? props.size : "small"}
        aria-label={props.noArrow ? 'button' : props.backButton ? 'back' : 'next'}
        onClick={props.onClick}
        startIcon={props.backButton && !noIcon ? <ArrowBack /> : null}
        endIcon={!props.backButton && !noIcon ? <ArrowForward /> : null}
        id={props.id ? props.id : null}
      >
        {props.children}
      </DisabledColorButton>
    )
  }

  if (props.lightMode) {
    return (
      <LightColorButton
        variant={props.notOutlined ? 'contained' : 'outlined'}
        size={props.size ? props.size : "small"}
        aria-label={props.noArrow ? 'button' : props.backButton ? 'back' : 'next'}
        onClick={props.onClick}
        startIcon={props.backButton && !noIcon ? <ArrowBack /> : null}
        endIcon={!props.backButton && !noIcon ? <ArrowForward /> : null}
        id={props.id ? props.id : null}
        className={props.className}
      >
        {props.children}
      </LightColorButton>
    )
  } else {
    return (
      <ColorButton
        variant={props.notOutlined ? 'contained' : 'outlined'}
        size={props.size ? props.size : "small"}
        aria-label={props.noArrow ? 'button' : props.backButton ? 'back' : 'next'}
        onClick={props.onClick}
        startIcon={props.backButton && !noIcon ? <ArrowBack /> : null}
        endIcon={!props.backButton && !noIcon ? <ArrowForward /> : null}
        id={props.id ? props.id : null}
        className={props.className}
      >
        {props.children}
      </ColorButton>
    );
  }
};

export default ColoredButton;