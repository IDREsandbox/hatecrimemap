import React, { Component } from 'react';
import axios from 'axios';
import Divider from 'material-ui/Divider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Dialog from 'material-ui/Dialog';

import SimpleTable from '../../components/SimpleTable';
import { storeMapData } from '../../utils/filtering';
import { camelize } from '../../utils/utilities';

function createVerifiedIncident(incident, value) {
  const verified = value === 1 ? '1' : '0';
  const verifiedIncident = Object.assign({}, incident, {
    verified,
    verifiedbystudent: 'true',
  });
  return verifiedIncident;
}

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

const columnHeaders = [
  'Harassment Location',
  'Date of Harassment',
  'Date Submitted',
  'Groups Harassed',
  'Verification Link',
  'Action',
];

function addIdProperty(mockData) {
  mockData.forEach((point, i) => {
    point.id = i;
    const camelized = point.groupharassedsplit.map(group => camelize(group));
    point.camelized = new Set(camelized);
  });
}
const primaryTexts = ['Add as Verified', 'Add as Unverified', 'Remove Report'];

export default class VerifyIncidentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      incidentReports: [],
      openDialog: false,
      incidentToVerify: {},
      value: 1,
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

  convertReportsToDisplayableData = (reports) => {
    const displayableData = reports.map((report, i) => (
      [
        report.locationname,
        '1/21/1996',
        '1/24/2016',
        report.groupharassedcleaned,
        <button>Link</button>,
        <button onClick={this.handleOpenDialog(i)}>Action</button>,
      ]
    ));
    return displayableData;
  }

  handleOpenDialog = () => (rowId) => {
    this.setState({
      openDialog: true,
      incidentToVerify: Object.assign({}, this.state.incidentReports[rowId]),
     });
  }

  handleCloseDialog = () => this.setState({
    openDialog: false,
    value: 1,
   });

  handleChange = (e, i, value) => this.setState({ value });

  verifyIncidentReport = () => {
    const { value, incidentToVerify } = this.state;
    const confirmed = window.confirm(`Press OK to ${primaryTexts[value - 1].toLowerCase()}`);
    if (confirmed) {
      if (value === 3) {
        axios.delete('/api/maps/removeincident', incidentToVerify.featureid)
          .then(res => console.log(res.data))
          .catch(err => console.log(err));
      } else {
        const verifiedIncident = createVerifiedIncident(incidentToVerify, value);
        axios.post('/api/maps/verifyincident', verifiedIncident)
          .then(res => console.log(res.data))
          .catch(err => console.log(err));
      }
      this.handleCloseDialog();
    }
  };

  render() {
    const { isFetching, incidentReports, openDialog, incidentToVerify, value } = this.state;
    const { locationname, groupharassedcleaned, validsourceurl, sourceurl } = incidentToVerify;
    const link = validsourceurl === 'true'
      ? <button><a href={sourceurl} target="_blank">Source Link</a></button>
      : 'No link';
    const actions = [
      <DropDownMenu
        value={value}
        onChange={this.handleChange}
      >
        <MenuItem value={1} primaryText={primaryTexts[0]} />
        <MenuItem value={2} primaryText={primaryTexts[1]} />
        <MenuItem value={3} primaryText={primaryTexts[2]} />
      </DropDownMenu>,
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleCloseDialog}
      />,
      <FlatButton
        label="Confirm"
        primary
        onClick={this.verifyIncidentReport}
      />,
    ];
    const displayData = this.convertReportsToDisplayableData(incidentReports);

    return (
      <div className="verifyIncidentsPage">
        {openDialog &&
          <Dialog
            title="Verify Incident Report"
            open={openDialog}
            close={this.handleCloseDialog}
            actions={actions}
          >
            <div>{locationname}</div>
            <Divider />
            <div>{groupharassedcleaned}</div>
            <Divider />
            <div>{link}</div>
          </Dialog>
        }
        {!isFetching &&
          <SimpleTable
            columnHeaders={columnHeaders}
            tableData={displayData}
          />
        }
      </div>
    );
  }
}
