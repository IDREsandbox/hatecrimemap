import React, { Component } from 'react';
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
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
    console.log(mapdata);
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          {'This is '}
          <a href="https://github.com/mars/heroku-cra-node">
            {'create-react-app with a custom Node/Express server'}
          </a><br />
        </p>
        <p className="App-intro">
          {fetching
            ? 'Fetching message from API'
            : message}
        </p>
      </div>
    );
  }
}
