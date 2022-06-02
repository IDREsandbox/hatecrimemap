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
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { ABOUT_DIALOGS } from '../../res/values/string';
import ColoredButton from 'components/Reusables/ColoredButton';

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
  dialogContent: {
    backgroundColor: '#262626',
    color: 'white'
  },
  title: {
    backgroundColor: "#262626",
    color: "#ffffff",
    textAlign: 'center',
  },
  closebuttons: {
    backgroundColor: "#262626",
    color: "white",
  },
  mylink: {
    color: 'white'
  }
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

    return (
      <div>
        <ColoredButton noIcon onClick={this.handleClickOpen}>
          About the Project
        </ColoredButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          maxWidth="md"
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle className={classes.title} id="responsive-dialog-title">Mapping Hate Crimes in the US</DialogTitle>
          <DialogContent
            className={classes.dialogContent}
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="baseline">
              <Grid item  >
                <Typography variant="h6" gutterBottom>
                  About the Project
                </Typography>
                <Typography paragraph>
                  {ABOUT_DIALOGS.HCM.PARAGRAPH1}
                </Typography>
                <Typography paragraph>
                  {ABOUT_DIALOGS.HCM.PARAGRAPH2}
                </Typography>
              </Grid>
              <hr />
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Acknowledgments
                </Typography>
                <Typography paragraph>
                  {ABOUT_DIALOGS.HCM.ACKNOWLEDGEMENTS1}
                </Typography>
                <Typography paragraph>
                  {ABOUT_DIALOGS.HCM.ACKNOWLEDGEMENTS2}
                </Typography>
                <Typography paragraph>
                  {ABOUT_DIALOGS.HCM.ACKNOWLEDGEMENTS3}
                </Typography>
              </Grid>
              <Typography className={classes.paragraph} paragraph>
                Any questions? Email us at
                {' '} <a className={classes.mylink} href={`mailto:${ABOUT_DIALOGS.HCM.EMAIL}?Subject=Hate%20Crime%20Map%20Inquiry`}> {ABOUT_DIALOGS.HCM.EMAIL}</a>
              </Typography>
            </Grid>
          </DialogContent>
          <DialogActions className={classes.closebuttons}>
            <ColoredButton noIcon onClick={this.handleClose}>
              Close
            </ColoredButton>
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
