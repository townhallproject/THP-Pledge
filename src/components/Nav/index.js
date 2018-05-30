
import React from 'react';
import { Icon, Button } from 'antd';

import './style.scss';

export default () => (
  <nav className="navbar navbar-light justify-content-between">
    <a className="navbar-brand" href="/">
      <img src="images/THP_logo_horizontal_simple_pledge.png" className="d-inline-block align-top" alt="Town Hall Project Pledge" />
    </a>
    <ul className="nav navbar-nav navbar-right">
      <li><a className="linkOut social-icons" href="https://twitter.com/townhallproject" target="_blank"><Icon type="twitter" aria-hidden="true" /></a></li>
      <li><a className="linkOut social-icons" href="https://www.facebook.com/TownHallProject/" target="_blank"><Icon type="facebook" aria-hidden="true" /></a></li>
      <li><a data-toggle="tab" className="linkOut social-icons" href="#contact"><Icon type="mail" /></a></li>
      <li><Button href="https://secure.actblue.com/contribute/page/townhallproject" className="linkOut btn" id="donate-button" role="button" target="_blank">Donate</Button></li>
      <li><Button href="//townhallproject.com" rel="noopener noreferrer" target="_blank" className="linkOut">Main site <div className="main-site" /></Button></li>
    </ul>
  </nav>
);

