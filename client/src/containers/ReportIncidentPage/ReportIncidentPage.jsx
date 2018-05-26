import React, { Component } from 'react';
import axios from 'axios';
import isUrl from 'is-url';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import LocationSearchInput from '../../components/LocationSearchInput/LocationSearchInput';
import ReportIncidentStepper from '../../components/ReportIncidentStepper/ReportIncidentStepper';
import GHCheckboxList from '../../components/GHCheckboxList/GHCheckboxList';
import './ReportIncidentPage.css';

const dateRegex = /^\w{3}\s\w{3}\s\d{2}\s\d{4}$/;

export default class ReportIncidentPage extends Component {
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
      associatedLink: true,
    };
  }

  getStepContent = () => {
    const { location, sourceurl, stepIndex, groupsHarassed, associatedLink } = this.state;

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
          <div>
            <TextField
              name="sourceurl"
              onChange={this.handleChange}
              hintText="http://www.example.com/"
              floatingLabelText="Paste or type a link to a website"
              defaultValue={sourceurl}
            />
            <Checkbox
              label="No assoicated link"
              checked={!associatedLink}
              onCheck={this.updateAssociatedLink}
            />
          </div>
        );
      default:
        return 'error';
    }
  }

  updateAssociatedLink = () => this.setState(oldState => ({ associatedLink: !oldState.associatedLink }));

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
        return dateRegex.test(date);
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

  updateLocation = (location) => {
    this.setState({
      location,
      latLng: {},
     });
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
    const {
      groupsHarassed,
      location,
      sourceurl,
      date,
      latLng,
    } = this.state;
    console.log(this.state);
    this.setState({
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
      date: '',
      stepIndex: 0,
      finished: false,
      latLng: {},
    });
    axios.post('/api/maps/reportincident', {
      groupsHarassed: Array.from(groupsHarassed),
      location,
      sourceurl,
      date,
      latLng,
    })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  }

  render() {
    const { stepIndex, finished } = this.state;
    const nextStepContent = this.getStepContent();

    return (
      <Paper className="ReportIncidentPage" zDepth={2}>
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
