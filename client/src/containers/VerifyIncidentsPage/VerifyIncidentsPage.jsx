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

import { storeMapData, getAllPoints } from '../../utils/filtering';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      incidentReports: [],
      currentPage: 0,
      totalPages: 0,
    };
  }

  componentDidMount() {
    const allpoints = getAllPoints();
    if (allpoints.length !== 0) {
      this.setState({
        isFetching: false,
        incidentReports: allpoints,
      });
      return;
    }
    axios.get('/api/maps/usapoints')
      .then(({ data: { mapdata } }) => {
        this.setState({
          isFetching: false,
          incidentReports: storeMapData(mapdata),
          totalPages: Math.ceil(mapdata.length / 50),
        });
        console.log(this.state.incidentReports);
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        alert(`API call failed: ${err}`);
      });
  }

  updatePage = (page) => {
    this.setState({
      currentPage: page - 1,
    });
  }

  render() {
    const { isFetching, incidentReports, currentPage, totalPages } = this.state;
    const displayPage = currentPage + 1;
    const lowerBound = currentPage * 50;
    const upperBound = lowerBound + 50;
    const displayReports = incidentReports.slice(lowerBound, upperBound);
    let rowNum = lowerBound + 1;
    console.log(incidentReports.length);
    console.log(totalPages);

    return (
      <div className="verifyIncidentsPage">
        {!isFetching &&
          <Table
            height="600px"
            fixedHeader
            selectable
            multiSelectable
          >
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn colSpan="5" style={{ textAlign: 'center' }}>
                  Verify Incident Reports
                </TableHeaderColumn>
              </TableRow>
              <TableRow>
                <TableHeaderColumn>Row #</TableHeaderColumn>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Harassment Location</TableHeaderColumn>
                <TableHeaderColumn>Date of Harassment</TableHeaderColumn>
                <TableHeaderColumn>Groups Harassed</TableHeaderColumn>
                <TableHeaderColumn>Verification Link</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody stripedRows>
              {displayReports.map(row => (
                <TableRow key={row.featureid}>
                  <TableRowColumn>{rowNum++}</TableRowColumn>
                  <TableRowColumn>{row.featureid}</TableRowColumn>
                  <TableRowColumn>{row.locationname}</TableRowColumn>
                  <TableRowColumn>date of harassment</TableRowColumn>
                  <TableRowColumn>{row.groupharassedcleaned}</TableRowColumn>
                  <TableRowColumn>{row.sourceurl}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableRowColumn style={{ textAlign: 'center' }}>
                  <Pagination total={totalPages} display={7} current={displayPage} onChange={page => this.updatePage(page)} />
                </TableRowColumn>
              </TableRow>
            </TableFooter>
          </Table>
        }
      </div>
    );
  }
}
