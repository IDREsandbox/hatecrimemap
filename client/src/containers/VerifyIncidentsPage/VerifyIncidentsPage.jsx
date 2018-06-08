import React, { Component } from 'react';
import axios from 'axios';

import SimpleTable from '../../components/SimpleTable/SimpleTable';
import { storeMapData } from '../../utils/filtering';
import { camelize } from '../../utils/utilities';

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

function getColumnHeaders() {
  return [
    'Harassment Location',
    'Date of Harassment',
    'Date Submitted',
    'Groups Harassed',
    'Verification Link',
    'Action',
  ];
}

function addIdProperty(mockData) {
  mockData.forEach((point, i) => {
    point.id = i;
    const camelized = point.groupharassedsplit.map(group => camelize(group));
    point.camelized = new Set(camelized);
  });
}

export default class VerifyIncidentsPage extends Component {
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

  convertReportsToTableData = (reports) => {
    const displayableData = reports.map((report) => {
      const link = report.validsourceurl === 'true'
        ? <button><a href={report.sourceurl} target="_blank">Source link</a></button>
        : 'No link';

      return [
        report.locationname,
        '1/21/1996',
        '1/24/2016',
        report.groupharassedcleaned,
        link,
        <button onClick={() => alert('Verify Report')}>Action</button>,
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
    const tableData = this.convertReportsToTableData(incidentReports);

    return (
      <div className="verifyIncidentsPage">
        {!isFetching &&
          <SimpleTable
            columnHeaders={getColumnHeaders()}
            tableData={tableData}
          />
        }
      </div>
    );
  }
}
