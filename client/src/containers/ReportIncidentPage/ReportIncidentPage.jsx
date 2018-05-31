import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import isUrl from 'is-url';
// import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Paper from '@material-ui/core/Paper';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import LocationSearchInput from '../../components/LocationSearchInput/LocationSearchInput';
// import ReportIncidentStepper from '../../components/ReportIncidentStepper/ReportIncidentStepper';
import GHCheckboxList from '../../components/GHCheckboxList/GHCheckboxList';

const styles = theme => ({
  root: {
    margin: '50px auto',
    width: '50%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

const getSteps = () => [
  'Harassment Location',
  'Date of Harassment',
  'Groups Harassed',
  'Verification Link',
];

class ReportIncidentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
      date: {},
      activeStep: 0,
      latLng: {},
      associatedLink: true,
    };
  }

  getStepContent = (index) => {
    const { location, sourceurl, activeStep, groupsHarassed, date, associatedLink } = this.state;
    const errorText = !this.isFormFilledOut() ? 'Field Required' : '';

    switch (index || activeStep) {
      case 0:
        return (
          <LocationSearchInput
            name="location"
            onChange={this.updateLocation}
            onSelect={this.selectLocation}
            value={location}
            errorText={errorText}
          />
        );
      case 1:
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              keyboard
              label="Select a date"
              format="MM/DD/YYYY"
              placeholder="08/21/2018"
              showTodayButton
              mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
              value={date}
              onChange={this.updateDate}
              disableOpenOnEnter
              maxDate={new Date()}
              maxDateMessage="Date must be less than today"
            />
          </MuiPickersUtilsProvider>
        );
      case 2:
        return (
          <GHCheckboxList
            onClick={this.updateGroupsHarassed}
            showSVGs={false}
            groupsChecked={groupsHarassed}
          />
        );
      case 3:
        return (
          <div>
            <TextField
              name="sourceurl"
              error={errorText !== ''}
              onChange={this.handleChange}
              label={errorText}
              helperText="http://www.example.com/"
              defaultValue={sourceurl}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!associatedLink}
                  onChange={this.updateAssociatedLink}
                  value="associatedLink"
                />
              }
              label="No associated link"
            />
          </div>
        );
      default:
        return 'error';
    }
  }

  isFormFilledOut = () => {
    const {
      activeStep,
      location,
      date,
      groupsHarassed,
      sourceurl,
      latLng,
      associatedLink,
    } = this.state;

    switch (activeStep) {
      case 0:
        return location !== '' && latLng.lat;
      case 1:
        return !(Object.keys(date).length === 0 && date.constructor === Object);
      case 2:
        return groupsHarassed.size !== 0;
      case 3:
        return (isUrl(sourceurl) && associatedLink) || (sourceurl === '' && !associatedLink);
      default:
        return true;
    }
  }

  updateGroupsHarassed = ({ target: { name } }) => {
    const { groupsHarassed } = this.state;
    if (groupsHarassed.has(name)) {
      groupsHarassed.delete(name);
    } else {
      groupsHarassed.add(name);
    }
    this.setState({ groupsHarassed });
  }

  selectLocation = (location) => {
    this.updateLocation(location);
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({ latLng }))
      .catch(error => console.error('Error', error));
  }

  updateLocation = location => this.setState({ location, latLng: {} });

  updateDate = date => this.setState({ date });

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  updateAssociatedLink = () => this.setState(oldState => ({ associatedLink: !oldState.associatedLink }));

  handleNext = () => {
    const { activeStep } = this.state;
    if (!this.isFormFilledOut()) {
      const alertMessage = activeStep === 3
        ? 'A correctly formatted url is required before continuing.'
        : 'This field is required before continuing.';
      alert(alertMessage);
      return;
    }
    this.setState({
      activeStep: activeStep + 1,
    });
  }

  handleBack = () => this.setState({ activeStep: this.state.activeStep - 1 });

  handleReset = () => this.setState({ activeStep: 0 });

  reportIncident = () => {
    console.log(this.state);
    this.setState({
      groupsHarassed: new Set(),
      location: '',
      sourceurl: '',
      date: {},
      activeStep: 0,
      latLng: {},
      associatedLink: true,
    });
    axios.post('/api/maps/reportincident', this.state)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }

  render() {
    const { activeStep } = this.state;
    const { classes } = this.props;
    const steps = getSteps();
    const nextStepContent = this.getStepContent();
    const nextDisabled = !this.isFormFilledOut();

    return (
      <Paper className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{nextStepContent}</Typography>
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                      <Button
                        variant="raised"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}
                        disabled={nextDisabled}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&quot;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </Paper>
      // <Paper className="reportIncidentPage" elevation={2}>
      //   <ReportIncidentStepper stepIndex={stepIndex} />
      //   <div>
      //     {finished ? (
      //       <p>
      //         <button
      //           onClick={(event) => {
      //             this.reportIncident();
      //             event.preventDefault();
      //             this.setState({ stepIndex: 0, finished: false });
      //           }}
      //         >
      //           Click here
      //         </button> to console log data and reset form.
      //       </p>
      //     ) : (
      //       <div>
      //         <div>{nextStepContent}</div>
      //         <div>
      //           <Button
      //             disabled={stepIndex === 0}
      //             onClick={this.handlePrev}
      //           >
      //             Back
      //           </Button>
      //           <Button
      //             variant="raised"
      //             onClick={this.handleNext}
      //             disabled={nextDisabled}
      //           >
      //             {stepIndex === 3 ? 'Finish' : 'Next'}
      //           </Button>
      //         </div>
      //       </div>
      //     )}
      //   </div>
      // </Paper>
    );
  }
}

ReportIncidentPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReportIncidentPage);
