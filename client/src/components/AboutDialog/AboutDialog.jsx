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

class AboutDialog extends Component {
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
          <DialogTitle id="responsive-dialog-title">Hate Crime Map</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>Hate crime—violence impelled by bigotry or bias—is a global and national human rights 
              problem of significant concern. According to experts like the FBI, the Southern Poverty Law 
              Center, and ProPublica, there has been a dramatic increase in hate crimes and harassment in 
              the United States during the past three years. The presence of high-profile incidents of 
              violence and aggression based on racial or other bias and intolerance is much more visible 
              in the media; nevertheless, hate crimes statistics are notoriously unreliable. The definition 
              of what constitutes a hate crime varies from jurisdiction to jurisdiction, and often is quite 
              reduced in terms of what actions qualify. Underreporting is widespread, and often even when 
              reporting happens, law enforcement is reluctant to designate crimes as hate crimes. 
              The need for a publicly available resource documenting hate crimes has never been greater, 
              yet accessible data on the type and frequency of crimes occurring is not currently available. 
              The HateMap Project seeks to address this need by providing a crowd-sourced platform that 
              enables researchers and victims to report hate-based incidents in detail, without having to 
              approach law enforcement.</p>
              <br />
              <p>The map of the United States is shown to the left, and the side panel on the right displays
               data as you hover over states/counties. Click on a location to lock it on the side panel, then
               you may interact with the graphs by clicking on top-level categories to see finer details. Click 
               anywhere else on the map to unlock it from that location.</p>
              <br />
              <p>If you would like to contribute to the database, click on "Report Incident" on the top right to 
              be taken to a page where you can submit a hate crime report. This will not be immediately updated in 
              the map, as the report must be verified with a valid report source in order to prevent mass false reports.</p>  
              <br />
              <p>Any questions? Email us at <a href="mailto:aisc@ucla.edu?Subject=Hate%20Crime%20Map%20Inquiry">aisc@ucla.edu</a></p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
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
