import React from 'react';
import PropTypes from 'prop-types';

import ghFilters from '../../globals/ghFilters';
import './GHCheckboxList.css';

const GHCheckboxList = ({ onClick }) => {
  const labels = ghFilters.map(({
    name,
    label,
    key,
    color,
  }) => (
    <label key={key}>
      <input type="checkbox" name={name} onClick={onClick} />
      {label}
      <svg height="12" width="12">
        <circle cx="6" cy="6" r="6" stroke="white" opacity="1" id="meeting" fill={color} />
      </svg>
    </label>
  ));
  return (
    <div className="ghCheckboxList">
      <h4 className="ghCheckboxList__header">Filter By Type</h4>
      <form className="ghCheckboxList__form">
        {labels}
      </form>
    </div>
  );
};

GHCheckboxList.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default GHCheckboxList;
