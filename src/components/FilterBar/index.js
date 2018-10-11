import React from 'react';

import PropTypes from 'prop-types';
import {
  Tag,
} from 'antd';

const {
  CheckableTag
} = Tag;

/* eslint-disable */
require('style-loader!css-loader!antd/es/popover/style/index.css');
// import './style.scss';
/* eslint-enable */

const FilterBar = (props) => {
  const {
    addFilterBy,
    filterBy,
    removeFilterBy,
  } = props;

  function changeNomineeToggle(value) {
    if (value) {
      return addFilterBy({
        status: 'Nominee'
      })
    }
    return removeFilterBy('status');
  };

  return (
    <div className="container-fluid">
        <CheckableTag 
            checked={filterBy.status === 'Nominee'} 
            onChange={changeNomineeToggle}>Nominees Only
        </CheckableTag>
    </div>
  );
};

FilterBar.propTypes = {
  allPledgers: PropTypes.shape({}).isRequired,
};

export default FilterBar;
