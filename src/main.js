import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';

import configureStore from './store/configureStore';

import './style/app.scss';

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <App />
  </Provider>
);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

renderApp();
