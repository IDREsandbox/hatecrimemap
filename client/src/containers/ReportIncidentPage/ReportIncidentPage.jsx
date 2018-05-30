import React, { Component } from 'react';
import axios from 'axios';
import isUrl from 'is-url';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import LocationSearchInput from '../../components/LocationSearchInput/LocationSearchInput';
import ReportIncidentStepper from '../../components/ReportIncidentStepper/ReportIncidentStepper';
import GHCheckboxList from '../../components/GHCheckboxList/GHCheckboxList';
import './ReportIncidentPage.css';

export default class ReportIncidentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
      date: {},
      stepIndex: 0,
      finished: false,
      latLng: {},
      associatedLink: true,
    };
  }

  getStepContent = () => {
    const { location, sourceurl, stepIndex, groupsHarassed, date, associatedLink } = this.state;
    const errorText = !this.isFormFilledOut() ? 'Field Required' : '';

    switch (stepIndex) {
      case 0:
        return (
          <LocationSearchInput
            name="location"
            onChange={this.updateLocation}
            onSelect={this.selectLocation}
            value={location}
            errorText={errorText}
          />
        );
      case 1:
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              keyboard
              label="Select a date"
              format="MM/DD/YYYY"
              placeholder="08/21/2018"
              showTodayButton
              mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
              value={date}
              onChange={this.updateDate}
              disableOpenOnEnter
              maxDate={new Date()}
              maxDateMessage="Date must be less than today"
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
              error={errorText !== ''}
              onChange={this.handleChange}
              label={errorText}
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
      stepIndex,
      location,
      date,
      groupsHarassed,
      sourceurl,
      latLng,
      associatedLink,
    } = this.state;

    switch (stepIndex) {
      case 0:
        return location !== '' && latLng.lat;
      case 1:
        return !(Object.keys(date).length === 0 && date.constructor === Object);
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
      .catch(error => console.error('Error', error));
  }

  updateLocation = location => this.setState({ location, latLng: {} });

  updateDate = date => this.setState({ date });

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  updateAssociatedLink = () => this.setState(oldState => ({ associatedLink: !oldState.associatedLink }));

  handleNext = () => {
    const { stepIndex } = this.state;
    if (!this.isFormFilledOut()) {
      const alertMessage = stepIndex === 3
        ? 'A correctly formatted url is required before continuing.'
        : 'This field is required before continuing.';
      alert(alertMessage);
      return;
    }
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3,
    });
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  reportIncident = () => {
    console.log(this.state);
    this.setState({
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
      date: {},
      stepIndex: 0,
      finished: false,
      latLng: {},
      associatedLink: true,
    });
    axios.post('/api/maps/reportincident', this.state)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }

  render() {
    const { stepIndex, finished } = this.state;
    const nextStepContent = this.getStepContent();
    const nextDisabled = !this.isFormFilledOut();

    return (
      <Paper className="reportIncidentPage" elevation={2}>
        <ReportIncidentStepper stepIndex={stepIndex} />
        <div>
          {finished ? (
            <p>
              <button
                onClick={(event) => {
                  this.reportIncident();
                  event.preventDefault();
                  this.setState({ stepIndex: 0, finished: false });
                }}
              >
                Click here
              </button> to console log data and reset form.
            </p>
          ) : (
            <div>
              <div>{nextStepContent}</div>
              <div>
                <Button
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                >
                  Back
                </Button>
                <Button
                  variant="raised"
                  onClick={this.handleNext}
                  disabled={nextDisabled}
                >
                  {stepIndex === 3 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Paper>
    );
  }
}
