import React from 'react';

import Nav from './components/Nav/index';
import Header from './containers/Header';
import PledgerDashboard from './containers/PledgerDashboard';

export default () => (
  <div>
    <Nav />
    <Header />
    <PledgerDashboard />
  </div>
);

