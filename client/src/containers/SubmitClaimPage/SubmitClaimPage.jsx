import React, { Component } from 'react';

import GHCheckboxList from '../../components/GHCheckboxList/GHCheckboxList';
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
    return (
      <div className="submitClaimPage">
        <h1>Submit a claim</h1>
        <form>
          <GHCheckboxList onClick={updateGroupsHarassed} />
        </form>
      </div>
    );
  }
}
