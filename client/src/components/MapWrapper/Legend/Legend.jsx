import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { hashColor } from '../../../utils/data-utils';
import './Legend.css';

const Legend = (props) => {
  const map = useMap();

  const createLeafletElement = () => {
    let max;
    if (props.displayType === 'state') max = props.maxState;
    else if (props.displayType === 'county') max = props.maxCounty;

    const getColor = (d) => hashColor(d, max, props.colors);

    // REFERENCE hashColor in data-utils
    const ranges = [
      0,
      Math.floor(max / 10),
      Math.floor(max / 8),
      Math.floor(max / 5),
      Math.floor(max / 3),
      Math.floor(max + 1),
    ];

    const LegendConstructor = L.Control.extend({
      onAdd: () => { // 'map' prop to this Leaflet function removed to satisfy eslint
        const div = L.DomUtil.create('div', 'info legend');

        const labels = [];
        if (props.hasNone) {
          labels.push('<i style="background:#cccccc"' + '"></i> None'); //eslint-disable-line
        }

        for (let i = 0; i < ranges.length - 1; i++) {
          const start = ranges[i];
          const end = ranges[i + 1];
          labels.push(
            `<i style="background:${getColor(
              start + 1,
            )}"></i> ${start}&ndash;${end}`,
          );
        }

        const header = `<p><strong>Cases per ${props.displayType}</strong></p>`;

        div.innerHTML = header + labels.join('<br>');
        return div;
      },
    });

    return new LegendConstructor({ position: 'bottomright' });
  };

  useEffect(() => {
    const control = createLeafletElement();
    control.addTo(map);
    return () => map.removeControl(control);
  }, [props.displayType, props.maxState, props.maxCounty]);

  return null;
};

export default Legend;
