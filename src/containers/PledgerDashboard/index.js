/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { difference } from 'lodash';

import {
  getAllPledgers,
  getPledgersByDistrict,
  getPledgersByUsState,
} from '../../state/pledgers/selectors';


import { startSetPledgers } from '../../state/pledgers/actions';

import {
  getUsState,
  getDistricts,
  getFilterBy,
  getElectionYear
} from '../../state/selections/selectors';
import * as selectionActions from '../../state/selections/actions';
import { getDoYourJobDistricts } from '../../state/do-your-job-district/selectors';


import MapView from '../../components/MapView';
import WebGlError from '../../components/WebGlError';
import CounterBar from '../../components/CounterBar';

import SearchBar from '../SearchBar';
import Table from '../../components/Table';

import './style.scss';
import Legend from '../../components/Legend';
import FilterBar from '../../components/FilterBar';
import { STATUS_WON } from '../../components/constants';

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
      getInitialPledgers, year
    } = this.props;
    getInitialPledgers(year)
      .then((returned) => {
        this.props.setInitialFilters(returned);
        this.setState({ init: false });
      });
  }

  renderMap() {
    const {
      allDoYourJobDistricts,
      filterBy,
      pledgersByState,
      resetSelections,
      searchByDistrict,
      selectedState,
      setUsState,
      selectedDistricts,
    } = this.props;

    if (!mapboxgl.supported()) {
      return (<WebGlError mapType="pledger" />);
    }

    return (<MapView
      allDoYourJobDistricts={allDoYourJobDistricts}
      items={pledgersByState}
      selectedState={selectedState}
      winnersOnly={
        difference(filterBy.status, [STATUS_WON]).length === 0
      }
      setUsState={setUsState}
      districts={selectedDistricts}
      resetSelections={resetSelections}
      searchByDistrict={searchByDistrict}
    />);
  }

  render() {
    const {
      addFilterBy,
      allDoYourJobDistricts,
      pledgersByDistrict,
      allPledgers,
      filterBy,
      removeFilterBy,
    } = this.props;

    if (this.state.init) {
      return (<SearchBar
        items={pledgersByDistrict}
        mapType="pledger"
      />);
    }
    return (
      <div className="pledgers-container main-container">
        <div className="table-container" id="table--state">
          <Table
            allDoYourJobDistricts={allDoYourJobDistricts}
            items={pledgersByDistrict}
          />
        </div>
        <SearchBar
          items={pledgersByDistrict}
          mapType="pledger"
        />
        <Legend
          addFilterBy={addFilterBy}
          filterBy={filterBy}
          removeFilterBy={removeFilterBy}
        />
        {this.renderMap()}

        <CounterBar
          allPledgers={allPledgers}
        />
        <div className="footer" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allDoYourJobDistricts: getDoYourJobDistricts(state),
  allPledgers: getAllPledgers(state),
  filterBy: getFilterBy(state),
  pledgersByDistrict: getPledgersByDistrict(state),
  pledgersByState: getPledgersByUsState(state),
  selectedDistricts: getDistricts(state),
  selectedState: getUsState(state),
  year: getElectionYear(state)
});

const mapDispatchToProps = dispatch => ({
  addFilterBy: filter => dispatch(selectionActions.addFilterBy(filter)),
  getInitialPledgers: (year) => dispatch(startSetPledgers(year)),
  removeFilterBy: filter => dispatch(selectionActions.removeFilterBy(filter)),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  addFilterBy: filter => dispatch(selectionActions.addFilterBy(filter)),
  removeFilterBy: filter => dispatch(selectionActions.removeFilterBy(filter)),
  searchByDistrict: val => dispatch(selectionActions.setDistrict(val)),
  setFilters: filters => dispatch(selectionActions.setFilters(filters)),
  setInitialFilters: pledgers => dispatch(selectionActions.setInitialFilters(pledgers)),
  setUsState: usState => dispatch(selectionActions.setUsState(usState)),
});

pledgerDashboard.propTypes = {
  allDoYourJobDistricts: PropTypes.shape({}).isRequired,
  allPledgers: PropTypes.shape({}),
  getInitialPledgers: PropTypes.func.isRequired,
  pledgersByDistrict: PropTypes.shape({}),
  filterBy: PropTypes.shape({}).isRequired,
  pledgersByState: PropTypes.shape({}),
  resetSelections: PropTypes.func.isRequired,
  searchByDistrict: PropTypes.func.isRequired,
  selectedDistricts: PropTypes.arrayOf(PropTypes.number),
  selectedState: PropTypes.string,
  setInitialFilters: PropTypes.func.isRequired,
  setUsState: PropTypes.func.isRequired,
};

pledgerDashboard.defaultProps = {
  allPledgers: null,
  pledgersByDistrict: null,
  pledgersByState: null,
  selectedDistricts: [],
  selectedState: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(pledgerDashboard);
