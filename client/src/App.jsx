import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
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
          {this.state.fetching
            ? 'Fetching message from API'
            : this.state.message}
        </p>
      </div>
    );
  }
}

export default App;
