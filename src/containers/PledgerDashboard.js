/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getAllPledgers,
  getPledgersByDistrict,
} from '../state/pledgers/selectors';

import { startSetPledgers } from '../state/pledgers/actions';

import { getUsState, getDistricts} from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import MapView from '../components/MapView';
import WebGlError from '../components/WebGlError';

import SearchBar from './SearchBar';
import Table from '../components/Table';

class pledgerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.renderMap = this.renderMap.bind(this);

    this.state = {
      init: true,
    };
  }

  componentDidMount() {
    const {
      getInitialPledgers,
    } = this.props;
    getInitialPledgers()
      .then((returned) => {
        if (this.state.issueFilter) {
          this.props.setFilters(this.state.issueFilter);
          this.setState({ issueFilter: null });
        } else {
          this.props.setInitialFilters(returned);
        }
        this.setState({ init: false });
      });
  }

  renderMap() {
    const {
      resetSelections,
      searchByDistrict,
      selectedState,
      pledgersByDistrict,
      setUsState,
      selectedDistricts,
    } = this.props;

    if (!mapboxgl.supported()) {
      return (<WebGlError mapType="pledger" />);
    }

    return (<MapView
      items={pledgersByDistrict}
      selectedState={selectedState}
      setUsState={setUsState}
      districts={selectedDistricts}
      resetSelections={resetSelections}
      searchByDistrict={searchByDistrict}
    />);
  }

  render() {
    const {
      pledgersByDistrict,
      resetSelections,
    } = this.props;

    if (this.state.init) {
      return null;
    }
    return (
      <div className="pledgers-container main-container">
        <div className="table-container" id='table--state'>
        <Table
          items={pledgersByDistrict}
        />
        </div>
        <SearchBar
          items={pledgersByDistrict}
          mapType="pledger"
        />
        {this.renderMap()}
        <div className="footer" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allPledgers: getAllPledgers(state),
  pledgersByDistrict: getPledgersByDistrict(state),
  selectedState: getUsState(state),
  selectedDistricts: getDistricts(state),
});

const mapDispatchToProps = dispatch => ({
  getInitialPledgers: () => dispatch(startSetPledgers()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByDistrict: val => dispatch(selectionActions.setDistrict(val)),
  setFilters: filters => dispatch(selectionActions.setFilters(filters)),
  setInitialFilters: pledgers => dispatch(selectionActions.setInitialFilters(pledgers)),
  setUsState: usState => dispatch(selectionActions.setUsState(usState)),
});

pledgerDashboard.propTypes = {

};

pledgerDashboard.defaultProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(pledgerDashboard);
