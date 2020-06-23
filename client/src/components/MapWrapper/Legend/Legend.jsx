import { MapControl, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import './Legend.css';

class Legend extends MapControl {
	createLeafletElement(props) {
		const getColor = d => {
	      return d > 1000
	        ? "#800026"
	        : d > 500
	        ? "#BD0026"
	        : d > 200
	        ? "#E31A1C"
	        : d > 100
	        ? "#FC4E2A"
	        : d > 50
	        ? "#FD8D3C"
	        : d > 20
	        ? "#FEB24C"
	        : d > 10
	        ? "#FED976"
	        : "#FFEDA0";
	    };

	    const legend = L.Control.extend({
	    	onAdd: (map) => {
			   	const div = L.DomUtil.create("div", "info legend");
				const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
				let labels = [];
				let from;
				let to;

				for (let i = 0; i < grades.length; i++) {
				  from = grades[i];
				  to = grades[i + 1];

				  labels.push(
				    '<i style="background:' +
				      getColor(from + 1) +
				      '"></i> ' +
				      from +
				      (to ? "&ndash;" + to : "+")
				  );
				}

				div.innerHTML = labels.join("<br>");
				return div;
		    }
	    })

	    return new legend({ position: "bottomright" });
	}

   
}

export default withLeaflet(Legend);