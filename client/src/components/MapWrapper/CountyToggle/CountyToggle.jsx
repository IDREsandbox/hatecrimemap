import React, { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const CountyToggle = (props) => {
  const map = useMap();

  // Controls seem to be immutable, i.e. props are in a closure so that values passed in do not update
  // Therefore, zoom is a method that should return the latest HomePage's state's zoom

  useMapEvents({
    zoomend: (e) => {
      const z = e.target.getZoom();
      if (props.zoom() < 6 && z >= 6) {
        map.getPane('states').style.display = 'none';
        map.getPane('counties').style.display = 'block';
      } else if (props.zoom() >= 6 && z < 6) {
        map.getPane('states').style.display = 'block';
        map.getPane('counties').style.display = 'none';
      }
      props.updateZoom(z);
    }
  })

  return null;
}

export default CountyToggle;
