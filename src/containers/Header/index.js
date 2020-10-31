import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { connect } from 'react-redux';
import Nav from '../../components/Nav';

import SignPledge from '../../components/SignPledge';

import { startSetDoYourJobDistricts } from '../../state/do-your-job-district/actions';
import { totalDoYourJobCount } from '../../state/do-your-job-district/selectors';

import { getElectionYear } from '../../state/selections/selectors';
/* eslint-disable */
require('style-loader!css-loader!antd/es/button/style/index.css');
import './style.scss';
import { switchElectionYear } from '../../state/selections/actions';
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
      electionYear,
    } = this.props;
    getDoYourJobDistricts(electionYear);
  }

  toggleInfo() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const width = window.innerWidth;
    const src = width > 992 ? 'images/pledgeHeader.jpg' : 'images/pledgeHeader@0,5x.jpg';
    return (
      <div>
        <Nav
          handleYearChange={this.props.changeYear}
          electionYear={this.props.electionYear}
        />
        <div className="header-container">

          <div className="header-pledge--CTA">
            <img src={src} alt="banner collage" />
            <div className="spacer" />
            <div className="background-light text-container">

              <h2>The Town Hall Pledge</h2>
              <p>We ask every single candidate for public office to take the <strong>#TownHallPledge</strong> to their constituents to hold a minimum of four town hall meetings per year in office.</p>
              <p>It is never too late to make this common-sense commitment to listen to the people. Ask lawmakers in your community to take the Pledge today!</p>
              <Button onClick={this.toggleInfo} className="text-right pt-2">Download the pledge</Button>
            </div>
          </div>
          {this.state.open ? (<SignPledge />) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allDoYourJobDistricts: totalDoYourJobCount(state),
  electionYear: getElectionYear(state),
});

const mapDispatchToProps = dispatch => ({
  changeYear: year => dispatch(switchElectionYear(year)),
  getDoYourJobDistricts: year => dispatch(startSetDoYourJobDistricts(year)),
});

Header.propTypes = {
  changeYear: PropTypes.func.isRequired,
  electionYear: PropTypes.string.isRequired,
  getDoYourJobDistricts: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
