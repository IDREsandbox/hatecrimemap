import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

const Header = () => (
  <div className="headerContainer">
    <h1 className="header">
      <Link to="submitclaim">Mapping Harassment in the US</Link>
    </h1>
  </div>
);

export default Header;
