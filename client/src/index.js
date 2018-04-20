/* Entry point for App, do not rename from index.js */

import React from 'react';
import { render } from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

render(<App />, document.getElementById('root'));
registerServiceWorker();
