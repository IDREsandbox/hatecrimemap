import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  root: {

  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: 'white',
  },
  reportIncidentButton: {
    color: 'white',
  },
  aboutButton: {
    color: 'white',
  },
  link: {
    textDecoration: 'none',
  },
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
    // const { fullScreen } = this.props;

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
              Hate crime—violence impelled by bigotry or bias—is a global and national human rights problem of significant concern. According to experts like the FBI, the Southern Poverty Law Center, and ProPublica, there has been a dramatic increase in hate crimes and harassment in the United States during the past three years. The presence of high-profile incidents of violence and aggression based on racial or other bias and intolerance is much more visible in the media; nevertheless, hate crimes statistics are notoriously unreliable. The definition of what constitutes a hate crime varies from jurisdiction to jurisdiction, and often is quite reduced in terms of what actions qualify. Underreporting is widespread, and often even when reporting happens, law enforcement is reluctant to designate crimes as hate crimes.
              The need for a publicly available resource documenting hate crimes has never been greater, yet accessible data on the type and frequency of crimes occurring is not currently available. The HateMap Project seeks to address this need by providing a crowd-sourced platform that enables researchers and victims to report hate-based incidents in detail, without having to approach law enforcement.
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

const Header = ({ classes }) => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Link to="/">
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <HomeIcon />
          </IconButton>
        </Link>
        <Typography variant="title" color="inherit" className={classes.flex}>
          Mapping Harassment in the US
        </Typography>
        <Link to="/reportincident" className={classes.link}>
          <Button className={classes.reportIncidentButton} color="inherit">Report Incident</Button>
        </Link>
        <AboutDialog classes={classes}></AboutDialog>
      </Toolbar>
    </AppBar>
  </div>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
