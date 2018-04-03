import React from 'react';
import PropTypes from 'prop-types';

import FilterMenu from './components/FilterMenu/FilterMenu';
import './SideMenu.css';

const SideMenu = ({ updateMapData }) => (
  <div className="sideMenu">
    <h2 className="sideMenu__header">Search</h2>
    <FilterMenu updateMapData={updateMapData} />
  </div>
);

SideMenu.propTypes = {
  updateMapData: PropTypes.func.isRequired,
};

export default SideMenu;
