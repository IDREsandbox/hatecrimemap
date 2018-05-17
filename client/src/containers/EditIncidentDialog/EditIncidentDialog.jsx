import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Dialog
        title="Scrollable Dialog"
        // actions={actions}
        modal={false}
        open={this.props.open}
        // onRequestClose={this.handleClose}
        autoScrollBodyContent
      >
        Schwoooooop
      </Dialog>
    );
  }
}
