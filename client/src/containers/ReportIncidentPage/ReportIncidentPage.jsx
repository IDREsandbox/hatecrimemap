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

const testData = {
  date: new Date(),
  datesubmitted: new Date(),
  groupsharassed: 'Arab,African American,Asian American',
  lat: 34.0194543,
  locationname: 'SLO',
  lon: -118.4911912,
  sourceurl: '',
  validsourceurl: false,
  verified: -1,
  verifiedbystudent: true,
};

const createInsertUnconfirmedPoint = (data) => {
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data).map((value) => {
    if (typeof value === 'string') return `\'${value}\'`; // eslint-disable-line
    if (value instanceof Date) return `(\'${value.toUTCString()}\')::date`; // eslint-disable-line
    return value;
  }).join(', ');
  const insertUnconfirmedPoint = `INSERT INTO hcmdata (${columns}) VALUES(${values})`;
  console.log(insertUnconfirmedPoint);
};

createInsertUnconfirmedPoint(testData);

class ReportIncidentPage extends Component {
  state = getInitialState();

  getStepContent = (index) => {
    const { location, sourceurl, activeStep, groupsHarassed, date, associatedLink } = this.state;

    switch (index || activeStep) {
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
    console.log(dataToSubmit);
    this.resetState();
    axios.post('/api/maps/reportincident', dataToSubmit)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }

  resetState = () => this.setState(getInitialState());

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
