import React, { Component } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Pagination from 'material-ui-pagination';

import EditIncidentDialog from '../EditIncidentDialog/EditIncidentDialog';
import { storeMapData } from '../../utils/filtering';

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

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      incidentReports: [],
      currentPage: 1,
      totalPages: 0,
      openDialog: false,
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
        this.setState({
          isFetching: false,
          incidentReports,
          totalPages: Math.ceil(incidentReports.length / 50),
        });
        console.log(incidentReports[0]);
        console.log(incidentReports);
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        alert(`API call failed: ${err}`);
      });
  }

  handleOpenDialog = () => {
    this.setState({ openDialog: true });
  }

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  }

  updatePage = (page) => {
    this.setState({
      currentPage: page,
    });
  }

  render() {
    const { isFetching, incidentReports, currentPage, totalPages, openDialog } = this.state;
    const lowerBound = (currentPage - 1) * 50;
    const upperBound = lowerBound + 50;
    const displayReports = incidentReports.slice(lowerBound, upperBound);
    let rowNum = lowerBound + 1;

    return (
      <div className="verifyIncidentsPage">
        <EditIncidentDialog open={openDialog} handleCloseDialog={this.handleCloseDialog} />
        {!isFetching &&
          <Table height="calc(100vh - 250px)" fixedHeader>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn colSpan="6" style={{ textAlign: 'center' }}>
                  Verify Incident Reports
                </TableHeaderColumn>
              </TableRow>
              <TableRow>
                <TableHeaderColumn>Row #</TableHeaderColumn>
                <TableHeaderColumn>Harassment Location</TableHeaderColumn>
                <TableHeaderColumn>Date of Harassment</TableHeaderColumn>
                <TableHeaderColumn>Groups Harassed</TableHeaderColumn>
                <TableHeaderColumn>Verification Link</TableHeaderColumn>
                <TableHeaderColumn>Edit/Save/Delete</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody className="testTable" stripedRows displayRowCheckbox={false}>
              {displayReports.map((row) => {
                const link = row.validsourceurl === 'true'
                  ? <button><a href={row.sourceurl} target="_blank">Source Link</a></button>
                  : 'No link';
                return (
                  <TableRow key={row.featureid} selectable={false}>
                    <TableRowColumn>{rowNum++}</TableRowColumn>
                    <TableRowColumn>{row.locationname}</TableRowColumn>
                    <TableRowColumn>05/12/2018</TableRowColumn>
                    <TableRowColumn>{row.groupharassedcleaned}</TableRowColumn>
                    <TableRowColumn tooltip="test">{link}</TableRowColumn>
                    <TableRowColumn>
                      <button onClick={this.handleOpenDialog}>Edit</button>
                      <button>Save</button>
                      <button>Delete</button>
                    </TableRowColumn>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableRowColumn style={{ textAlign: 'center' }}>
                  <Pagination total={totalPages} display={7} current={currentPage} onChange={page => this.updatePage(page)} />
                </TableRowColumn>
              </TableRow>
            </TableFooter>
          </Table>
        }
      </div>
    );
  }
}
