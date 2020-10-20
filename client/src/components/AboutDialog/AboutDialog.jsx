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
  },
  images: {
    display: 'table',
    'border-collapse': 'collapse',
    width: '100%'
  },
  inline: {
    display: 'table-cell',
    'vertical-align': 'middle',
    "& img": {
      display: 'block',
      width: '100%',
      height: 'auto'
    }
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
              <p>Hate crime is a global and national human rights problem of significant concern. 
              Incidents are on the rise, but hate crimes statistics are notoriously unreliable. 
              The definition of hate crime varies from jurisdiction to jurisdiction, underreporting 
              is widespread, and law enforcement is reluctant to designate crimes as hate crimes. 
              The need for a publicly available resource documenting hate crimes has never been 
              greater, yet accurate data on the type and frequency of crimes is not available.</p>
              <br />
              <p>The Hate Crime Map seeks to address this need by providing a crowd-sourced platform that 
              enables victims to report hate-based incidents in detail, and researchers to study the data. 
              In addition to self-reported incidents, reports are culled from newspapers, and ProPublica 
              and the Stop AAPI Hate Reporting Center have shared their data. For the reasons listed above, 
              the data included herein represents only a fraction of the true number.</p>
              <br />
              <p>Any questions? Email us at <a href="mailto:aisc@ucla.edu?Subject=Hate%20Crime%20Map%20Inquiry">aisc@ucla.edu</a></p>
              <br />
              <hr />
              <br />
              <h3>Acknowledgments</h3>
              <p>This map was made possible with funding from the UCLA Institute of American Cultures, 
              Dean of UCLA Social Sciences Darnell Hunt, and the UCLA American Indian Studies Center. 
              Data was graciously provided by ProPublica’s Documenting Hate project and Russell Jeung 
              of the Stop AAPI Hate Reporting Center. Published incidents were culled from newspaper 
              reports by UCLA American Indian Studies Center staff and from self-reporting. Special 
              thanks go to mapping genius Albert Kochaphum, UCLA Institute of Digital Research & 
              Education, and Christopher Lam, brilliant UCLA engineering student, for their 
              extraordinary work in creating a functional and sophisticated, yet accessible, map. 
              Thanks also go to the originators of the “Harass Map,” which formed the foundation 
              of the current map: Patrick Meier, PhD, a consultant on humanitarian technology and 
              innovation; Andrew Schroeder, a geographic information systems expert; and Vanessa Diaz, 
              assistant professor in anthropology at Loyola Marymount University.</p>
              <div className={this.props.classes.images}>
                <div className={this.props.classes.inline}>
                  <img src={require("../../res/img/AISC_logo.png")} />
                </div>
                <div className={this.props.classes.inline}>
                  <img src={require("../../res/img/idre-logo.png")} />
                </div>
                <div className={this.props.classes.inline}>
                  <img src={require("../../res/img/InstAmerCultures_A.png")} />
                </div>
                <div className={this.props.classes.inline}>
                  <img src={require("../../res/img/social-sciences-logo.png")} />
                </div>
              </div>
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
