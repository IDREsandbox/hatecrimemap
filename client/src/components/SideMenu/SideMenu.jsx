import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';

import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';
import './SideMenu.css';

const SideMenu = ({ updateMapData, resetMapData, currentLayers }) => {
  const toggled = currentLayers.has('verified');

  return (
    <div className="sideMenu">
      <h2 className="sideMenu__header">Filters</h2>
      <form className="sideMenu__form">
        <Toggle
          toggled={toggled}
          label="Toggle Verified"
          name="verified"
          labelPosition="right"
          onClick={updateMapData}
        />
        <GHCheckboxList onClick={updateMapData} showSVGs groupsChecked={currentLayers} />
        <RaisedButton label="Reset Filters" primary onClick={resetMapData} />
      </form>
    </div>
  );
};

SideMenu.propTypes = {
  updateMapData: PropTypes.func.isRequired,
  resetMapData: PropTypes.func.isRequired,
  currentLayers: PropTypes.instanceOf(Set).isRequired,
};

export default SideMenu;
