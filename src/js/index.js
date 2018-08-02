import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import config from './config/firebase.config';
import App from './app';

import "../scss/style.scss";

firebase.initializeApp(config);

ReactDOM.render(
  <div id="main">
    <App />
  </div>,document.getElementById('app'));
