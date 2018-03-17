import React, { Component } from 'react';

import HomePage from './pages/HomePage/HomePage';
import Header from './components/Header/Header';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Header />
        <HomePage />
      </div>
    );
  }
}
