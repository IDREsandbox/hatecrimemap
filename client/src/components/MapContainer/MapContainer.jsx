import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, CircleMarker, Popup } from 'react-leaflet';

import './MapContainer.css';

const MapContainer = ({ mapdata, zoom }) => {
  const mapCenter = [38, -100];
  const markerItems = mapdata.map((markerItemData) => {
    const {
      lat,
      lon,
      featureid,
      reporttype,
      groupharassed,
      locationname,
      verified,
    } = markerItemData;
    const markerCenter = [Number(lat), Number(lon)];
    return (
      <CircleMarker key={featureid} center={markerCenter}>
        <Popup>
          <div>
            <h3>{reporttype}</h3>
            <ul>
              <li>{groupharassed}</li>
              <li>{locationname}</li>
              <li>{`Verified: ${verified}`}</li>
            </ul>
          </div>
        </Popup>
      </CircleMarker>
    );
  });

  return (
    <Map id="mapContainer" center={mapCenter} zoom={zoom}>
      <TileLayer
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerItems}
    </Map>
  );
};

MapContainer.propTypes = {
  mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
  zoom: PropTypes.number.isRequired,
};

export default MapContainer;
