
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button, Menu, Dropdown, message } from 'antd';

import './style.scss';

import { startSetPledgers } from '../../state/pledgers/actions'

require('style-loader!css-loader!antd/es/dropdown/style/index.css');
require('style-loader!css-loader!antd/es/message/style/index.css');
require('style-loader!css-loader!antd/es/menu/style/index.css');

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.handleChangeYear = this.handleChangeYear.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
  }

  handleChangeYear(e) {
    console.log('click', e.key);
    this.props.startSetPledgers(e.key)
  }

  renderMenu() {
    return (
      <Menu onClick={this.handleChangeYear}>
        <Menu.Item key="2018">2018</Menu.Item>
        <Menu.Item key="2019">2019</Menu.Item>
      </Menu>
    );
  }
  
  render() {
    return (
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
          <li>
            <Dropdown overlay={this.renderMenu()}>
              <Button style={{ marginLeft: 8 }}>
                Election Year <Icon type="down" />
              </Button>
            </Dropdown>
          </li>
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {}

const mapDispatchToProps = dispatch => ({
  startSetPledgers: (year) => dispatch(startSetPledgers(year))
});

Nav.propTypes = {
  startSetPledgers: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
