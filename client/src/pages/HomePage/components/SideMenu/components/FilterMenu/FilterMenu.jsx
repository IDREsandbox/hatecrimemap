import React from 'react';
import PropTypes from 'prop-types';

import filterMethods from './services';
import './FilterMenu.css';

const FilterMenu = ({ updateMapData }) => {
  const labels = filterMethods.map(({ name, label, key }) => (
    <label key={key}>
      <input type="checkbox" name={name} onClick={updateMapData} />
      {label}
    </label>
  ));
  return (
    <div className="filterMenu">
      <h4 className="filterMenu__header">Filter By Type</h4>
      <form className="filterMenu__form">
        {labels}
      </form>
    </div>
  );
};

FilterMenu.propTypes = {
  updateMapData: PropTypes.func.isRequired,
};

export default FilterMenu;
