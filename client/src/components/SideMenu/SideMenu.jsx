import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';

import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';
import './SideMenu.css';

const SideMenu = ({ updateMapData }) => (
  <div className="sideMenu">
    <h2 className="sideMenu__header">Filters</h2>
    <form className="sideMenu__form">
      <Toggle
        label="Toggle Verified"
        name="verified"
        labelPosition="right"
        onClick={updateMapData}
      />
      <GHCheckboxList onClick={updateMapData} showSVGs />
    </form>
  </div>
);

SideMenu.propTypes = {
  updateMapData: PropTypes.func.isRequired,
};

export default SideMenu;
