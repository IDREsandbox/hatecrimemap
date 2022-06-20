import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  LinearProgress,
  Toolbar,
  Tooltip,
  Typography,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Grid
} from '@material-ui/core';
import {
  MoreVert, Done, Link, Web,
} from '@material-ui/icons';

import SimpleTable from 'components/SimpleTable/SimpleTable';
import Login from 'components/Login/Login';
import {
  reviewIncidentReport,
  validateIncidentReport,
  publishedIncidentReport,
  deleteIncidentReport,
} from 'utils/utilities';
import { faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';

const styles = () => ({
  root: {
    textAlign: 'center',
  },
  progress: {
    position: 'fixed',
    top: '50%',
    left: '25%',
    right: '25%',
  },
  loading: {
    display: 'flex',
    'justify-content': 'center',
    'margin-top': '16px',
    width: '100%',
  },
  filterOptionsContainer: {
    padding: '0.5em'
  }
});

const ACTIONS = {
  VERIFY: 1,
  UNVERIFY: 2,
  VALID_URL: 3,
  INVALID_URL: 4,
  PUBLISH: 5,
  UNPUBLISH: 6,
  DELETE: 7,
  MULTI_VERIFY: 'verify',
  MULTI_UNVERIFY: 'unverify',
  MULTI_VALID_URL: 'validate the URLs of',
  MULTI_INVALID_URL: 'invalidate the URLs of',
  MULTI_PUBLISH: 'mark as published',
  MULTI_UNPUBLISH: 'mark as unpublished',
  MULTI_DELETE: 'delete',
};

const toolbarStyles = () => ({
  edit: {
    display: 'flex',
    'justify-content': 'space-between',
  },
});

const BatchEdit = withStyles(toolbarStyles)((props) => (
  <Toolbar className={props.classes.edit}>
    <Typography variant="h6" color="inherit">
      Selected
      {' '}
      {props.incidentsChecked.length}
    </Typography>
    <div>
      <Tooltip title="Verify">
        <IconButton
          onClick={() => props.actions(props.incidentsChecked, ACTIONS.MULTI_VERIFY)}
        >
          {' '}
          <Done />
          {' '}
        </IconButton>
      </Tooltip>
      <Tooltip title="Validate Source URL">
        <IconButton
          onClick={() => props.actions(props.incidentsChecked, ACTIONS.MULTI_VALID_URL)}
        >
          {' '}
          <Link />
          {' '}
        </IconButton>
      </Tooltip>
      <Tooltip title="Mark as Published">
        <IconButton
          onClick={() => props.actions(props.incidentsChecked, ACTIONS.MULTI_PUBLISH)}
        >
          {' '}
          <Web />
          {' '}
        </IconButton>
      </Tooltip>
    </div>
  </Toolbar>
));

const COLUMN_HEADERS = [
  'Harassment Location',
  'Date of Harassment',
  'Date Submitted',
  'Groups Harassed',
  'Verification Link',
  'Student Reviewed',
  'URL Valid',
  'Published Source',
  'Description',
  'Action',
];

const getInitialState = () => ({
  incidentReports: null,
  loggedIn: null,
  email: '',
  password: '',
  openActionDialog: false,
  openAlertDialog: false,
  storeIds: [],
  storeAction: null,
  activeReport: null,
  counts: null,
  incidentsChecked: [],
  sortBy: 3,
  perPage: 10,
  page: 0,
});

class VerifyIncidentsPage extends Component {
  constructor(props) {
    super(props);

    this.state = getInitialState();
  }

  UNSAFE_componentWillMount() {
    axios
      .get(`/api/verify/unreviewedcount/${this.state.verified}`)
      .then((res) => {
        if (res.data.counts) {
          this.setState({ counts: parseInt(res.data.counts, 10) });
        }
      })
      .catch((err) => alert(err));
  }

  componentWillMount() {
    if (this.state.loggedIn) {
      this.getIncidentCounts()
    }
  }

  componentDidMount() {
    this.checkLoggedIn();
  }

  getIncidentCounts = () => {
    axios
      .get(`/api/verify/unreviewedcount`)
      .then((res) => {
        if (res.data.counts) {
          this.setState({ counts: parseInt(res.data.counts) });
        }
      })
      .catch((err) => alert(err));
  }

  checkLoggedIn = () => {
    axios
      .get('/api/auth/check')
      .then((res) => {
        if (res.data.auth) {
          this.fetchData();
          this.setState({ loggedIn: true });
        } else {
          this.setState({ loggedIn: false });
        }
      })
      .catch((err) => alert(err));
  };

  openActions = (id, v, s, p) => () => {
    console.log(`Opening ${id}`);
    this.setState(
      {
        activeReport: id,
        verified: v,
        urlvalid: s,
        published: p,
      },
      this.handleOpenActionDialog(),
    );
  };

  handleOpenActionDialog = () => this.setState({ openActionDialog: true });

  handleCloseActionDialog = () => this.setState({ openActionDialog: false });

  handleCloseAlertDialog = () => this.setState({ openAlertDialog: false, storeIds: [], storeAction: null });

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  convertReportsToTableData = (reports) => {
    const displayableData = reports.map(
      ({
        id,
        incidentdate,
        submittedon,
        location,
        sourceurl,
        issourceurlvalid,
        verified,
        published,
        waybackurl,
        description,
        groupsharassed,

      }) => {
        const link = sourceurl ? (
          <a href={sourceurl} target="_blank" rel="noreferrer">
            Source link
          </a>
        ) : (
          'No link'
        );
        const actionButton = (
          <IconButton
            onClick={this.openActions(
              id,
              verified,
              issourceurlvalid,
              published,
            )}
          >
            <MoreVert />
          </IconButton>
        );

        if (!incidentdate) {
          incidentdate = 'N/A';
        } else {
          incidentdate = new Date(incidentdate).toDateString();
        }

        if (!groupsharassed) {
          groupsharassed = [];
        }

        if (!published) {
          published = 'false'
        }

        let finalDescription;
        if (!description) {
          finalDescription = (
            <p style={{ textAlign: 'center' }}>
              No description
            </p>
          )
        } else {
          finalDescription = (
            <Tooltip title={
              <Typography>
                {description}
              </Typography>
            }>
              <button style={{ textAlign: 'center', background: 'none', border: 'none', width: '100%', fontSize: 14 }}>
                Hover to See
              </button>
            </Tooltip>
          )
        }

        return [
          id,
          location,
          incidentdate,
          new Date(submittedon).toDateString(),
          groupsharassed.join(', '),
          link,
          verified.toString(),
          issourceurlvalid.toString(),
          published.toString(),
          finalDescription,
          actionButton,
        ];
      },
    );
    return displayableData;
  };

  fetchData = (perPage = 10, page = 0) => {
    axios
      .get(`/api/verify/unreviewed/${perPage}/${page}/${this.state.sortBy}`)
      .then((res) => {
        console.log(res)
        if (!res.data.incidents) {
          this.setState({ loggedIn: false }); // TODO: it could be a server error, not authentication? Add a check
          return;
        }
        this.setState({
          incidentReports: this.convertReportsToTableData(res.data.incidents),
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  handleCheckIncident = (e, id) => {
    if (e.target.checked && !this.state.incidentsChecked.includes(id)) {
      this.setState((prev) => ({
        incidentsChecked: [...prev.incidentsChecked, id],
      })); // push returns length
    } else if (!e.target.checked && this.state.incidentsChecked.includes(id)) {
      const idx = this.state.incidentsChecked.indexOf(id);
      this.setState((prev) => ({
        incidentsChecked: prev.incidentsChecked.filter((_, i) => i != idx),
      })); // splice returns deleted element(s)
    }
  };

  handleCheckAll = (ids) => {
    const checked = [...this.state.incidentsChecked]; // shallow copy

    let allChecked = true;
    ids.forEach((id) => {
      if (checked.indexOf(id) == -1) {
        allChecked = false;
        checked.push(id);
      }
    });

    // if and only if all are already checked, then uncheck them all
    if (allChecked) {
      ids.forEach((id) => {
        checked.splice(checked.indexOf(id));
      });
    }
    this.setState({ incidentsChecked: checked });
  };

  // fix the below having repeated function like 5 times
  handleAction = (id, action) => {
    if (action == ACTIONS.VERIFY) reviewIncidentReport(id, true, () => { this.fetchData(this.state.perPage, this.state.page) });
    else if (action == ACTIONS.UNVERIFY) reviewIncidentReport(id, false, () => { this.fetchData(this.state.perPage, this.state.page) });
    else if (action == ACTIONS.VALID_URL) validateIncidentReport(id, true, () => { this.fetchData(this.state.perPage, this.state.page) });
    else if (action == ACTIONS.INVALID_URL) validateIncidentReport(id, false, () => { this.fetchData(this.state.perPage, this.state.page) });
    else if (action == ACTIONS.PUBLISH) publishedIncidentReport(id, true, () => { this.fetchData(this.state.perPage, this.state.page) });
    else if (action == ACTIONS.UNPUBLISH) publishedIncidentReport(id, false, () => { this.fetchData(this.state.perPage, this.state.page) });
    else if (action == ACTIONS.DELETE) deleteIncidentReport(id, () => { this.fetchData(this.state.perPage, this.state.page) });
    else if (
      action === ACTIONS.MULTI_VERIFY
      || action === ACTIONS.MULTI_UNVERIFY
      || action === ACTIONS.MULTI_VALID_URL
      || action === ACTIONS.MULTI_INVALID_URL
      || action === ACTIONS.MULTI_PUBLISH
      || action === ACTIONS.MULTI_UNPUBLISH
      || action === ACTIONS.MULTI_DELETE
    ) {
      // typeof(action) == "string"
      this.setState({
        openAlertDialog: true,
        alertDialogAction: action,
        storeIds: id,
        storeAction: action,
      });
    }

    this.handleCloseActionDialog();
  };

  handleConfirmAction = () => {
    const { storeAction, storeIds } = this.state;
    if (this.state.storeAction && this.state.storeIds) {
      if (storeAction == ACTIONS.MULTI_VERIFY) reviewIncidentReport(storeIds, true);
      else if (storeAction == ACTIONS.MULTI_UNVERIFY) reviewIncidentReport(storeIds, false);
      else if (storeAction == ACTIONS.MULTI_VALID_URL) validateIncidentReport(storeIds, true);
      else if (storeAction == ACTIONS.MULTI_INVALID_URL) validateIncidentReport(storeIds, false);
      else if (storeAction == ACTIONS.MULTI_PUBLISH) publishedIncidentReport(storeIds, true);
      else if (storeAction == ACTIONS.MULTI_UNPUBLISH) publishedIncidentReport(storeIds, false);
      else if (storeAction == ACTIONS.MULTI_DELETE) deleteIncidentReport(storeIds);
    } else {
      alert('Something went wrong');
    }
    this.setState({
      openAlertDialog: false,
    }, () => {
      this.fetchData(this.state.perPage, this.state.page)
    })
  };

  login = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    axios
      .post('/api/auth/login', { useremail: email, password })
      .then((res) => {
        if (res.data.auth_user) {
          this.setState({ loggedIn: true });
          this.fetchData();
        } else {
          alert('Error logging in with the credentials provided.');
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  handleSortByChange = (e) => {
    this.setState({ sortBy: e.target.value }, () => {
      console.log(this.state.perPage, this.state.page)
      this.fetchData(this.state.perPage, this.state.page);
    })
  }

  handlePageChange = (e, page) => {
    this.setState({ page });
    this.fetchData(this.state.perPage, page);
  };

  handleRowChange = (e) => {
    let currentNumber = this.state.perPage * this.state.page;
    let value = Number(e.target.value)
    let newPage = Math.floor(currentNumber / value);
    this.setState({ perPage: e.target.value, page: newPage }, () => {
      this.fetchData(e.target.value, newPage);
    });
  };

  render() {
    const {
      incidentReports,
      email,
      password,
      openActionDialog,
      openAlertDialog,
      activeReport,
      loggedIn,
      counts
    } = this.state;
    const { classes } = this.props;

    if (loggedIn == null) {
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

    if (!counts) {
      this.getIncidentCounts();
      return (
        <div className={classes.loading}>
          <LinearProgress className={classes.progress} />
        </div>
      );
    }

    return (
      <div className={classes.root}>
        {this.state.incidentsChecked
          && this.state.incidentsChecked.length > 0 && (
            <BatchEdit
              incidentsChecked={this.state.incidentsChecked}
              actions={this.handleAction}
            />
          )}
        <Grid container justify="flex-start" className={classes.filterOptionsContainer}>
          <FormControl>
            <InputLabel > Sort By </InputLabel>
            <Select
              value={this.state.sortBy}
              label="Sort By"
              onChange={this.handleSortByChange}
            >
              <MenuItem value={0}> Incident ID </MenuItem>
              <MenuItem value={1}> Date of Event (ascending) </MenuItem>
              <MenuItem value={2}> Date of Event (descending) </MenuItem>
              <MenuItem value={3}> Date Submitted (ascending) </MenuItem>
              <MenuItem value={4}> Date Submitted (descending) </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <SimpleTable
          columnHeaders={COLUMN_HEADERS}
          tableData={incidentReports}
          key="incidenttable"
          onCheckIncident={this.handleCheckIncident}
          onCheckAll={this.handleCheckAll}
          idsChecked={this.state.incidentsChecked || []}
          fetchData={this.fetchData}
          counts={this.state.counts}
          perPage={this.state.perPage}
          page={this.state.page}
          handlePageChange={this.handlePageChange}
          handleRowChange={this.handleRowChange}
        />
        <Dialog onClose={this.handleCloseAlertDialog} open={openAlertDialog}>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to
              {' '}
              {this.state.storeAction}
              {' '}
              {this.state.storeIds.length}
              {' '}
              reports?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleConfirmAction}>
              YES
            </Button>
            <Button
              color="primary"
              onClick={this.handleCloseAlertDialog}
              autoFocus
            >
              CANCEL
            </Button>
          </DialogActions>
        </Dialog>
        {openActionDialog && (
          <Dialog
            onClose={this.handleCloseActionDialog}
            open={openActionDialog}
          >
            <DialogTitle>Choose Action</DialogTitle>
            <div>
              <List>
                <ListItem
                  button
                  onClick={() => { this.handleAction(activeReport, ACTIONS.VERIFY) }}
                >
                  <ListItemText primary="Mark Verified" />
                </ListItem>
                {!this.state.urlvalid ? (
                  <ListItem
                    button
                    onClick={() => { this.handleAction(activeReport, ACTIONS.VALID_URL) }}
                  >
                    <ListItemText primary="Mark Valid URL" />
                  </ListItem>
                ) : (
                  <ListItem
                    button
                    onClick={() => {
                      this.handleAction(
                        activeReport,
                        ACTIONS.INVALID_URL,
                      )
                    }}
                  >
                    <ListItemText primary="Mark Invalid URL" />
                  </ListItem>
                )}
                {!this.state.published ? (
                  <ListItem
                    button
                    onClick={() => { this.handleAction(activeReport, ACTIONS.PUBLISH) }}
                  >
                    <ListItemText primary="Mark Published Source" />
                  </ListItem>
                ) : (
                  <ListItem
                    button
                    onClick={() => { this.handleAction(activeReport, ACTIONS.UNPUBLISH) }}
                  >
                    <ListItemText primary="Mark Unpublished Source" />
                  </ListItem>
                )}
                <ListItem
                  button
                  onClick={() => { this.handleAction(activeReport, ACTIONS.DELETE) }}
                >
                  <ListItemText primary="Delete Report" />
                </ListItem>
              </List>
            </div>
          </Dialog>
        )}
      </div>
    );
  }
}

VerifyIncidentsPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VerifyIncidentsPage);