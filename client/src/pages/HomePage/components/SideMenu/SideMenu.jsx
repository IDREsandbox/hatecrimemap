import React from 'react';
import PropTypes from 'prop-types';

import filterMethods from './services';
import './SideMenu.css';

const SideMenu = ({ updateMapData }) => {
  const labels = filterMethods.map(({ name, label, key }) => (
    <label key={key}>
      <input type="checkbox" name={name} onClick={updateMapData} />
      {label}
    </label>
  ));
  return (
    <div className="sideMenu">
      <h2>Side Menu</h2>
      {labels}
    </div>
  );
};

SideMenu.propTypes = {
  updateMapData: PropTypes.func.isRequired,
};

export default SideMenu;
