/*  eslint import/no-unresolved: 0, global-require: 0  */

/* eslint-disable */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
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

import Floater from 'react-floater'
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
  }
};

const ColorButton = withStyles((theme) => ({
  root: {
    color: 'white',
    borderColor: 'white',
  }
}))(Button)


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





  let leafletTarget = null;

  const handleClickOpen = () => {
    leafletTarget = (".sideMenu__chart")
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
    }

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
        <ColorButton
          variant="outlined"
          className={classes.aboutButton}
          onClick={handleClickOpen}>
          View Stories from this Location
        </ColorButton>
      </div>

      {/* <Floater
        open={open}
        target=".leaflet-states-pane .leaflet-interactive:nth-child(4)"
        content="This is the Floater content"
        showCloseButton={true}
        options={{
          textColor: 'black',
          width: 800,
          zIndex: 9000,
        }}
        styles={{
          options: {
            textColor: 'black',
            width: 800,
            zIndex: 9000,
          },
        }}
      >
        text
      </Floater> */}

       <Dialog
        open={open}
        onClose={handleClickOpen}
        aria-labelledby="responsive-dialog-title"
        fullWidth
        maxWidth="md"
        className={classes.mainModal}
        PaperProps={{
          style: {
            backgroundColor: '#262626',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent className={classes.content}>
          {loadingOrNot()}
        </DialogContent>
        <DialogActions>
          <ColoredButton
            buttonClick={handleClose}
            notOutlined
            noIcon
          >
            Close
          </ColoredButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

/*
Have  to reimplement floater to lock on to exact 




ok so idea -> on open click, have the button set the floater to open
if the map is locked onto anything, have the floater lock onto that location

*/

SpotlightModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpotlightModal);
/* eslint-enable */
