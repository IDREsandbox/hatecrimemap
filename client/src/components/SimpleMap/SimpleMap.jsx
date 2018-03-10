import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

export default class SimpleMap extends Component {
  constructor(props) {
    super(props);
    const { x, y } = this.props.mapdata[0];
    this.state = {
      x: Number(y),
      y: Number(x),
      zoom: 8,
    };
  }

  render() {
    const { x, y, zoom } = this.state;
    const position = [x, y];
    return (
      <Map id="mapContainer" center={position} zoom={zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <span>
              This is the first reported point from the database!
            </span>
          </Popup>
        </Marker>
      </Map>
    );
  }
}

SimpleMap.propTypes = {
  mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
};
