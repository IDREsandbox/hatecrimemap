import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isUrl from 'is-url';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  Tooltip,
} from '@material-ui/core';
import './AboutPage.css';

const styles = () => ({
});

const AboutPage = () => {
  return (
    <div className="aboutPage">
      <p>
      Hate crime—violence impelled by bigotry or bias—is a global and national human rights problem of significant concern. According to experts like the FBI, the Southern Poverty Law Center, and ProPublica, there has been a dramatic increase in hate crimes and harassment in the United States during the past three years. The presence of high-profile incidents of violence and aggression based on racial or other bias and intolerance is much more visible in the media; nevertheless, hate crimes statistics are notoriously unreliable. The definition of what constitutes a hate crime varies from jurisdiction to jurisdiction, and often is quite reduced in terms of what actions qualify. Underreporting is widespread, and often even when reporting happens, law enforcement is reluctant to designate crimes as hate crimes.
      </p>
      <p>
      The need for a publicly available resource documenting hate crimes has never been greater, yet accessible data on the type and frequency of crimes occurring is not currently available. The HateMap Project seeks to address this need by providing a crowd-sourced platform that enables researchers and victims to report hate-based incidents in detail, without having to approach law enforcement.
      </p>
    </div>
  );
}

export default withStyles(styles)(AboutPage);
// export default withStyles(styles)(AboutPage);