import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Button, IconButton } from '@material-ui/core';

import { FirstTimeOverlay, MapWrapper, SideMenu, Charts, FilterBar } from '../../components';
import { counties } from '../../res/counties/statecounties.js';
import { states } from '../../res/states.js';
import { Rectangle, GeoJSON } from 'react-leaflet';
import { getAllData, eachState, eachStatesCounties, storeStateData, resetStateColor } from '../../utils/data-utils';

import './HomePage.css';

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
      zoom: 3,
      isFetching: true,
      currentDisplay: 'none',
      locked: false, // lock the sidebar on a state or county
    };
    this.statesRef = React.createRef();
  }

  async componentDidMount() {
    getAllData().then(values => {
      this.setState({
        data: { states: storeStateData(values[0].result, values[1]) },
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

  updateZoom = (zoom = 4) => {
    // if((this.state.zoom > 6 && zoom < 6) || (this.state.zoom < 6 && zoom > 6))  // threshold for switching between county and state, unlock display
    //   this.setState({zoom: zoom, lock: false}, () => this.state.zoom);
    // else
    //   this.setState({zoom: zoom}, () => this.state.zoom);
    // console.log(this.statesRef);
  }

  render() {
    const { isFetching, data, currentDisplay } = this.state;
    const { classes } = this.props;

    if(isFetching) {
      return <CircularProgress className={classes.progress} />;
    }

    return (
      <div className="homePage">
          <FirstTimeOverlay />
          {/* TODO: context for mapdata and data.states? */}
          <MapWrapper zoom={this.getZoom} updateZoom={this.updateZoom}>
            <Rectangle bounds={[[-90., -180.], [90., 180.]]} stroke={false} fillOpacity="0" onClick={() => this.updateState("none", true)} />
            { this.state.zoom >= 6 && counties.map((state, index) => <GeoJSON key={index} data={state} onEahFeature={(feature, layer) => eachStatesCounties(feature, layer, data.counties, this.updateCounty)} /> ) }     
            <GeoJSON ref={this.statesRef} data={states} onEachFeature={(feature, layer) => eachState(feature, layer, data.states, 100, this.updateState)} />
          </MapWrapper>

          <div className="side">
            <SideMenu header={this.state.currentDisplay}>
              {/* Charts */}
              <div className="sideMenu__chart">
                <Charts data={data.states[currentDisplay]} max={data.states.groupMax} />
              </div>
            </SideMenu>
            <FilterBar />
          </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
