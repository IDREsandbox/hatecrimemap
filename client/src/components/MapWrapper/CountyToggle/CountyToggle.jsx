import React, { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const CountyToggle = (props) => {
  const map = useMap();

  useMapEvents({
    zoomend: (e) => {
      const z = e.target.getZoom();
      props.updateZoom(z);
      if (props.zoom < 6 && z >= 6) {
        map.getPane('states').style.display = 'none';
        map.getPane('counties').style.display = 'block';
      } else if (props.zoom >= 6 && z < 6) {
        map.getPane('states').style.display = 'block';
        map.getPane('counties').style.display = 'none';
      }
    }
  })

  return null;
}

export default CountyToggle;
