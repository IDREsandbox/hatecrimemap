import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import './Charts.css';
import { CHARTS, getChartData, wholeYAxis } from '../../utils/chart-utils';
import { Bar } from 'react-chartjs-2';

const styles = theme => ({

});

class Charts extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      data: props.data
    }
  }

  render() {
    if (this.props.data) {
      return (
        <div className="charts">
          <Bar data={getChartData(CHARTS.RACE_ETHNICITY, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(CHARTS.RELIGION, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(CHARTS.GENDER_SEXUALITY, this.props.data)} options={wholeYAxis} />
          <Bar data={getChartData(CHARTS.OTHER, this.props.data)} options={wholeYAxis} />
        </div>
      )
    }

    return null;
  }
}

export default withStyles(styles)(Charts);