import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import {
//   FormGroup,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
// } from '@material-ui/core';
import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';
import './SideMenu.css';
import { Bar } from 'react-chartjs-2';

function getShowReportsValue(layers) {
  if (layers.has('verified')) return 'verified';
  if (layers.has('unverified')) return 'unverified';
  return 'all';
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

const SideMenu = ({ statetotals, countytotals, currentState, currentCounty, currentLayers, classes }) => {
  const showReportsValue = getShowReportsValue(currentLayers);
  // const maxAxis = Object.keys(statetotals).map(state => Object.keys(statetotals[state]).reduce((prev, curr) => (statetotals[state].curr) > prev ? statetotals[state].curr : prev)).reduce((prev, curr) => (prev > curr ? prev : curr));

  console.log(currentState,currentCounty);

  let dataSource;

  if(currentState != "none")
  {
    dataSource = statetotals[currentState];
  } else if(currentCounty != "none") {
    dataSource = countytotals[currentCounty];
  } else {
    return (
      <div className="sideMenu">
        <h2 className="sideMenu__header">Hover over a state</h2>
        <div className="sideMenu__info">
          <p>Hover a state to display 4 charts of hate crime data within that state</p>
          <p>Click a state to lock onto it</p>
        </div>
      </div>
    );
  }
  var raceData = [dataSource['african_american_harassed_total'], dataSource['arab_harassed_total'], dataSource['asian_american_harassed_total'], dataSource['latinx_harassed_total'], dataSource['native_american_harassed_total'], dataSource['pacific_islander_harassed_total'], dataSource['immigrants_harassed_total'], dataSource['white_harassed_total']];
  // ( ({ african_american_harassed_total, arab_harassed_total, asian_american_harassed_total, latinx_harassed_total, native_american_harassed_total, pacific_islander_harassed_total, immigrants_harassed_total, white_harassed_total }) => ({ african_american_harassed_total, arab_harassed_total, asian_american_harassed_total, latinx_harassed_total, native_american_harassed_total, pacific_islander_harassed_total, immigrants_harassed_total, white_harassed_total }) )(statetotals[currentState]);
  var religionData = [dataSource['jewish_harassed_total'], dataSource['muslim_harassed_total'], dataSource['sikh_harassed_total']];
  //( ({jewish_harassed_total, muslim_harassed_total, sikh_harassed_total}) => ({jewish_harassed_total, muslim_harassed_total, sikh_harassed_total}) )(statetotals[currentState]);
  var genderData = [dataSource['lgbt_harassed_total'], dataSource['women_harassed_total'], dataSource['girls_harassed_total'], dataSource['men_harassed_total'], dataSource['boys_harssed_total']];
  //( ({lgbt_harassed_total, women_harassed_total, girls_harassed_total, men_harassed_total, boys_harassed_total}) => ({lgbt_harassed_total, women_harassed_total, girls_harassed_total, men_harassed_total, boys_harassed_total}) )(statetotals[currentState]);
  var otherData = [dataSource['diabled_harassed_total'], dataSource['trump_supporter_harassed_total'], dataSource['others_harassed_total']];
  //( ({disabled_harassed_total, trump_supporter_harassed_total, others_harassed_total}) => ({disabled_harassed_total, trump_supporter_harassed_total, others_harassed_total}))(statetotals[currentState]);

  var raceChartData = {
    labels: ["African American", "Arab", "Asian American", "Chinese", "Native American/Alaska Native", "Latinx", "Pacific Islander", "White"],
    datasets: [
    {
      label:"Number of Hate Crimes against Race Groups",
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: raceData
    }]
  };
  var religionChartData = {
    labels: ["Jewish", "Muslim", "Sikh"],
    datasets: [
    {
      label:"Number of Hate Crimes against Religious Groups",
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: religionData
    }]
  };
  var genderChartData = {
    labels: ["Women", "Men", "Girls", "Boys"],
    datasets: [
    {
      label:"Number of Hate Crimes based on Gender",
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: genderData
    }]
  };
  var otherChartData = {
    labels: ["LGBT", "Trump Supporter", "Disabled"],
    datasets: [
    {
      label:"Number of Hate Crimes against Other Groups",
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: otherData
    }]
  };

  const wholeYAxis = {scales: {
        yAxes: [{
          ticks: {
            // beginAtZero:true,
            // callback: function(value) {if(value % 1 ===0) {return value;}},
            min: 0,
            max: 30
            // stepSize: 1
          }
        }]
      }};

  return (
    <div className="sideMenu">
      <h2 className="sideMenu__header">{currentState != "none" ? currentState : (currentCounty)}</h2>
      <div className="sideMenu__chart">
        { raceData && 
          <Bar data={raceChartData} options={wholeYAxis}/>
        }
        { religionData && 
          <Bar data={religionChartData} options={wholeYAxis}/>
        }
        { genderData && 
          <Bar data={genderChartData} options={wholeYAxis}/>
        }
        { otherData && 
          <Bar data={otherChartData} options={wholeYAxis}/>
        }
      </div>

    </div>
  );



  /////////// filtering side menu
  /*return (
    <div className="sideMenu">
      <h2 className="sideMenu__header">Filters</h2>
      <FormGroup className="sideMenu__form">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="showReports">Show Reports</InputLabel>
          <Select
            value={showReportsValue}
            onChange={updateMapData}
            inputProps={{
              name: 'reports',
              id: 'showReports',
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="verified">Verified Reports</MenuItem>
            <MenuItem value="unverified">Unverified Reports</MenuItem>
          </Select>
        </FormControl>
        <GHCheckboxList onClick={updateMapData} groupsChecked={currentLayers} showSVGs />
        <Button className={classes.button} variant="raised" onClick={resetMapData} color="primary">
          Reset Filters
        </Button>
      </FormGroup>
    </div>
    );*/
  };

  SideMenu.propTypes = {
  // updateMapData: PropTypes.func.isRequired,
  // resetMapData: PropTypes.func.isRequired,
  currentLayers: PropTypes.instanceOf(Set).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideMenu);
