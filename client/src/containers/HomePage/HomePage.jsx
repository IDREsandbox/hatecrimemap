import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Button, IconButton } from '@material-ui/core';

import { FirstTimeOverlay, MapWrapper, SideMenu, Charts, FilterBar, MapBar } from '../../components';
import { counties } from '../../res/counties/statecounties.js';
import { GeoJSON } from 'react-leaflet';
import { getAllData, eachStatesCounties, storeStateData, resetStateColor } from '../../utils/data-utils';

import './HomePage.css';

export const MAP_DISPLAY = {
  USA: 1,
  ALASKA: 2,
  HAWAII: 3
}

const styles = () => ({
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
  },
});

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: MAP_DISPLAY.USA,
      zoom: 4,
      isFetching: true,
      currentDisplay: 'none',
      currentFilter: 'published',
      locked: false, // lock the sidebar on a state or county
    };
    this.statesRef = React.createRef();
    this.alaskaRef = React.createRef();
    this.hawaiiRef = React.createRef();
    this.mapRef = React.createRef();
  }

  async componentDidMount() {
    getAllData().then(values => {
      this.setState({
        data: { states: storeStateData(values[0].result, values[2]),
                publishedStates: storeStateData(values[1].result, values[2])
                // we shouldn't add more api endpoints for filters, it should be dynamic within the front-end
              },
        isFetching: false
      });
      
    });
  }

  resetMapData = () => {
  }

  resetStateColors() {
    Object.values(this.statesRef.current.contextValue.layerContainer._layers).forEach(layer => {
      if(layer.feature) {  // only the states/counties have a feature
        // console.log(layer.feature);
        resetStateColor(layer, this.state.data.states);
      }
    })
  }

  changeViewRegion = (event, region) => {
    if (region !== null) {
      this.setState({region: region}, () => {
        if (this.mapRef.current !== null && this.statesRef.current !== null) {
          let bounds;
          if (region == MAP_DISPLAY.ALASKA) {
            bounds = this.alaskaRef.current.leafletElement.getBounds().pad(0.1)
          } else if (region == MAP_DISPLAY.USA) {
            bounds = this.statesRef.current.leafletElement.getBounds()
          } else if (region == MAP_DISPLAY.HAWAII) {
            bounds = this.hawaiiRef.current.leafletElement.getBounds().pad(0.5)
          }
          console.log(bounds)
          this.mapRef.current.leafletElement.fitBounds(bounds)
        }
      })
    }
  }

  filterIncidents = (flt) => {
    this.setState({ currentFilter: flt }) // 'all' or 'published'
  }

  // Return value, success (in our terms, not react's)
  updateState = (state, lock = false) => {
    if(lock || !this.state.locked) {  // lock parameter overrides current lock
      if(this.state.locked && state === "none") this.resetStateColors();  // would like color-setting to be more declarative
      // but onEachFeature only executes to initialize, so color handling is all done within events (mouseon, mouseout, click)

      this.setState({currentDisplay: state, locked: lock && state!=="none"});  // we never want to lock onto None
      return true;
    }
    return false;
  }

  updateCounty = (county, lock = false) => {
    console.log(county);
    if(lock) {
      this.setState({currentDisplay: county, locked: county!=="none"});
      return true;
    } else if(!this.state.locked) {
      this.setState({currentDisplay: county});
      return true;
    }
    return false;
  }

  getZoom = () => {
    return this.state.zoom;
  }

  render() {
    const { isFetching, currentDisplay } = this.state;
    const { classes } = this.props;


    if(isFetching) {
      return <CircularProgress className={classes.progress} />;
    }

    const data = this.state.currentFilter=='all' ? this.state.data.states : this.state.data.publishedStates
    
    return (
      <div className="homePage">
          <FirstTimeOverlay />
          {/* TODO: context for mapdata and data.states? */}
          <MapWrapper region={this.state.region} updateState={this.updateState}
          statesRef={this.statesRef} mapRef={this.mapRef} alaskaRef={this.alaskaRef} hawaiiRef={this.hawaiiRef}
          data={data} updateView={this.changeViewRegion}>
            <MapBar changeRegion={this.changeViewRegion} region={this.state.region}/>
          </MapWrapper>

          <div className="side">
            <SideMenu header={this.state.currentDisplay}>
              {/* Charts */}
              <div className="sideMenu__chart">
                <Charts data={data[currentDisplay]} max={data.groupMax} />
              </div>
            </SideMenu>
            <FilterBar filterfn={this.filterIncidents} />
          </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
