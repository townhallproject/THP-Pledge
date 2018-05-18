/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getAllPledgers,
  getPledgersByDistrict,
} from '../state/pledgers/selectors';

import { startSetPledgers } from '../state/pledgers/actions';

import {getUsState,} from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import MapView from '../components/PledgerMap';
import WebGlError from '../components/WebGlError';

import SearchBar from './SearchBar';
import SideBar from '../components/SideBar';

class pledgerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.renderTotal = this.renderTotal.bind(this);
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

  renderTotal(items) {
    const { district, filterValue } = this.props;
    if (district) {
      return (
        <p className="pledger-count">
        Viewing {items.length} pledgers in {filterValue}-{district}
        </p>);
    }
    return (<p className="pledger-count">Viewing {items.length} pledgers</p>);
  }

  renderMap() {
    const {
      resetSelections,
      searchByDistrict,
      selectedState,
      pledgersByDistrict,
      setUsState,
    } = this.props;

    if (!mapboxgl.supported()) {
      return (<WebGlError mapType="pledger" />);
    }

    return (<MapView
      items={pledgersByDistrict}
      selectedState={selectedState}
      setUsState={setUsState}
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
    console.log(pledgersByDistrict);
    return (
      <div className="pledgers-container main-container">
        <h2 className="dash-title">pledger Dashboard</h2>
        <SearchBar
          items={pledgersByDistrict}
          mapType="pledger"
        />
        <SideBar
          renderTotal={this.renderTotal}
          items={pledgersByDistrict}
          resetSelections={resetSelections}
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
});

const mapDispatchToProps = dispatch => ({
  getInitialPledgers: () => dispatch(startSetPledgers()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByDistrict: val => dispatch(selectionActions.setDistrict(val)),
  setFilters: filters => dispatch(selectionActions.setFilters(filters)),
  setInitialFilters: pledgers => dispatch(selectionActions.setInitialFilters(pledgers)),
  setLatLng: val => dispatch(selectionActions.setLatLng(val)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
  setUsState: usState => dispatch(selectionActions.setUsState(usState)),
});

pledgerDashboard.propTypes = {

};

pledgerDashboard.defaultProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(pledgerDashboard);
