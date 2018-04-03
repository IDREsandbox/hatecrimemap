import React from 'react';

import HomePage from './pages/HomePage/HomePage';
import Header from './components/Header/Header';
import './App.css';

const App = () => (
  <div className="app">
    <Header />
    <HomePage />
  </div>
);

export default App;
