import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import LocationSearchInput from '../../components/LocationSearchInput/LocationSearchInput';
import SubmitClaimStepper from '../../components/SubmitClaimStepper/SubmitClaimStepper';
import GHCheckboxList from '../../components/GHCheckboxList/GHCheckboxList';
import './SubmitClaimPage.css';

export default class SubmitClaimPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
      date: '',
      stepIndex: 0,
      finished: false,
      latLng: {},
    };
  }

  getStepContent = () => {
    const { location, sourceurl, stepIndex, groupsHarassed } = this.state;

    switch (stepIndex) {
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
          <DatePicker
            name="date"
            onChange={(e, dateObj) => this.updateDate(dateObj)}
            hintText="Select a date"
            mode="landscape"
            openToYearSelection
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
          <TextField
            name="sourceurl"
            onChange={this.handleChange}
            hintText="Paste or type a link to a website"
            defaultValue={sourceurl}
          />
        );
      default:
        return 'error';
    }
  }

  formFilledOut = () => {
    const {
      stepIndex,
      location,
      date,
      groupsHarassed,
      sourceurl,
    } = this.state;

    switch (stepIndex) {
      case 0:
        return location !== '';
      case 1:
        return date !== '';
      case 2:
        return groupsHarassed.size !== 0;
      case 3:
        return sourceurl !== '';
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

  updateLocation = (location) => {
    this.setState({ location });
  }

  selectLocation = (location) => {
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        console.log('Success', latLng);
        this.setState({ latLng });
      })
      .catch(error => console.error('Error', error));
  }

  updateDate = (dateObj) => {
    const date = dateObj.toDateString();
    this.setState({ date });
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  }

  handleNext = () => {
    const { stepIndex } = this.state;
    if (!this.formFilledOut()) {
      alert('Complete field before continuing');
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

  submitClaim = () => {
    const {
      groupsHarassed,
      location,
      sourceurl,
      date,
      latLng,
    } = this.state;
    console.log('Location:', location);
    console.log('Lat Lon:', latLng);
    console.log('Date:', date);
    console.log('Groups harassed:', groupsHarassed);
    console.log('Source URL:', sourceurl);
    this.setState({
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
      date: '',
      stepIndex: 0,
      finished: false,
    });
    axios.post('/api/maps/submitclaim', {
      groupsHarassed: Array.from(groupsHarassed),
      location,
      sourceurl,
      date,
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }

  render() {
    const { stepIndex, finished } = this.state;
    const nextStepContent = this.getStepContent();

    return (
      <Paper className="submitClaimPage" zDepth={2}>
        <SubmitClaimStepper stepIndex={stepIndex} />
        <div>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  this.submitClaim();
                  event.preventDefault();
                  this.setState({ stepIndex: 0, finished: false });
                }}
              >
                Click here
              </a> to console log data and reset form.
            </p>
          ) : (
            <div>
              <div>{nextStepContent}</div>
              <div>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                />
                <RaisedButton
                  label={stepIndex === 3 ? 'Finish' : 'Next'}
                  primary
                  onClick={this.handleNext}
                />
              </div>
            </div>
          )}

        </div>
      </Paper>
    );
  }
}
