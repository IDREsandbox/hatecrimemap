import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isUrl from 'is-url';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
} from '@material-ui/core';

import LocationSearchInput from '../../components/LocationSearchInput/LocationSearchInput';
import GHCheckboxList from '../../components/GHCheckboxList/GHCheckboxList';
import { createDataToSubmit } from '../../utils/utilities';

const styles = theme => ({
  root: {
    margin: '50px auto',
    width: '65%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

const getSteps = () => [
  'Harassment Location',
  'Date of Harassment',
  'Groups Harassed',
  'Verification Link',
];

class ReportIncidentPage extends Component {
  state = {
    groupsHarassed: new Set(),
    location: '',
    sourceurl: '',
    date: new Date(),
    activeStep: 0,
    latLng: {},
    associatedLink: true,
    isDateSelected: false,
  };

  getStepContent = (index) => {
    const { location, sourceurl, activeStep, groupsHarassed, date, associatedLink } = this.state;

    switch (index || activeStep) {
      case 0:
        return (
          <LocationSearchInput
            name="location"
            onChange={this.updateLocation}
            onSelect={this.selectLocation}
            value={location}
          />
        );
      case 1:
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              value={date}
              onChange={this.updateDate}
              label="Select a date"
              format="MM/DD/YYYY"
              showTodayButton
              maxDate={new Date()}
            />
          </MuiPickersUtilsProvider>
        );
      case 2:
        return (
          <GHCheckboxList
            onClick={this.updateGroupsHarassed}
            showSVGs={false}
            groupsChecked={groupsHarassed}
          />
        );
      case 3:
        return (
          <div>
            <TextField
              name="sourceurl"
              onChange={this.handleChange}
              helperText="http://www.example.com/"
              defaultValue={sourceurl}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!associatedLink}
                  onChange={this.updateAssociatedLink}
                  value="associatedLink"
                />
              }
              label="No associated link"
            />
          </div>
        );
      default:
        return 'error';
    }
  }

  isFormFilledOut = () => {
    const {
      activeStep,
      location,
      isDateSelected,
      groupsHarassed,
      sourceurl,
      latLng,
      associatedLink,
    } = this.state;

    switch (activeStep) {
      case 0:
        return location !== '' && latLng.lat;
      case 1:
        return isDateSelected;
      case 2:
        return groupsHarassed.size !== 0;
      case 3:
        return (isUrl(sourceurl) && associatedLink) || (sourceurl === '' && !associatedLink);
      default:
        return true;
    }
  }

  updateGroupsHarassed = ({ target: { name } }) => {
    const { groupsHarassed } = this.state;
    if (groupsHarassed.has(name)) {
      groupsHarassed.delete(name);
    } else {
      groupsHarassed.add(name);
    }
    this.setState({ groupsHarassed });
  }

  selectLocation = (location) => {
    this.updateLocation(location);
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({ latLng }))
      .catch(() => alert('Oops! There was an error. Please try again.'));
  }

  updateLocation = location => this.setState({ location, latLng: {} });

  updateDate = date => this.setState({ date, isDateSelected: true });

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  updateAssociatedLink = () => this.setState(oldState => ({ associatedLink: !oldState.associatedLink }));

  handleNext = () => this.setState(oldState => ({ activeStep: oldState.activeStep + 1 }));

  handleBack = () => this.setState(oldState => ({ activeStep: oldState.activeStep - 1 }));

  handleReset = () => {
    this.setState({ activeStep: 0 });
    this.reportIncident();
  }

  reportIncident = () => {
    const dataToSubmit = createDataToSubmit(this.state);
    console.log(dataToSubmit);
    this.setState({
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
      date: {},
      activeStep: 0,
      latLng: {},
      associatedLink: true,
    });
    axios.post('/api/maps/reportincident', dataToSubmit)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }

  render() {
    const { activeStep } = this.state;
    const { classes } = this.props;
    const steps = getSteps();
    const nextStepContent = this.getStepContent();

    return (
      <Paper className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed - you&quot;re finished
              </Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </div>
          ) : (
            <div>
              <div>{nextStepContent}</div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant="raised"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                  disabled={!this.isFormFilledOut()}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Paper>
    );
  }
}

ReportIncidentPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReportIncidentPage);
