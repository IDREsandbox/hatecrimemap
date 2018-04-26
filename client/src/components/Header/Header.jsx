import React from 'react';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import AppBar from 'material-ui/AppBar';

import './Header.css';

const Header = () => (
  <AppBar
    className="headerContainer"
    title="Mapping Harassment in the US"
    iconElementLeft={<Link to="/"><IconButton><ActionHome /></IconButton></Link>}
    iconElementRight={
      <Link to="/submitclaim">
        <RaisedButton
          className="header__submitClaim"
          label="Submit Claim"
        />
      </Link>}
  />
);

export default Header;
