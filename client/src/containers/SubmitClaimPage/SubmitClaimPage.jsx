import React, { Component } from 'react';
import './SubmitClaimPage.css';

export default class SubmitClaimPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsHarassed: [],
    };
  }

  render() {
    return (
      <div className="submitClaimPage">
        <h1>Submit a claim</h1>
      </div>
    );
  }
}
