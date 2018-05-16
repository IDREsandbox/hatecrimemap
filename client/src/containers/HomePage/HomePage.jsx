import React, { Component } from 'react';
import axios from 'axios';

import MapWrapper from '../../components/MapWrapper/MapWrapper';
import SideMenu from '../../components/SideMenu/SideMenu';
import { updateCurrentLayers, getMapData, storeMapData, allpoints } from '../../utils/filtering';
import './HomePage.css';

// remove after May meeting
function printUnique(mapdata) {
  const gh = mapdata.map(group => group.groupharassedcleaned);
  const ghDelimited = gh
    .map(group => group.split(','))
    .reduce((acc, val) => acc.concat(val), []);
  const noDupes = Array.from(new Set(ghDelimited));
  console.log(noDupes.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }));
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      mapdata: [],
      currentLayers: new Set(),
    };
  }

  componentDidMount() {
    if (allpoints.length !== 0) {
      this.setState({
        isFetching: false,
        mapdata: allpoints.slice(),
      });
      return;
    }
    axios.get('/api/maps/usapoints')
      .then(({ data: { mapdata } }) => {
        storeMapData(mapdata);
        this.setState({
          isFetching: false,
          mapdata,
        });
        printUnique(mapdata);
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        alert(`API call failed: ${err}`);
      });
  }

  updateMapData = ({ target: { name } }) => {
    const currentLayers = updateCurrentLayers(name, this.state.currentLayers);
    this.setState({
      mapdata: getMapData(name, currentLayers).slice(),
      currentLayers,
    });
  }

  resetMapData = () => {
    this.setState({
      mapdata: allpoints.slice(),
      currentLayers: new Set(),
     });
  }

  render() {
    const { isFetching, mapdata, currentLayers } = this.state;

    return (
      <div className="homePage">
        {!isFetching &&
          <React.Fragment>
            <MapWrapper mapdata={mapdata} zoom={4} />
            <SideMenu updateMapData={this.updateMapData} resetMapData={this.resetMapData} currentLayers={currentLayers} />
          </React.Fragment>}
      </div>
    );
  }
}
