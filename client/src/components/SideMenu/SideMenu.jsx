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

const SideMenu = ({ statetotals, currentDisplay, currentLayers, classes }) => {
  const showReportsValue = getShowReportsValue(currentLayers);

  if(currentDisplay != "none")
  {
    const a = statetotals[currentDisplay];
    var raceData = [a['african_american_harassed_total'], a['arab_harassed_total'], a['asian_american_harassed_total'], a['latinx_harassed_total'], a['native_american_harassed_total'], a['pacific_islander_harassed_total'], a['immigrants_harassed_total'], a['white_harassed_total']];
    // ( ({ african_american_harassed_total, arab_harassed_total, asian_american_harassed_total, latinx_harassed_total, native_american_harassed_total, pacific_islander_harassed_total, immigrants_harassed_total, white_harassed_total }) => ({ african_american_harassed_total, arab_harassed_total, asian_american_harassed_total, latinx_harassed_total, native_american_harassed_total, pacific_islander_harassed_total, immigrants_harassed_total, white_harassed_total }) )(statetotals[currentDisplay]);
  var religionData = [a['jewish_harassed_total'], a['muslim_harassed_total'], a['sikh_harassed_total']];
    //( ({jewish_harassed_total, muslim_harassed_total, sikh_harassed_total}) => ({jewish_harassed_total, muslim_harassed_total, sikh_harassed_total}) )(statetotals[currentDisplay]);
  var genderData = [a['lgbt_harassed_total'], a['women_harassed_total'], a['girls_harassed_total'], a['men_harassed_total'], a['boys_harssed_total']];
    //( ({lgbt_harassed_total, women_harassed_total, girls_harassed_total, men_harassed_total, boys_harassed_total}) => ({lgbt_harassed_total, women_harassed_total, girls_harassed_total, men_harassed_total, boys_harassed_total}) )(statetotals[currentDisplay]);
  var otherData = [a['diabled_harassed_total'], a['trump_supporter_harassed_total'], a['others_harassed_total']];
    //( ({disabled_harassed_total, trump_supporter_harassed_total, others_harassed_total}) => ({disabled_harassed_total, trump_supporter_harassed_total, others_harassed_total}))(statetotals[currentDisplay]);
} else {
  var raceData = [];
  var religionData = [];
  var genderData = [];
  var otherData = [];
}
  var raceChartData = {
               labels: ["African American", "Arab", "Asian American", "Chinese", "Native American/Alaska Native", "Latinx", "Pacific Islander", "White"],
               datasets: [
               {       label:"Number of Hate Crimes against Race Groups",
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                       data: raceData
               }
               ]
           };
    var religionChartData = {
               labels: ["Jewish", "Muslim", "Sikh"],
               datasets: [
               {       label:"Number of Hate Crimes against Religious Groups",
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                       data: religionData
               }
               ]
           };
    var genderChartData = {
               labels: ["Women", "Men", "Girls", "Boys"],
               datasets: [
               {       label:"Number of Hate Crimes based on Gender",
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                       data: genderData
               }
               ]
           };
    var otherChartData = {
               labels: ["LGBT", "Trump Supporter", "Disabled"],
               datasets: [
               {       label:"Number of Hate Crimes against Other Groups",
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                       data: otherData
               }
               ]
           };
    

  return (
    <div className="sideMenu">
      <h2 className="sideMenu__header">{currentDisplay}</h2>
        {/* Insert react-chartJS stuff here */}
        {/* Don't forget to install and import the library here */}
        {/* and I think the statetotals looks like the pastebin on slack */}
        <div className="sideMenu__chart">
        { raceData && 
            <Bar data={raceChartData} />
         }
        { religionData && 
            <Bar data={religionChartData} />
         }
        { genderData && 
            <Bar data={genderChartData} />
         }
        { otherData && 
            <Bar data={otherChartData} />
         }
         </div>
         {/*
         <BarChart
           type: 'bar',
           data: {
               labels: ["Jewish","Muslim", "Sikh"],
               datasets:[
               {
                   label: "Number of Hate Crimes against Religious Groups",
                   backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
                   data: [religionData]
               }
               ]
           }
       />
         <BarChart
             type: 'bar',
           data: {
               labels: ["Women","Men", "Girls", "Boys"];
               datasets:[
                   {
                       label: "Number of Hate Crimes based on Gender",
                       backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
                   data: [genderData]
                   }
               ]
         }
       />*/}


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
