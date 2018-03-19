import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './SideMenu.css';

export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="sideMenu">
        <h2>Side Menu</h2>
        <label htmlFor="notVerified">
          <input type="checkbox" name="notVerified" onClick={this.props.updateMapData} />
          Not Verified
        </label>
        <label htmlFor="verified1">
          <input type="checkbox" onClick={this.props.updateMapData} />
          Verified 1
        </label>
        <label htmlFor="verified2">
          <input type="checkbox" onClick={this.props.updateMapData} />
          Verified 2
        </label>
      </div>
    );
  }
}

SideMenu.propTypes = {
  updateMapData: PropTypes.func.isRequired,
};
