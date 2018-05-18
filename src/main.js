import React from 'react';
import ReactDom from 'react-dom';
// import { Provider } from 'react-redux';

import Nav from './components/Nav';
import Header from './components/Header';
import CounterBar from './components/CounterBar';

// import configureStore from './store/configureStore';

import './style/app.scss';

// const store = configureStore();

const jsx = (
  // <Provider store={store}>
  <div>
    <Nav />
    <Header />
    <CounterBar />
  </div>
);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

renderApp();
