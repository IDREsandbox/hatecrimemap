import React, { Component } from 'react';
import axios from 'axios';

import SimpleMap from './components/SimpleMap/SimpleMap';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      fetching: true,
      mapdata: [],
    };
  }

  componentDidMount() {
    axios.get('/api/mapdata')
      .then((res) => {
        this.setState({
          message: res.data.message,
          fetching: false,
          mapdata: res.data.mapdata,
        });
      })
      .catch((err) => {
        this.setState({
          message: `API call failed: ${err}`,
          fetching: false,
        });
      });
  }

  render() {
    const { message, fetching, mapdata } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Hate Crime Map</h2>
        </div>
        {fetching
          ? 'Fetching data'
          : <SimpleMap mapdata={mapdata} />}
        <p className="App-intro">
          {fetching
            ? 'Fetching message from API'
            : message}
        </p>
      </div>
    );
  }
}
