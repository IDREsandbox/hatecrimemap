import React, { Component } from 'react';
import axios from 'axios';
import Pagination from 'material-ui-pagination';
import Divider from 'material-ui/Divider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton/FlatButton';

import DialogWrapper from '../../components/DialogWrapper/DialogWrapper';
import TableWrapper from '../../components/TableWrapper/TableWrapper';
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
      currentPage: 1,
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

  handleOpenDialog = (rowId) => {
    this.setState({
      openDialog: true,
      incidentToVerify: Object.assign({}, this.state.incidentReports[rowId]),
     });
  }

  handleCloseDialog = () => this.setState({
    openDialog: false,
    value: 1,
   });

  updatePage = page => this.setState({ currentPage: page });

  handleChange = (e, i, value) => this.setState({ value });

  render() {
    const { isFetching, incidentReports, currentPage, openDialog, incidentToVerify, value } = this.state;
    const { locationname, groupharassedcleaned, validsourceurl, sourceurl } = incidentToVerify;
    const totalPages = Math.ceil(incidentReports.length / 50);
    const lowerBound = (currentPage - 1) * 50;
    const upperBound = lowerBound + 50;
    const displayReports = incidentReports.slice(lowerBound, upperBound);
    const columnHeaders = ['Row #', 'Harassment Location', 'Date of Harassment', 'Groups Harassed', 'Verification Link', 'Edit/Save/Delete'];
    const tableFooter = (
      <Pagination
        total={totalPages}
        display={7}
        current={currentPage}
        onChange={page => this.updatePage(page)}
      />
    );
    const link = validsourceurl === 'true'
      ? <button><a href={sourceurl} target="_blank">Source Link</a></button>
      : 'No link';
    const actions = [
      <DropDownMenu
        value={value}
        onChange={this.handleChange}
      >
        <MenuItem value={1} primaryText="Add as Verified" />
        <MenuItem value={2} primaryText="Add as Unverified" />
        <MenuItem value={3} primaryText="Remove Report" />
      </DropDownMenu>,
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleCloseDialog}
      />,
      <FlatButton
        label="Confirm"
        primary
        onClick={this.handleCloseDialog}
      />,
    ];

    return (
      <div className="verifyIncidentsPage">
        {openDialog &&
          <DialogWrapper
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
          </DialogWrapper>
        }
        {!isFetching &&
          <TableWrapper
            tableHeader="Verify Incident Reports"
            columnHeaders={columnHeaders}
            bodyData={displayReports}
            footer={tableFooter}
            onClick={this.handleOpenDialog}
          />
        }
      </div>
    );
  }
}
