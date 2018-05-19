import React from 'react';

import Nav from './components/Nav';
import Header from './components/Header';
import CounterBar from './components/CounterBar';
import PledgerDashboard from './containers/PledgerDashboard';

export default () => (
  <div>
    <Nav />
    <Header />
    <CounterBar />
    <PledgerDashboard />
  </div>
);

