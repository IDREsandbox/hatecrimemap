import React, { Component } from 'react';
import axios from 'axios';

import { storeMapData, getAllPoints } from '../../utils/filtering';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      incidents: [],
    };
  }

  componentDidMount() {
    const allpoints = getAllPoints();
    if (allpoints.length !== 0) {
      this.setState({
        isFetching: false,
        incidents: allpoints,
      });
      return;
    }
    axios.get('/api/maps/usapoints')
      .then(({ data: { mapdata } }) => {
        mapdata = storeMapData(mapdata);
        this.setState({
          isFetching: false,
          incidents: storeMapData(mapdata),
        });
        console.log(this.state.incidents[0]);
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        alert(`API call failed: ${err}`);
      });
  }

  render() {
    return (
      <div className="verifyIncidentsPage">
        Welcome to da page
      </div>
    );
  }
}
