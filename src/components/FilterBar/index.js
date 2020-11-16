import React from 'react';

import PropTypes from 'prop-types';
import { Switch } from 'antd';

/* eslint-disable */
require('style-loader!css-loader!antd/es/popover/style/index.css');
require('style-loader!css-loader!antd/es/switch/style/index.css');
import './style.scss';

/* eslint-enable */

const FilterBar = (props) => {
  const {
    toggleFilterToWinners,
    showOnlyWinners,
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
        defaultChecked={showOnlyWinners}
      />

    </div>
  );
};

FilterBar.propTypes = {
  showOnlyWinners: PropTypes.bool.isRequired,
  toggleFilterToWinners: PropTypes.func.isRequired,
};

export default FilterBar;
