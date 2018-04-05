import React from 'react';
import PropTypes from 'prop-types';

import ghFilters from '../../utils/ghFilters';
import './FilterMenu.css';

const colors = ['red', '#DFCFBE', '#55B4B0', '#E15D44', '#7FCDCD', '#BC243C'];

const FilterMenu = ({ updateMapData }) => {
  const labels = ghFilters.map(({ name, label, key }, i) => (
    <label key={key}>
      <input type="checkbox" name={name} onClick={updateMapData} />
      {label}
      <svg height="12" width="12">
        <circle cx="6" cy="6" r="6" stroke="white" opacity="1" id="meeting" fill={colors[i % 6]} />
      </svg>
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
