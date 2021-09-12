import React, { useEffect } from 'react';

import { GeoJSON } from 'react-leaflet';

const MyGeoJSON = (props) => {

	return <GeoJSON
		    data={props.geojson}
		    style={props.style}
		    /* style is mutable in react-leaflet 3.2.1, so this would override eventHandlers changing the hover color. This only works now because of React.memo() below */
		    eventHandlers={props.eventHandlers}
		  />
};

const rerenderWhen = (prevProps, props) => prevProps.datalen === props.datalen;
export default React.memo(MyGeoJSON, rerenderWhen);
