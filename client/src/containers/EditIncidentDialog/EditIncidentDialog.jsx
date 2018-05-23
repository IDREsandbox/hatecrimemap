import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const EditIncidentDialog = ({ handleCloseDialog, open, incidentToEdit }) => {
  const actions = [
    <FlatButton
      label="Cancel"
      primary
      onClick={handleCloseDialog}
    />,
    <FlatButton
      label="Submit"
      primary
      disabled
      onClick={handleCloseDialog}
    />,
  ];

  return (
    <Dialog
      title="Edit Entry"
      actions={actions}
      open={open}
      autoScrollBodyContent
    >
      {incidentToEdit.id}
    </Dialog>
  );
};

EditIncidentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  incidentToEdit: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default EditIncidentDialog;
