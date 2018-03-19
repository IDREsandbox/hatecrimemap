import React, { Component } from 'react';
import axios from 'axios';

import MapContainer from '../../components/MapContainer/MapContainer';
import SideMenu from './components/SideMenu/SideMenu';
import './HomePage.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      mapdata: [],
    };
  }

  componentDidMount() {
    axios.get('/api/maps/allpoints')
      .then((res) => {
        this.setState({
          isFetching: false,
          mapdata: res.data.mapdata,
        });
      })
      .catch((err) => {
        this.setState({
          isFetching: false,
        });
        alert(`API call failed: ${err}`);
      });
  }

  render() {
    const { isFetching, mapdata } = this.state;
    return (
      <div className="homePage">
        {!isFetching &&
          <React.Fragment>
            <MapContainer mapdata={mapdata} zoom={4} />
            <SideMenu />
          </React.Fragment>}
      </div>
    );
  }
}
