import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import './CovidCharts.css';
import { Pie } from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';

import { getCovidChartData, takeTop } from '../../utils/chart-utils';

import WordCloud from '../Charts/elements/WordCloud/WordCloud';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import ChartsTable from 'components/Charts/ChartsTable';

// Note: when cleaned up, left all outdated wordcloud props in case they're ever needed for reference

const styles = (theme) => ({}); // eslint-disable-line no-unused-vars

const columns = [ // eslint-disable-line no-unused-vars
  { field: 'date', headerName: 'Date of Incident', width: 70 },
  {
    field: 'cityState',
    headerName: 'Location',
    width: 100,
    valueGetter: (params) => `${params.getValue('city')}, ${params.getValue('state')}`,
  },
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
    valueGetter: (params) => `${params.getValue('description')}\n${params.getValue('link') || ''}`,
  },
];

const covidRE = [
  'Asian',
  'Native American/Indigenous',
  'African American',
  'Latinx',
  'White',
  'Other',
];
const covidGender = ['Male', 'Female', 'Other'];
const covidType = [
  'Verbal',
  'Physical',
  'Coughing/Spitting',
  'Online',
  'Other',
];
const covidOther = ['Unknown'];

const options = { // eslint-disable-line no-unused-vars
  colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
  enableTooltip: true,
  deterministic: false,
  fontFamily: 'impact',
  fontSizes: [12, 30],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 0],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000,
};

const size = [200, 200]; // eslint-disable-line no-unused-vars
const words = [ // eslint-disable-line no-unused-vars
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
];

class CovidCharts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: parseInt(props.max) || 68,
              },
            },
          ],
        },
      },
      dialogOpen: false,
      dialogShow: 'all',
      dialogFilter: 0,
    };
  }

  toggleOpen = (open) => {
    this.setState({ dialogOpen: open });
  };

  pieREClick = (elems) => {
    this.setState({
      dialogOpen: true,
      dialogShow: 'ethnicity',
      dialogFilter: covidRE[elems[0]._index],
    });
  };

  pieGenderClick = (elems) => {
    this.setState({
      dialogOpen: true,
      dialogShow: 'gender',
      dialogFilter: covidGender[elems[0]._index],
    });
  };

  pieTypeClick = (elems) => {
    this.setState({
      dialogOpen: true,
      dialogShow: 'type',
      dialogFilter: covidType[elems[0]._index],
    });
  };

  pieOtherClick = (elems) => {
    this.setState({
      dialogOpen: true,
      dialogShow: 'other',
      dialogFilter: covidOther[elems[0]._index],
    });
  };

  render() {
    if (this.props.data && this.state.options) {
      const covidData = getCovidChartData(
        this.props.data,
        this.props.currState,
      );

      const rows = this.props.currState == 'none'
        ? Object.values(this.props.data)
          .filter((val) => val instanceof Object)
          .reduce(
            (prev, next) => prev.concat(
              next.children.filter(
                (el) => el[this.state.dialogShow]
                  && el[this.state.dialogShow].includes(
                    this.state.dialogFilter,
                  ),
              ),
            ),
            [],
          )
        : this.props.data[this.props.currState]
        && this.props.data[this.props.currState].children
        && this.props.data[this.props.currState].children.filter(
          (el) => el[this.state.dialogShow]
            && el[this.state.dialogShow].includes(this.state.dialogFilter),
        );

      return (
        <div className="CovidCharts">
          <Grid container justifyContent="space-between">
            <WordCloud
              words={
                this.props.currState != 'none'
                  ? this.props.wordCloudData[this.props.currState]
                  : takeTop(Object.values(this.props.wordCloudData).flat())
              }
            />
            <Grid container item justifyContent="center" xs={6}>
              <h4>Ethnicity</h4>

              <Pie
                onElementsClick={this.pieREClick}
                data={covidData[0]}
                options={{ legend: { display: false } }}
              />
            </Grid>
            <Grid container item justifyContent="center" xs={6}>
              <h4>Gender</h4>
              <Pie
                onElementsClick={this.pieGenderClick}
                data={covidData[1]}
                options={{ legend: { display: false } }}
              />
            </Grid>
            <br />
            <br />

            <Grid container item justifyContent="center" xs={6}>
              <h4>Type</h4>
              <Pie
                onElementsClick={this.pieTypeClick}
                data={covidData[2]}
                options={{ legend: { display: false } }}
              />
            </Grid>
          </Grid>

          <ChartsTable
            toggleOpen={this.toggleOpen}
            dialogOpen={this.state.dialogOpen}
            group={this.state.dialogFilter}
            popup_data={rows}
            lockType={'state'}
            covid
          />
        </div>
      );
    }

    return null;
  }
}

export default withStyles(styles)(CovidCharts);
