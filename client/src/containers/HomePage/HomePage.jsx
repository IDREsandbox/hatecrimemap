import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

import MapWrapper from '../../components/MapWrapper/MapWrapper';
import SideMenu from '../../components/SideMenu/SideMenu';
import { updateCurrentLayers, getMapData, storeMapData, getAllPoints, storeStateData } from '../../utils/filtering';
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
    mapdata: [],
    statesdata: {},
    currentLayers: new Set(['all']),
  };

  componentDidMount() {
    const allpoints = getAllPoints();
    if (allpoints.length !== 0) {
      this.setState({
        isFetching: false,
        mapdata: allpoints,
      });
      return;
    }
    // axios.all(['/api/maps/usapoints', '/api/totals'])
    //   .then(axios.spread((points, totals) => {
    //     this.setState({
    //       isFetching: false,
    //       mapdata: storeMapData(mapdata)
    //     })
    //   }));
    axios.get('/api/maps/usadata')
      .then(({ data: { data } }) => {
        this.setState({
          isFetching: false,
          mapdata: storeMapData(data[0]),
          statesdata: storeStateData(data[1])
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
  //     .then(({ data: {statesdata} {} => {
  //       this.setState({
  //       mapdata: getMapData(name, newLayers),
  //       statesdata: statesdata.result,
  //       currentLayers: newLayers,
  //     });
  //   });
  // }

  resetMapData = () => {
    this.setState({
      mapdata: getAllPoints(),
      currentLayers: new Set(['all']),
     });
  }

  render() {
    const { isFetching, mapdata, statesdata, currentLayers } = this.state;
    const { classes } = this.props;

    return (
      <div className="homePage">
        {isFetching ? (
          <CircularProgress className={classes.progress} />
        ) : (
          <React.Fragment>
        {/* TODO: context for mapdata and statesdata? */}
            <MapWrapper mapdata={mapdata} statesdata={statesdata} zoom={6} />
            <SideMenu updateMapData={this.updateMapData} resetMapData={this.resetMapData} statesdata={statesdata} currentLayers={currentLayers} />
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
