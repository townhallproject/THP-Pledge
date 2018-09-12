import React from 'react';
import { Button } from 'antd';

import { DYJD_COLOR, PLEDGED_COLOR } from '../constants';
import SignPledge from '../SignPledge';

/* eslint-disable */
require('style-loader!css-loader!antd/es/button/style/index.css');
import './style.scss';
/* eslint-enable */

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.state = {
      open: false,
    };
  }
  toggleInfo() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const width = window.innerWidth;
    const src = width > 992 ? 'images/pledgeHeader.jpg' : 'images/pledgeHeader@0,5x.jpg';
    return (
      <div className="header-container">
        < div className="text-container">
            <h1>Accessibility is on the ballot</h1>
            <p>
              <strong style={{ color: DYJD_COLOR }}>* 31 * DO YOUR JOB DISTRICTS </strong> 
              are currently held by incumbent 
              <strong syle={{ color: 'red'}}> Missing Members </strong> who haven't not held a single open town hall meeting this entire Congressional session running against a challenger who has taken the 
              <strong style={{ color: PLEDGED_COLOR }}> TOWN HALL PLEDGE</strong>.</p>
            <p>It’s time to <strong style={{ color: DYJD_COLOR }}>Do Your Job... </strong>or let someone else do it for you.</p>
        </div>
        <div className="header-pledge--CTA">
          <img src={src} alt="banner collage" />
          <div className="spacer" />
          <div className="background-light text-container">
          
            <h2>Take the Town Hall Pledge</h2>
            <p>We are asking every single candidate for public office this year to take the <strong>#townhallpledge</strong> to their constituents to hold a minimum of four town hall meetings per year in office.
            </p>
            <p>Ask candidates in your community to take the Pledge today!</p>
            <Button ghost onClick={this.toggleInfo} className="text-right pt-2">Download the pledge</Button>
          </div>
        </div>
        {this.state.open ? (<SignPledge />) : null}
      </div>
    );
  }
}

export default Header;
