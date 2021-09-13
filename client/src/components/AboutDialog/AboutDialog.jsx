/*  eslint import/no-unresolved: 0, global-require: 0  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { ABOUT_DIALOGS } from '../../res/values/string';

const styles = {
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
};

class AboutDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      classes,
    } = this.props;

    console.log(classes);

    return (
      <div>
        <Button className={classes.aboutButton} onClick={this.handleClickOpen}>
          About
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          maxWidth="md"
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Hate Crime Map</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>{ABOUT_DIALOGS.HCM.PARAGRAPH1}</p>
              <br />
              <p>{ABOUT_DIALOGS.HCM.PARAGRAPH2}</p>
              <br />
              <p>
                Any questions? Email us at
                <a href={`mailto:${ABOUT_DIALOGS.HCM.EMAIL}?Subject=Hate%20Crime%20Map%20Inquiry`}>{ABOUT_DIALOGS.HCM.EMAIL}</a>
              </p>
              <br />
              <hr />
              <br />
              <h3>Acknowledgments</h3>
              <p>{ABOUT_DIALOGS.HCM.ACKNOWLEDGEMENTS}</p>
              <div className={classes.images}>
                <div className={classes.inline}>
                  <img src={require('res/img/AISC_logo.png')} alt="UCLA American Indian Studies Center Logo" />
                </div>
                <div className={classes.inline}>
                  <img src={require('res/img/idre-logo.png')} alt="UCLA Institute for Digital Research and Education Logo" />
                </div>
                <div className={classes.inline}>
                  <img src={require('res/img/InstAmerCultures_A.png')} alt="UCLA Insitute of American Cultures Logo" />
                </div>
                <div className={classes.inline}>
                  <img src={require('res/img/social-sciences-logo.png')} alt="UCLA Social Sciences Logo" />
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>

        </Dialog>
      </div>
    );
  }
}

AboutDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AboutDialog);
