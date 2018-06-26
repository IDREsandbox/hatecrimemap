import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import SimpleTable from '../../components/SimpleTable/SimpleTable';
import SimpleSnackbar from '../../components/SimpleSnackbar/SimpleSnackbar';
import Login from '../../components/Login/Login';
import { storeMapData } from '../../utils/filtering';
import { camelize, reviewIncidentReport, deleteIncidentReport } from '../../utils/utilities';

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

const tempEmail = 'temp@gmail.com';
const tempPassword = 'temp';

const getColumnHeaders = () => [
  'Harassment Location',
  'Date of Harassment',
  'Date Submitted',
  'Groups Harassed',
  'Verification Link',
  'Action',
];

function addRowNumProperty(mockData) {
  mockData.forEach((point, i) => {
    point.rowNum = i;
    const camelized = point.groupsharassedsplit.map(group => camelize(group));
    point.camelized = new Set(camelized);
  });
}

const getInitialState = () => ({
  isFetching: true,
  incidentReports: [],
  openSnackbar: false,
  loggedIn: true,
  email: 'temp@gmail.com',
  password: 'temp',
  openDialog: false,
  activeReport: null,
});

class VerifyIncidentsPage extends Component {
  state = getInitialState();

  componentDidMount() {
    axios.get('/api/maps/unreviewedpoints')
      .then(({ data: { mapdata } }) => {
        const incidentReports = storeMapData(mapdata);
        addRowNumProperty(incidentReports);
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

  openActions = rowNum => () => {
    const { incidentReports } = this.state;
    this.setState({
      activeReport: incidentReports[rowNum],
    }, () => {
      this.handleOpenDialog();
    });
  }

  handleOpenDialog = () => this.setState({ openDialog: true });

  handleCloseDialog = () => this.setState({ openDialog: false });

  handleOpenSnackbar = () => this.setState({ openSnackbar: true });

  handleCloseSnackbar = () => this.setState({ openSnackbar: false });

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  removeReport = ({ target: { name } }) => {
    const { incidentReports } = this.state;
    this.handleOpenSnackbar();
    const newIncidentReports = incidentReports.filter(({ rowNum }) => rowNum !== name);
    this.setState({ incidentReports: newIncidentReports, openSnackbar: true });
  }

  convertReportsToTableData = (reports) => {
    const displayableData = reports.map(({
      rowNum,
      validsourceurl,
      sourceurl,
      locationname,
      groupsharassed,
      date,
      datesubmitted,
    }) => {
      const link = validsourceurl
        ? <button><a href={sourceurl} target="_blank">Source link</a></button>
        : 'No link';
      const actionButton = (
        <IconButton onClick={this.openActions(rowNum)}>
          <MoreVert />
        </IconButton>
      );

      return [
        locationname,
        date,
        datesubmitted,
        groupsharassed,
        link,
        actionButton,
      ];
    });
    return displayableData;
  }

  login = () => {
    const { email, password } = this.state;
    if (email.toLowerCase() === tempEmail.toLowerCase() && password === tempPassword) {
      this.setState({ loggedIn: true });
    } else {
      alert('Email or password is incorrect. Please try again.');
    }
    this.setState({ email: '', password: '' });
  }

  render() {
    const { isFetching, incidentReports, openSnackbar, loggedIn, email, password, openDialog, activeReport } = this.state;
    const { classes } = this.props;
    const tableData = this.convertReportsToTableData(incidentReports).slice(0, 10);

    if (!loggedIn) {
      return (
        <Login
          email={email}
          password={password}
          onChange={this.handleChange}
          onSubmit={this.login}
        />
      );
    }

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
        {openSnackbar &&
          <SimpleSnackbar
            message="Report Removed"
            open={openSnackbar}
            handleClose={this.handleCloseSnackbar}
          />
        }
        {openDialog &&
          <Dialog onClose={this.handleCloseDialog} open={openDialog}>
            <DialogTitle>Choose Action</DialogTitle>
            <div>
              <List>
                <ListItem button onClick={reviewIncidentReport(activeReport.id, 1, this.handleCloseDialog)}>
                  <ListItemText primary="Add as Verified" />
                </ListItem>
                <ListItem button onClick={reviewIncidentReport(activeReport.id, 0, this.handleCloseDialog)}>
                  <ListItemText primary="Add as Unverified" />
                </ListItem>
                <ListItem
                  button
                  onClick={deleteIncidentReport(activeReport.id, this.handleCloseDialog)}
                >
                  <ListItemText primary="Delete Report" />
                </ListItem>
              </List>
            </div>
          </Dialog>
        }
      </div>
    );
  }
}

VerifyIncidentsPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VerifyIncidentsPage);
