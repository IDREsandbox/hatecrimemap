import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOM from 'react-dom';
import './MapBar.css';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

/*
 * Values gotten from previously HomePage.jsx::changeViewRegion calling on getBounds()
 * Can tweak these values as fit
 */

const usaBounds = [[49.384358, -65.221568], [17.926875, -124.733174]];
const alaskaBounds = [[73.3658309, -125.0627281], [49.2065921, -184.0641229]];
const hawaiiBounds = [[23.891022, -152.0892635], [17.259614, -162.9697255]];

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
          <ToggleButton value={usaBounds} aria-label="continental usa">
            Continental USA
          </ToggleButton>
          <ToggleButton value={alaskaBounds} aria-label="alaska">
            Alaska
          </ToggleButton>
          <ToggleButton value={hawaiiBounds} aria-label="hawaii">
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