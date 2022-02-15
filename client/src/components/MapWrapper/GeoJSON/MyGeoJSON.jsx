import React from 'react';
import { GeoJSON } from 'react-leaflet';

const MyGeoJSON = (props) => {
  console.log(props)
  return (<GeoJSON
    data={props.geojson}
    style={props.style}
    /* style is mutable in react-leaflet 3.2.1, so this would override eventHandlers changing the hover color. This only works now because of React.memo() below */
    eventHandlers={props.eventHandlers}
    key={props.key}
  />)
}

function rerenderWhen(prevProps, newProps) {
  return prevProps.datalen === newProps.datalen;
}

export default React.memo(MyGeoJSON, rerenderWhen);
// React.memo makes it so that this GeoJson component only rerenders upon prop changes
// So without the React.memo, the style wouldn't change or would just rechange immediately since style is mutable
