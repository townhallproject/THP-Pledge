import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { Radio } from 'antd';
import states from '../data/states';
import * as selectionActions from '../state/selections/actions';


import SearchInput from '../components/SearchInput';
import StatusFilterTags from '../components/StatusFilterTags';

const RadioGroup = Radio.Group;
/* eslint-disable */
require('style-loader!css-loader!antd/es/radio/style/index.css');
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
      resetSearchByZip,
      searchByZip,
      setUsState,
      setDistrict,
    } = this.props;
    const nameTitleMap = {
      event: 'title',
      group: 'name',
    };

    if (!query) {
      return resetSelections();
    }
    if (SearchBar.isZipCode(query)) {
      return searchByZip(value);
    }
    if (SearchBar.isState(query)) {
      resetSearchByZip();
      console.log(SearchBar.isState(query).USPS);
      return setUsState({ usState: SearchBar.isState(query).USPS });
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
    if (mapType === 'group') {
      return null;
    }
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
    return (
      <div className="search-bar">
        <SearchInput
          submitHandler={this.searchHandler}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userSelections: state.selections,
});

const mapDispatchToProps = dispatch => ({
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByZip: zipcode => dispatch(selectionActions.getDistrictFromZip(zipcode)),
  setDistrict: district => dispatch(selectionActions.setDistrict(district)),
  setUsState: usState => dispatch(selectionActions.setUsState(usState)),
});

SearchBar.propTypes = {

};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
