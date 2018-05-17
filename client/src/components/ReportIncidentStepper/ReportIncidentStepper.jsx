import React from 'react';
import PropTypes from 'prop-types';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

const ReportIncidentStepper = ({ stepIndex }) => (
  <Stepper activeStep={stepIndex}>
    <Step>
      <StepLabel>Harassment Location</StepLabel>
    </Step>
    <Step>
      <StepLabel>Date of Harassment</StepLabel>
    </Step>
    <Step>
      <StepLabel>Groups Harassed</StepLabel>
    </Step>
    <Step>
      <StepLabel>Verification Link</StepLabel>
    </Step>
  </Stepper>
);

ReportIncidentStepper.propTypes = {
  stepIndex: PropTypes.number.isRequired,
};

export default ReportIncidentStepper;
