import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import './Charts.css';
import { CHARTS, getChartData } from '../../utils/chart-utils';
import { Bar } from 'react-chartjs-2';

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
      currentDisplay: "TOP",
      data: props.data,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              // beginAtZero:true,
              // callback: function(value) {if(value % 1 ===0) {return value;}},
              min: 0,
              max: parseInt(props.max) || 50
              // stepSize: 1
            }
          }]
        }
      }
    }
  }

  render() {
    if (this.props.data && this.state.options) {
      return (
        <div className="charts">
          <Bar data={getChartData(CHARTS.TOP, this.props.data)} options={this.state.options} />
        </div>
      )
    }

    return null;
  }
}

export default withStyles(styles)(Charts);