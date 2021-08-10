import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

import {
  MapWrapper,
  SideMenu,
  CovidCharts,
  MapBar,
  Legend,
} from 'components';
import { getCovidData, resetStateColor, covidColors } from 'utils/data-utils';
import { wordCloudReducer, takeTop } from 'utils/chart-utils';

import './CovidPage.css';

export const MAP_DISPLAY = {
  USA: 1,
  ALASKA: 2,
  HAWAII: 3,
};

const styles = () => ({
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
  },
  dateRange: {
    'text-align': 'center',
    'margin-bottom': '15px',
  },
  footnotes: {},
});

let wordData = {};
let stateNames = {};

class CovidPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: MAP_DISPLAY.USA,
      zoom: 4,
      isFetching: true,
      currentDisplay: 'none',
      locked: false, // lock the sidebar on a state or county
    };
    this.statesRef = React.createRef();
    this.alaskaRef = React.createRef();
    this.hawaiiRef = React.createRef();
    this.mapRef = React.createRef();
  }

  async componentDidMount() {
    getCovidData().then((values) => {
      stateNames = Object.keys(values);
      wordData = {};
      Object.keys(values)
        .filter((state) => values[state] instanceof Object)
        .forEach(
          (state) => (wordData[state] = takeTop(
              values[state].children.reduce(wordCloudReducer, []),
            )),
        );
      this.setState({
        data: values,
        wordCloudData: wordData,
        isFetching: false,
      });
      // console.log(wordData);
    });
  }

  resetMapData = () => {};

  resetStateColors() {
    Object.values(
      this.statesRef.current.contextValue.layerContainer._layers,
    ).forEach((layer) => {
      if (layer.feature) {
        // only the states/counties have a feature
        // console.log(layer.feature);
        resetStateColor(layer, this.state.data, covidColors);
      }
    });
  }

  filterIncidents = (flt) => {
    this.setState({ currentFilter: flt }); // 'all' or 'published'
  };

  // Return value, success (in our terms, not react's)
  updateState = (state, lock = false) => {
    if (lock || !this.state.locked) {
      // lock parameter overrides current lock
      if (this.state.locked && state === 'none') this.resetStateColors(); // would like color-setting to be more declarative
      // but onEachFeature only executes to initialize, so color handling is all done within events (mouseon, mouseout, click)

      this.setState({
        currentDisplay: state,
        locked: lock && state !== 'none',
      }); // we never want to lock onto None
      return true;
    }
    return false;
  };

  updateCounty = (county, lock = false) => {
    if (lock) {
      this.setState({ currentDisplay: county, locked: county !== 'none' });
      return true;
    }
    if (!this.state.locked) {
      this.setState({ currentDisplay: county });
      return true;
    }
    return false;
  };

  changeViewRegion = (event, region) => {
    if (region !== null) {
      this.setState({ region }, () => {
        if (this.mapRef.current !== null && this.statesRef.current !== null) {
          let bounds;
          if (region == MAP_DISPLAY.ALASKA) {
            bounds = this.alaskaRef.current.leafletElement.getBounds().pad(0.1);
          } else if (region == MAP_DISPLAY.USA) {
            bounds = this.statesRef.current.leafletElement.getBounds();
          } else if (region == MAP_DISPLAY.HAWAII) {
            bounds = this.hawaiiRef.current.leafletElement.getBounds().pad(0.5);
          }
          this.mapRef.current.leafletElement.fitBounds(bounds);
        }
      });
    }
  };

  updateZoom = (z) => {
    this.setState({ zoom: z.target._zoom });
  };

  getZoom = () => this.state.zoom;

  filterTime = (time) => {};

  render() {
    const { isFetching } = this.state;
    const { classes } = this.props;

    if (isFetching) {
      return <CircularProgress className={classes.progress} />;
    }

    return (
      <div className="CovidPage">
        {/* <FirstTimeOverlay /> */}
        {/* TODO: context for mapdata and data.states? */}
        <MapWrapper
          region={this.state.region}
          updateState={this.updateState}
          zoom={this.getZoom}
          updateZoom={this.updateZoom}
          filterTime={this.filterTime}
          statesRef={this.statesRef}
          mapRef={this.mapRef}
          alaskaRef={this.alaskaRef}
          hawaiiRef={this.hawaiiRef}
          data={this.state.data}
          updateView={this.changeViewRegion}
          covid
        >
          <MapBar
            changeRegion={this.changeViewRegion}
            region={this.state.region}
          />
          <Legend colors={covidColors} covidFlag={true} />
        </MapWrapper>

        <div className="side">
          <SideMenu>
            <h2 className="sideMenu__header">
              {`COVID Hate Incidents in ${
              this.state.currentDisplay == 'none'
                ? 'US'
                : this.state.currentDisplay
            }`}
            </h2>
            {this.state.currentDisplay != 'none' ? (
              <div className={`sideMenu__info ${classes.dateRange}`}>
                <p>
                  {this.state.data[this.state.currentDisplay].children[0].date}
                  {' '}
                  -
                  {' '}
                  {
                    this.state.data[this.state.currentDisplay].children[
                      this.state.data[this.state.currentDisplay].children
                        .length - 1
                    ].date
                  }
                </p>
              </div>
            ) : (
              <div className="sideMenu__info">
              </div>
            )}
            <div className="sideMenu__chart">
              <CovidCharts
                data={this.state.data}
                currState={this.state.currentDisplay}
                max={this.state.data.groupMax}
                wordCloudData={this.state.wordCloudData}
              />
              <p className={classes.footnotes}>
                <em>
                  * Please note that this data includes a small number of
                  reports from witnesses of a different race than the victims.
                </em>
              </p>
            </div>
          </SideMenu>
        </div>
      </div>
    );
  }
}

CovidPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CovidPage);
