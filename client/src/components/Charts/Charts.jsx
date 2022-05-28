import React, { createRef } from 'react';
import { withStyles } from '@material-ui/core/styles';

import './Charts.css';
import { Bar, Pie } from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';

import ChartsTable from './ChartsTable';

import axios from 'axios';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import ColoredButton from 'components/Reusables/ColoredButton';
import { CHARTS, CHART_STRINGS, getChartData } from '../../utils/chart-utils';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({ // eslint-disable-line no-unused-vars
  // leaving above theme for future syntax reference
  chartLabel: {
    color: 'white',
    fontStyle: 'italic',
    marginTop: '0.5em'
  }
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
            color: 'white',
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
        legend: {
          display: true,
          labels: {
            fontColor: 'white',
          },
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: 'white',
            },
          }],
          yAxes: [{
            ticks: {
              fontColor: 'white',
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
      state: null,
      county: null,
      // published: false // filled in by filters, used to filter data once retrieved from backend
    };
    this.props.filters.forEach((f) => params[f[0]] = f[1]);

    /*
    if both state and county are null, don't trigger any change on backend
    */
    // check cache
    if (this.state.tableRows[params.state] && this.state.tableRows[params.state][params.group]) {
      this.setState((prevState) => ({
        popup_data: prevState.tableRows[params.state][params.group].filter((each) => (new Date(each.date).getFullYear() >= this.props.time[0] && new Date(each.date).getFullYear() <= this.props.time[1] && (!params.published || (params.published && each.published)))),
      }));
      return;
    } if (this.state.tableRows[params.county] && this.state.tableRows[params.county][params.group]) {
      this.setState((prevState) => ({
        popup_data: prevState.tableRows[params.county][params.group].filter((each) => (new Date(each.date).getFullYear() >= this.props.time[0] && new Date(each.date).getFullYear() <= this.props.time[1] && (!params.published || (params.published && each.published)))),
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
              [data.filter_item]: {
                ...prevState[data.filter_item],
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

  barClick = (elems, event = null) => {
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
    switch (dataIdx) { // eslint-disable-line default-case
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
    const { classes } = this.props;

    if (this.props.data && this.state.options) {
      if (this.state.currentDisplay != CHARTS.TOP) {
        // const rows = this.props.currState == 'none' ?
        //   Object.values(this.props.data).reduce(((p, c) => c instanceof Object ? p.concat(c.children.filter(e => e.group == this.state.popup_filter)) : p), [])
        //   : this.props.data[this.props.currState].children.filter(e => e.group == this.state.popup_filter);

        /* Need to adjust styling of chart labels for pie charts */

        const pieOptions = {
          legend: {
            display: true,
            labels: {
              fontColor: 'white',
            },
          },
          plugins: {
            datalabels: {
              color: 'white',
              anchor: 'center',
              display(context) {
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                if (value > 1) {
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
                <ColoredButton
                  id="chartbackButton"
                  onClick={this.barUnClick}
                  backButton
                >
                  Back
                </ColoredButton>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'center', color: 'white' }}>
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
            <Typography variant="body1" className={classes.chartLabel}>
              * Click on any section of the pie chart to view a table of individual incidents
            </Typography>
            {/* <ChartsText data={this.props.data[this.state.drilldown].children} /> */}
            <ChartsTable
              toggleOpen={this.toggleOpen}
              dialogOpen={this.state.dialogOpen}
              popup_data={this.state.popup_data}
              lockType={this.props.lockType}
            />
          </div>
        );
      }

      const { options } = this.state;
      if (options) options.scales.yAxes[0].ticks.max = this.props.max;

      return (
        <div className="charts" id="theChartsState">
          <Bar
            id="hatecrimeBarChart"
            data={getChartData(CHARTS.TOP, this.props.data, this.props.filters)}
            options={options}
            onElementsClick={this.barClick}
            plugins={[ChartDataLabels]}
            ref={this.chartReference}
          />
          {/* <ChartsText data={this.props.data} /> */}
          <Typography variant="body1" className={classes.chartLabel}>
            * Click on any bar to view a detailed breakdown of incident targets
          </Typography>
        </div>
      );
    }
    return null;
  }
}

export default withStyles(styles)(Charts);
