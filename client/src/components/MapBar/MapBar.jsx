import React from 'react';
import { MapControl, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import ReactDOM from 'react-dom';
import './MapBar.css';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


class MapBar extends MapControl {
  createLeafletElement(props) {
    const jsx = (
      <div className="map-bar">
        <ToggleButtonGroup
          exclusive
          onChange={props.changeRegion}
          aria-label="region display"
        >
          <ToggleButton value={1} aria-label="central usa">
            Center
          </ToggleButton>
          <ToggleButton value={2} aria-label="alaska">
            Alaska
          </ToggleButton>
          <ToggleButton value={3} aria-label="hawaii">
            Hawaii
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    )

    const mapbar = L.Control.extend({
      onAdd: (map) => {
        const div = L.DomUtil.create("div", '');
        ReactDOM.render(jsx, div);
        return div;
      }
    })

    return new mapbar({ position: "bottomleft" });
  }

   
}

// MapBar.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withLeaflet(MapBar);