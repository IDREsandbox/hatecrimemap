import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, IconButton } from '@material-ui/core';

import {
  FirstTimeOverlay,
  MapWrapper,
  SideMenu,
  Charts,
  FilterBar,
  MapBar,
} from 'components';
import { JOYRIDE_STEPS } from 'res/values/joyride';
import { MAP_DISPLAY } from 'res/values/map';
import {
  getDataCounts,
  counts_aggregateBy,
  counts_total,
  counts_maxPrimary,
  counts_maxState,
  resetStateColor,
  defaultColors,
  resetStateColors,
} from 'utils/data-utils';

import HelpIcon from '@material-ui/icons/Help';

import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';

import './HomePage.css';
import { ControlPointSharp } from '@material-ui/icons';

const styles = () => ({
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
  },
});

const JOYRIDE_LOCK_STATE = 'California';

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
      locked: false, // lock the sidebar on a state or county
      run: false,
      steps: JOYRIDE_STEPS,
      stepIndex: 0,
      skipStep: false,
      lockType: 'none',
    };

    this.statesRef = React.createRef();
    this.alaskaRef = React.createRef();
    this.hawaiiRef = React.createRef();
    this.mapRef = React.createRef();
    this.chartsRef = React.createRef();
  }

  async componentDidMount() {
    // getStateDataReports().then(values => {
    //   this.setState({
    //     data: values,
    //     publishedData: filterPublishedReports(values),
    //     isFetching: false
    //   });

    // });

    getDataCounts().then((values) => {
      const max = counts_total(values);
      // console.log(values.filter(f => f.state=="California"))
      this.setState({
        data: values,
        dataMax: max,
        isFetching: false,
      });
    });
  }

  resetStateColors() {
    Object.values(
      this.statesRef.current.contextValue.layerContainer._layers,
    ).forEach((layer) => {
      if (layer.feature) {
        // only the states/counties have a feature
        // console.log(layer.feature);
        resetStateColor(layer, this.state.data, defaultColors);
      }
    });
  }

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

  filterIncidents = (flt) => {
    this.setState({ filterPublished: flt }); // true or false
  };

  filterTime = (time) => {
    this.setState({ filterTimeRange: time });
  };


  // only called by map wrapper by click outside the map to manually imitate a state/county being un clicked
  updateMap = () => {
    if (this.state.locked) {
      if (this.state.lockType === 'county') {
        this.updateCounty('none', true);
      } else if (this.state.lockType === 'state') {
        this.updateState('none', true)
      }
    }
  }

  updateLockItem = (item, lock = false, lockType = 'none') => {
    if (lock || !this.state.locked) {
      this.setState({
        currentDisplay: item,
        locked: lock && item !== 'none',
        lockType: lockType,
      }); // we never want to lock onto None
      // setting lock type parameters correctly for future use?
      if (this.state.locked === false) {
        this.state.lockType = 'none';
      }
      return true;
    }
    return false;
  }

  // Return value, success (in our terms, not react's)
  updateState = (state, lock = false) => {
    if (lock || !this.state.locked) {
      // lock parameter overrides current lock
      // NOTE: commented out  call of this.resetStateColors(). With new changes, all color changing is handled inside data utils by all 'each state + county functions'
      //if (this.state.locked && state === 'none') this.resetStateColors();
      // but onEachFeature only executes to initialize, so color handling is all done within events (mouseon, mouseout, click)
      this.setState({
        currentDisplay: state,
        locked: lock && state !== 'none',
        lockType: 'state',
      }); // we never want to lock onto None
      // setting lock type parameters correctly for future use?
      if (this.state.locked === false) {
        this.state.lockType = 'none';
      }
      return true;
    }
    return false;
  };

  updateCounty = (county, lock = false) => {
    // same functionality as above state county -> could possibly change to be one function 
    if (lock || !this.state.locked) {
      this.setState({
        currentDisplay: county,
        locked: lock && county !== 'none',
        lockType: 'county',
      }); // we never want to lock onto None
      // setting lock type parameters correctly for future use?
      if (this.state.locked === false) {
        this.state.lockType = 'none';
      }
      return true;
    }
    return false;
  };

  showTutorial = () => {
    this.setState({ run: true });
  };

  runTutorial = () => {
    this.setState({ run: true });
  };

  isNotReadyToStep = (index, type) => {
    // Logic for each indiviudal step on whether the joyride should move forward or not
    return (index == 3 && this.state.currentDisplay !== JOYRIDE_LOCK_STATE)
      || (index == 4 && [EVENTS.TARGET_NOT_FOUND].includes(type))
      || (index == 6 && this.chartsRef.current.state.dialogOpen)
      || (index == 7 && this.chartsRef.current.state.currentDisplay != 5)
      || (index == 8 && this.state.currentDisplay === JOYRIDE_LOCK_STATE)
  };

  handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if (action == ACTIONS.CLOSE || action == ACTIONS.SKIP) {
      this.setState({ stepIndex: 0, run: false });
      return; // avoid pathways that could all setState [to the same fields], this leads to race conditions
    }

    // First 4 options are special cases
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
    } else if (
      index == 5
      && [EVENTS.TARGET_NOT_FOUND].includes(type)
      && !this.chartsRef.current.state.dialogOpen
    ) {
      // once you click "next" when the table is open, it will throw an error because the current target (reports) is technically closed
      // the "step-after" part of the event can't mount because the target isn't found -> need to make it so that it manually skips over?
      this.setState({ stepIndex: index + 1 });
    } else if (
      [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)
      && index != 5
    ) {
      // Update state to advance the tour
      this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ stepIndex: 0 }); // added this to make sure the tutorial can be ran again
      this.setState({ run: false });
    }
  };

  updateZoom = (z) => {
    this.setState({ zoom: z.target._zoom });
  };

  getZoom = () => this.state.zoom;

  timeSlider = (
    <div id="timeslider">
      <Nouislider
        behaviour="tap-drag"
        connect
        range={{
          min: 2015,
          max: 2021,
        }}
        direction="ltr"
        pips={{ mode: 'count', values: 7 }}
        clickablePips
        step={1}
        start={[2015, 2021]}
        onUpdate={(render, handle, value, un, percent) => this.filterTime(value)}
      />
    </div>
  );

  render() {
    const {
      isFetching, run, steps, stepIndex,
    } = this.state;
    const { classes } = this.props;

    if (isFetching) {
      return <CircularProgress className={classes.progress} />;
    }

    let data;
    let dataPtr;
    // timeslider filter. TODO: make a generic state data filter/callback that handles pointer and closures
    // TODO: sort by date and binary search
    dataPtr = this.state.data;
    data = dataPtr.filter(
      (row) => row.yyyy >= this.state.filterTimeRange[0]
        && row.yyyy <= this.state.filterTimeRange[1],
    );
    const dataMapMax = this.state.zoom >= 6 ? 30 : counts_maxState(data);
    const dataMax = counts_maxPrimary(data);
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
    if (this.state.filterPublished) filters.push(['published', true]);

    return (
      <div className="homePage">
        <FirstTimeOverlay onClose={this.showTutorial} />

        {/* TODO: context for mapdata and data.states? */}
        <MapWrapper
          region={this.state.region}
          updateState={this.updateState}
          updateCounty={this.updateCounty}
          statesRef={this.statesRef}
          mapRef={this.mapRef}
          alaskaRef={this.alaskaRef}
          hawaiiRef={this.hawaiiRef}
          outsideClick={this.updateMap}
          data={data}
          max={dataMapMax}
          updateView={this.changeViewRegion}
          updateZoom={this.updateZoom}
          zoom={this.getZoom}
          filterTime={this.filterTime}
          timeSlider={this.timeSlider}
        >
          <MapBar
            changeRegion={this.changeViewRegion}
            region={this.state.region}
          />
          <Joyride
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
                backgroundColor: 'rgb(236, 242, 255)',
                overlayColor: 'rgba(5, 5, 10, 0.7)',
                primaryColor: 'rgb(0, 100, 255)',
                textColor: 'black',
                width: 800,
                zIndex: 9000,
              },
            }}
          />
        </MapWrapper>

        <div className="side">
          <SideMenu>
            <div className="sideMenu__header">
              <h2>
                Hate Crimes in
                {' ' +
                  (this.state.currentDisplay == 'none'
                    ? 'the US'
                    : isNaN(this.state.currentDisplay[this.state.currentDisplay.length - 1])
                      ? this.state.currentDisplay
                      : (this.state.currentDisplay.substr(0, this.state.currentDisplay.length - 3) + ` County`))}
                <IconButton
                  onClick={this.runTutorial}
                  className={classes.menuButton}
                  aria-label="Menu"
                >
                  <HelpIcon id="hateCrimeTutorial" />
                </IconButton>
              </h2>

              <h4>
                {currTotal} in {this.state.filterTimeRange.join('-')}
              </h4>
            </div>

            <div className="sideMenu__chart">
              <Charts
                ref={this.chartsRef}
                data={data}
                max={dataMax}
                filters={filters}
                time={this.state.filterTimeRange}
                lockType={this.state.lockType}
                lockItem={this.state.currentDisplay}
              />
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
