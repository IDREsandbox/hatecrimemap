import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Button, IconButton } from '@material-ui/core';

import { FirstTimeOverlay, MapWrapper, SideMenu, Charts, FilterBar, MapBar } from 'components';
import { JOYRIDE_STEPS } from 'res/values/joyride';
import { MAP_DISPLAY } from 'res/values/map';
import { Rectangle, GeoJSON } from 'react-leaflet';
import { getAllData, storeStateData, resetStateColor,defaultColors,covidColors, getStateDataReports, filterPublishedReports } from '../../utils/data-utils';

import HelpIcon from '@material-ui/icons/Help';

import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';


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
      region: MAP_DISPLAY.USA,
      zoom: 4,
      isFetching: true,
      currentDisplay: 'none',
      filterPublished: false,
      filterTimeRange: [2015, 2021],
      spotlightClicks: true,  
      locked: false, // lock the sidebar on a state or county
      run: false,
      disableBeacon: true,
      isFixed: true,
      steps: JOYRIDE_STEPS,
    };

    this.statesRef = React.createRef();
    this.alaskaRef = React.createRef();
    this.hawaiiRef = React.createRef();
    this.mapRef = React.createRef();
  }

  async componentDidMount() {
    getStateDataReports().then(values => {
      this.setState({
        data: values,
        publishedData: filterPublishedReports(values),
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
        resetStateColor(layer, this.state.data,defaultColors);
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
          this.mapRef.current.leafletElement.fitBounds(bounds)
        }
      })
    }
  }

  filterIncidents = (flt) => {
    this.setState({ filterPublished: flt }) // true or false
  }

  filterTime = (time) => {
    this.setState({ filterTimeRange: time })
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
    if(lock) {
      this.setState({currentDisplay: county, locked: county!=="none"});
      return true;
    } else if(!this.state.locked) {
      this.setState({currentDisplay: county});
      return true;
    }
    return false;
  }
  showTutorial = () => {
    this.setState({run:true})
  }

  runTutorial = () => {
    this.setState({run:true})
  }

  handleJoyrideCallback = data => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    }
    
    if (action == ACTIONS.CLOSE || action == ACTIONS.SKIP) {
      this.setState({ stepIndex: 0, run: false })
    }
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ run: false });
    }
  };
  
  getZoom = () => {
    return this.state.zoom;
  }

  render() {
    const { isFetching, currentDisplay, run, steps,stepIndex } = this.state;
    const { classes } = this.props;


    if(isFetching) {
      return <CircularProgress className={classes.progress} />;
    }

    let data, dataPtr;
    if (this.state.filterPublished) {
      dataPtr = this.state.publishedData
    } else {
      dataPtr = this.state.data;
    }
    // timeslider filter. TODO: make a generic state data filter/callback that handles pointer and closures
    // TODO: sort by date and binary search
    data = {}
    for (var state in dataPtr) {
      if (!dataPtr[state].children) continue;
      data[state] = {children: dataPtr[state].children.filter(incident => {
          let yr = (new Date(incident.date)).getFullYear();
          return yr >= this.state.filterTimeRange[0] && yr <= this.state.filterTimeRange[1]
        }),
      count: dataPtr[state].count
      }
    }
    data.max = dataPtr.max;
    
    return (

      <div className="homePage">

          <FirstTimeOverlay onClose={this.showTutorial}/>

          {/* TODO: context for mapdata and data.states? */}
          <MapWrapper region={this.state.region} updateState={this.updateState} updateCounty={this.updateCounty}
          statesRef={this.statesRef} mapRef={this.mapRef} alaskaRef={this.alaskaRef} hawaiiRef={this.hawaiiRef}
          data={data} updateView={this.changeViewRegion} updateZoom={this.updateZoom} zoom={this.getZoom} filterTime={this.filterTime} >
          <MapBar changeRegion={this.changeViewRegion} region={this.state.region}/>
          <Joyride
              run={run}
              scrollToFirstStep={true}
              showProgress={true}
              continuous={true}
              showSkipButton={true}
              showProgress={false}
              callback={this.handleJoyrideCallback}
              stepIndex={stepIndex}
              // spotlightClicks={true}
              steps={steps}
              locale={{back: 'Back', close: 'Close', last: 'Finish', next: 'Next', skip: 'Skip' }}
              styles={{
                options: {
                  arrowColor: 'rgb(236, 242, 255)',
                  backgroundColor: 'rgb(236, 242, 255)',
                  overlayColor: 'rgba(5, 5, 10, 0.7)',
                  primaryColor: 'rgb(0, 100, 255)',
                  textColor: 'black',
                  width: 800,
                  zIndex: 9000,
                }
        }}
      />
          </MapWrapper>
 
          <div className="side">
            <SideMenu>
              <div className="sideMenu__header">
                <h2>Hate Crimes in {this.state.currentDisplay == 'none' ? "the US" : this.state.currentDisplay }               
                  <IconButton  onClick={this.runTutorial} className={classes.menuButton} color="gray" aria-label="Menu">
                    <HelpIcon id="hateCrimeTutorial" />
                  </IconButton>
                </h2>

                <h4>In {this.state.filterTimeRange.join('-')}</h4>
              </div>

              <div className="sideMenu__chart">
                <Charts data={data} max={data.groupMax} currState={this.state.currentDisplay} />
              </div>
            <br />
              <FilterBar filterfn={this.filterIncidents} />
            </SideMenu>
          </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
