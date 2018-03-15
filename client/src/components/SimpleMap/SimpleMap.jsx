import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, CircleMarker, Popup } from 'react-leaflet';

export default class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapdata: this.props.mapdata,
      zoom: 3,
    };
  }

  render() {
    const { mapdata, zoom } = this.state;
    const center = [20.28, 15.85];
    const markerItems = mapdata.map((pointObj, i) => {
      const position = [Number(pointObj.lat), Number(pointObj.lon)];
      return (
        <CircleMarker key={i} center={position}>
          <Popup>
            <div>
              <h3>{pointObj.report_type}</h3>
              <ul>
                <li>{pointObj.group_harassed}</li>
                <li>{pointObj.location_name}</li>
                <li>{`Verified: ${pointObj.verified}`}</li>
              </ul>
            </div>
          </Popup>
        </CircleMarker>
      );
    });
    return (
      <Map id="mapContainer" center={center} zoom={zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerItems}
      </Map>
    );
  }
}

SimpleMap.propTypes = {
  mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
};
