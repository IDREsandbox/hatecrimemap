import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, CircleMarker, Popup } from 'react-leaflet';

export default class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapdata: this.props.mapdata,
      zoom: 3,
    };
  }

  render() {
    const { mapdata, zoom } = this.state;
    const mapCenter = [20.28, 15.85];
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
  }
}

MapContainer.propTypes = {
  mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
};
