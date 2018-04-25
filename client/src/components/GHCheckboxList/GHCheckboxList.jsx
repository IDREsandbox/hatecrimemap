import React from 'react';
import PropTypes from 'prop-types';

import ghFilters from '../../globals/ghFilters';
import './GHCheckboxList.css';

const GHCheckboxList = ({ onClick, showSVGs }) => {
  const labels = ghFilters.map(({
    name,
    label,
    key,
    color,
  }) => (
    <label key={key}>
      <input type="checkbox" name={name} onClick={onClick} />
      {label}
      {showSVGs &&
        <svg height="12" width="12">
          <circle cx="6" cy="6" r="6" stroke="white" opacity="1" id="meeting" fill={color} />
        </svg>}
    </label>
  ));
  return (
    <div className="ghCheckboxList">
      {labels}
    </div>
  );
};

GHCheckboxList.defaultProps = {
  showSVGs: false,
};

GHCheckboxList.propTypes = {
  onClick: PropTypes.func.isRequired,
  showSVGs: PropTypes.bool,
};

export default GHCheckboxList;
