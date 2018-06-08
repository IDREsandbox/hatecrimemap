import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import MapWrapper from '../../components/MapWrapper/MapWrapper';
import SideMenu from '../../components/SideMenu/SideMenu';
import { updateCurrentLayers, getMapData, storeMapData, getAllPoints } from '../../utils/filtering';
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
      isFetching: true,
      mapdata: [],
      currentLayers: new Set(),
    };
  }

  componentDidMount() {
    const allpoints = getAllPoints();
    if (allpoints.length !== 0) {
      this.setState({
        isFetching: false,
        mapdata: allpoints,
      });
      return;
    }
    axios.get('/api/maps/usapoints')
      .then(({ data: { mapdata } }) => {
        this.setState({
          isFetching: false,
          mapdata: storeMapData(mapdata),
        });
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        alert(`API call failed: ${err}`);
      });
  }

  updateMapData = ({ target: { name } }) => {
    const currentLayers = updateCurrentLayers(name, this.state.currentLayers);
    this.setState({
      mapdata: getMapData(name, currentLayers),
      currentLayers,
    });
  }

  resetMapData = () => {
    this.setState({
      mapdata: getAllPoints(),
      currentLayers: new Set(),
     });
  }

  render() {
    const { isFetching, mapdata, currentLayers } = this.state;
    const { classes } = this.props;

    return (
      <div className="homePage">
        {isFetching ? (
          <CircularProgress className={classes.progress} />
        ) : (
          <React.Fragment>
            <MapWrapper mapdata={mapdata} zoom={4} />
            <SideMenu updateMapData={this.updateMapData} resetMapData={this.resetMapData} currentLayers={currentLayers} />
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
