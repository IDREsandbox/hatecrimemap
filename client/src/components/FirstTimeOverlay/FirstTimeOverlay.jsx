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
  dontShowBox: {
    'justify-content': 'flex-end'
  }
};

class FirstTimeOverlay extends Component {
  state = {
    open: true,
    dontShow: false
  };

  async componentDidMount() {
    let hasVisited = (localStorage.getItem('visitedPage')) == 'true';
    if(hasVisited) {
      this.setState({
        open: false,
        dontShow: false
      });
    }
  }

  handleCheck = (e) => {
    this.setState((prev, props) => ({dontShow: !prev.dontShow}))
    if (document.cookie.split(';').some((item) => item.trim().startsWith('dontshow='))) {
      console.log('First time visiting')
  }
  console.log('you checked dont show')

  }

  handleClose = () => {
    if(this.state.dontShow) {
        localStorage.setItem('visitedPage', true)
        document.cookie = "dontshow=do_not_show";
    }
    this.setState({ open: false });
    this.props.onClose()
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
            The Hate Crime Map offers an anonymous platform for victims of hate-based assault and 
            crime to record their experiences so that researchers and policy makers have accurate 
            information about the causes and locations of hate crimes. In addition to reporting crimes, 
            you can search the data by race, gender, religion and other factors. To see data, hover 
            over a state. To report harassment or assault, click on “Report Incident” on toolbar.” 
            For more details, click on “About”.
            <br />
            <br />
            <em>*Please be advised that by accessing this site, you may encounter offensive language content, and that self-reported content may also include suspicious links.</em>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={this.handleClose} color="primary">
            I Understand
          </Button>
          <FormControlLabel
            control={
              <Checkbox className={this.props.classes.dontShowBox} checked={this.state.dontShow} onChange={this.handleCheck} />
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