import { MapControl, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import './Legend.css';

class Legend extends MapControl {
	createLeafletElement(props) {
		const getColor = d => {
			// TODO: take these colors from/to data_utils
			return d < 22 ? "#f2f0f7"
			: d < 28 ? "#cbc9e2"
			: d < 45 ? "#9e9ac8"
			: d < 75 ? "#756bb1"
			: d < 227 ? "#54278f"
			: "#cccccc";
	    };

	    const legend = L.Control.extend({
	    	onAdd: (map) => {
			   	const div = L.DomUtil.create("div", "info legend");
				const grades = [0, 22, 28, 45, 75, 227];
				let labels = [];
				let from;
				let to;

				for (let i = 0; i < grades.length-1; i++) {
				  from = grades[i];
				  to = grades[i + 1];

				  labels.push(
				    '<i style="background:' +
				      getColor(from + 1) +
				      '"></i> ' +
				      from + "&ndash;" + to
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