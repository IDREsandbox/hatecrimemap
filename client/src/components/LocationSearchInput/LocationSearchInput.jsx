import React from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete from 'react-places-autocomplete';
import TextField from 'material-ui/TextField';

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
            placeholder: 'Search Places ...',
          })}
        />
        <div>
          {suggestions.map((suggestion) => {
            const style = suggestion.active
              ? { backgroundColor: '#fafafa', cursor: 'pointer' }
              : { backgroundColor: '#ffffff', cursor: 'pointer' };
            return (
              <div {...getSuggestionItemProps(suggestion, { style })}>
                <span>{suggestion.description}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </PlacesAutocomplete>
);

LocationSearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default LocationSearchInput;
