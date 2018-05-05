import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'material-ui/DatePicker';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import GHCheckboxList from '../../components/GHCheckboxList/GHCheckboxList';
import './SubmitClaimPage.css';

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return (<p>Location</p>);
    case 1:
      return 'date';
    case 2:
      return 'groups';
    case 3:
      return 'url';
    default:
      return 'default';
  }
}

export default class SubmitClaimPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
      stepIndex: 0,
      finished: false,
    };
    this.updateGroupsHarassed = this.updateGroupsHarassed.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.submitClaim = this.submitClaim.bind(this);
  }

  updateGroupsHarassed({ target: { name } }) {
    const { groupsHarassed } = this.state;
    if (groupsHarassed.has(name)) {
      groupsHarassed.delete(name);
    } else {
      groupsHarassed.add(name);
    }
    this.setState({ groupsHarassed });
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleNext() {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3,
    });
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  submitClaim() {
    const { groupsHarassed, location, sourceurl } = this.state;
    if (groupsHarassed.size === 0 || location === '' || sourceurl === '') {
      alert('Fill out all areas of the form before submitting');
      return;
    }
    axios.post('/api/maps/submitclaim', {
      groupsHarassed: Array.from(groupsHarassed),
      location,
      sourceurl,
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }

  render() {
    const { updateGroupsHarassed, handleChange, submitClaim } = this;
    const { location, sourceurl, stepIndex, finished } = this.state;

    return (
      <div className="submitClaimPage">
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Harassment Location</StepLabel>
          </Step>
          <Step>
            <StepLabel>Date of Harassment</StepLabel>
          </Step>
          <Step>
            <StepLabel>Groups Harassed</StepLabel>
          </Step>
          <Step>
            <StepLabel>Verification URL</StepLabel>
          </Step>
        </Stepper>
        <div>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({ stepIndex: 0, finished: false });
                }}
              >
                Click here
              </a> to reset the example.
            </p>
          ) : (
            <div>
              <p>{getStepContent(stepIndex)}</p>
              <div style={{ marginTop: 12 }}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                  style={{ marginRight: 12 }}
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
        {/* <h1>Submit a claim</h1>
        <form className="submitClaimPage__form">
          <label>
            Location
            <input type="text" name="location" value={location} onChange={handleChange} />
          </label>
          <button type="button" onClick={getLocation}>Locate me</button>
          <GHCheckboxList onClick={updateGroupsHarassed} />
          <label>
            Please add the full link/URL to the article, post, report, etc where this event was reported
            <input type="text" name="sourceurl" value={sourceurl} onChange={handleChange} />
          </label>
          <DatePicker hintText="Select a date" mode="landscape" />
          <button type="button" onClick={submitClaim}>Submit</button>
        </form> */}
      </div>
    );
  }
}
