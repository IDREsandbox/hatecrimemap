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
import ColoredButton from 'components/Reusables/ColoredButton';
import SliderExport from './ProgressBar';
import './Carousel.css'


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
  hr: {
    marginTop: '1em',
    marginBottom: '0',
    color: 'white',
    boxShadow: 'none',
    borderTop: '0.5px solid white',
    borderBottom: '0.5px solid white',
  },
  slider: {
    height: '100%',
    margin: '0.1em 0',
  },
  buttonWrapper: {
    margin: '1em',
    backgroundColor: 'transparent',
    padding: 0,
    border: 'none',
    background: 'none',
  },
  headline: {
    color: 'white',
    fontSize: 50,
    margin: 0,
    marginTop: 2,
    padding: 0,
  },
  label: {
    color: 'white',
    fontSize: 18,
  },
  incidentRightAlign: {
    fontSize: 20,
    width: '100%',
    paddingRight: 10,
  },
  incidentDescription: {
    fontSize: 20,
  },
  incidentContainer: {
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    'justify-content': 'center',
    'margin-top': '16px',
    'align-items': 'center',
    margin: '1px 10px',
  },
  buttonContainer: {
    display: 'flex',
    'justify-content': 'space-between',
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
  location: {
    color: 'white'
  },
  CarouselProvider: {
    height: '100%',
  },
});

const Carousel = (props) => {
  const {
    data, lockItem, lockType, openPopup
  } = props;

  const classes = useStyles();

  const getDateFromISOString = (isoString) => {
    const dateString = isoString.toString(); // being safe
    const d = new Date(dateString);
    return d.toLocaleDateString();
  };

  /* eslint-disable */
  const renderChildren = (input) => {
    if (Object.keys(data).length === 0) {
      return <h1> No data for this location. </h1>
    }
    const toReturn = [];
    Object.keys(data).forEach((each, index) => {
      toReturn.push(
        <Slide tag="a" key={index} className='slide-style'>
          <div className={classes.incidentContainer}>
            <p className={`${classes.incidentRightAlign} ${classes.location}`}>
              {/* location here */}
               From {data[each].location} on {' '}
              {getDateFromISOString(data[each].date)}
              {' '}
            </p>
            <p>
            </p>
            <p className={classes.incidentDescription}>
              {data[each].description}
            </p>
          </div>
        </Slide>,
      );
    });
    return toReturn;
  };
  /* eslint-enable */
  const [currentSlide, setCurrentSlide] = useState(0);

  function renderDots(ev) {
    // console.log(ev.carouselStore);
    // ev.carouselStore.setStoreState({ currentSlide: 5 })
    // console.log(data[ev.currentSlide])
    // ev.currentSlide contains umbers
    const latitude = data[ev.currentSlide].latitude;
    const longitude = data[ev.currentSlide].longitude;
    setCurrentSlide(ev.currentSlide);
    openPopup(latitude, longitude, data[ev.currentSlide].location, getDateFromISOString(data[ev.currentSlide].date));
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
    return lockItem; // for some reason, this if is yielding 'none'
  }

  const numItems = Object.keys(data).length;

  return (
    <CarouselProvider
      className={classes.CarouselProvider}
      visibleSlides={1}
      totalSlides={Object.keys(data).length}
      naturalSlideWidth={2}
      naturalSlideHeight={1}
      isIntrinsicHeight={false}
    >
      <h1 className={classes.headline}>Featured Stories</h1>
      <p className={classes.label}>
        Some Featured Stories from
        {' '}
        {getLabel()}
      </p>
      <hr className={classes.hr} />
      <Slider
        className={classes.slider}
        trayProps={{ draggable: true }}
      >
        {renderChildren()}
      </Slider>
      <div className={classes.buttonContainer}>
        <ButtonBack className={classes.buttonWrapper}>
          <ColoredButton
            backButton
          >
            Back
          </ColoredButton>
        </ButtonBack>
        <ButtonNext className={classes.buttonWrapper}>
          <ColoredButton>
            Next
          </ColoredButton>
        </ButtonNext>
      </div>
      <DotGroup renderDots={renderDots} />
      <div className={classes.flexCenter}>
        <SliderExport length={numItems} current={currentSlide} />
      </div>
    </CarouselProvider>
  );
};

/*
  note - button inside butotn DOM nesting = invalid

*/

export default Carousel;
