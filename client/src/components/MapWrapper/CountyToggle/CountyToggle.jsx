import React from 'react'; //eslint-disable-line
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; //eslint-disable-line

const CountyToggle = (props) => {
  const map = useMap();

  // Controls seem to be immutable, i.e. props are in a closure so that values passed in do not update
  // Therefore, zoom is a method that should return the latest HomePage's state's zoom

  useMapEvents({
    zoomend: (e) => {
      const z = e.target.getZoom();
      props.updateZoom(z, (displayType) => {
        if (displayType === 'county') {
          map.getPane('states').style.display = 'none';
          map.getPane('counties').style.display = 'block';
        } else if (displayType === 'state') {
          map.getPane('states').style.display = 'block';
          map.getPane('counties').style.display = 'none';
        }
      });
    },
  });

  return null;
};

export default CountyToggle;