import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';

import { getSourceLI } from '../../utils/utilities';
import './MapWrapper.css';
// import { counties } from './counties/statecounties.js';
import { states } from './states.js';

const colorBins = [0, 50, 75, 100, 120];
var lockedLayer = null;
var lockedLayerColor = null;

function eachState(feature, layer, statetotals, total, setStateDisplay) {
  if(statetotals[feature.properties.NAME] && statetotals[feature.properties.NAME].sum_harassment > 0) {
    // const colorHashed = colorBins[Math.floor((5*statetotals[feature.properties.NAME].sum_harassment-1)/total)];
    let colorHashed = 0;
    if(statetotals[feature.properties.NAME].sum_harassment < total/10) colorHashed = colorBins[0];
    else if(statetotals[feature.properties.NAME].sum_harassment < total/8) colorHashed = colorBins[1];
    else if(statetotals[feature.properties.NAME].sum_harassment < total/6) colorHashed = colorBins[2];
    else if(statetotals[feature.properties.NAME].sum_harassment < total/4) colorHashed = colorBins[3];
    else if(statetotals[feature.properties.NAME].sum_harassment < total + 1) colorHashed = colorBins[4];
    layer.on('mouseover', function(event){
      if(!setStateDisplay(feature.properties.NAME)) return;  // setStateDisplay() will return false if we're locked onto something else
      // layer._path.classList.add("show-state");
      layer.setStyle({fillColor: 'rgb(200, 200, 200)'});
    });
    layer.on('mouseout', function(event){
      if(!setStateDisplay("none")) return;
      // layer._path.classList.remove("show-state");
      layer.setStyle({fillColor: `rgb(255, ${150-colorHashed}, ${150-colorHashed})`});
    });
    layer.on('click', function(event) {
      if(lockedLayer) {
        lockedLayer.setStyle({fillColor: `rgb(255, ${lockedLayerColor}, ${lockedLayerColor})`});
        layer.setStyle({fillColor: `rgb(100, 100, 100)`});
        if(lockedLayer === layer) {
          setStateDisplay("none", true);
          return;
        }
      }
      setStateDisplay(feature.properties.NAME, true);  // true parameter for locking


      lockedLayerColor = 150-colorHashed;
      lockedLayer = layer;
    });
    layer.setStyle({stroke: 0.5, color: 'white', fillColor: `rgb(255, ${150-colorHashed}, ${150-colorHashed})`, fillOpacity: 0.75});
  } else {
    layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
  }
}

function unlockLayer(e, setStateDisplay) {
  // console.log(e,setStateDisplay);  // need to check if e.originalEvent.path is a geoJson or a blank spot
  // if(lockedLayer) {
  //   lockedLayer.setStyle({fillColor: `rgb(255, ${lockedLayerColor}, ${lockedLayerColor})`});
  //   setStateDisplay("none");
  //   lockedLayer = null;
  //   lockedLayerColor = null;
  // }
}

const MapWrapper = ({ statetotals, updateDisplay, zoom }) => {
  // const mapCenter = [35, -120];
  const mapCenter = [38, -95];
  const totalHarassment = Object.keys(statetotals).map(state => statetotals[state].sum_harassment).reduce((prev, curr) => prev + curr);
  const maxHarassment = Object.keys(statetotals).map(state => statetotals[state].sum_harassment).reduce((prev, curr) => curr > prev ? curr : prev);
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
      <GeoJSON data={states} onEachFeature={(feature, layer) => eachState(feature, layer, statetotals, maxHarassment, updateDisplay)} />
    </Map>
  );
};

MapWrapper.propTypes = {
  // mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
  zoom: PropTypes.number.isRequired,
};

export default MapWrapper;