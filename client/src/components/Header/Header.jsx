import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

const Header = () => (
  <div className="headerContainer">
    <h1 className="header"><Link to="/">Mapping Harassment in the US</Link></h1>
    <Link to="/submitclaim">
      <button className="header__submitClaim">Submit Claim</button>
    </Link>
  </div>
);

export default Header;
