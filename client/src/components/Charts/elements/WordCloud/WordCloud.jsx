import React from 'react';
import { takeTop } from 'utils/chart-utils';

import Grid from '@material-ui/core/Grid';
import { Resizable } from "re-resizable";
import ReactWordcloud from 'react-wordcloud';


const options = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  enableTooltip: true,
  deterministic: false,
  fontFamily: "impact",
  fontSizes: [12, 30],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 0],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000
};

const callbacks = {};

const resizeStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const WordCloud = (props) => {

  return ( 
    <Grid container item justify="center" xs={6}>
      <h4>Word Cloud</h4>
      <Resizable
        defaultSize={{
          width: 200,
          height: 200
        }}
        style={resizeStyle}
      >                
        <div style={{ height: "100%", width: "100%" }}>
          <ReactWordcloud
            callbacks={callbacks}
            options={options}
            // size={size}
            words={props.words}
            // words={wordCloudData}                    
          />
        </div>
      </Resizable>
    </Grid>
  )
}

export default WordCloud;