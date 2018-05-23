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

import EditIncidentDialog from '../../components/EditIncidentDialog/EditIncidentDialog';
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

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      incidentReports: [],
      currentPage: 1,
      openDialog: false,
      incidentToEdit: {},
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
        console.log(incidentReports[0]);
        console.log(incidentReports);
      })
      .catch((err) => {
        this.setState({ isFetching: false });
        alert(`API call failed: ${err}`);
      });
  }

  updateIncidentToEdit = ({ target: { type, name } }) => {
    const { incidentToEdit } = this.state;
    let { camelized } = incidentToEdit;

    if (type === 'checkbox') {
      camelized = updateCurrentLayers(name, camelized);
      const incidentWithUpdatedCamelized = Object.assign({}, incidentToEdit, { camelized });
      this.setState({ incidentToEdit: incidentWithUpdatedCamelized });
    }
  }

  handleOpenDialog = (rowId) => {
    this.setState({
      openDialog: true,
      incidentToEdit: Object.assign({}, this.state.incidentReports[rowId]),
     });
  }

  handleCloseDialog = () => this.setState({ openDialog: false });

  updatePage = page => this.setState({ currentPage: page });

  render() {
    const { isFetching, incidentReports, currentPage, openDialog, incidentToEdit } = this.state;
    const totalPages = Math.ceil(incidentReports.length / 50);
    const lowerBound = (currentPage - 1) * 50;
    const upperBound = lowerBound + 50;
    const displayReports = incidentReports.slice(lowerBound, upperBound);

    return (
      <div className="manageIncidentsPage">
        {openDialog &&
          <EditIncidentDialog
            open={openDialog}
            handleCloseDialog={this.handleCloseDialog}
            incidentToEdit={incidentToEdit}
            updateIncidentToEdit={this.updateIncidentToEdit}
          />}
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
            <TableBody stripedRows displayRowCheckbox={false}>
              {displayReports.map((row) => {
                const link = row.validsourceurl === 'true'
                  ? <button><a href={row.sourceurl} target="_blank">Source Link</a></button>
                  : 'No link';
                return (
                  <TableRow key={row.featureid} selectable={false}>
                    <TableRowColumn>{row.id + 1}</TableRowColumn>
                    <TableRowColumn>{row.locationname}</TableRowColumn>
                    <TableRowColumn>05/12/2018</TableRowColumn>
                    <TableRowColumn>{row.groupharassedcleaned}</TableRowColumn>
                    <TableRowColumn tooltip="test">{link}</TableRowColumn>
                    <TableRowColumn>
                      <button onClick={() => this.handleOpenDialog(row.id)}>Edit</button>
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
