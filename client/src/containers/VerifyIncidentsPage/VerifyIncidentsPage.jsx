import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

import SimpleTable from '../../components/SimpleTable/SimpleTable';
import { storeMapData } from '../../utils/filtering';
import { camelize } from '../../utils/utilities';

const styles = () => ({
  root: {
    textAlign: 'center',
  },
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
  },
});

function createMockData(mapdata) {
  const mockData = mapdata.map((point) => {
    const num = Math.floor(Math.random() * Math.floor(5));
    if (num === 0) {
      return Object.assign({}, point, { verified: '-1' });
    }
    return Object.assign({}, point);
  });
  return mockData.slice();
}

const getColumnHeaders = () => (
  [
    'Harassment Location',
    'Date of Harassment',
    'Date Submitted',
    'Groups Harassed',
    'Verification Link',
    'Action',
  ]
);

function addIdProperty(mockData) {
  mockData.forEach((point, i) => {
    point.id = i;
    const camelized = point.groupharassedsplit.map(group => camelize(group));
    point.camelized = new Set(camelized);
  });
}

class VerifyIncidentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      incidentReports: [],
    };
  }

  componentDidMount() {
    axios.get('/api/maps/usapoints')
      .then(({ data: { mapdata } }) => {
        // remove before pushing to production
        const test = storeMapData(mapdata);
        const mockData = createMockData(test);
        const incidentReports = mockData.filter(point => point.verified === '-1');
        // end
        addIdProperty(incidentReports);
        this.setState({
          isFetching: false,
          incidentReports,
        });
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        alert(`API call failed: ${err}`);
      });
  }

  removeReport = (i) => {
    const { incidentReports } = this.state;
    const reportToRemove = incidentReports[i];
    const newIncidentReports = incidentReports.filter(({ featureid }) => featureid !== reportToRemove.featureid);
    this.setState({ incidentReports: newIncidentReports });
  }

  convertReportsToTableData = (reports) => {
    const displayableData = reports.map((report, i) => {
      const link = report.validsourceurl === 'true'
        ? <button><a href={report.sourceurl} target="_blank">Source link</a></button>
        : 'No link';

      return [
        report.locationname,
        '1/21/1996',
        '1/24/2016',
        report.groupharassedcleaned,
        link,
        <button onClick={() => this.removeReport(i)}>Action</button>,
      ];
    });
    return displayableData;
  }

  // verifyIncidentReport = () => {
  //   const { value, incidentToVerify } = this.state;
  //   const confirmed = window.confirm(`Press OK to ${primaryTexts[value - 1].toLowerCase()}`);
  //   if (confirmed) {
  //     if (value === 3) {
  //       axios.delete('/api/maps/removeincident', incidentToVerify.featureid)
  //         .then(res => console.log(res.data))
  //         .catch(err => console.log(err));
  //     } else {
  //       const verifiedIncident = createVerifiedIncident(incidentToVerify, value);
  //       axios.post('/api/maps/verifyincident', verifiedIncident)
  //         .then(res => console.log(res.data))
  //         .catch(err => console.log(err));
  //     }
  //     this.handleCloseDialog();
  //   }
  // };

  render() {
    const { isFetching, incidentReports } = this.state;
    const { classes } = this.props;
    const tableData = this.convertReportsToTableData(incidentReports);

    return (
      <div className={classes.root}>
        {isFetching ? (
          <CircularProgress className={classes.progress} />
        ) : (
          <SimpleTable
            columnHeaders={getColumnHeaders()}
            tableData={tableData}
          />
        )}
      </div>
    );
  }
}

VerifyIncidentsPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VerifyIncidentsPage);
