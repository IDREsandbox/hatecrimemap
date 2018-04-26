import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, CircleMarker, Popup } from 'react-leaflet';

import './MapWrapper.css';

const MapWrapper = ({ mapdata, zoom }) => {
  const mapCenter = [38, -100];
  const markerItems = mapdata.map((markerItemData) => {
    const {
      lat,
      lon,
      featureid,
      reporttype,
      groupharassedcleaned,
      locationname,
      verified,
      sourceurl,
      validsourceurl,
    } = markerItemData;
    const markerCenter = [lat, lon];
    const color = markerItemData.color || 'blue';
    const isValidSourceUrl = validsourceurl === 'true'
      ? 'Source is valid'
      : 'Source is not valid';
    return (
      <CircleMarker color={color} key={featureid} center={markerCenter} radius={2}>
        <Popup>
          <div>
            <h3>{reporttype}</h3>
            <ul>
              <li>{groupharassedcleaned}</li>
              <li>{locationname}</li>
              <li>{`Verified: ${verified}`}</li>
              <li><a href={sourceurl} target="_blank">Source</a></li>
              <li>{isValidSourceUrl}</li>
            </ul>
          </div>
        </Popup>
      </CircleMarker>
    );
  });

  return (
    <Map id="MapWrapper" center={mapCenter} zoom={zoom}>
      <TileLayer
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
      />
      {markerItems}
    </Map>
  );
};

MapWrapper.propTypes = {
  mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
  zoom: PropTypes.number.isRequired,
};

export default MapWrapper;
