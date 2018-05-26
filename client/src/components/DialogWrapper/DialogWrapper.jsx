import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const DialogWrapper = ({
  title,
  open,
  close,
  children,
  onClick,
}) => {
  const submitDisabled = typeof onClick !== 'function';
  const actions = [
    <FlatButton
      label="Cancel"
      primary
      onClick={close}
    />,
    <FlatButton
      label="Submit"
      primary
      disabled={submitDisabled}
      onClick={onClick}
    />,
  ];

  return (
    <Dialog
      title={title}
      actions={actions}
      open={open}
      autoScrollBodyContent
    >
      {children}
    </Dialog>
  );
};

DialogWrapper.defaultProps = {
  onClick: null,
};

DialogWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default DialogWrapper;
