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
    addFilterBy,
    filterBy,
    removeFilterBy,
  } = props;

  function changeNomineeToggle(value) {
    console.log(value);
    if (value) {
      return addFilterBy({
        status: 'Nominee',
      });
    }
    return removeFilterBy('status');
  }

  return (
    <div className="container-fluid filter-bar">
        Show:
      <Switch
          onChange={changeNomineeToggle}
          defaultChecked
          checkedChildren="Nominees only"
          unCheckedChildren="All candidates"
        />

    </div>
  );
};

FilterBar.propTypes = {
  allPledgers: PropTypes.shape({}).isRequired,
};

export default FilterBar;
