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
import Typography from '@material-ui/core/Typography'
import { stateIdToStateName } from 'utils/data-utils';
import ColoredButton from 'components/Reusables/ColoredButton';
import SliderExport from './ProgressBar';
import './Carousel.css'


const useStyles = makeStyles({
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
  noEventContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventTitle: {
    margin: '2em',
    color: 'white'
  }
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

  const noEventReturn = (
    <div className={classes.noEventContainer}>
      <h2 className={classes.noEventTitle}>
        No incidents for this location.
      </h2>
    </div>
  )

  /* eslint-disable */
  const renderChildren = (input) => {
    if (!data) {
      return noEventReturn;
    }
    else {
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
    }
  };
  /* eslint-enable */
  const [currentSlide, setCurrentSlide] = useState(0);

  function renderDots(ev) {
    if (data[ev.currentSlide].latitude && data[ev.currentSlide].longitude) {
      const latitude = data[ev.currentSlide].latitude;
      const longitude = data[ev.currentSlide].longitude;
      setCurrentSlide(ev.currentSlide);
    } else {
      return;
    }
  }

  useEffect(() => {
    if (data && data[currentSlide] && !isNaN(currentSlide)) { // not triggering??
      openPopup(data[currentSlide].latitude, data[currentSlide].longitude)
    } 
  }, [])
  useEffect(() => {
    if (data && data[currentSlide] && !isNaN(currentSlide)) {
      openPopup(data[currentSlide].latitude, data[currentSlide].longitude)
    }
  }, [currentSlide, lockItem])

  function getLabel() {
    if (lockItem === 'none') {
      return 'the United States';
    } if (lockType === 'county') {
      const countyName = lockItem.substr(0, lockItem.length - 3);
      const id = lockItem.substr(lockItem.length - 2, lockItem.length - 1);
      return `${countyName} County, ${stateIdToStateName(id)}`;
    }
    return lockItem;
  }

  const numItems = Object.keys(data).length;

  if (numItems === 0) {
    return noEventReturn;
  } else {
    return (
      <CarouselProvider
        className={classes.CarouselProvider}
        visibleSlides={1}
        totalSlides={Object.keys(data).length}
        naturalSlideWidth={2}
        naturalSlideHeight={1}
        isIntrinsicHeight={false}
      >
        <h1 className={classes.headline}>Highlighted Incidents</h1>
        <p className={classes.label}>
          Hate Incidents from
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
        {numItems > 1
          &&
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
        }
        {numItems > 1 &&
          <DotGroup renderDots={renderDots} />
        }
        <div className={classes.flexCenter}>
          <SliderExport length={numItems} current={currentSlide} />
        </div>
      </CarouselProvider>
    );
  }
};

/*
  note - button inside butotn DOM nesting = invalid
*/

export default Carousel;
