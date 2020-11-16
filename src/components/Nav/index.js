
import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
  Menu,
  Divider,
} from 'antd';

import SubMenu from 'antd/lib/menu/SubMenu';

import './style.scss';

/* eslint-disable */
require('style-loader!css-loader!antd/es/dropdown/style/index.css');
require('style-loader!css-loader!antd/es/menu/style/index.css');
require('style-loader!css-loader!antd/es/divider/style/index.css');
/* eslint-enable */


const MenuItemGroup = Menu.ItemGroup;

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.handleYearSwitch = this.handleYearSwitch.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
    this.renderMenuTitle = this.renderMenuTitle.bind(this);
  }


  handleYearSwitch(e) {
    this.props.handleYearChange(e.key);
  }

  renderMenu() {
    return (
      <MenuItemGroup>
        <Menu.Item key="2018" onClick={this.handleYearSwitch}>2018</Menu.Item>
        {/* <Menu.Item key="2019" onClick={this.handleYearSwitch}>2019</Menu.Item> */}
        <Menu.Item key="2020" onClick={this.handleYearSwitch}>2020</Menu.Item>

      </MenuItemGroup>
    );
  }

  renderMenuTitle() {
    const {
      electionYear,
    } = this.props;
    return (<React.Fragment>Election Year {electionYear || <Icon type="loading" /> } <Icon type="caret-down" /></React.Fragment>);
  }

  render() {
    return (
      <div
        className="navbar-container"
      >
        <Menu
          className="navbar"
          mode="horizontal"
        >
          <Menu.Item>
            <a className="navbar-brand" href="/">
              <img src="images/THP_logo_horizontal_simple_pledge.png" className="d-inline-block align-top" alt="Town Hall Project Pledge" />
            </a>
          </Menu.Item>
          <SubMenu title={this.renderMenuTitle()}>
            {this.renderMenu()}
          </SubMenu>
        </Menu>
        <Menu
          className="navbar"
          mode="horizontal"
        >
          <Menu.Item
            className="social-icons"
          >
            <a className="linkOut" href="https://twitter.com/townhallproject" target="_blank"><Icon type="twitter" aria-hidden="true" />
            </a>
          </Menu.Item>
          <Menu.Item
            className="social-icons"
          >
            <a className="linkOut" href="https://www.facebook.com/TownHallProject/" target="_blank"><Icon type="facebook" aria-hidden="true" />
            </a>
          </Menu.Item>
          <Menu.Item
            className="social-icons"
          >
            <a data-toggle="tab" className="linkOut" href="mailto:info@townhallproject.com"><Icon type="mail" /></a>
          </Menu.Item>
          <Divider type="vertical" />
          <Menu.Item>
            <a href="//townhallproject.com" rel="noopener noreferrer" target="_blank" className="linkOut"><div className="main-site" /> Main site </a>
          </Menu.Item>
          <Button href="https://secure.actblue.com/contribute/page/townhallproject" className="linkOut btn" id="donate-button" role="button" target="_blank">Donate</Button>
        </Menu>

      </div>
    );
  }
}

Nav.propTypes = {
  electionYear: PropTypes.string.isRequired,
  handleYearChange: PropTypes.func.isRequired,
};

export default Nav;
