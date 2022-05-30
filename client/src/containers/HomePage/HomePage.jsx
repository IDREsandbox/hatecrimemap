import React, { Component } from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, IconButton } from '@material-ui/core';

import HelpIcon from '@material-ui/icons/Help';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { popup, marker, icon } from 'leaflet';
import ColoredButton from 'components/Reusables/ColoredButton';
import SpotlightModal from '../../components/SpotlightModal/SpotlightModal';
import { MainContext } from '../context/joyrideContext';
import {
  FirstTimeOverlay,
  MapWrapper,
  SideMenu,
  Charts,
  FilterBar,
  MapBar,
  Legend,
  CountyToggle,
} from '../../components';
import { JOYRIDE_STEPS } from '../../res/values/joyride';
import { MAP_DISPLAY } from '../../res/values/map';
import {
  getDataCounts,
  counts_aggregateBy,
  counts_total,
  counts_maxPrimary,
  counts_maxState,
  defaultColors,
  counts_maxCounties,
} from '../../utils/data-utils';

import './HomePage.css';

const styles = () => ({
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
  },
  popupStyle: {
    minWidth: 300,
    padding: 0,
  },
  flexCenter: {
    flexDirection: 'row',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    width: '100%',
  },
  timeSlider: {
    backgroundColor: '#E05215',
  },
});

const JOYRIDE_LOCK_STATE = 'California';

class HomePage extends Component {
  static contextType = MainContext;

  constructor(props) {
    super(props);
    this.state = {
      region: MAP_DISPLAY.USA,
      zoom: 4,
      isFetching: true,
      currentDisplay: 'none',
      filterPublished: false,
      filterTimeRange: [2015, 2021],
      locked: false, // lock the sidebar on a state or county
      run: false,
      steps: JOYRIDE_STEPS,
      stepIndex: 0,
      skipStep: false,
      displayType: 'state', // consider simplifying with lockType
      lockType: 'none',
      spotlightMode: false,

      focusItem: 'none',
    };

    this.statesRef = React.createRef();
    this.countiesRef = React.createRef();
    this.alaskaRef = React.createRef();
    this.hawaiiRef = React.createRef();
    this.mapRef = React.createRef();
    this.chartsRef = React.createRef();
  }

  async componentDidMount() {
    const context = this.context;

    this.state.run = context.homePageJoyrideRestart;
    this.state.stepIndex = context.stepIndex;

    getDataCounts().then((values) => {
      this.setState({
        data: values,
        isFetching: false,
      });
    });
  }

  closePopup = () => {
    this.mapRef.current.closePopup();
  }

  myMarker = null
  generateNewPopup = (latitude = 34.0522, longitude = -118.2437) => {
    if (!this.myMarker) {
      const newMarker = marker([latitude, longitude]);
      this.myMarker = newMarker

      var customIcon = icon({
        iconUrl: require('./map_marker.png'),
        iconSize: [40, 40], // size of the icon
        iconAnchor: [22, 40], // point of the icon which will correspond to marker's location
      });
      newMarker.setIcon(customIcon)
      newMarker.addTo(this.mapRef.current);
    } else {
      this.myMarker.setLatLng([latitude, longitude])
    }
    this.mapRef.current.flyTo([latitude, longitude], this.state.lockType === 'county' ? 8.5 : 5);
  }

  closeMarker = () => {
    if (this.myMarker) {
      this.myMarker.remove()
    }
    this.myMarker = null
  }

  changeViewRegion = (event, region) => {
    if (region && this.mapRef.current) {
      this.mapRef.current.fitBounds(region);
    }
  };

  filterIncidents = (flt) => {
    this.setState({ filterPublished: flt }); // true or false
  };

  filterTime = (time) => {
    this.setState({ filterTimeRange: time });
  };

  clearLock = () => {
    this.setState({
      currentDisplay: 'none', // if we try to "re-lock" onto the same state, toggle it off
      locked: false,
      lockType: 'none', // if there's nothing locked on, the lockType should be none!
    });
  }

  // Return value, success (in our terms, not react's)
  updateState = (state, lock = false) => {
    if (this.state.locked && !lock) return false;

    if (this.state.locked && this.state.currentDisplay === state) {
      this.clearLock();
      return false; // uncolor
    }

    this.setState({
      currentDisplay: state,
      locked: lock && state !== 'none', // we never want to lock onto None
      lockType: 'state',
    });
    return true;
  };

