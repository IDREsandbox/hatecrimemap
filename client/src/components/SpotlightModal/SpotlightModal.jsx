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
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'; //eslint-disable-line
import Carousel from './Carousel';


import axios from 'axios';

const styles = {
  loading: {
    display: 'flex',
    'justify-content': 'center',
    'margin-top': '16px',
    width: '100%',
  },
  aboutButton: {
    color: 'white',
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
  const { classes, state } = props;

  const [open, setOpen] = useState(false);
  const [carouselData, setCarouselData] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios.get(`/stories/${state}`)
      .then(res => {
        console.log(res);
        /*DO AFTER FINISHED EXTRACTING DATA
  
        setCarouselData(data);
  
        */
      })
      .catch(err => {
        console.log(err);
      })

  }, [open]);

  return (
    <div>
      <Button className={classes.aboutButton} onClick={handleClickOpen}>
        About
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        fullWidth
        maxWidth="md"
        className={classes.mainModal}
      >
        <DialogContent className={classes.content}>

          {carouselData ?
            <Carousel />
            :
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          }
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
    So we're trying to highlight a few of the stories on the site. Is it worthwile to create a modal specifically for highlighting states or should it just be included
        in the first time overlay?

    Idea: I think I should include the same inner workings of the spotlightModal in the first time overlay with just general stories
    Upon "locking" onto a state, have a button appear on sidebar (so much wasted space) to
    Ok -> have a slideshow component as part of the inner workings sof the spotlightModal, then add

*/

SpotlightModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpotlightModal);
/* eslint-enable */
