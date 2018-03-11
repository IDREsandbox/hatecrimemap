import React, { Component } from 'react';
import axios from 'axios';

import SimpleMap from './components/SimpleMap/SimpleMap';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isFetching: true,
      data: [],
    };
  }

  componentDidMount() {
    axios.get('/api/maps/allpoints')
      .then((res) => {
        this.setState({
          message: res.data.message,
          isFetching: false,
          data: res.data.data,
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
    const { message, isFetching, data } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Hate Crime Map</h2>
        </div>
        {!isFetching &&
          <SimpleMap mapdata={data} />}
        <p className="App-intro">
          {isFetching
            ? 'Fetching data'
            : message}
        </p>
      </div>
    );
  }
}
