import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOM from 'react-dom';
import './MapBar.css';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const MapBar = (props) => {
  const map = useMap();

  const createLeafletElement = () => {
    const jsx = (
      <div className="map-bar">
        <ToggleButtonGroup
          exclusive
          onChange={props.changeRegion}
          aria-label="region display"
        >
          <ToggleButton value={1} aria-label="continental usa">
            Continental USA
          </ToggleButton>
          <ToggleButton value={2} aria-label="alaska">
            Alaska
          </ToggleButton>
          <ToggleButton value={3} aria-label="hawaii">
            Hawaii
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    );

    const mapbar = L.Control.extend({
      onAdd: (map) => {
        const div = L.DomUtil.create('div', '');
        ReactDOM.render(jsx, div);
        return div;
      },
    });

    return new mapbar({ position: 'bottomleft' });
  }

  useEffect(() => {
    const control = createLeafletElement();
    control.addTo(map);
  }, [])

  return null;
}

export default MapBar;