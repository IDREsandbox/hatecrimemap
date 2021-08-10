import { MapControl, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import './Legend.css';

class Legend extends MapControl {
  createLeafletElement(props) {
    const getColor = (d) => {
      // REFERENCE: data-utils.js::hashStateColor()
      if(d < props.max/10) return props.colors[0];
      else if(d < props.max/8) return props.colors[1];
      else if(d < props.max/5) return props.colors[2];
      else if(d < props.max/3) return props.colors[3];
      else if(d < props.max + 1) return props.colors[4];
    }

    const ranges = [
        0,
        Math.floor(props.max/10),
        Math.floor(props.max/8),
        Math.floor(props.max/5),
        Math.floor(props.max/3),
        Math.floor(props.max + 1)
    ]

    const legend = L.Control.extend({
      onAdd: (map) => {
        const div = L.DomUtil.create('div', 'info legend');

        const labels = [];
        if (props.hasNone) {
          labels.push('<i style="background:"#cccccc"' + '"></i> None');
        }

        for (let i = 0; i < ranges.length - 1; i++) {
          let start = ranges[i];
          let end = ranges[i+1];
          labels.push(
            `<i style="background:${getColor(
              start + 1,
            )}"></i> ${start}&ndash;${end}`,
          );
        }

        const header = '<p><strong>Cases per state</strong></p>';

        div.innerHTML = header + labels.join('<br>');
        return div;
      },
    });

    return new legend({ position: 'bottomright' });
  }
}

export default withLeaflet(Legend);
