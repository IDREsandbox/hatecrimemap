import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const EditIncidentDialog = ({ handleCloseDialog, open }) => {
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
      modal={false}
      open={open}
      autoScrollBodyContent
    >
      Edit here
    </Dialog>
  );
};

EditIncidentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
};

export default EditIncidentDialog;
