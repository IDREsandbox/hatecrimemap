import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';

const DialogWrapper = ({
  title,
  open,
  children,
  actions,
}) => (
  <Dialog
    title={title}
    actions={actions}
    open={open}
    autoScrollBodyContent
  >
    {children}
  </Dialog>
);

DialogWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  actions: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default DialogWrapper;
