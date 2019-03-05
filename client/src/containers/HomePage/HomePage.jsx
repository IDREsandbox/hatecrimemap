import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

import MapWrapper from '../../components/MapWrapper/MapWrapper';
import SideMenu from '../../components/SideMenu/SideMenu';
// import { updateCurrentLayers, getMapData, storeMapData, getAllPoints, storeStateData } from '../../utils/filtering';
import { storeStateData } from '../../utils/filtering';
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
    isFetching: true,
    statetotals: {},
    currentLayers: new Set(['all']),
    display: 'none',
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
  sideMenuDisplay = (state, lock = false) => {
    if(lock) {
      this.setState({display: state, locked: state!=="none"});  // we never want to lock onto None
      return true;
    } else if(!this.state.locked) {
      this.setState({display: state});
      return true;
    }
    return false;
  }

  render() {
    const { isFetching, statetotals, display, currentLayers } = this.state;
    const { classes } = this.props;

    return (
      <div className="homePage">
        {isFetching ? (
          <CircularProgress className={classes.progress} />
        ) : (
          <React.Fragment>
        {/* TODO: context for mapdata and statetotals? */}
            <MapWrapper statetotals={statetotals} zoom={4} updateDisplay={this.sideMenuDisplay} />
            <SideMenu
              statetotals={statetotals} currentDisplay={display} currentLayers={currentLayers} />
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
