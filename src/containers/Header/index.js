import React from 'react';
import { Button, Icon } from 'antd';
import { connect } from 'react-redux';

import DYJDModal from '../../components/DYJD_Modal';

import { DYJD_COLOR, PLEDGED_COLOR } from '../../components/constants';
import SignPledge from '../../components/SignPledge';

import { startSetDoYourJobDistricts } from '../../state/do-your-job-district/actions';
import { totalDoYourJobCount } from '../../state/do-your-job-district/selectors';
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

  componentDidMount() {
    const {
      getDoYourJobDistricts,
    } = this.props;
    getDoYourJobDistricts();
  }

  toggleInfo() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { allDoYourJobDistricts } = this.props;
    const width = window.innerWidth;
    const src = width > 992 ? 'images/pledgeHeader.jpg' : 'images/pledgeHeader@0,5x.jpg';
    return (
      <div className="header-container">
        <div className="text-container do-your-job-banner">
          <h1>Accessibility is on the ballot</h1>
          <p>
              <strong style={{ color: DYJD_COLOR }}>{allDoYourJobDistricts ? `${allDoYourJobDistricts} ` : (<Icon type="loading" />)} 
              DO YOUR JOB DISTRICTS </strong>
              are currently held by incumbent
              <strong syle={{ color: 'red' }}> <a href="https://townhallproject.com/#missing-members" target="_blank" rel="noopener noreferrer">Missing Members </a></strong> who have not held a single open town hall meeting this entire Congressional session running against a challenger who has taken the
              <strong style={{ color: PLEDGED_COLOR }}> TOWN HALL PLEDGE</strong>.
            </p>
          <p><span className="do-your-job-icon"></span>It’s time to <strong style={{ color: DYJD_COLOR }}>Do Your Job... </strong>or let someone else do it for you.
          <DYJDModal />
         </p>
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

const mapStateToProps = state => ({
  allDoYourJobDistricts: totalDoYourJobCount(state),
});

const mapDispatchToProps = dispatch => ({
  getDoYourJobDistricts: () => dispatch(startSetDoYourJobDistricts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
