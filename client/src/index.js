/* Entry point for App, do not rename from index.js */

import React from 'react';
import { render } from 'react-dom';
// import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

render(<App />, document.getElementById('root'));

registerServiceWorker();
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin();
