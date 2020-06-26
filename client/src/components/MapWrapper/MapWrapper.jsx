import React from 'react';
import { Map, TileLayer, MapControl } from 'react-leaflet';
import { Rectangle, GeoJSON } from 'react-leaflet';
import { usa } from '../../res/usa.js';
import Legend from './Legend/Legend';
import './MapWrapper.css';
import { states_usa } from '../../res/states.js';
import { states_alaska } from '../../res/alaska.js';
import { states_hawaii } from '../../res/hawaii.js';
import { eachState } from '../../utils/data-utils';


// move to map res utils
const usaCentre = [38., -96.], usaBounds = [[18., -135.], [52., -60.]];
const alaskaCentre = [64., -150.], alaskaBounds = [[34., -110.], [94., -190.]];
const hawaiiCentre = [20., -155.], hawaiiBounds = [[0., -170.], [40., -135.]];
const worldBounds = [[-90., -180.], [90., 180.]]
const MapWrapper = (props) => {

  return (
    <div id="MapWrapper">

      <Map id="USA" ref={props.mapRef} maxBounds={worldBounds} minZoom={2} zoomSnap={0.25} center={usaCentre} zoom={4.5}>
        <TileLayer bounds={worldBounds} attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="http://c.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png" />
          <Rectangle bounds={worldBounds} stroke={false} fillOpacity="0" onClick={() => props.updateState("none", true)} />
          <GeoJSON ref={props.statesRef} data={states_usa} onAdd={() => props.updateView(0, 1)} onEachFeature={(feature, layer) => eachState(feature, layer, props.data.states, 100, props.updateState)} />
          <GeoJSON ref={props.alaskaRef} data={states_alaska} onEachFeature={(feature, layer) => eachState(feature, layer, props.data.states, 100, props.updateState)} />
          <GeoJSON ref={props.hawaiiRef} data={states_hawaii} onEachFeature={(feature, layer) => eachState(feature, layer, props.data.states, 100, props.updateState)} />
          <GeoJSON data={usa} onEachFeature={(feature, layer) => { layer.setStyle({stroke: 0.3, color: '#777777'})}} />
        <Legend />
        {props.children}
      </Map>
    </div>
  );
};

MapWrapper.propTypes = {
  // mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
  // zoom: PropTypes.function.isRequired,
};
//https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png
export default MapWrapper;