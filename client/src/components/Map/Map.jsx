import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

export default class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 51.505,
      y: -0.09,
      zoom: 13,
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
              A pretty CSS3 popup. <br /> Easily customizable.
            </span>
          </Popup>
        </Marker>
      </Map>
    );
  }
}
