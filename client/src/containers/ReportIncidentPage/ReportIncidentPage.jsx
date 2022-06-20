import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isUrl from 'is-url';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Paper,
  StepContent,
  Tooltip,
  Select,
  MenuItem,
  Typography,
  Grid
} from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank, Check, MoreHoriz, RadioButtonUncheckedSharp } from '@material-ui/icons';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';

import CheckboxTree from 'react-checkbox-tree';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { createDataToSubmit } from '../../utils/utilities';
import LocationSearchInput from '../../components/LocationSearchInput/LocationSearchInput';

import { motion } from 'framer-motion'
import ColoredButton from 'components/Reusables/ColoredButton';

import { PageVariants } from 'res/values/variants';

const styles = ({ spacing }) => ({
  root: {
    flex: 1,
    marginTop: spacing.unit * 2,
    width: '90%',
    margin: '0 1em',
    backgroundColor: '#ffffff'
  },
  stepper: {
    minWidth: '80%',
    backgroundColor: 'white',
    color: 'white',
  },
  button: {
    marginTop: spacing.unit,
    marginRight: spacing.unit,
  },
  actionsContainer: {
    marginBottom: spacing.unit * 2,
  },
  resetContainer: {
    padding: spacing.unit * 3,
  },
  checkboxWrapper: {
    color: 'black',
    marginLeft: spacing.unit,
  },
  mainTitle: {
    textAlign: "center",
    fontFamily: 'Bebas Neue',
    fontWeight: 'bold',
    fontSize: 50,
    color: 'black',
    marginTop: '1em'
  },
  container: {
    color: 'white',
  },
  stepLabel: {
    label: {
      fontSize: 50,
    },
    root: {
      fontSize: 50,
      color: 'white'
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 10000,
    }
  },
  hcmBanner: {
    width: '100%',
    selfAlign: 'center'
  },
  bannerContainer: {
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
  },
  stepIcon: {
    display: 'block',
    margin: 'auto',
    height: '100%',
  },
  mainGrid: {
    marginBottom: '1em',
  }
});

const getSteps = () => [
  'Harassment Location',
  'Date of Harassment',
  'Main Reason of Target',
  'Harassed Demographics',
  'Verification Link',
];

const getInitialState = () => ({
  primaryGroup: '',
  tag: 0,
  groupsChecked: [],
  groupsExpanded: [],
  other_race: '',
  other_religion: '',
  other_gender: '',
  other_misc: '',
  latLng: {},
  location: '',
  sourceurl: '',
  date: null,
  isDateSelected: false,
  associatedLink: true,
  description: '',
  activeStep: 0,
});

