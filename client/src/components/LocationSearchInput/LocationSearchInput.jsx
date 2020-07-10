import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PlacesAutocomplete from 'react-places-autocomplete';
import TextField from '@material-ui/core/TextField';

import './LocationSearchInput.css';

const styles = theme => ({
  textField: {
    margin: theme.spacing.unit,
    width: 200,
  },
});

const LocationSearchInput = ({ value, onChange, onSelect, classes, name, errorText }) => (
  <PlacesAutocomplete
    value={value}
    onChange={onChange}
    onSelect={onSelect}
  >
    {({ getInputProps, suggestions, getSuggestionItemProps }) => (
      <div>
        <TextField
          {...getInputProps({
            className: classes.textField,
            name,
            placeholder: 'Enter location',
            error: errorText !== '',
            label: errorText,
          })}
        />
        <div className="locationSearchInput__menu">
          {suggestions.map((suggestion) => {
            const style = suggestion.active
              ? { backgroundColor: '#fafafa', cursor: 'pointer' }
              : { backgroundColor: '#ffffff', cursor: 'pointer' };
            return (
              <div key={suggestion.description} className="locationSearchInput__menu__item" {...getSuggestionItemProps(suggestion, { style })}>
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
  errorText: '',
};

LocationSearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  errorText: PropTypes.string,
};

export default withStyles(styles)(LocationSearchInput);
