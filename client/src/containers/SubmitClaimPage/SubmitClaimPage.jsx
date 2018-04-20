import React, { Component } from 'react';

import ghFilters from '../../globals/ghFilters';
import './SubmitClaimPage.css';

export default class SubmitClaimPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsHarassed: new Set(),
    };
    this.updateGroupsHarassed = this.updateGroupsHarassed.bind(this);
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

  render() {
    const { updateGroupsHarassed } = this;
    const checkboxes = ghFilters.map(({ name, label, key }) => (
      <label key={key}>
        <input type="checkbox" name={name} onClick={updateGroupsHarassed} />
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
