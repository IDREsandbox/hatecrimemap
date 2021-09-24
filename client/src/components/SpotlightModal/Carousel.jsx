/*  eslint import/no-unresolved: 0, no-unused-vars: 0  */
import React, { useState, useEffect } from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  DotGroup,
  Dot,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { stateIdToStateName } from 'utils/data-utils';

const useStyles = makeStyles({
  /* root: {
    position: 'relative',
    overflow: 'hidden',
  },
  indicators: {
    width: '100%',
    marginTop: '10px',
    textAlign: 'center',
  },
  indicator: {
    cursor: 'pointer',
    transition: '200ms',
    padding: 0,
    color: '#afafaf',
    '&:hover': {
      color: '#1f1f1f',
    },
    '&:active': {
      color: '#1f1f1f',
    },
  },
  indicatorIcon: {
    fontSize: '15px',
  },
  active: {
    color: '#494949',
  },
  buttonWrapper: {
    margin: '1em',
    backgroundColor: 'transparent',
    padding: 0,
    border: 'none',
    background: 'none',
  },
  fullHeightHoverWrapper: {
    height: '100%', // This is 100% - indicator height - indicator margin
    top: '0',
  },
  buttonVisible: {
    opacity: '1',
  },
  buttonHidden: {
    opacity: '0',
  },
  button: {
    margin: '0 10px',
    position: 'relative',
    backgroundColor: '#494949',
    top: 'calc(50% - 20px) !important',
    color: 'white',
    fontSize: '30px',
    transition: '200ms',
    cursor: 'pointer',
    '&:hover': {
      opacity: '0.6 !important',
    },
  },
  next: {
    right: 0,
  },
  prev: {
    left: 0,
  },
  container: {
    width: '100%',
  },
  leftArrow: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-100%)',
  },
  rightArrow: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-100%)',
  },
  p: {
    border: '1px solid black',
  },
  slideDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    height: '100%',
    width: '100%',
  },
  slider: {
    height: '80%',
  }, */
  slider: {
    height: 300,
    margin: '1em 0',
  },
  buttonWrapper: {
    margin: '1em',
    backgroundColor: 'transparent',
    padding: 0,
    border: 'none',
    background: 'none',
  },
  headline: {
    fontSize: 50,
    margin: 0,
    marginTop: 2,
    padding: 0,
  },
  label: {
    fontSize: 18,
  },
  incidentRightAlign: {
    textAlign: 'right',
    width: '100%',
    paddingRight: 10,
  },
  incidentDescription: {
    fontSize: 15,
  },
  incidentContainer: {
    display: 'flex',
    flexDirection: 'column',
    'justify-content': 'center',
    'margin-top': '16px',
    'align-items': 'center',
    margin: '5px 10px',
  },
  buttonContainer: {
    display: 'flex',
    'justify-content': 'center',
    'margin-top': '16px',
    'align-items': 'center',
  },
  dots: {
    width: 25,
    height: 15,
    backgroundColor: 'black',
    '&:hover': {
      cursor: 'pointer',
    },
    border: 'none',
  },
  innerDot: {
    padding: '1em',
  },
  currentDot: {
    backgroundColor: 'gray',
  },
  flexCenter: {
    flexDirection: 'row',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    width: '100%',
  },
});

