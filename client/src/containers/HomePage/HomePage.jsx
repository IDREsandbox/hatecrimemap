import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

import MapWrapper from '../../components/MapWrapper/MapWrapper';
import SideMenu from '../../components/SideMenu/SideMenu';
// import { updateCurrentLayers, getMapData, storeMapData, getAllPoints, storeStateData } from '../../utils/filtering';
import { storeStateData, storeCountyData } from '../../utils/filtering';
import './HomePage.css';

const styles = () => ({
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
  },
});

class HomePage extends Component {
  state = {
    zoom: 4,
    isFetching: true,
    statetotals: {},
    currentLayers: new Set(['all']),
    countytotals: {},
    displayState: 'none',
    displayCounty: 'none',
    locked: false
  };

  componentDidMount() {
    // const allpoints = getAllPoints();
    // if (allpoints.length !== 0) {
    //   this.setState({
    //     isFetching: false,
    //     mapdata: allpoints,
    //   });
    //   return;
    // }

    axios.get('/api/maps/statedata')
      .then(({data: {data}}) => {
        this.setState({
          isFetching: false,
          statetotals: storeStateData(data)  // Converts array to objects with state names as keys
        });
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        alert(`API call failed: ${err}`);
      });

    axios.get('/api/maps/countydata')
      .then(({data: {data}}) => {
        this.setState({
          countytotals: storeCountyData(data)
        });
      })
      .catch((err) => {
        alert(`API call failed: ${err}`);
      });
  }

  // updateMapData = ({ target: { name, value } }) => {
  //   const { currentLayers } = this.state;
  //   const newLayers = name === 'reports'
  //     ? updateCurrentLayers(value, currentLayers, true)
  //     : updateCurrentLayers(name, currentLayers);

  //   axios.get('/api/totals/' + name)
  //     .then(({ data: {statetotals} {} => {
  //       this.setState({
  //       mapdata: getMapData(name, newLayers),
  //       statetotals: statetotals.result,
  //       currentLayers: newLayers,
  //     });
  //   });
  // }

  resetMapData = () => {
    this.setState({
      // mapdata: getAllPoints(),
      currentLayers: new Set(['all']),
     });
  }

  // Return value, success (in our terms, not react's)
  updateState = (state, lock = false) => {
    if(lock) {
      this.setState({displayState: state, locked: state!=="none"});  // we never want to lock onto None
      return true;
    } else if(!this.state.locked) {
      this.setState({displayState: state});
      return true;
    }
    return false;
  }

  updateCounty = (county, lock = false) => {
    console.log(county);
    if(lock) {
      this.setState({displayCounty: county, locked: county!=="none"});
      return true;
    } else if(!this.state.locked) {
      this.setState({displayCounty: county});
      return true;
    }
    return false;
  }

  getZoom = () => {
    return this.state.zoom;
  }

  updateZoom = (zoom = 4) => {
    if((this.state.zoom > 6 && zoom < 6) || (this.state.zoom < 6 && zoom > 6))  // threshold for switching between county and state, unlock display
      this.setState({zoom: zoom, lock: false}, () => this.state.zoom);
    else
      this.setState({zoom: zoom}, () => this.state.zoom);
  }



  render() {
    const { isFetching, statetotals, displayState, currentLayers } = this.state;
    const { classes } = this.props;

    return (
      <div className="homePage">
        {isFetching ? (
          <CircularProgress className={classes.progress} />
        ) : (
          <React.Fragment>
        {/* TODO: context for mapdata and statetotals? */}
            <MapWrapper statetotals={statetotals} countytotals={this.state.countytotals} updateState={this.updateState} updateCounty={this.updateCounty} zoom={this.getZoom} updateZoom={this.updateZoom} />
            <SideMenu
              statetotals={statetotals} countytotals={this.state.countytotals} currentState={displayState} currentCounty={this.state.displayCounty} currentLayers={currentLayers} />
          </React.Fragment>
        )}
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
