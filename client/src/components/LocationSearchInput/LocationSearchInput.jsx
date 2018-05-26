import React from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete from 'react-places-autocomplete';
import TextField from 'material-ui/TextField';

import './LocationSearchInput.css';

const LocationSearchInput = props => (
  <PlacesAutocomplete
    value={props.value}
    onChange={props.onChange}
    onSelect={props.onSelect}
  >
    {({ getInputProps, suggestions, getSuggestionItemProps }) => (
      <div>
        <TextField
          {...getInputProps({
            name: props.name,
            placeholder: 'Enter location',
            underlineShow: props.underlineShow,
            errorText: props.errorText,
          })}
        />
        <div className="locationSearchInput__menu">
          {suggestions.map((suggestion) => {
            const style = suggestion.active
              ? { backgroundColor: '#fafafa', cursor: 'pointer' }
              : { backgroundColor: '#ffffff', cursor: 'pointer' };
            return (
              <div className="locationSearchInput__menu__item" {...getSuggestionItemProps(suggestion, { style })}>
                <span>{suggestion.description}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </PlacesAutocomplete>
);

LocationSearchInput.defaultProps = {
  underlineShow: true,
  errorText: '',
};

LocationSearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  underlineShow: PropTypes.bool,
  errorText: PropTypes.string,
};

export default LocationSearchInput;