class ReportIncidentPage extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
    this.setState({ groups: {}, snackOpen: false });
  }

  async componentDidMount() {
    axios
      .get('/api/totals/groups')
      .then((res) => this.setState({ groups: this.groupToNodes(res.data.ret) }))
      .catch((err) => {
        alert(`API call failed: ${err}`);
        return {};
      });
  }

  onHandleClose = () => {
    this.setState({ snackOpen: false });
  };

  groupToNodes = (groups) => groups.map((eachGroup) => {
    eachGroup.value = eachGroup.key;
    delete eachGroup.key;
    eachGroup.label = eachGroup.name;
    delete eachGroup.name;
    if (eachGroup.children) {
      eachGroup.children = this.groupToNodes(eachGroup.children);
    }

    if (eachGroup.level == 0) {
      // disable toplevel categories, they're just for grouping
      eachGroup.showCheckbox = false;
      // this.setState((prevState) => prevState.groupsExpanded.push(eachGroup['value']));
    }

    // Do other node customizations, e.g. custom icons or class

    return eachGroup;
  });

  getStepContent = (index) => {
    const {
      location,
      sourceurl,
      groups,
      date,
      associatedLink,
      description,
    } = this.state;
    const { classes } = this.props;

    switch (index) {
      case 0:
        return (
          <LocationSearchInput
            name="location"
            onChange={this.handleLocationChange}
            onSelect={this.selectLocation}
            value={location}
          />
        );
      case 1:
        return (
          <KeyboardDatePicker
            DialogProps={{
              color: 'white',
              PaperProps: {
                color: 'white',
                className: classes.picker,
              }
            }}
            margin="normal"
            id="date-picker-dialog"
            label="Date of Incident"
            format="MM/dd/yyyy"
            value={date}
            disableFuture
            onChange={this.handleDateChange}
            showTodayButton
            maxDate={new Date()}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        );
      case 2:
        return (
          <Select
            name="targetSelect"
            id="targetSelect"
            value={this.state.primaryGroup}
            onChange={this.handleTargetChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Please Select One
            </MenuItem>
            {groups
              && Object.keys(groups).map((category) => (
                <MenuItem
                  key={groups[category].value}
                  value={groups[category].value}
                >
                  {groups[category].label}
                </MenuItem>
              )) /* Top level */}
          </Select>
        );
      case 3:
        return (
          <div className={classes.checkboxWrapper}>
            <CheckboxTree
              nodes={this.state.groups}
              checked={this.state.groupsChecked}
              expanded={this.state.groupsExpanded}
              onCheck={(groupsChecked) => this.setState({ groupsChecked })}
              onExpand={(groupsExpanded) => this.setState({ groupsExpanded })}
              icons={{
                check: <CheckBox color='action' />,
                uncheck: (
                  <CheckBoxOutlineBlank
                    color='action'
                  />
                ),
                halfCheck: (
                  <FontAwesomeIcon
                    color='#262626'
                    className="rct-icon rct-icon-half-check"
                    icon="check-square"
                  />
                ),
                expandClose: (
                  <div style={{ fontSize: '14px', color: 'black' }}>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                    />
                  </div>
                ),
                expandOpen: (
                  <div style={{ fontSize: '14px'.at, color: 'black' }}>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                    />
                  </div>
                ),
                expandAll: (
                  <div style={{ fontSize: '14px', color: 'black' }}>
                    <FontAwesomeIcon
                      icon={faPlusSquare}
                    />
                  </div>
                ),
                collapseAll: (
                  <FontAwesomeIcon
                    icon={faMinusSquare}
                  />
                ),
                parentClose: null,
                parentOpen: null,
                leaf: null,
              }}
              noCascade // Should "Asian American" automatically select everything under?
            />
            {this.state.groupsChecked.includes('40') && (
              <div>
                <TextField
                  name="other_race"
                  onChange={this.handleChange}
                  helperText="Other (Race/Ethnicity)"
                />
              </div>
            )}
            {this.state.groupsChecked.includes('41') && (
              <div>
                <TextField
                  name="other_religion"
                  onChange={this.handleChange}
                  helperText="Other (Religion)"
                />
              </div>
            )}
            {this.state.groupsChecked.includes('42') && (
              <div>
                <TextField
                  name="other_gender"
                  onChange={this.handleChange}
                  helperText="Other (Gender/Sexuality)"
                />
              </div>
            )}
            {this.state.groupsChecked.includes('43') && (
              <div>
                <TextField
                  name="other_misc"
                  onChange={this.handleChange}
                  helperText="Other (Miscellaneous)"
                />
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div>
            <Tooltip
              title="Please include http:// in any links"
              placement="left"
            >
              <TextField
                name="sourceurl"
                onChange={this.handleChange}
                helperText="http://www.example.com/"
                defaultValue={sourceurl}
                disabled={!associatedLink}
              />
            </Tooltip>
            <FormControlLabel
              control={(
                <CheckBox
                  checked={!associatedLink}
                  onChange={this.updateAssociatedLink}
                  value="associatedLink"
                />
              )}
              label="No associated link"
            />
            <Tooltip
              title="Include the demographic(s) of the group(s) harassed"
              placement="left"
            >
              <TextField
                name="description"
                onChange={this.handleChange}
                helperText="Provide a description of the incident"
                defaultValue={description}
                fullWidth
              />
            </Tooltip>
          </div>
        );
      default:
        return 'error';
    }
  };

  isFormFilledOut = () => {
    const {
      activeStep,
      location,
      isDateSelected,
      groupsChecked,
      sourceurl,
      latLng,
      associatedLink,
      description,
    } = this.state;

    switch (activeStep) {
      case 0:
        return location !== '' && latLng.lat;
      case 1:
        return isDateSelected;
      case 2:
        return this.state.primaryGroup !== '';
      case 3:
        return groupsChecked.length > 0;
      case 4:
        return (
          (isUrl(sourceurl) && associatedLink)
          || (sourceurl === '' && !associatedLink && description != '')
        );
      default:
        return true;
    }
  };

  selectLocation = (location) => {
    this.handleLocationChange(location);
    geocodeByAddress(location)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => this.setState({ latLng }))
      .catch(() => alert('Oops! There was an error. Please try again.'));
  };

  handleLocationChange = (location) => this.setState({ location, latLng: {} });

  handleDateChange = (date) => this.setState({ date, isDateSelected: true });

  handleTargetChange = (event) => this.setState({ primaryGroup: event.target.value });

  handleTagChange = (event) => {
    if (event.target.name == 'iscovid') {
      this.setState({ tag: event.target.checked ? 1 : 0 });
    }
  };

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  updateAssociatedLink = () => this.setState((oldState) => ({ associatedLink: !oldState.associatedLink }));

  handleNext = () => this.setState((oldState) => ({ activeStep: oldState.activeStep + 1 }));

  handleBack = () => this.setState((oldState) => ({ activeStep: oldState.activeStep - 1 }));

  handleReset = () => {
    this.setState({ activeStep: 0 });
    this.reportIncident();
  };

  reportIncident = () => {
    const dataToSubmit = createDataToSubmit(this.state);
    axios
      .post('/api/report/incident', dataToSubmit)
      .then(() => {
        this.setState({ snackOpen: true });
        this.resetState();
      })
      .catch((err) => {
        alert('Failed to submit the report');
        console.log(err);
      });
  };

  resetState = () => this.setState(getInitialState());

  stepIcon = (stepInfo) => {
    const { active, completed } = stepInfo;

    const { classes } = this.props;

    if (active) {
      return (
        <MoreHoriz color='action' className={classes.stepIcon} />
      )
    }

    return (
      <div>
        {completed ?
          <Check color='primary' className={classes.stepIcon} />
          :
          <RadioButtonUncheckedSharp color='disabled' className={classes.stepIcon} />
        }
      </div>
    )
  }

  render() {
    document.body.style = 'background: rgb(255,255,255)';
    const { activeStep } = this.state;
    const { classes } = this.props;
    const steps = getSteps();
    const buttonOnclick = activeStep === steps.length - 1 ? this.handleReset : this.handleNext;

    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={PageVariants}
        transition={{ duration: 0.5 }}
      >
        <Typography className={classes.mainTitle} variant="h4" >
          Report an Incident
        </Typography>
        <Grid
          container
          direction="row-reverse"
          justifyContent="center"
          alignItems="center"
          className={classes.mainGrid}
        >
          <Grid item md={8} xs={12}>
            <Paper className={classes.root}>
              <p style={{ padding: '24px 24px 0 24px' }}>
                To have an incident reported on the Hate Crime Map, it can be recorded here.
              </p>
              <p style={{ padding: '24px 24px 0 24px' }}>
                After being verified, it will be displayed on the map.
              </p>
              <p style={{ padding: '24px 24px 0 24px' }}>
                <em>
                  If this is a COVID-related incident, consider navigating to the
                  COVID page through the menu and reporting there.
                </em>
              </p>
              <Stepper
                className={classes.stepper}
                activeStep={activeStep}
                orientation="vertical"
                connector={<StepConnector classes={{
                  line: classes.connector,
                  completed: classes.connector,
                }} />}
              >
                {steps.map((label, i) => (
                  <Step key={label}>
                    <StepLabel className={classes.stepLabel} sx={{ color: 'white' }} StepIconComponent={this.stepIcon}>{label}</StepLabel>
                    <StepContent>
                      <div>{this.getStepContent(i)}</div>
                      <div className={classes.actionsContainer}>
                        <div>
                          <ColoredButton
                            lightMode
                            noIcon
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.button}
                          >
                            Back
                          </ColoredButton>
                          <ColoredButton
                            lightMode
                            noIcon
                            disabled={!this.isFormFilledOut()}
                            onClick={buttonOnclick}
                            className={classes.button}
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </ColoredButton>
                        </div>
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              <Snackbar
                open={this.state.snackOpen}
                autoHideDuration={5000}
                onClose={this.onHandleClose}
              >
                <Alert severity="success">Incident Reported!</Alert>
              </Snackbar>
            </Paper>
          </Grid>
          <Grid item md={4} xs={12}>
            <div className={classes.bannerContainer}>
              <img src={require('res/img/hcm_banner.png')} className={classes.hcmBanner} alt="Speak Out Logo" />
            </div>
          </Grid>
        </Grid>
      </motion.div >
    );
  }
}

ReportIncidentPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReportIncidentPage);