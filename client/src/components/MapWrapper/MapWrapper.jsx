import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';

import { getSourceLI } from '../../utils/utilities';
import './MapWrapper.css';
// import { counties } from './counties/statecounties.js';
import { states } from './states.js';

function eachState(feature, layer, statetotals, total, update) {
  if(statetotals[feature.properties.NAME] && statetotals[feature.properties.NAME].sum_harassment > 0) {
    // layer.bindPopup('<h3>' + feature.properties.NAME+ '</h3>' +
      // '<p><strong>Total Harassment: </strong>' + feature.properties.sum_harassment + '</p>');
    layer.on('mouseover', function(event){
      // console.log(event,layer);
      // layer.openPopup();
      update(feature.properties.NAME);
      layer._path.classList.add("show-state");
      layer.setStyle({fillColor: 'rgb(100, 100, 100)'});
      // console.log(layer);
    });
    layer.on('mouseout', function(event){
      // layer.closePopup();
      layer._path.classList.remove("show-state");
      layer.setStyle({stroke: 0, fillColor: `rgb(255, ${150-gradient}, ${150-gradient})`, fillOpacity: 0.75});
      update("none");
    });
    const gradient = 750 * (statetotals[feature.properties.NAME].sum_harassment/total);
    layer.setStyle({stroke: 0, fillColor: `rgb(255, ${150-gradient}, ${150-gradient})`, fillOpacity: 0.75});
  } else {
    layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
  }
}

const MapWrapper = ({ statetotals, updateDisplay, zoom }) => {
  // const mapCenter = [35, -120];
  const mapCenter = [38, -95];
  const totalHarassment = Object.keys(statetotals).map(state => statetotals[state].sum_harassment).reduce((prev, curr) => prev + curr);

  // const markerItems = mapdata.map((markerItemData) => {
  //   const {
  //     lat,
  //     lon,
  //     id,
  //     reporttype,
  //     groupsharassed,
  //     locationname,
  //     sourceurl,
  //     validsourceurl,
  //     waybackurl,
  //     validwaybackurl,
  //   } = markerItemData;
  //   const markerCenter = [Number(lat), Number(lon)];
  //   const color = markerItemData.color || 'blue';
  //   const source = getSourceLI(sourceurl, validsourceurl, waybackurl, validwaybackurl);
  //   return (
  //     <CircleMarker color={color} key={id} center={markerCenter} radius={2}>
  //       <Popup>
  //         <div>
  //           <h3>{reporttype}</h3>
  //           <ul>
  //             <li>{groupsharassed}</li>
  //             <li>{locationname}</li>
  //             {source}
  //           </ul>
  //         </div>
  //       </Popup>
  //     </CircleMarker>
  //   );
  // });

  return (
    <Map id="MapWrapper" center={mapCenter} zoom={zoom}>
      <TileLayer
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
      />
      {/*markerItems*/}
      {/*   counties.map(state => <GeoJSON data={state} /> ) */}     
      <GeoJSON data={states} onEachFeature={(feature, layer) => eachState(feature, layer, statetotals, totalHarassment, updateDisplay)} />
    </Map>
  );
};

MapWrapper.propTypes = {
  // mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
  zoom: PropTypes.number.isRequired,
};

export default MapWrapper;