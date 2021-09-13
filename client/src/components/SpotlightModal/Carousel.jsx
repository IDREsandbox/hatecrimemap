/*  eslint import/no-unresolved: 0, no-unused-vars: 0  */
import React from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
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
  },
});

const Carousel = (props) => {
  const { items } = props;

  const classes = useStyles();

  const renderChildren = (input) => {
    const toReturn = [];

    let i;
    for (i = 0; i < 6; ++i) {
      toReturn.push(
        <Slide className={classes.p} index={i}>
          <div className={classes.slideDiv}>
            <p>Hello</p>
          </div>
        </Slide>,
      );
    }
    return toReturn;
  };

  const getStoriesToDisplay = (region) => {
    axios.get('/api/totals/stories')
      .then((data) => {

      })
      .catch((err) => console.log(err));
  };

  return (
    <CarouselProvider
      visibleSlides={1}
      totalSlides={6}
      step={1}
      naturalSlideHeight={1}
      naturalSlideWidth={1}
      className={classes.card}
    >
      <h1 className={classes.headline}>Featured Stories</h1>
      <Slider className={classes.slider}>{renderChildren()}</Slider>
      <ButtonBack className={`${classes.leftArrow} ${classes.buttonWrapper}`}>
        <Button color="primary">Back</Button>
      </ButtonBack>
      <ButtonNext
        className={`${classes.rightArrow} ${classes.buttonWrapper}`}
      >
        <Button color="primary">Next</Button>
      </ButtonNext>
    </CarouselProvider>
  );
};

export default Carousel;

/*
TODO

need to figure out how to retrieve stories for the carousel/display to show in the slider

could write a route to retrieve some from the database manually? cache like the other thing
or could just fetch them at the beginning

I think I should write a route to receive some specific stories from the database

[i.e. create a bunch of numbers that will fetch specific id's from the database depending upon which state is selected]

*/
