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

/* eslint-enable */

const FilterBar = (props) => {
  const {
    toggleFilterToWinners,
  } = props;

  function changeNomineeToggle(value) {
    if (value) {
      return toggleFilterToWinners(true);
    }
    return toggleFilterToWinners(false);
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
  toggleFilterToWinners: PropTypes.func.isRequired,
};

export default FilterBar;
