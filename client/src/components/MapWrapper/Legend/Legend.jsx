import { MapControl, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import './Legend.css';

class Legend extends MapControl {


	createLeafletElement(props) {
		// BEGIN: ghetto temporary fix for getting the numbers in ASAP..... need to refactor this
		let rangeValue1
		let rangeValue2
		let rangeValue3
		let rangeValue4
		let rangeValue5
		
		if (props.covid == 1){
			rangeValue1 = 272
			rangeValue2 = 341
			rangeValue3 = 545
			rangeValue4 = 909
			rangeValue5 = 2728
			
		}
		else{
			rangeValue1 = 22
			rangeValue2 = 28
			rangeValue3 = 45
			rangeValue4 = 75
			rangeValue5 = 227
		}
		// END: Ghetto method for getting the numbers


		const getColor = d => {
			// Done: take these colors from/to data_utils -- by AK 10/24/2020

			// TODO (Albert): Need to get the numbers from data_utils and not use ghetto method
			return d < rangeValue1 ? props.colors[0]
			: d < rangeValue2 ? props.colors[1]
			: d < rangeValue3 ? props.colors[2]
			: d < rangeValue4 ? props.colors[3]
			: d < rangeValue5 ? props.colors[4]
			: "#cccccc";
	    };

	    const legend = L.Control.extend({
	    	onAdd: (map) => {
				   const div = L.DomUtil.create("div", "info legend");
				   let grades;
				// BEGIN: Temporary fix for the legend categories being less than 5 for COVID    
				if (props.covid ==1){
					// covid only has 4 categories, so reducing them to 4
					grades = [0, rangeValue2, rangeValue3, rangeValue4, rangeValue5];
				}
				else{
					grades = [0,rangeValue1, rangeValue2, rangeValue3, rangeValue4, rangeValue5];

				}   
				// END: Temp fix.
				
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

				let header = '<p><strong>Cases per state</strong></p>'

				div.innerHTML = header + labels.join("<br>");
				return div;
		    }
	    })

	    return new legend({ position: "bottomright" });
	}

   
}

export default withLeaflet(Legend);