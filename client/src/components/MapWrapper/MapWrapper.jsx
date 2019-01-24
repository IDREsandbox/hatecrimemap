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
  
  const statesWithData = {...states, features: states.features.map((eachFeature, index) => ({...eachFeature, properties: Object.assign({}, eachFeature.properties, fauxData[index])}))}
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

const fauxData = [
        {
            "name": "North Dakota",
            "sum_harassment": 4,
            "jewish_harassed_total": 0
        },
        {
            "name": "Oklahoma",
            "sum_harassment": 19,
            "jewish_harassed_total": 1
        },
        {
            "name": "Pennsylvania",
            "sum_harassment": 37,
            "jewish_harassed_total": 8
        },
        {
            "name": "South Dakota",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "Texas",
            "sum_harassment": 25,
            "jewish_harassed_total": 0
        },
        {
            "name": "Tennessee",
            "sum_harassment": 6,
            "jewish_harassed_total": 0
        },
        {
            "name": "Missouri",
            "sum_harassment": 14,
            "jewish_harassed_total": 2
        },
        {
            "name": "West Virginia",
            "sum_harassment": 2,
            "jewish_harassed_total": 0
        },
        {
            "name": "Arkansas",
            "sum_harassment": 1,
            "jewish_harassed_total": 0
        },
        {
            "name": "California",
            "sum_harassment": 114,
            "jewish_harassed_total": 19
        },
        {
            "name": "Oregon",
            "sum_harassment": 9,
            "jewish_harassed_total": 1
        },
        {
            "name": "Virginia",
            "sum_harassment": 15,
            "jewish_harassed_total": 2
        },
        {
            "name": "Washington",
            "sum_harassment": 15,
            "jewish_harassed_total": 0
        },
        {
            "name": "Wisconsin",
            "sum_harassment": 8,
            "jewish_harassed_total": 0
        },
        {
            "name": "Nebraska",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "South Carolina",
            "sum_harassment": 1,
            "jewish_harassed_total": 0
        },
        {
            "name": "Puerto Rico",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "Idaho",
            "sum_harassment": 3,
            "jewish_harassed_total": 0
        },
        {
            "name": "Nevada",
            "sum_harassment": 1,
            "jewish_harassed_total": 0
        },
        {
            "name": "Vermont",
            "sum_harassment": 9,
            "jewish_harassed_total": 4
        },
        {
            "name": "Louisiana",
            "sum_harassment": 4,
            "jewish_harassed_total": 0
        },
        {
            "name": "Alabama",
            "sum_harassment": 1,
            "jewish_harassed_total": 0
        },
        {
            "name": "Alaska",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "Arizona",
            "sum_harassment": 4,
            "jewish_harassed_total": 0
        },
        {
            "name": "Florida",
            "sum_harassment": 11,
            "jewish_harassed_total": 1
        },
        {
            "name": "Georgia",
            "sum_harassment": 6,
            "jewish_harassed_total": 0
        },
        {
            "name": "Indiana",
            "sum_harassment": 15,
            "jewish_harassed_total": 3
        },
        {
            "name": "Colorado",
            "sum_harassment": 17,
            "jewish_harassed_total": 2
        },
        {
            "name": "Wyoming",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "Illinois",
            "sum_harassment": 15,
            "jewish_harassed_total": 1
        },
        {
            "name": "Connecticut",
            "sum_harassment": 5,
            "jewish_harassed_total": 0
        },
        {
            "name": "Guam",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "New Mexico",
            "sum_harassment": 6,
            "jewish_harassed_total": 1
        },
        {
            "name": "Delaware",
            "sum_harassment": 2,
            "jewish_harassed_total": 0
        },
        {
            "name": "District of Columbia",
            "sum_harassment": 13,
            "jewish_harassed_total": 0
        },
        {
            "name": "Hawaii",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "Iowa",
            "sum_harassment": 7,
            "jewish_harassed_total": 0
        },
        {
            "name": "Kentucky",
            "sum_harassment": 3,
            "jewish_harassed_total": 2
        },
        {
            "name": "Maryland",
            "sum_harassment": 33,
            "jewish_harassed_total": 8
        },
        {
            "name": "Michigan",
            "sum_harassment": 31,
            "jewish_harassed_total": 2
        },
        {
            "name": "Mississippi",
            "sum_harassment": 2,
            "jewish_harassed_total": 0
        },
        {
            "name": "Montana",
            "sum_harassment": 14,
            "jewish_harassed_total": 7
        },
        {
            "name": "New Hampshire",
            "sum_harassment": 7,
            "jewish_harassed_total": 0
        },
        {
            "name": "New York",
            "sum_harassment": 113,
            "jewish_harassed_total": 30
        },
        {
            "name": "Ohio",
            "sum_harassment": 13,
            "jewish_harassed_total": 1
        },
        {
            "name": "Utah",
            "sum_harassment": 5,
            "jewish_harassed_total": 0
        },
        {
            "name": "American Samoa",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "Commonwealth of the Northern Mariana Islands",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "United States Virgin Islands",
            "sum_harassment": 0,
            "jewish_harassed_total": 0
        },
        {
            "name": "Kansas",
            "sum_harassment": 6,
            "jewish_harassed_total": 0
        },
        {
            "name": "Maine",
            "sum_harassment": 2,
            "jewish_harassed_total": 0
        },
        {
            "name": "Massachusetts",
            "sum_harassment": 24,
            "jewish_harassed_total": 6
        },
        {
            "name": "Minnesota",
            "sum_harassment": 20,
            "jewish_harassed_total": 0
        },
        {
            "name": "New Jersey",
            "sum_harassment": 6,
            "jewish_harassed_total": 0
        },
        {
            "name": "North Carolina",
            "sum_harassment": 12,
            "jewish_harassed_total": 0
        },
        {
            "name": "Rhode Island",
            "sum_harassment": 2,
            "jewish_harassed_total": 0
        }
    ];