import React, { Component } from 'react';
import axios from 'axios';
import Pagination from 'material-ui-pagination';
import Divider from 'material-ui/Divider';

import DialogWrapper from '../../components/DialogWrapper/DialogWrapper';
import TableWrapper from '../../components/TableWrapper/TableWrapper';
import { storeMapData, updateCurrentLayers } from '../../utils/filtering';
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
    };
  }

  componentDidMount() {
    axios.get('/api/maps/usapoints')
      .then(({ data: { mapdata } }) => {
        // remove before pushing to production
        const test = storeMapData(mapdata);
        const mockData = createMockData(test);
        // end
        const incidentReports = mockData.filter(point => point.verified === '-1');
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

  updateincidentToVerify = ({ target: { type, name } }) => {
    const { incidentToVerify } = this.state;
    let { camelized } = incidentToVerify;

    if (type === 'checkbox') {
      camelized = updateCurrentLayers(name, camelized);
      const incidentWithUpdatedCamelized = Object.assign({}, incidentToVerify, { camelized });
      this.setState({ incidentToVerify: incidentWithUpdatedCamelized });
    }
  }

  handleOpenDialog = (rowId) => {
    this.setState({
      openDialog: true,
      incidentToVerify: Object.assign({}, this.state.incidentReports[rowId]),
     });
  }

  handleCloseDialog = () => this.setState({ openDialog: false });

  updatePage = page => this.setState({ currentPage: page });

  render() {
    const { isFetching, incidentReports, currentPage, openDialog, incidentToVerify } = this.state;
    const { locationname, groupharassedcleaned, sourceurl } = incidentToVerify;
    const totalPages = Math.ceil(incidentReports.length / 50);
    const lowerBound = (currentPage - 1) * 50;
    const upperBound = lowerBound + 50;
    const displayReports = incidentReports.slice(lowerBound, upperBound);
    const columnHeaders = ['Row #', 'Harassment Location', 'Date of Harassment', 'Groups Harassed', 'Verification Link', 'Edit/Save/Delete'];
    const footer = (
      <Pagination
        total={totalPages}
        display={7}
        current={currentPage}
        onChange={page => this.updatePage(page)}
      />
    );

    return (
      <div className="verifyIncidentsPage">
        {openDialog &&
          <DialogWrapper
            title="Verify Incident Report"
            open={openDialog}
            close={this.handleCloseDialog}
          >
            <p>{locationname}</p>
            <Divider />
            <p>{groupharassedcleaned}</p>
            <Divider />
            <p>{sourceurl}</p>
          </DialogWrapper>
        }
        {!isFetching &&
          <TableWrapper
            tableHeader="Verify Incident Reports"
            columnHeaders={columnHeaders}
            bodyData={displayReports}
            footer={footer}
            onClick={this.handleOpenDialog}
          />
        }
      </div>
    );
  }
}
