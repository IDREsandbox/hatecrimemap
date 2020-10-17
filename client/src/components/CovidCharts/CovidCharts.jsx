import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import './CovidCharts.css';
import { Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { COVID_CHARTS, CHART_STRINGS, getCovidChartData, sumData } from '../../utils/chart-utils';
import { Bar, Pie } from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';

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



const styles = theme => ({

});
/*
          <Bar data={getChartData(COVID_CHARTS.RACE_ETHNICITY, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(COVID_CHARTS.RELIGION, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(COVID_CHARTS.GENDER_SEXUALITY, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(COVID_CHARTS.OTHER, this.props.data)} options={wholeYAxis} />
*/

const TableDiaglog = (props) => {
  const [open, toggleOpen] = useState(false);

    return (
      <div>

      </div>
    );
  }


const covidRE = ["Asian", "Native American/Indigenous", "African American", "Latinx", "White", "Other"]
const covidGender = ["Male", "Female", "Other"]
const covidType = ["Verbal", "Physical", "Coughing/Spitting", "Online", "Other"]
const covidOther = ["Unknown"]


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
    console.log(elems)
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

  pi = (elems) => {
    // index into `data` of the bar clicked
    if (!elems[0]) {
      return
    }
    const dataIdx = elems[0]._index
    switch(dataIdx) {
      case 0:
        this.setState({currentDisplay: dataIdx+1, drilldown: this.props.data["Race/Ethnicity"].children})
        break
      case 1:
        this.setState({currentDisplay: dataIdx+1, drilldown: this.props.data["Religion"].children})
        break
      case 2:
        this.setState({currentDisplay: dataIdx+1, drilldown: this.props.data["Gender/Sexuality"].children})
        break
      case 3:
        this.setState({currentDisplay: dataIdx+1, drilldown: this.props.data["Miscellaneous"].children})
    }

    
  }

  render() {
    if (this.props.data && this.state.options) {
        const covidData = getCovidChartData(this.props.data, this.props.currState);
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
              <Grid container item justify="center" xs={6}>
                <h4>Ethnicity</h4>
                <Pie onElementsClick={this.pieREClick} data={covidData[0]} options={{legend: { display: false } }} />
              </Grid>
              <Grid container item justify="center" xs={6}>
                <h4>Gender</h4>
                <Pie onElementsClick={this.pieGenderClick} data={covidData[1]} options={{legend: { display: false } }} />
              </Grid>
            </Grid>
            <br/>
            <br/>
            <Grid container justify="space-between">
              <Grid container item justify="center" xs={6}>
                <h4>Type</h4>
                <Pie onElementsClick={this.pieTypeClick} data={covidData[2]} options={{legend: { display: false } }} />
              </Grid>
              <Grid container item justify="center" xs={6}>
                <h4>Other</h4>
                <Pie onElementsClick={this.pieClick} data={covidData[3]} options={{legend: { display: false } }} />
              </Grid>
            </Grid>



            <Dialog
              open={this.state.dialogOpen}
              onClose={() => this.toggleOpen(false)}
              maxWidth="xl"
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">{this.state.dialogShow.charAt(0).toUpperCase() + this.state.dialogShow.slice(1)}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <TableContainer component={Paper}>
                    <Table className={this.props.classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date (Y/M/D)</TableCell>
                          <TableCell>City, State</TableCell>
                          <TableCell>Ethnicity</TableCell>
                          <TableCell>Gender</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        { this.props.currState == "none" ? 
                          (
                            Object.values(this.props.data).filter(val => val instanceof Object).reduce( (prev, next) => (
                              prev.concat(next.children.filter(el => el[this.state.dialogShow] == this.state.dialogFilter))
                              ), []).map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>{row.date.split('T')[0]}</TableCell>
                              <TableCell>{row.city + ", " + row.state}</TableCell>
                              <TableCell>{row.ethnicity}</TableCell>
                              <TableCell>{row.gender}</TableCell>
                              <TableCell>{row.type}</TableCell>
                              <TableCell>{row.description}</TableCell>
                            </TableRow>
                          ))
                          )
                          :

                          this.props.data[this.props.currState]
                          && this.props.data[this.props.currState].children
                          && this.props.data[this.props.currState].children.filter(el => el[this.state.dialogShow]==this.state.dialogFilter).map((row) => (
                            <TableRow key={row.id}>
                            <TableCell>{row.date.split('T')[0]}</TableCell>
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
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => this.toggleOpen(false)} color="primary" autoFocus>
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