const Carousel = (props) => {
  const { data, lockItem, lockType } = props;

  console.log(data);

  const classes = useStyles();

  const getDateFromISOString = (isoString) => {
    const dateString = isoString.toString(); // being safe
    const d = new Date(dateString);
    return d.toLocaleDateString();
  };

  /* eslint-disable */
  const renderChildren = (input) => {
    const toReturn = [];
    Object.keys(data).forEach((each, index) => {
      toReturn.push(
        <Slide tag="a" key={index}>
          <div className={classes.incidentContainer}>
            <p className={classes.incidentDescription}>
              {data[each].description}
            </p>
            <p className={classes.incidentRightAlign}>slin
              {' '}
              {/* location here */}
              {data[each].location}
            </p>
            <p className={classes.incidentRightAlign}>
              {' '}
              {/* date here  */}
              {getDateFromISOString(data[each].date)}
            </p>
          </div>
        </Slide>,
      );
    });
    return toReturn;
  };
  /* eslint-enable */

  function eventLogger(ev) {
    // eslint-disable-next-line no-console
    // console.log(ev.type, ev.target);
  }

  function renderDots(ev) {
    console.log(ev);
    const totalSlides = ev.totalSlides;
    const currentSlide = ev.currentSlide;
    let i = 0;
    const dots = [];
    for (; i < totalSlides; ++i) {
      dots.push(
        <Dot
          key={i}
          slide={i}
          selected
          disabled={false}
        >
          <span className={classes.innerDot}> </span>
        </Dot>,
      );
    }
    return dots;
  }

  function getLabel() {
    if (lockItem === 'none') {
      return 'the United States';
    } if (lockType === 'county') {
      const countyName = lockItem.substr(0, lockItem.length - 3);
      const id = lockItem.substr(lockItem.length - 2, lockItem.length - 1);
      console.log(id);
      return `${countyName} County, ${stateIdToStateName(id)}`;
    }
    return lockItem; // for some reason, this if statamnet is yielding 'none'
  }

  return (
    <CarouselProvider
      className={classes.CarouselProvider}
      visibleSlides={1}
      totalSlides={Object.keys(data).length}
      naturalSlideWidth={100}
      naturalSlideHeight={100}
    >
      <h1 className={classes.headline}>Featured Stories</h1>
      <p className={classes.label}>
        Some Featured Stories from
        {' '}
        {getLabel()}
      </p>
      <Slider
        className={classes.slider}
        trayProps={{
          // clipboard events? Sure why not.
          onCopy: eventLogger,
          onCut: eventLogger,
          onPaste: eventLogger,

          // composition events
          onCompositionEnd: eventLogger,
          onCompositionStart: eventLogger,
          onCompositionUpdate: eventLogger,

          // keyboard events
          onKeyDown: eventLogger,
          onKeyPress: eventLogger,
          onKeyUp: eventLogger,

          // focus events,
          onFocus: eventLogger,
          onBlur: eventLogger,

          // form events,
          onChange: eventLogger,
          onInput: eventLogger,
          onInvalid: eventLogger,
          onSubmit: eventLogger,

          // mouse events
          onClick: eventLogger,
          onContextMenu: eventLogger,
          onDoubleClick: eventLogger,
          onDrag: eventLogger,
          onDragEnd: eventLogger,
          onDragEnter: eventLogger,
          onDragExit: eventLogger,
          onDragLeave: eventLogger,
          onDragOver: eventLogger,
          onDragStart: eventLogger,
          onDrop: eventLogger,
          onMouseDown: eventLogger,
          onMouseEnter: eventLogger,
          onMouseLeave: eventLogger,
          // onMouseMove: eventLogger,
          onMouseOut: eventLogger,
          onMouseOver: eventLogger,
          onMouseUp: eventLogger,

          // touch events
          onTouchCancel: eventLogger,
          onTouchEnd: eventLogger,
          // onTouchMove: eventLogger,
          onTouchStart: eventLogger,

          // pointer events
          onPointerDown: eventLogger,
          // onPointerMove: eventLogger,
          onPointerUp: eventLogger,
          onPointerCancel: eventLogger,
          onGotPointerCapture: eventLogger,
          onLostPointerCapture: eventLogger,
          onPointerEnter: eventLogger,
          onPointerLeave: eventLogger,
          onPointerOver: eventLogger,
          onPointerOut: eventLogger,

          draggable: true,
        }}
      >
        {renderChildren()}
      </Slider>
      <div className={classes.buttonContainer}>
        <ButtonBack className={classes.buttonWrapper}>
          <Button variant="outlined" color="primary">
            Back
          </Button>
        </ButtonBack>
        <ButtonNext className={classes.buttonWrapper}>
          <Button variant="outlined" color="primary">
            Next
          </Button>
        </ButtonNext>
      </div>
      <div className={classes.flexCenter}>
        <DotGroup
          renderDots={renderDots}
        />
      </div>
    </CarouselProvider>
  );
};

/*
  note - button inside butotn DOM nesting = invalid

*/

export default Carousel;
