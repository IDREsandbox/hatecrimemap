/*  eslint import/no-unresolved: 0, global-require: 0  */
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import  CircularProgress  from '@material-ui/core/CircularProgress';

import Carousel from './Carousel';

import axios from 'axios';

import ColoredButton from 'components/Reusables/ColoredButton';

const styles = {
  flexCenter: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
  },
  loading: {
    'margin-top': '16px',
    width: '100%',
    height: 300,
  },
  images: {
    display: 'table',
    'border-collapse': 'collapse',
    width: '100%',
  },
  inline: {
    display: 'table-cell',
    'vertical-align': 'middle',
    '& img': {
      display: 'block',
      width: '100%',
      height: 'auto',
    },
  },
  mainModal: {
    width: '100%',
  },
  content: {
    width: '100%',
  },
  SpotlightContainer: {
    margin: '1em 0',
    height: '50%',
  }
};

function SpotlightModal(props) {
  const { classes, openPopup, closePopup, locked } = props;

  const [carouselData, setCarouselData] = useState({
    data: {}
  });

  const [lockItem, setLockItem] = useState(props.lockItem);
  const [lockType, setLockType] = useState(props.lockType);

  // can't only change on lockType, similar changes between state will break
  useEffect(() => {
    if (!locked) {
      if (lockItem !== 'none') {
        setLockItem('none')
      }
      return;
    }
    setLockItem(props.lockItem);
    setLockType(props.lockType);
  }, [props.lockItem, locked]) // janky fix, also considering locked as a parameter to reset to wait for state change above

  // FIX THIS: CHANGE QUERY TO ONLY BE MADE IF DATA NOT ALREADY PRESENT, NOT EVERY TIME
  // need this to be triggered upon change to lockItem type & on default
  useEffect(() => {
    // this is causing an extra call to API without the need?
    fetchSpotlightData(props.lockItem)
  }, []);


  // Fetch Hook upon lockItem changing on upper level
  useEffect(() => {
    // if it's unlocked should display 'none' data
    if (!locked) {

      if (!carouselData['none']) {
        fetchSpotlightData('none')
        return;
      }
    } else {
      fetchSpotlightData(lockItem)
    }
  }, [lockItem])

  const fetchSpotlightData = (item) => {
    if (!locked && carouselData['none']) { // if it's not locked, fetch carousel data
      return;
    }

    let lockTypeQuery;
    if (item === 'none') {
      lockTypeQuery = 'none'
    } else {
      lockTypeQuery = lockType
    }

    if (carouselData[item]) {
      // do nothing
    } else {
      axios.get(`/api/stories/${lockTypeQuery}/${item}`)
        .then(res => {
          setCarouselData((prevState) => ({
            data: {
              ...prevState.data,
              [item]: res.data,
            }
          }));
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  const handleClose = () => {
    closePopup()
    props.exitSpotlightMode()
  };

  const loadingOrNot = () => {
    if (carouselData.data[lockItem]) {
      return (
        <Carousel
          closePopup={closePopup}
          openPopup={openPopup}
          lockItem={lockItem}
          lockType={lockType}
          data={carouselData.data[lockItem]}
        />
      )
    } else {
      return (
        <div className={`${classes.loading} ${classes.flexCenter}`}>
          <CircularProgress style={{ 'color': 'white' }} />
        </div>
      )
    }
  }

  return (
    <div className={classes.SpotlightContainer}>
      <ColoredButton
        id="spotlightbackButton"
        onClick={handleClose}
        backButton
      >
        Back to Charts
      </ColoredButton>
      {loadingOrNot()}
    </div>
  );
}

SpotlightModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpotlightModal);
/* eslint-enable */