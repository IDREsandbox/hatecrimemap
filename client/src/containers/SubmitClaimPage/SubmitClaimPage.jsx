import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'material-ui/DatePicker';

import GHCheckboxList from '../../components/GHCheckboxList/GHCheckboxList';
import './SubmitClaimPage.css';

function showPosition(position) {
  console.log('runnin');
  console.log(position.coords);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

export default class SubmitClaimPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
    };
    this.updateGroupsHarassed = this.updateGroupsHarassed.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    const { location, sourceurl } = this.state;
    return (
      <div className="submitClaimPage">
        <h1>Submit a claim</h1>
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
        </form>
      </div>
    );
  }
}