  updateCounty = (county, lock = false) => {
    if (this.state.locked && !lock) return false;

    if (this.state.locked && this.state.currentDisplay === county) {
      this.clearLock();
      return false; // uncolor
    }

    this.setState({
      currentDisplay: county,
      locked: lock && county !== 'none', // we never want to lock onto None
      lockType: 'county',
    });
    return true;
  };

  showTutorial = () => {
    this.setState({ run: true });
  };

  runTutorial = () => {
    this.setState({ run: true });
  };

  // Logic for each indiviudal step on whether the joyride should move forward or not
  isNotReadyToStep = (index, type) => (index == 3 && this.state.currentDisplay !== JOYRIDE_LOCK_STATE)
    || (index == 4 && [EVENTS.TARGET_NOT_FOUND].includes(type))
    || (index == 6 && this.chartsRef.current.state.dialogOpen)
    || (index == 7 && this.chartsRef.current.state.currentDisplay != 5)
    || (index == 8 && this.state.currentDisplay === JOYRIDE_LOCK_STATE)
    || (index == 9 && this.state.zoom < 6)
    || (index == 11 && this.state.zoom >= 6 && [EVENTS.STEP_BEFORE].includes(type));

  handleJoyrideCallback = (data) => {
    const {
      action, index, status, type,
    } = data;

    if (action == ACTIONS.CLOSE || action == ACTIONS.SKIP) {
      // prevents covid tutorial from opening on covid homepage if the joyride is exited
      const { context } = this;
      context.covidJoyrideRun = false;
      context.stepIndex = 0;
      context.homePageJoyrideRestart = false;
      this.setState({ stepIndex: 0, run: false });
      return; // avoid pathways that could all setState [to the same fields], this leads to race conditions
    }

    // First 4 steps are special cases
    if (this.state.skipStep && type == EVENTS.STEP_BEFORE) {
      this.setState({ stepIndex: 4, skipStep: false });
    } else if (
      index == 4
      && [EVENTS.STEP_AFTER].includes(type)
      && !this.chartsRef.current.state.dialogOpen
    ) {
      // Progressing from step 4 before the chart is open needs to be caught in the step after part of step 4, otherwise it will cause errors with skipping backwards steps
      this.setState({ stepIndex: index - 1, skipStep: true });
    } else if (this.isNotReadyToStep(index, type)) {
      this.setState({ stepIndex: index - 1 });
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    } else if (index == 12) {
      const { context } = this;
      if ([EVENTS.TOOLTIP].includes(type)) { // upon mounting of step 12 tooltip, set this context
        context.covidJoyrideRun = true;
        context.stepIndex = 13;
        context.homePageJoyrideRestart = true;
      }
    } else if (index == 13) {
      const { context } = this;
      context.covidJoyrideRun = false;
      context.stepIndex = 0;
      context.homePageJoyrideRestart = false;
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ stepIndex: 0 }); // added this to make sure the tutorial can be ran again
      this.setState({ run: false });
    }
  };

  updateZoom = (z, callback) => {
    if (this.state.zoom < 6 && z >= 6) {
      // Should show county
      if (this.state.lockType === 'state') {
        this.clearLock();
      }
      this.setState({ zoom: z, displayType: 'county' }, callback('county'));
    } else if (this.state.zoom >= 6 && z < 6) {
      // Should show state
      if (this.state.lockType === 'county') {
        this.clearLock();
      }
      this.setState({ zoom: z, displayType: 'state' }, callback('state'));
    } else {
      this.setState({ zoom: z });
    }
  };

  getZoom = () => this.state.zoom;

  /*
    top level component

    so the lockItem mechanism is too generally used
    make a callback so that when a state is clicked on, it sets a 'lockItem' component in upper level
    this component should only be set when something is actually locked onto

  */

  lockChange = () => {
    if (this.state.lockItem) {
      // if the state is actually locked onto something, set the lockItem to that ?
      // otherwise, set nothing

      // why not just pass down the locked component from this level and only update if locked is true?
    }
  }

  render() {
    const {
      isFetching, run, steps, stepIndex, region, displayType,
    } = this.state;
    const { classes } = this.props;

    document.body.style = 'background: rgb(0,0,0)';

    if (isFetching) {
      return <CircularProgress style={{ 'color': 'white' }} className={classes.progress} />;
    }

    // timeslider filter. TODO: make a generic state data filter/callback that handles pointer and closures
    // TODO: sort by date and binary search
    const dataPtr = this.state.data;
    let data = dataPtr.filter(
      (row) => row.yyyy >= this.state.filterTimeRange[0]
        && row.yyyy <= this.state.filterTimeRange[1],
    );
    if (this.state.filterPublished) {
      data = data.filter(
        (row) => row.published,
      );
    }
    const dataStateMax = counts_maxState(data);
    const dataCountyMax = counts_maxCounties(data); // replace with county-max calculator, make it only called once
    const dataMaxTopLevel = counts_maxPrimary(data); // TODO: rename these...
    let currTotal = 0;

    const filters = [];
    if (this.state.currentDisplay != 'none') {
      filters.push([this.state.lockType, this.state.currentDisplay]);
      currTotal = counts_aggregateBy(
        data,
        this.state.lockType,
        this.state.currentDisplay,
      );
    } else {
      currTotal = counts_total(data);
    }

    return (
      <div className="homePage">
        <FirstTimeOverlay onClose={this.showTutorial} />

        {/* TODO: context for mapdata and data.states? */}
        <MapWrapper
          updateState={this.updateState}
          updateCounty={this.updateCounty}
          mapRef={this.mapRef}
          data={data}
          max={dataStateMax}
          maxCounty={dataCountyMax}
          zoom={this.getZoom}
          displayType={displayType}
          timeSliderUpdate={this.filterTime}
          spotlightOn={this.state.spotlightMode}
          controls={(map) => ( //eslint-disable-line
            <>
              <Legend colors={defaultColors} maxState={dataStateMax} maxCounty={dataCountyMax} displayType={displayType} />
              <MapBar changeRegion={this.changeViewRegion} region={region} />
              <CountyToggle updateZoom={this.updateZoom} />
            </>
          )}
          publishedChange={this.state.filterPublished}
        />
        <div className="side">
          <SideMenu>
            {!this.state.spotlightMode
              ? (
                <>
                  <div className="sideMenu__header">
                    <h2>
                      Hate Crimes in
                      {` ${this.state.currentDisplay == 'none'
                        ? 'the US'
                        : isNaN(this.state.currentDisplay[this.state.currentDisplay.length - 1]) // eslint-disable-line no-restricted-globals
                          ? this.state.currentDisplay
                          : (`${this.state.currentDisplay.substr(0, this.state.currentDisplay.length - 3)} County`)}`}
                      <IconButton
                        onClick={this.runTutorial}
                        className={classes.menuButton}
                        aria-label="Menu"
                        style={{ color: 'white' }}
                      >
                        <HelpIcon id="hateCrimeTutorial" />
                      </IconButton>
                    </h2>

                    <h4>
                      {`${currTotal
                        } incidents (${this.state.filterTimeRange.join('–')})`}
                    </h4>
                  </div>

                  <div className="sideMenu__chart">
                    <Charts
                      ref={this.chartsRef}
                      data={data}
                      max={dataMaxTopLevel}
                      filters={filters}
                      time={this.state.filterTimeRange}
                      lockType={this.state.lockType}
                      lockItem={this.state.currentDisplay}
                    />
                  </div>
                  <br />
                  <FilterBar filterfn={this.filterIncidents} />
                  <div className={classes.flexCenter}>
                    <ColoredButton
                      onClick={() => { this.setState({ spotlightMode: true }); }}
                      noIcon
                    >
                      View Stories From This Location
                    </ColoredButton>
                  </div>
                </>
              )
              : (
                <SpotlightModal
                  openPopup={this.generateNewPopup}
                  closePopup={this.closeMarker}
                  exitSpotlightMode={() => { this.setState({ spotlightMode: false }); }}
                  lockType={this.state.lockType}
                  lockItem={this.state.currentDisplay}
                  locked={this.state.locked}
                />
              )}

          </SideMenu>
        </div>
        <Joyride
          className="joyride"
          run={run}
          scrollToFirstStep
          continuous
          showSkipButton
          showProgress={false}
          callback={this.handleJoyrideCallback}
          stepIndex={stepIndex}
          steps={steps}
          locale={{
            back: 'Back',
            close: 'Close',
            last: 'Finish',
            next: 'Next',
            skip: 'Skip',
          }}
          styles={{
            options: {
              arrowColor: 'rgb(236, 242, 255)',
              backgroundColor: '#262626',
              overlayColor: 'rgba(255, 255, 255, 0.3)',
              primaryColor: 'rgb(0, 100, 255)',
              textColor: 'white',
              width: 800,
              zIndex: 9000,
            },
          }}
        />
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
