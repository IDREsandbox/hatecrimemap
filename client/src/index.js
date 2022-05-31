/* Entry point for App, do not rename from index.js */

import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom"

// Advanced
// import injectTapEventPlugin from 'react-tap-event-plugin';
import registerServiceWorker from './registerServiceWorker';
// import reportWebVitals from './reportWebVitals';

render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    ,
    document.getElementById('root')
);

// reportWebVitals();
registerServiceWorker();
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

