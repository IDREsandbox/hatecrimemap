import React, { useEffect } from 'react';

import { GeoJSON } from 'react-leaflet';

const MyGeoJSON = (props) => {

	let lockedLayer; // useState causes rerendering

	return <GeoJSON
		    data={props.geojson}
		    style={props.style}
		    /* style is mutable in react-leaflet 3.2.1, so this would override eventHandlers changing the hover color. This only works now because of React.memo() below */
		    eventHandlers={{
		      mouseover: ({layer}) => props.update && props.update(layer.feature.properties.NAME) && layer.setStyle({fillColor: 'rgb(200, 200, 200)'}),
		      mouseout: ({layer}) => props.update && props.update('none') && layer.setStyle({fillColor: layer.feature.properties.COLOR}),
		      click: ({layer}) => {
		      	if (!props.update) return;
		        props.update(layer.feature.properties.NAME, true);
		        if (lockedLayer) {
		          lockedLayer.setStyle({fillColor: lockedLayer.feature.properties.COLOR});
		          if (lockedLayer === layer) {
		            lockedLayer = null;
		            return;
		          }
		        }
		        layer.setStyle({fillColor: 'rgb(100, 100, 100)'});
		        lockedLayer = layer;
		      }
		    }}
		  />
};

const rerenderWhen = (prevProps, props) => prevProps.datalen === props.datalen;
export default React.memo(MyGeoJSON, rerenderWhen);
