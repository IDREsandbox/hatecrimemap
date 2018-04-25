import React from 'react';
import PropTypes from 'prop-types';

import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';
import './SideMenu.css';

const SideMenu = ({ updateMapData }) => (
  <div className="sideMenu">
    <h2 className="sideMenu__header">Search</h2>
    <form className="sideMenu__form">
      <GHCheckboxList onClick={updateMapData} showSVGs />
    </form>
  </div>
);

SideMenu.propTypes = {
  updateMapData: PropTypes.func.isRequired,
};

export default SideMenu;
