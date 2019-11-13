import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isUrl from 'is-url';
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
  StepContent,
  Tooltip,
} from '@material-ui/core';

import LocationSearchInput from '../../components/LocationSearchInput/LocationSearchInput';
import GHCheckboxList from '../../components/GHCheckboxList/GHCheckboxList';
import { createDataToSubmit } from '../../utils/utilities';

const styles = ({ spacing }) => ({
  root: {
    margin: '0 auto',
    marginTop: spacing.unit * 2,
    width: '45%',
  },
  stepper: {
    minWidth: '500px',
  },
  button: {
    marginTop: spacing.unit,
    marginRight: spacing.unit,
  },
  actionsContainer: {
    marginBottom: spacing.unit * 2,
  },
  resetContainer: {
    padding: spacing.unit * 3,
  },
  checkboxWrapper: {
    marginLeft: spacing.unit,
  },
});

const getSteps = () => [
  'Harassment Location',
  'Date of Harassment',
  'Groups Harassed',
  'Verification Link',
];

const getInitialState = () => ({
  groupsHarassed: new Set(),
  location: '',
  sourceurl: '',
  date: new Date(),
  activeStep: 0,
  latLng: {},
  associatedLink: true,
  isDateSelected: false,
});



class ReportIncidentPage extends Component {
  state = getInitialState();

  getStepContent = (index) => {
    const { location, sourceurl, groupsHarassed, date, associatedLink } = this.state;
    const { classes } = this.props;

    switch (index) {
      case 0:
        return (
          <LocationSearchInput
            name="location"
            onChange={this.handleLocationChange}
            onSelect={this.selectLocation}
            value={location}
          />
        );
      case 1:
        return (
          <DatePicker
            value={date}
            onChange={this.handleDateChange}
            label="Select a date"
            format="MM/DD/YYYY"
            showTodayButton
            maxDate={new Date()}
          />
        );
      case 2:
        return (
          <div className={classes.checkboxWrapper}>
            <GHCheckboxList
              onClick={this.updateGroupsHarassed}
              showSVGs={false}
              groupsChecked={groupsHarassed}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <Tooltip title="Please include http:// in any links" placement="left">
              <TextField
                name="sourceurl"
                onChange={this.handleChange}
                helperText="http://www.example.com/"
                defaultValue={sourceurl}
              />
            </Tooltip>
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
    this.handleLocationChange(location);
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({ latLng }))
      .catch(() => alert('Oops! There was an error. Please try again.'));
  }

  handleLocationChange = location => this.setState({ location, latLng: {} });

  handleDateChange = date => this.setState({ date: date.toDate(), isDateSelected: true });

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
    this.resetState();
    axios.post('/api/maps/incidentreport', dataToSubmit)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }

  resetState = () => this.setState(getInitialState());

  render() {
    const { activeStep } = this.state;
    const { classes } = this.props;
    const steps = getSteps();
    const buttonOnclick = activeStep === steps.length - 1 ? this.handleReset : this.handleNext;


    return (
      <Paper className={classes.root}>
        <Stepper className={classes.stepper} activeStep={activeStep} orientation="vertical">
          {steps.map((label, i) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <div>{this.getStepContent(i)}</div>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      disabled={!this.isFormFilledOut()}
                      variant="raised"
                      color="primary"
                      onClick={buttonOnclick}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    );
  }
}

ReportIncidentPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReportIncidentPage);
