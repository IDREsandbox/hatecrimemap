import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';

const EditIncidentDialog = ({
  handleCloseDialog,
   open,
   incidentToEdit,
   updateIncidentToEdit,
 }) => {
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
  const groupsChecked = incidentToEdit.camelized;
  console.log(groupsChecked);

  return (
    <Dialog
      title="Edit Entry"
      actions={actions}
      open={open}
      autoScrollBodyContent
    >
      {incidentToEdit.id}
      <GHCheckboxList onClick={updateIncidentToEdit} groupsChecked={groupsChecked} />
    </Dialog>
  );
};

EditIncidentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  incidentToEdit: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateIncidentToEdit: PropTypes.func.isRequired,
};

export default EditIncidentDialog;
