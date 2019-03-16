import React from 'react';

import PropTypes from 'prop-types';
import {
  Tag,
  Switch,
} from 'antd';

/* eslint-disable */
require('style-loader!css-loader!antd/es/popover/style/index.css');
require('style-loader!css-loader!antd/es/switch/style/index.css');
import './style.scss';
import { 
  STATUS_WON, 
  STATUS_NOMINEE,
  INCLUDE_STATUS,
} from '../constants';
/* eslint-enable */

const FilterBar = (props) => {
  const {
    addFilterBy, 
  } = props;

  function changeNomineeToggle(value) {
    if (value) {
      return addFilterBy({
        pledged: [true],
        status: [STATUS_WON],
      });
    }
    return addFilterBy({
      pledged: [true, false],
      status: INCLUDE_STATUS,
    });
  }

  return (
    <div className="container-fluid filter-bar">
        Showing:
      <Switch
        onChange={changeNomineeToggle}
        checkedChildren="Pledged winners"
        unCheckedChildren="All nominees"
      />

    </div>
  );
};

FilterBar.propTypes = {
  allPledgers: PropTypes.shape({}).isRequired,
  addFilterBy: PropTypes.func.isRequired,
};

export default FilterBar;
