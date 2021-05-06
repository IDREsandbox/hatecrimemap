import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import './Charts.css';
import { Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { CHARTS, CHART_STRINGS, getChartData, sumData } from 'utils/chart-utils';
import { Bar, Pie } from 'react-chartjs-2';
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

const RACE_LABELS = ["African American", "Asian", "Latinx", "Native American/Indigenous", "White", "Other Race/Ethnicity"]
const RELIGION_LABELS = ["Anti-Jewish", "Anti-Christian", "Anti-Muslim", "Other Religion"]
const GENDER_LABELS = ["Male", "Female", "Transgender", "LGBTQ+", "Non-Binary", "Other Gender/Sexuality"]
const MISC_LABELS = ["Immigrant", "Disabled", "National Origin", "Unknown", "Other Miscellaneous"]
const FILTERS = [RACE_LABELS, RELIGION_LABELS, GENDER_LABELS, MISC_LABELS]

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
              max: 90,
              // stepSize: 1
            }
          }]
        }
      },
      drilldown: {},
      popup_filter_num: 0,
      popup_filter: ""
    }
  }

  barUnClick = () => {
    this.setState({currentDisplay: CHARTS.TOP})
  }

  pieClick = (elems) => {
    if (!elems[0] || !elems[0]._chart) return;
    this.setState({ dialogOpen: true, popup_filter: elems[0]._chart.config.data.labels[elems[0]._index] });
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
        this.setState({currentDisplay: dataIdx+1, drilldown: "Race/Ethnicity", popup_filter_num: 0})
        break
      case 1:
        this.setState({currentDisplay: dataIdx+1, drilldown: "Religion", popup_filter_num: 1})
        break
      case 2:
        this.setState({currentDisplay: dataIdx+1, drilldown: "Gender/Sexuality", popup_filter_num: 2})
        break
      case 3:
        this.setState({currentDisplay: dataIdx+1, drilldown: "Miscellaneous", popup_filter_num: 3})
    }

    
  }

  render() {
    if (this.props.data && this.state.options) {

      if(this.state.currentDisplay != CHARTS.TOP) {

        const rows = this.props.currState == 'none' ? 
          Object.values(this.props.data).reduce(((p, c) => c instanceof Object ? p.concat(c.children.filter(e => e.group == this.state.popup_filter)) : p), [])
          : this.props.data[this.props.currState].children.filter(e => e.group == this.state.popup_filter);

        // Pie charts!
        return (
          <div key={this.props.currState} className="charts" >
            <Grid container justify="space-between">
              <Grid item xs={3}>
                <Button variant="outlined" color="primary" size="small" aria-label="back" id="chartbackButton" onClick={this.barUnClick} startIcon={<ArrowBack />}>Back</Button>
              </Grid>
              <Grid item xs={6} style={{'textAlign': 'center'}}>
                <h4>{CHART_STRINGS[this.state.currentDisplay-1]}</h4>
              </Grid>
              <Grid item xs={3}>{/* to center the title */}</Grid>
            </Grid>
            <Pie id="hatecrimePieChart" data={getChartData(this.state.currentDisplay, this.props.data, this.props.currState)} 
                  onElementsClick={this.pieClick}/>
            {/*<ChartsText data={this.props.data[this.state.drilldown].children} />*/}

            <Dialog
              open={this.state.dialogOpen}
              onClose={() => this.toggleOpen(false)}
              maxWidth="xl"
              aria-labelledby="responsive-dialog-title" id="hateCrimeDataTable"
            >
              <DialogTitle id="responsive-dialog-title">Hate Crimes</DialogTitle>
              <DialogContent>
                <Table stickyHeader className="hello" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date (M/D/Y)</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Primary Reason</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map(row => (
                          <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.state}</TableCell>
                            <TableCell>{row.group}</TableCell>
                            <TableCell>{row.link ? <a href={row.link} target="_blank">{row.link}</a> : "N/A"}</TableCell>
                            <TableCell>{row.description || ""}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </DialogContent>
              <DialogActions  id="closeDataTable">
                <Button onClick={() => this.toggleOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )
      }

      let { options } = this.state;
      if (options && this.props.currState == 'none') options.scales.yAxes[0].ticks.max = 700;
      else options.scales.yAxes[0].ticks.max = 90;

      return (
        <div className="charts" id="theChartsState">
          <Bar data={getChartData(CHARTS.TOP, this.props.data, this.props.currState)} options={options}
               onElementsClick={this.barClick} />
          {/*<ChartsText data={this.props.data} />*/}
        </div>
      )
    }

    return null;
  }
}

export default withStyles(styles)(Charts);