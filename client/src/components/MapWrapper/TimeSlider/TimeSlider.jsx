import React from 'react';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import './TimeSlider.css'

const TimeSlider = (props) => {
    const { filterTime } = props;
    return (
        <div id="timeslider">
            <Nouislider
                behaviour="tap-drag"
                connect
                range={{
                    min: 2015,
                    max: 2022,
                }}
                direction="ltr"
                pips={
                    {
                        mode: 'count',
                        values: 8,
                        density: 14,
                    }
                }
                clickablePips
                step={1}
                start={[2015, 2022]}
                onUpdate={(render, handle, value, un, percent) => {
                    filterTime(value);
                }} // eslint-disable-line no-unused-vars 
            />
        </div>
    )
}

/* Color Control Notes
- the style prop does nothing for the slider
- nouislider docs themselves suggest using css classes to override styling
*/

export default TimeSlider;