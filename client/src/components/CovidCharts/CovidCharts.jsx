import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import './CovidCharts.css';
import { Button } from '@material-ui/core';
import { ArrowBack, ThreeSixty } from '@material-ui/icons';
import { COVID_CHARTS, CHART_STRINGS, getCovidChartData, sumData, takeTop } from 'utils/chart-utils';
import { Bar, Pie } from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';
import { Resizable } from "re-resizable";

import { useState } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import WordCloud from '../Charts/elements/WordCloud/WordCloud';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';


const styles = theme => ({

});
/*
          <Bar data={getChartData(COVID_CHARTS.RACE_ETHNICITY, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(COVID_CHARTS.RELIGION, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(COVID_CHARTS.GENDER_SEXUALITY, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(COVID_CHARTS.OTHER, this.props.data)} options={wholeYAxis} />
*/


const resizeStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const columns = [
  { field: 'date', headerName: 'Date of Incident', width: 70 },
  { field: 'cityState', headerName: 'Location', width: 100,
    valueGetter: (params) => `${params.getValue('city')}, ${params.getValue('state')}` },
  {
    field: 'ethnicity',
    headerName: 'Ethnicity',
    width: 90,
  },
  {
    field: 'gender',
    headerName: 'Gender',
    width: 90,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 90,
  },
  {
    field: 'description',
    headerName: 'Description',
    description: 'These are self-reported descriptions.',
    sortable: false,
    width: 160,
    valueGetter: (params) => `${params.getValue('description')}\n${params.getValue('link') || ''}`
  },
]

const covidRE = ["Asian", "Native American/Indigenous", "African American", "Latinx", "White", "Other"]
const covidGender = ["Male", "Female", "Other"]
const covidType = ["Verbal", "Physical", "Coughing/Spitting", "Online", "Other"]
const covidOther = ["Unknown"]


const options = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  enableTooltip: true,
  deterministic: false,
  fontFamily: "impact",
  fontSizes: [12, 30],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 0],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000
};

const size = [200, 200];
const words = [
  {
    text: 'told',
    value: 64,
  },
  {
    text: 'mistake',
    value: 11,
  },
  {
    text: 'thought',
    value: 16,
  },
  {
    text: 'bad',
    value: 17,
  },
]

const callbacks = {}

class CovidCharts extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      currentDisplay: COVID_CHARTS.TOP,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              // beginAtZero:true,
              // callback: function(value) {if(value % 1 ===0) {return value;}},
              min: 0,
              max: parseInt(props.max) || 68
              // stepSize: 1
            }
          }]
        }
      },
      drilldown: {},
      dialogOpen: false,
      dialogShow: "all",
      dialogFilter: 0
    }
  }

  toggleOpen = (open) => {
    this.setState({ dialogOpen: open });
  }

  barUnClick = () => {
    this.setState({currentDisplay: "TOP"})
  }

  pieREClick = (elems) => {
    this.setState({ dialogOpen: true, dialogShow: "ethnicity", dialogFilter: covidRE[elems[0]._index]})
  }
    pieGenderClick = (elems) => {
    this.setState({ dialogOpen: true, dialogShow: "gender", dialogFilter: covidGender[elems[0]._index]})
  }
    pieTypeClick = (elems) => {
    this.setState({ dialogOpen: true, dialogShow: "type", dialogFilter: covidType[elems[0]._index]})
  }
    pieOtherClick = (elems) => {
    this.setState({ dialogOpen: true, dialogShow: "other", dialogFilter: covidOther[elems[0]._index]})
  }

  render() {
    if (this.props.data && this.state.options) {
        const covidData = getCovidChartData(this.props.data, this.props.currState);
        // const covidWords = covidData[3].reduce((prev,next)=>prev.concat(next),[])


        // console.log(this.props.wordCloudData[this.props.currState])

        // need to figure out what to do for wordcloud when nothing is selected....
        const rows = this.props.currState == "none" ? 
                          (
                            Object.values(this.props.data).filter(val => val instanceof Object).reduce( (prev, next) => (
                              prev.concat(next.children.filter(el => el[this.state.dialogShow] && el[this.state.dialogShow].includes(this.state.dialogFilter)))
                              ), [])
                            )
                          :
                          (this.props.data[this.props.currState]
                          && this.props.data[this.props.currState].children
                          && this.props.data[this.props.currState].children.filter(el => el[this.state.dialogShow] && el[this.state.dialogShow].includes(this.state.dialogFilter)));

        return (

        <div className="CovidCharts">

            {/*<Grid container justify="space-between">
              <Grid item xs={3}>
                <Button variant="outlined" color="primary" size="small" aria-label="back" onClick={this.barUnClick} startIcon={<ArrowBack />}>Back</Button>
              </Grid>
              <Grid item xs={6} style={{'textAlign': 'center'}}>
                <h4>{CHART_STRINGS[this.state.currentDisplay]} ({sumData(this.state.drilldown)} total)</h4>
              </Grid>
              <Grid item xs={3}>* to center the title *</Grid>
            </Grid>*/}
            <Grid container justify="space-between">
              <WordCloud words={this.props.currState != 'none' ? this.props.wordCloudData[this.props.currState]
                          : takeTop(Object.values(this.props.wordCloudData).flat())} />        
              <Grid container item justify="center" xs={6}>
                <h4>Ethnicity</h4>
                
                <Pie onElementsClick={this.pieREClick} data={covidData[0]} options={{legend: { display: false } }} />
              </Grid>
              <Grid container item justify="center" xs={6}>
                <h4>Gender</h4>
                <Pie onElementsClick={this.pieGenderClick} data={covidData[1]} options={{legend: { display: false } }} />
            </Grid>
            <br/>
            <br/>

              <Grid container item justify="center" xs={6}>
                <h4>Type</h4>
                <Pie onElementsClick={this.pieTypeClick} data={covidData[2]} options={{legend: { display: false } }} />
              </Grid>

            </Grid>



            <Dialog
              open={this.state.dialogOpen}
              onClose={() => this.toggleOpen(false)}
              maxWidth="xl"
              aria-labelledby="responsive-dialog-title">
              <DialogTitle id="responsive-dialog-title">{this.state.dialogShow.charAt(0).toUpperCase() + this.state.dialogShow.slice(1)}</DialogTitle>
              <DialogContent>
                  <TableContainer>
                    <Table stickyHeader className={this.props.classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date (M/D/YY)</TableCell>
                          <TableCell>City, State</TableCell>
                          <TableCell>Ethnicity</TableCell>
                          <TableCell>Gender</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        { rows.map((row) => (
                          <TableRow key={row.ID}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.city + ", " + row.state}</TableCell>
                            <TableCell>{row.ethnicity}</TableCell>
                            <TableCell>{row.gender}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button id="closeDataTable" onClick={() => this.toggleOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )
      }

    return null;
  }
}

export default withStyles(styles)(CovidCharts);
/*
Replace with DataGrid later?
                  <DataGrid rows={rows} columns={columns} />
*/