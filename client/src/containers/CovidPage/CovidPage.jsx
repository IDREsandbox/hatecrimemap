import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import  CircularProgress  from '@material-ui/core/CircularProgress';

import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
import { MainContext } from '../context/joyrideContext';
import {
  MapWrapper,
  SideMenu,
  CovidCharts,
  MapBar,
  Legend,
} from '../../components';
import { getCovidData, covidColors } from '../../utils/data-utils';
import { wordCloudReducer, takeTop } from '../../utils/chart-utils';

import './CovidPage.css';

import { COVID_JOYRIDE_STEPS } from '../../res/values/joyride';

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
    fontSize: 18
  },
  footnotes: {},
});

let wordData = {};

class CovidPage extends Component {
  static contextType = MainContext;

  constructor(props) {
    super(props);
    this.state = {
      region: MAP_DISPLAY.USA,
      zoom: 4,
      isFetching: true,
      currentDisplay: 'none',
      locked: false, // lock the sidebar on a state or county
      steps: COVID_JOYRIDE_STEPS,
      run: false,
    };
    this.statesRef = React.createRef();
    this.alaskaRef = React.createRef();
    this.hawaiiRef = React.createRef();
    this.mapRef = React.createRef();
  }

  async componentDidMount() {
    const context = this.context;
    this.state.run = context.covidJoyrideRun;

    getCovidData().then((values) => {
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
    });
  }

  resetMapData = () => { };

  filterIncidents = (flt) => {
    // 'all' or 'published'
    this.setState({ currentFilter: flt }); //eslint-disable-line
  };

  // Return value, success (in our terms, not react's)
  updateState = (state, lock = false) => {
    if (this.state.locked && !lock) return false;
    if (this.state.locked && this.state.currentDisplay === state) {
      this.setState({
        currentDisplay: 'none', // if we try to "re-lock" onto the same state, toggle it off
        locked: false,
        // lockType: 'state, (lockType only needed on homePage?)
      });
      return false; // uncolor
    }

    this.setState({
      currentDisplay: state,
      locked: lock && state !== 'none', // we never want to lock onto None
      // lockType: 'state', (lockType only needed on homePage)
    });
    return true;
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
    if (region && this.mapRef.current) {
      this.mapRef.current.fitBounds(region);
    }
  };

  updateZoom = (z) => {
    this.setState({ zoom: z.target._zoom });
  };

  getZoom = () => this.state.zoom;

  filterTime = (time) => { }; // eslint-disable-line no-unused-vars

  handleJoyrideCallback = (data) => {
    const {
      action, index, status, type, // eslint-disable-line no-unused-vars
    } = data;

    if (action == ACTIONS.CLOSE || action == ACTIONS.SKIP) {
      // prevents joyride from opening on normal homepage if the joyride is exited
      const { context } = this;
      context.covidJoyrideRun = false;
      context.stepIndex = 0;
      context.homePageJoyrideRestart = false;
      return;
    }

    if ([EVENTS.STEP_AFTER].includes(type)) {
      this.setState({ run: false });
      const { context } = this;
      context.covidJoyrideRun = false;
      context.stepIndex = 0;
      context.homePageJoyrideRestart = false;
    }
  };

  generateDateRange = () => {
    if (this.state.currentDisplay === 'none') {
      // Dates exist for some states. Only need to find the min of each first date and max of each last date
      let min = '12/31/2099' // extreme late date
      let max = '01/01/00' // need to uses comparisons within this century unless Date library used
      Object.keys(this.state.data).forEach(each => {
        if (this.state.data[each].children && this.state.data[each].children.length > 0) {
          let first = this.state.data[each].children[0].date
          if (first < min) { min = first }
          if (this.state.data[each].children.length > 1) {
            let second = this.state.data[each].children[this.state.data[each].children.length - 1].date;
            if (second > max) { max = second }
          }
        }
      })
      return `${min} - ${max}`
    } else {
      if (this.state.data[this.state.currentDisplay].children.length > 1) { // impossible to lock/hover on a state with no events now
        return `${this.state.data[this.state.currentDisplay].children[0].date
          } - ${this.state.data[this.state.currentDisplay].children.length > 1
          && this.state.data[this.state.currentDisplay].children[
            this.state.data[this.state.currentDisplay].children
              .length - 1
          ].date}`
      } else {
        return `${this.state.data[this.state.currentDisplay].children[0].date}`
      }
    }
  }

  render() {
    const { isFetching } = this.state;
    const { classes } = this.props;

    document.body.style = 'background: rgba(255,255,255)';

    if (isFetching) {
      return <CircularProgress className={classes.progress} />;
    }

    return (
      <div className="CovidPage">
        {/* <FirstTimeOverlay /> */}
        {/* TODO: context for mapdata and data.states? */}
        <MapWrapper
          region={this.state.region}
          max={this.state.data.max}
          zoom={this.getZoom}
          updateState={this.updateState}
          displayType="state"
          filterTime={this.filterTime}
          mapRef={this.mapRef}
          data={this.state.data}
          updateView={this.changeViewRegion}
          covid
          controls={(map) => ( //eslint-disable-line
            <>
              <MapBar
                changeRegion={this.changeViewRegion}
                region={this.state.region}
              />
              <Legend colors={covidColors} hasNone maxState={this.state.data.max} displayType="state" />
            </>
          )}
        >
          <Joyride
            run={this.state.run}
            continuous
            scrollToFirstStep
            callback={this.handleJoyrideCallback}
            showSkipButton
            locale={{
              last: 'Close',
            }}
            stepIndex={0}
            steps={this.state.steps}
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
          <SideMenu
            covid
          >
            <h2 className="sideMenu__header sideMenu__header-covid">
              {`COVID Hate Incidents in ${this.state.currentDisplay == 'none'
                ? 'US'
                : this.state.currentDisplay
                }`}
            </h2>
            <div className={`sideMenu__info ${classes.dateRange}`}>
              <p>
                {this.generateDateRange()}
              </p>
            </div>
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
