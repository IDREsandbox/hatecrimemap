import React, { Component } from 'react';
import axios from 'axios';

import MapContainer from '../../components/MapContainer/MapContainer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isFetching: true,
      mapdata: [],
    };
  }

  componentDidMount() {
    axios.get('/api/maps/allpoints')
      .then((res) => {
        this.setState({
          message: res.data.message,
          isFetching: false,
          mapdata: res.data.mapdata,
        });
      })
      .catch((err) => {
        this.setState({
          message: `API call failed: ${err}`,
          isFetching: false,
        });
      });
  }

  render() {
    const { message, isFetching, mapdata } = this.state;
    return (
      <div>
        <p>
          {isFetching
            ? 'Fetching data'
            : message}
        </p>
        {!isFetching &&
          <MapContainer mapdata={mapdata} zoom={5} />}
      </div>
    );
  }
}
