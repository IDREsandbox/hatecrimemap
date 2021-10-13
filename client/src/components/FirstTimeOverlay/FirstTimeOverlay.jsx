import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FIRST_OVERLAY } from '../../res/values/string';

const styles = {
  dontShowBox: {
    'justify-content': 'flex-end',
  },
};

class FirstTimeOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      dontShow: false,
    };
  }

  async componentDidMount() {
    const hasVisited = localStorage.getItem('visitedPage') == 'true';
    if (hasVisited) {
      this.setState({
        open: false,
        dontShow: false,
      });
    }
  }

  handleCheck = () => {
    this.setState((prev) => ({ dontShow: !prev.dontShow }));
    if (
      document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('dontshow='))
    ) { // eslint-disable-line no-empty
    }
  };

  handleClose = () => {
    if (this.state.dontShow) {
      localStorage.setItem('visitedPage', true);
      document.cookie = 'dontshow=do_not_show';
    }
    this.setState({ open: false });
    this.props.onClose();
  };

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        maxWidth="md"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {FIRST_OVERLAY.TITLE}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {FIRST_OVERLAY.TEXT}
            <br />
            <br />
            <em>{FIRST_OVERLAY.SUB_TEXT}</em>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={this.handleClose}
            color="primary"
          >
            I Understand
          </Button>
          <FormControlLabel
            control={(
              <Checkbox
                className={this.props.classes.dontShowBox}
                checked={this.state.dontShow}
                onChange={this.handleCheck}
              />
            )}
            label={FIRST_OVERLAY.CLOSE_LABEL}
          />
        </DialogActions>
      </Dialog>
    );
  }
}

FirstTimeOverlay.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FirstTimeOverlay);
