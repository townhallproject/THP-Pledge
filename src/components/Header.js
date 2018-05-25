import React from 'react';
import { Button } from 'antd';

import SignPledge from './SignPledge';

/* eslint-disable */
require('style-loader!css-loader!antd/es/button/style/index.css');
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
    return (
      <div className="container-fluid header-container">
        <div className="row header-pledge--CTA">
          <div className="background-light text-container col-12 offset-lg-4 col-lg-7 pl-5 px-5">
            <h1>Take the Town Hall Pledge:</h1>
            <p>Across party lines, voters in 2018 are demanding accessibility from their lawmakers.
            </p>
            <p>We are asking every single candidate for public office this year to take the <strong>#townhallpledge</strong> to their constituents to hold a minimum of four town hall meetings per year in office.
            </p>
            <p>Ask candidates in your community to take the Pledge today!</p>
            <Button onClick={this.toggleInfo} className="text-right pt-2">Sign the pledge</Button>
          </div>
        </div>
        {this.state.open ? (<SignPledge />) : null}
      </div>
    );
  }
}

export default Header;
