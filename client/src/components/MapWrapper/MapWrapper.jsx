import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';

import { getSourceLI } from '../../utils/utilities';
import './MapWrapper.css';
// import { counties } from './counties/statecounties.js';
import { states } from './states.js';

function eachState(feature, layer) {
  if(feature.properties && feature.properties.NAME && feature.properties.sum_harassment) {
    layer.bindPopup('<h3>' + feature.properties.NAME+ '</h3>' +
      '<p><strong>Total Harassment: </strong>' + feature.properties.sum_harassment + '</p>');
    layer.on('mouseover', function(event){
      console.log(event,layer);
      layer.openPopup();
    });
    layer.on('mouseout', function(event){
      layer.closePopup();
    });
  } else {
    layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
  }
}

const MapWrapper = ({ mapdata, statesdata, zoom }) => {
  // const statesWithData = {"features": statesdata.map((eachState,index) => Object.assign(states.features[index].properties, eachState)), ...states};
  
  const statesWithData = {...states, features: states.features.map((eachFeature, index) => ({...eachFeature, properties: Object.assign({}, eachFeature.properties, statesdata[index])}))}
  const mapCenter = [35, -120];
  // const countyLines = counties_ca['features'].map((county) => <GeoJSON data={county} />);

  // const states = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  // const stateAbrv = ['al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'dc', 'fl', 'ga', 'hi', 'id', 'il', 'in', 'ia',
  // 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny',
  // 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi',
  // 'wy', 'as', 'gu', 'mp', 'pr', 'vi']

  const markerItems = mapdata.map((markerItemData) => {
    const {
      lat,
      lon,
      id,
      reporttype,
      groupsharassed,
      locationname,
      sourceurl,
      validsourceurl,
      waybackurl,
      validwaybackurl,
    } = markerItemData;
    const markerCenter = [Number(lat), Number(lon)];
    const color = markerItemData.color || 'blue';
    const source = getSourceLI(sourceurl, validsourceurl, waybackurl, validwaybackurl);
    return (
      <CircleMarker color={color} key={id} center={markerCenter} radius={2}>
        <Popup>
          <div>
            <h3>{reporttype}</h3>
            <ul>
              <li>{groupsharassed}</li>
              <li>{locationname}</li>
              {source}
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
      {/*   counties.map(state => <GeoJSON data={state} /> ) */}     
      <GeoJSON data={statesWithData} onEachFeature={eachState} />
    </Map>
  );
};

MapWrapper.propTypes = {
  mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
  zoom: PropTypes.number.isRequired,
};

export default MapWrapper;