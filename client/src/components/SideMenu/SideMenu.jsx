import React from 'react';
import PropTypes from 'prop-types';

import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';
import './SideMenu.css';

const SideMenu = ({ updateMapData }) => (
  <div className="sideMenu">
    <h2 className="sideMenu__header">Search</h2>
    <GHCheckboxList onClick={updateMapData} />
  </div>
);

SideMenu.propTypes = {
  updateMapData: PropTypes.func.isRequired,
};

export default SideMenu;
