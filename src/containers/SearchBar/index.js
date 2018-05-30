import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { Icon, Affix } from 'antd';
import states from '../../data/states';
import * as selectionActions from '../../state/selections/actions';
import { allTotalPledged } from '../../state/pledgers/selectors';

import SearchInput from '../../components/SearchInput';
import StatusFilterTags from '../../components/StatusFilterTags';

/* eslint-disable */
require('style-loader!css-loader!antd/es/style/index.css');
require('style-loader!css-loader!antd/es/input/style/index.css');
require('style-loader!css-loader!antd/es/button/style/index.css');
import './style.scss';
/* eslint-enable */

class SearchBar extends React.Component {
  static isZipCode(query) {
    const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
    return query.match(zipcodeRegEx);
  }

  static isState(query) {
    return find(states, state =>
      state.USPS.toLowerCase().trim() === query.toLowerCase().trim()
    || state.Name.toLowerCase().trim() === query.toLowerCase().trim());
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.renderFilterBar = this.renderFilterBar.bind(this);
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  searchHandler(value) {
    const { query } = value;
    const {
      resetSelections,
      searchByZip,
      setDistrict,
    } = this.props;

    if (!query) {
      return resetSelections();
    }
    if (SearchBar.isZipCode(query)) {
      return searchByZip(value);
    }
    if (SearchBar.isState(query)) {
      return setDistrict({ districts: [], state: SearchBar.isState(query).USPS });
    }
    const stateMatch = query.match(/([A-Z]|[a-z]){2}/g)[0];
    const districtMatch = query.match(/([0-9]{2})|([0-9]{1})/g)[0];
    if (stateMatch.length > 0 && districtMatch.length > 0) {
      const state = query.match(/([A-Z]|[a-z]){2}/g)[0];
      const districts = [Number(query.match(/([0-9]{2})|([0-9]{1})/g)[0])];
      return setDistrict({ districts, state });
    }
    return resetSelections();
  }

  renderFilterBar() {
    const {
      issues,
      onFilterChanged,
      selectedFilters,
    } = this.props;
    return (
      <div className="input-group-filters">
        <StatusFilterTags
          issues={issues}
          onFilterChanged={onFilterChanged}
          selectedFilters={selectedFilters}
        />
      </div>
    );
  }

  render() {
    const { totalPledged } = this.props;

    return (
      <Affix className="search-bar">
        <h2>{totalPledged || (<Icon type="loading" />)} candidates have taken the Town Hall Pledge</h2>
        <p>Find candidates in your district:</p>
        <SearchInput
          submitHandler={this.searchHandler}
        />
      </Affix>
    );
  }
}

const mapStateToProps = state => ({
  totalPledged: allTotalPledged(state),
  userSelections: state.selections,
});

const mapDispatchToProps = dispatch => ({
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByZip: zipcode => dispatch(selectionActions.getDistrictFromZip(zipcode)),
  setDistrict: district => dispatch(selectionActions.setDistrict(district)),
});

SearchBar.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.string),
  onFilterChanged: PropTypes.func,
  resetSelections: PropTypes.func.isRequired,
  searchByZip: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.string),
  setDistrict: PropTypes.func.isRequired,
  setTextFilter: PropTypes.func,
  totalPledged: PropTypes.number,
};

SearchBar.defaultProps = {
  issues: [],
  onFilterChanged: () => {},
  selectedFilters: [],
  setTextFilter: () => {},
  totalPledged: NaN,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
