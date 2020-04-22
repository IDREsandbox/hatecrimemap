import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
};

class FirstTimeOverlay extends Component {
  state = {
    open: true,
    dontShow: false
  };

  async componentDidMount() {
    let hasVisited = (localStorage.getItem('visitedPage')) == 'true';
    if(false) {
      this.setState({
        open: false,
        dontShow: false
      });
    }
  }

  handleCheck = (e) => {
    this.setState((prev, props) => ({dontShow: !prev.dontShow}))
  }

  handleClose = () => {
    if(this.state.dontShow) {
        localStorage.setItem('visitedPage', true)
    }
    this.setState({ open: false });
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        maxWidth="md"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Welcome to the Hate Crime Map!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Hate Crime Map offers an anonymous platform for victims of hate-based assault and crime to
            record their experiences so that researchers and policy makers have accurate information. To see
            data, hover over a state. To report harassment or assault, click on “Report Incident” on toolbar.”
            For more details, click on “About Us.”
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={this.handleClose} color="primary" autoFocus>
            Close
          </Button>
          <FormControlLabel
            control={
              <Checkbox checked={this.state.dontShow} onChange={this.handleCheck} />
            }
            label="Don't show again"
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