import React, { createRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import './Charts.css';
import { Button, LinearProgress } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { CHARTS, CHART_STRINGS, getChartData } from 'utils/chart-utils';
import { Bar, Pie } from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import axios from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import ChartDataLabels from 'chartjs-plugin-datalabels';

const styles = (theme) => ({

});

class Charts extends React.Component {
  chartReference = createRef();

  constructor(props) {
    super(props);

    this.state = {
      currentDisplay: CHARTS.TOP,
      dialogOpen: false,
      options: {
        plugins: {
          datalabels: {
            anchor: 'end',
            align(context) {
              const index = context.dataIndex;
              const value = context.dataset.data[index];
              if (value < 300) {
                return 'top';
              }
              return 'bottom';
            },
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              // beginAtZero:true,
              // callback: function(value) {if(value % 1 ===0) {return value;}},
              min: 0,
              max: 90,
              // stepSize: 1
            },
          }],
        },
        tooltips: {
          intersect: false,
          mode: 'index',
        },
      },
      drilldown: {},
      popup_filter_num: 0,
      popup_data: '',
      tableRows: {}, // cache indexed by state: { group: [{ID, date, state, group, link, description}]}}
    };
  }

  barUnClick = () => {
    this.setState({ currentDisplay: CHARTS.TOP });
  }

  pieClick = (elems) => {
    if (!elems[0] || !elems[0]._chart) return;
    this.setState({ dialogOpen: true, popup_data: null });
    const params = {
      parent_group: this.state.drilldown, // see: note in totals.js regarding ignoring this property
      group: elems[0]._chart.config.data.labels[elems[0]._index],
      // time: this.props.time
      state: 'all', // default, overriden if state appears
      // published: false //default
      lockItem: 'all',
      lockType: this.props.lockType,
    };
    this.props.filters.forEach((f) => params.lockItem = f[1]); // filters never has more than one, if dne foreach wont run tho
  
    // check cache
    if (this.state.tableRows[params.lockItem] && this.state.tableRows[params.lockItem][params.group]) {
      this.setState((prevState) => ({
        popup_data: prevState.tableRows[params.lockItem][params.group].filter((each) => (new Date(each.date).getFullYear() >= this.props.time[0] && new Date(each.date).getFullYear() <= this.props.time[1] && (!params.published || (params.published && each.published)))),
      }));
      return;
    }

    axios.get('/api/totals/filtered', {
      params,
    })
      .then(({ data }) => {
        if (data.status == 'success') {
          this.setState((prevState) => ({
            tableRows: {
              ...prevState.tableRows,
              [params.lockItem]: {
                ...prevState[params.state],
                [params.group]: data.result,
              },
            },
            popup_data: data.result.filter((each) => (new Date(each.date).getFullYear() >= this.props.time[0] && new Date(each.date).getFullYear() <= this.props.time[1] && (!params.published || (params.published && each.published)))),
          }));
        }
      });
  }

  toggleOpen = (open) => {
    this.setState({ dialogOpen: open });
  }

  barClick = (elems, event=null) => {
    // index into `data` of the bar clicked
    // TODO -> add requirements that click can only be inside the chart itself, not outside borders?
    if (!elems[0]) {
      if (this.state.currentDisplay == CHARTS.TOP) {
        const points = this.chartReference.current.chartInstance.getElementsAtXAxis(event);
        this.barClick(points);
      }
      return;
    }

    const dataIdx = elems[0]._index;
    switch (dataIdx) {
      case 0:
        this.setState({ currentDisplay: dataIdx + 1, drilldown: 'Race/Ethnicity', popup_filter_num: 0 });
        break;
      case 1:
        this.setState({ currentDisplay: dataIdx + 1, drilldown: 'Religion', popup_filter_num: 1 });
        break;
      case 2:
        this.setState({ currentDisplay: dataIdx + 1, drilldown: 'Gender/Sexuality', popup_filter_num: 2 });
        break;
      case 3:
        this.setState({ currentDisplay: dataIdx + 1, drilldown: 'Miscellaneous', popup_filter_num: 3 });
    }
  }

  render() {
    if (this.props.data && this.state.options) {
      if (this.state.currentDisplay != CHARTS.TOP) {
        // const rows = this.props.currState == 'none' ?
        //   Object.values(this.props.data).reduce(((p, c) => c instanceof Object ? p.concat(c.children.filter(e => e.group == this.state.popup_filter)) : p), [])
        //   : this.props.data[this.props.currState].children.filter(e => e.group == this.state.popup_filter);

        /* Need to adjust styling of chart labels for pie charts */

        const pieOptions = {
          plugins: {
            datalabels: {
              anchor: 'center',
              display(context) {
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                if (value > 0) {
                  return true;
                }
                return false;
              },
            },
          },
        };

        // Pie charts!
        return (
          <div key={this.props.currState} className="charts">
            <Grid container justify="space-between">
              <Grid item xs={3}>
                <Button variant="outlined" color="primary" size="small" aria-label="back" id="chartbackButton" onClick={this.barUnClick} startIcon={<ArrowBack />}>Back</Button>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'center' }}>
                <h4>{CHART_STRINGS[this.state.currentDisplay - 1]}</h4>
              </Grid>
              <Grid item xs={3}>{/* to center the title */}</Grid>
            </Grid>
            <Pie
              id="hatecrimePieChart"
              options={pieOptions}
              plugins={[ChartDataLabels]}
              data={getChartData(this.state.currentDisplay, this.props.data, this.props.filters)}
              onElementsClick={this.pieClick}
            />
            {/* <ChartsText data={this.props.data[this.state.drilldown].children} /> */}

            <Dialog
              open={this.state.dialogOpen}
              onClose={() => this.toggleOpen(false)}
              maxWidth="xl"
              aria-labelledby="responsive-dialog-title"
              id="hateCrimeDataTable"
            >
              <DialogTitle id="responsive-dialog-title">Hate Crimes</DialogTitle>
              <DialogContent>
                {!this.state.popup_data ? <LinearProgress style={{ width: '100%' }} />
                    : (
                      <Table stickyHeader className="hello" aria-label="simple table" width="100%">
                        <TableHead>
                          <TableRow>
                            <TableCell width="10%">Date (M/D/Y)</TableCell>
                            <TableCell width="10%">{this.props.filters.some((e) => e[0] == 'county') ? 'County' : 'State' }</TableCell>
                            <TableCell width="15%">Primary Reason</TableCell>
                            <TableCell width="20%">Source</TableCell>
                            <TableCell width="45%">Description</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.popup_data.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell width="10%">{row.date}</TableCell>
                              <TableCell width="10%">{this.props.filters.some((e) => e[0] == 'county') ? row.county.substr(0, row.county.length - 3) : row.state}</TableCell>
                              <TableCell width="15%">{row.group}</TableCell>
                              <TableCell width="20%">{row.link ? <a href={row.link} target="_blank" rel="noreferrrer noopener">{row.link}</a> : 'N/A'}</TableCell>
                              <TableCell width="45%">{row.description || '--'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
              </DialogContent>
              <DialogActions id="closeDataTable">
                <Button onClick={() => this.toggleOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }

      const { options } = this.state;
      if (options) options.scales.yAxes[0].ticks.max = this.props.max;

      return (
        <div className="charts" id="theChartsState">
          <Bar
            data={getChartData(CHARTS.TOP, this.props.data, this.props.filters)}
            options={options}
            onElementsClick={this.barClick}
            plugins={[ChartDataLabels]}
            ref={this.chartReference}
          />
          {/* <ChartsText data={this.props.data} /> */}
        </div>
      );
    }
    return null;
  }
}

export default withStyles(styles)(Charts);
