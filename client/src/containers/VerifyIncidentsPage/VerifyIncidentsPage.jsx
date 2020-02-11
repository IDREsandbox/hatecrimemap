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
  CircularProgress,
  LinearProgress
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
    left: '25%',
    right: '25%'
  },
  loading: {
    display: 'flex',
    'justify-content': 'center',
    'margin-top': '16px',
    width: '100%'
  }
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
  incidentReports: null,
  loggedIn: null,
  email: '',
  password: '',
  openDialog: false,
  activeReport: null,
});

class VerifyIncidentsPage extends Component {
  state = getInitialState();

  componentDidMount() {
    this.checkLoggedIn()
  }

  checkLoggedIn = () => {
    axios.get('/api/auth/check')
        .then( (res) => {
          if(res.data.auth) {
            this.fetchData();
            this.setState({ loggedIn: true })
          } else {
            this.setState({ loggedIn: false })
          }
        })
        .catch((err) => alert(err))
  }

  openActions = id => () => {
    console.log("Opening " + id)
    this.setState({
      activeReport: id,
    }, this.handleOpenDialog);
  }

  handleOpenDialog = () => this.setState({ openDialog: true });

  handleCloseDialog = () => this.setState({ openDialog: false });

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  convertReportsToTableData = (reports) => {
    const displayableData = reports.map(({
      id,
      incidentdate,
      submittedon,
      location,
      sourceurl,
      isvalidsourceurl,
      waybackurl,
      othergroups,
      groupsharassed,
    }) => {
      const link = sourceurl
        ? <a href={sourceurl} target="_blank">Source link</a>
        : 'No link';
      const actionButton = (
        <IconButton onClick={this.openActions(id)}>
          <MoreVert />
        </IconButton>
      );

      if(!incidentdate) {
        incidentdate = "N/A";
      } else {
        incidentdate = new Date(incidentdate).toDateString();
      }

      if(othergroups) {
        groupsharassed.push(othergroups)
      }

      return [
        id,
        location,
        incidentdate,
        new Date(submittedon).toDateString(),
        groupsharassed.join(", "),
        link,
        actionButton,
      ];
    });
    return displayableData;
  }

  fetchData = (perPage=10, page=0) => {
    axios.get(`/api/verify/unreviewed/${perPage}/${page}`)
      .then( (res) => {
        if(!res.data.incidents) {
          this.setState({ loggedIn: false });  // TODO: it could be a server error, not authentication? Add a check
          return;
        }
        this.setState({ incidentReports: this.convertReportsToTableData(res.data.incidents) });
      })
      .catch((err) => {
        alert(err);
      })
  }

  login = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    axios.post('/api/auth/login', { useremail: email, password: password })
    .then( (res) => {
      if(res.data.auth_user) {
        this.setState({loggedIn: true});
        this.fetchData();
      } else {
        alert("Error logging in with the credentials provided.")
      }
    })
    .catch((err) => {
      alert(err);
    })
  }

  render() {
    const { incidentReports, email, password, openDialog, activeReport, loggedIn } = this.state;
    const { classes } = this.props;

    if(loggedIn == null) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
       );
    }

    if (loggedIn == false) {
      return (
        <Login
          email={email}
          password={password}
          onChange={this.handleChange}
          onSubmit={this.login}
        />
      );
    }


    if (incidentReports == null) {
      return (
        <div className={classes.loading}>
          <LinearProgress className={classes.progress} />
        </div>
       );
    }

    return (
      <div className={classes.root}>
        <SimpleTable
          columnHeaders={getColumnHeaders()}
          tableData={incidentReports}
          key="incidenttable"
          fetchData={this.fetchData}
        />
        {openDialog &&
          <Dialog onClose={this.handleCloseDialog} open={openDialog}>
            <DialogTitle>Choose Action</DialogTitle>
            <div>
              <List>
                <ListItem
                  button
                  onClick={reviewIncidentReport(activeReport, 1, this.handleCloseDialog)}
                >
                  <ListItemText primary="Add as Verified" />
                </ListItem>
                <ListItem
                  button
                  onClick={reviewIncidentReport(activeReport, 0, this.handleCloseDialog)}
                >
                  <ListItemText primary="Add as Unverified" />
                </ListItem>
                <ListItem
                  button
                  onClick={deleteIncidentReport(activeReport, this.handleCloseDialog)}
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
