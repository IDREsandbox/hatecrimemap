import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import './Charts.css';
import { Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { CHARTS, CHART_STRINGS, getChartData, sumData } from '../../utils/chart-utils';
import { Bar, Pie } from 'react-chartjs-2';
import ChartsText from './ChartText';
import Grid from '@material-ui/core/Grid';

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
          <Bar data={getChartData(CHARTS.RACE_ETHNICITY, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(CHARTS.RELIGION, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(CHARTS.GENDER_SEXUALITY, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(CHARTS.OTHER, this.props.data)} options={wholeYAxis} />
*/
class Charts extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      currentDisplay: CHARTS.TOP,
      dialogOpen: false,
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
      drilldown: {}
    }
  }

  barUnClick = () => {
    this.setState({currentDisplay: CHARTS.TOP})
  }

  pieClick = (elems) => {
    this.setState({ dialogOpen: true });
  }

  toggleOpen = (open) => {
    this.setState({ dialogOpen: open });
  }

  barClick = (elems) => {
    // index into `data` of the bar clicked
    if (!elems[0]) {
      return
    }
    const dataIdx = elems[0]._index
    switch(dataIdx) {
      case 0:
        this.setState({currentDisplay: dataIdx+1, drilldown: "Race/Ethnicity"})
        break
      case 1:
        this.setState({currentDisplay: dataIdx+1, drilldown: "Religion"})
        break
      case 2:
        this.setState({currentDisplay: dataIdx+1, drilldown: "Gender/Sexuality"})
        break
      case 3:
        this.setState({currentDisplay: dataIdx+1, drilldown: "Miscellaneous"})
    }

    
  }

  render() {
    if (this.props.data && this.state.options) {
      if(this.state.currentDisplay != CHARTS.TOP) {
        // Pie charts!
        return (
          <div key={this.props.currState} className="charts">
            <Grid container justify="space-between">
              <Grid item xs={3}>
                <Button variant="outlined" color="primary" size="small" aria-label="back" onClick={this.barUnClick} startIcon={<ArrowBack />}>Back</Button>
              </Grid>
              <Grid item xs={6} style={{'textAlign': 'center'}}>
                <h4>{CHART_STRINGS[this.state.currentDisplay-1]}</h4>
              </Grid>
              <Grid item xs={3}>{/* to center the title */}</Grid>
            </Grid>
            <Pie data={getChartData(this.state.currentDisplay, this.props.data[this.state.drilldown].children)} 
                  onElementsClick={this.pieClick}/>
            {/*<ChartsText data={this.props.data[this.state.drilldown].children} />*/}

            <Dialog
              open={this.state.dialogOpen}
              onClose={() => this.toggleOpen(false)}
              maxWidth="xl"
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">Hate Crimes</DialogTitle>
              <DialogContent>
                <DialogContentText>
                    <Table stickyHeader className="hello" aria-label="simple table">
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
                            <TableRow>
                              <TableCell>_</TableCell>
                              <TableCell>_</TableCell>
                              <TableCell>_</TableCell>
                              <TableCell>_</TableCell>
                              <TableCell>_</TableCell>
                              <TableCell>_</TableCell>
                            </TableRow>
                      </TableBody>
                    </Table>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => this.toggleOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )
      }

      return (
        <div className="charts">
          <Bar data={getChartData(CHARTS.TOP, this.props.data)} options={this.state.options}
               onElementsClick={this.barClick} />
          {/*<ChartsText data={this.props.data} />*/}
        </div>
      )
    }

    return null;
  }
}

export default withStyles(styles)(Charts);