import React from 'react';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
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
      <Link to="/reportincident">
        <FlatButton
          className="header__reportIncident"
          label="Report Incident"
          style={{ color: 'white' }}
        />
      </Link>}
  />
);

export default Header;
