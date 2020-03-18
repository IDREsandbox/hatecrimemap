import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Button, IconButton } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Close from '@material-ui/icons/Close';

import MapWrapper from '../../components/MapWrapper/MapWrapper';
import SideMenu from '../../components/SideMenu/SideMenu';
import Charts from '../../components/Charts/Charts';
// import { updateCurrentLayers, getMapData, storeMapData, getAllPoints, storeStateData } from '../../utils/filtering';
import { counties } from '../../res/counties/statecounties.js';
import { states } from '../../res/states.js';
import { Rectangle, GeoJSON } from 'react-leaflet';
import { Bar } from 'react-chartjs-2';
import { labels, getRaceChartData } from '../../utils/chart-utils';
import { getAllData, eachState, eachStatesCounties, storeStateData, storeCountyData, resetStateColor } from '../../utils/data-utils';

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
      data: {},  // { states, counties }
      currentDisplay: 'none',
      locked: false,
      firstTime: true
    };
    this.statesRef = React.createRef();
  }

  async componentDidMount() {
    getAllData().then(values => {
      this.setState({
        data: { states: storeStateData(values[0].result) },
        isFetching: false
      });
      
    });

    let hasVisited = (localStorage.getItem('visitedPage')) == 'true';
    if(hasVisited) {
      this.setState({
        firstTime: false
      });
    }
  }

  closeOverlay = () => {
    this.setState({ firstTime: false });
  }

  destroyOverlay = () => {
    this.closeOverlay();
    localStorage.setItem('visitedPage', true);
  }

  resetMapData = () => {
  }

  resetStateColors() {
    Object.values(this.statesRef.current.contextValue.layerContainer._layers).forEach(layer => {
      if(layer.feature) {  // only the states/counties have a feature
        console.log(layer.feature);
        resetStateColor(layer, this.state.data.states);
      }
    })
  }

  // Return value, success (in our terms, not react's)
  updateState = (state, lock = false) => {
    if(lock || !this.state.locked) {  // lock parameter overrides current lock
      if(this.state.locked && state == "none") this.resetStateColors();  // would like color-setting to be more declarative
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
        <React.Fragment>
          { this.state.firstTime &&
              <React.Fragment>
                <div className="black">
                  <div className="welcome">
                    <h1>Welcome to the Hate Crime Map!</h1>
                    <br />
                    <p>Hate crime—violence impelled by bigotry or bias—is a global and national human rights 
                    problem of significant concern. According to experts like the FBI, the Southern Poverty Law 
                    Center, and ProPublica, there has been a dramatic increase in hate crimes and harassment in 
                    the United States during the past three years. The presence of high-profile incidents of 
                    violence and aggression based on racial or other bias and intolerance is much more visible 
                    in the media; nevertheless, hate crimes statistics are notoriously unreliable. The definition 
                    of what constitutes a hate crime varies from jurisdiction to jurisdiction, and often is quite 
                    reduced in terms of what actions qualify. Underreporting is widespread, and often even when 
                    reporting happens, law enforcement is reluctant to designate crimes as hate crimes. 
                    The need for a publicly available resource documenting hate crimes has never been greater, 
                    yet accessible data on the type and frequency of crimes occurring is not currently available. 
                    The HateMap Project seeks to address this need by providing a crowd-sourced platform that 
                    enables researchers and victims to report hate-based incidents in detail, without having to 
                    approach law enforcement.</p>
                    <br /> <hr /> <br />
                    <p>The map of the United States is shown to the left, and the side panel on the right displays
                     data as you hover over states/counties. Click on a location to lock it on the side panel, then
                     you may interact with the graphs by clicking on top-level categories to see finer details. Click 
                     anywhere else on the map to unlock it from that location.</p>
                    <br />
                    <p>If you would like to contribute to the database, click on "Report Incident" on the top right to 
                    be taken to a page where you can submit a hate crime report. This will not be immediately updated in 
                    the map, as the report must be verified with a valid report source in order to prevent mass false reports.</p>
                  </div>

                  <div className="noShow">
                    <Button variant="contained" color="primary" onClick={this.closeOverlay}>Close</Button>
                    <br />
                    <Link href="#" onClick={this.destroyOverlay}>Don't show again</Link>
                  </div>
                </div>
              </React.Fragment>
           }
          {/* TODO: context for mapdata and data.states? */}
          <MapWrapper zoom={this.getZoom} updateZoom={this.updateZoom}>
            <Rectangle bounds={[[-90., -180.], [90., 180.]]} stroke={false} fillOpacity="0" onClick={() => this.updateState("none", true)} />
            { this.state.zoom >= 6 && counties.map((state, index) => <GeoJSON key={index} data={state} onEahFeature={(feature, layer) => eachStatesCounties(feature, layer, data.counties, this.updateCounty)} /> ) }     
            <GeoJSON ref={this.statesRef} data={states} onEachFeature={(feature, layer) => eachState(feature, layer, data.states, 100, this.updateState)} />
          </MapWrapper>

          <SideMenu header={this.state.currentDisplay}>
            {/* Charts */}
            <div className="sideMenu__chart">
              <Charts data={data.states[currentDisplay]} max={data.states.groupMax} />
            </div>
          </SideMenu>
        </React.Fragment>
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
