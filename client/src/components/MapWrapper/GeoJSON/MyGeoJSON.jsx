import React, { useEffect } from 'react';

import { GeoJSON } from 'react-leaflet';

class MyGeoJSON extends React.Component {

	constructor(props) {
		super(props);
		// state
	}

	shouldComponentUpdate(nextProps) {
		// never want to rerender...
	    return false;
	}

	render() {
		return (
			<GeoJSON {...this.props} />
		)
	}
}

export default MyGeoJSON;