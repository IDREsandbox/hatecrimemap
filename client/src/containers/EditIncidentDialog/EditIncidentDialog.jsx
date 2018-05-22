import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class EditIncidentDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { handleCloseDialog, open } = this.props;
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
  }
}

EditIncidentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
};
