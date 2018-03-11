import React, { Component } from 'react';
import axios from 'axios';

import SimpleMap from './components/SimpleMap/SimpleMap';

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
    axios.get('/maps/allpoints')
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
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Hate Crime Map</h2>
        </div>
        {!isFetching &&
          <SimpleMap mapdata={mapdata} />}
        <p className="App-intro">
          {isFetching
            ? 'Fetching data'
            : message}
        </p>
      </div>
    );
  }
}
