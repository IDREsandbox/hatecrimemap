import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  aboutButton: {
    color: 'white',
  }
};

class AboutCovidDialog extends Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Button className={this.props.classes.aboutButton} onClick={this.handleClickOpen}>
          About
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          maxWidth="md"
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">About Mapping COVID Hate Incidents in the US</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>The reported incidents appearing at the launch of this separate COVID Hate Incidents Map on October 26, 2020 were provided by the Stop AAPI Hate Reporting Center (see more information in “Acknowledgments” below). Incorporating that data into the broader Hate Crime Map enables victims to report COVID-related harassment and violence in detail, and allows for researchers to analyze this data by state.</p>
              <br />
              <p>The data is presented from various perspectives, by location (the map), ethnicity of the reporter/victim, their gender, and the type of harassment encountered. Users can view the data for the entire United States, as well as scroll over the map to see the data by state. The pie charts at right list the data according to the location marked on the map. Click on the wedges in the pie chart to pull up a table listing each report's self-reported date, location, ethnicity, gender, harassment type, and description.</p>
              <br />
              <p>Any questions? Email us at <a href="mailto:aisc@ucla.edu?Subject=Hate%20Crime%20Map%20Inquiry">aisc@ucla.edu</a></p>
              <br />
              <hr />
              <br />
              <h3>Acknowledgments</h3>
              <p>The <a href="http://stopaapihate.org/" target="_blank">Stop AAPI Hate Reporting Center</a> was launched on March 19, 2020 in response to alarming reports about the escalation of harassment and violence against Asians and Asian Americans as a result of bigotry and misinformation spread about COVID-19. The center tracks and responds to incidents of hate, violence, harassment, and other forms of harassment against Asian Americans and Pacific Islanders in the United States.</p>
              <em>* Please note that some of the incidents were reported by witnesses of a different race or ethnicity than the victim.</em>
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

AboutCovidDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AboutCovidDialog);
