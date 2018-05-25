import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import GHCheckboxList from '../GHCheckboxList/GHCheckboxList';
import LocationSearchInput from '../LocationSearchInput/LocationSearchInput';

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
      title={`Edit Entry #${incidentToEdit.id + 1}`}
      actions={actions}
      open={open}
      autoScrollBodyContent
    >
      <LocationSearchInput
        name="location"
        onChange={() => console.log('woop')}
        onSelect={() => console.log('woop')}
        value={incidentToEdit.locationname}
        underlineShow={false}
      />
      <Divider />
      <GHCheckboxList onClick={updateIncidentToEdit} groupsChecked={groupsChecked} />
      <Divider />
      <TextField
        name="sourceurl"
        // onChange={this.handleChange}
        hintText="http://www.example.com/"
        floatingLabelText="Paste or type a link to a website"
        // defaultValue={sourceurl}
        underlineShow={false}
      />
      <Divider />
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
