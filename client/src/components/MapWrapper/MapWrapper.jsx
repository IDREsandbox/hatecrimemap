import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet';
import { usa } from '../../res/usa.js';

import './MapWrapper.css';

const MapWrapper = (props) => {
  const mapCenter = [38, -95];

  return (
    <Map id="MapWrapper" maxBounds={[[-90., -180.], [90., 180.]]} center={mapCenter} zoom={props.zoom()} minZoom={2} onZoomEnd={(e) => props.updateZoom(e.target._zoom)}>
      <TileLayer bounds={[[-90., -180.], [90., 180.]]} attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      url="http://c.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png" />
      {props.children}
      <GeoJSON data={usa} onEachFeature={(feature, layer) => { layer.setStyle({stroke: 0.3, color: '#777777'})}} />
    </Map>
  );
};

MapWrapper.propTypes = {
  // mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
  // zoom: PropTypes.function.isRequired,
};
//https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png
export default MapWrapper;