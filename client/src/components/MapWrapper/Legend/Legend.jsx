import { MapControl, withLeaflet } from 'react-leaflet';
import L from 'leaflet';

class Legend extends MapControl {
	createLeafletElement(props) {
   }
   componentDidMount() {
      // place your code here

      const legend = L.control({position: "bottomright"});

      const { map } = this.props.leaflet;
      legend.addTo(map);
   }

   
}

export default withLeaflet(Legend);