/*  eslint import/no-unresolved: 0, global-require: 0  */

/* eslint-disable */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
  Paper,
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Carousel from './Carousel';
import axios from 'axios';

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
  }
};


function SpotlightModal(props) {
  const { classes } = props;

  const [open, setOpen] = useState(false);
  const [carouselData, setCarouselData] = useState({
    data: {}
  });

  const [lockItem, setLockItem] = useState(props.lockItem);
  const [lockType, setLockType] = useState(props.lockType);

  useEffect(() => {
    setLockItem(props.lockItem);
    setLockType(props.lockType); // i knew this would happen.. lockType and lockItem techincally aren't finished being changed before the next couple lines are executed
  }, [props.lockItem, props.lockType])


  // FIX THIS: CHANGE QUERY TO ONLY BE MADE IF DATA NOT ALREADY PRESENT, NOT EVERY TIME
  useEffect(() => {
    // this is causing an extra call to API without the need?
    if (open) {

      let lockTypeQuery;
      if (lockItem === 'none') {
        lockTypeQuery = 'none'
      } else {
        lockTypeQuery = lockType
      }

      axios.get(`/api/stories/${lockTypeQuery}/${lockItem}`)
        .then(res => {
          if (carouselData.data[lockItem]) {
            // do nothing, data already exists
          } else {
            (`should get caught here`)
            setCarouselData((prevState) => ({
              data: {
                ...prevState.data,
                [lockItem]: res.data,
              }
            }));
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadingOrNot = () => {
    if (carouselData.data[lockItem]) {
      return (
        <Carousel
          lockItem={lockItem}
          lockType={lockType}
          data={carouselData.data[lockItem]}
        />
      )
    } else {
      return (
        <div className={`${classes.loading} ${classes.flexCenter}`}>
          <CircularProgress />
        </div>
      )
    }
  }

  return (
    <div>
      <div className={classes.flexCenter}>
        <Button
          variant="outlined"
          className={classes.aboutButton}
          onClick={handleClickOpen}>
          View Stories from this Location
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        fullWidth
        maxWidth="md"
        className={classes.mainModal}
      >
        <DialogContent className={classes.content}>
          {loadingOrNot()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

/*
Thoughts

*/

SpotlightModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpotlightModal);
/* eslint-enable */
