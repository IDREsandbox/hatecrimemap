import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  IconButton,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import SimpleTable from '../../components/SimpleTable/SimpleTable';
import Login from '../../components/Login/Login';
import { addGroupsHarassedSplit } from '../../utils/filtering';
import {
  reviewIncidentReport,
  deleteIncidentReport,
  addRowNumProperty,
  checkLoggedInCookie,
  setCookie,
  sortByDateSubmitted,
} from '../../utils/utilities';

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

const getColumnHeaders = () => [
  'Harassment Location',
  'Date of Harassment',
  'Date Submitted',
  'Groups Harassed',
  'Verification Link',
  'Action',
];

const getInitialState = () => ({
  incidentReports: [],
  email: '',
  password: '',
  openDialog: false,
  activeReport: null,
});

class VerifyIncidentsPage extends Component {
  state = getInitialState();

  componentDidMount() {
    if (checkLoggedInCookie()) {
      this.getUnreviewedPoints('', '', true);
    }
  }

  getUnreviewedPoints = (email, password, loggedIn) => {
    axios.get('/api/maps/unreviewedpoints', { params: { email, password, loggedIn } })
      .then(({ data: { mapdata } }) => {
        setCookie('loggedIn', 'true', 0.05);
        const incidentReports = addGroupsHarassedSplit(mapdata);
        addRowNumProperty(incidentReports);
        sortByDateSubmitted(incidentReports);
        this.setState({ incidentReports });
      })
      .catch((err) => {
        alert(`Email or password incorrect. Please try again.\n\n${err}`);
        this.setState({ email: '', password: '' });
      });
  }

  openActions = rowNum => () => {
    const { incidentReports } = this.state;
    this.setState({
      activeReport: incidentReports[rowNum],
    }, this.handleOpenDialog);
  }

  handleOpenDialog = () => this.setState({ openDialog: true });

  handleCloseDialog = () => this.setState({ openDialog: false });

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  removeReport = ({ target: { name } }) => {
    const { incidentReports } = this.state;
    this.handleOpenSnackbar();
    const newIncidentReports = incidentReports.filter(({ rowNum }) => rowNum !== name);
    this.setState({ incidentReports: newIncidentReports });
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
        ? <a href={sourceurl} target="_blank">Source link</a>
        : 'No link';
      const actionButton = (
        <IconButton onClick={this.openActions(rowNum)}>
          <MoreVert />
        </IconButton>
      );

      return [
        locationname,
        new Date(date).toDateString(),
        new Date(datesubmitted).toDateString(),
        groupsharassed,
        link,
        actionButton,
      ];
    });
    return displayableData;
  }

  login = () => {
    const { email, password } = this.state;
    this.getUnreviewedPoints(email, password, checkLoggedInCookie());
  }

  render() {
    const { incidentReports, email, password, openDialog, activeReport } = this.state;
    const { classes } = this.props;
    const tableData = this.convertReportsToTableData(incidentReports);

    if (!checkLoggedInCookie()) {
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
        <SimpleTable
          columnHeaders={getColumnHeaders()}
          tableData={tableData}
        />
        {openDialog &&
          <Dialog onClose={this.handleCloseDialog} open={openDialog}>
            <DialogTitle>Choose Action</DialogTitle>
            <div>
              <List>
                <ListItem
                  button
                  onClick={reviewIncidentReport(activeReport.id, 1, this.handleCloseDialog)}
                >
                  <ListItemText primary="Add as Verified" />
                </ListItem>
                <ListItem
                  button
                  onClick={reviewIncidentReport(activeReport.id, 0, this.handleCloseDialog)}
                >
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
