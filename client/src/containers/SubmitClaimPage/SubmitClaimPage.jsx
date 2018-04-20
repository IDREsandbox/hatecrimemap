import React, { Component } from 'react';

import ghFilters from '../../globals/ghFilters';
import './SubmitClaimPage.css';

export default class SubmitClaimPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsHarassed: [],
    };
  }

  render() {
    const checkboxes = ghFilters.map(({ name, label, key }) => (
      <label key={key}>
        <input type="checkbox" name={name} />
        {label}
      </label>
    ));
    return (
      <div className="submitClaimPage">
        <h1>Submit a claim</h1>
        <form className="submitClaimPage__form">
          {checkboxes}
        </form>
      </div>
    );
  }
}
