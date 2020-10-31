/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  getAllPledgers,
  getPledgersByDistrict,
  getPledgersByUsState,
  getMayorFeatures,
} from '../../state/pledgers/selectors';


import { startSetPledgers } from '../../state/pledgers/actions';

import {
  getUsState,
  getDistricts,
  getElectionYear,
  getFilterToWinners,
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

class PledgerDashboard extends React.Component {
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
      year,
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
      mayorFeatures,
      pledgersByState,
      resetSelections,
      searchByDistrict,
      selectedState,
      setUsState,
      selectedDistricts,
      showOnlyWinners,
    } = this.props;

    if (!mapboxgl.supported()) {
      return (<WebGlError mapType="pledger" />);
    }
    return (<MapView
      allDoYourJobDistricts={allDoYourJobDistricts}
      items={pledgersByState}
      mayorFeatures={mayorFeatures || []}
      selectedState={selectedState}
      winnersOnly={showOnlyWinners}
      setUsState={setUsState}
      districts={selectedDistricts}
      resetSelections={resetSelections}
      searchByDistrict={searchByDistrict}
    />);
  }

  render() {
    const {
      toggleFilterToWinners,
      allDoYourJobDistricts,
      pledgersByDistrict,
      allPledgers,
      showOnlyWinners,
      year,
    } = this.props;
    const isCurrentYear = year === moment().year().toString();

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
            isCurrentYear={isCurrentYear}
          />
        </div>
        <SearchBar
          items={pledgersByDistrict}
          mapType="pledger"
        />
        <Legend
          items={pledgersByDistrict}
          toggleFilterToWinners={toggleFilterToWinners}
          isCurrentYear={isCurrentYear}
          showOnlyWinners={showOnlyWinners}
        />
        {this.renderMap()}

        {<CounterBar
          allPledgers={allPledgers}
        />}
        <div className="footer" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allDoYourJobDistricts: getDoYourJobDistricts(state),
  allPledgers: getAllPledgers(state),
  mayorFeatures: getMayorFeatures(state),
  pledgersByDistrict: getPledgersByDistrict(state),
  pledgersByState: getPledgersByUsState(state),
  selectedDistricts: getDistricts(state),
  selectedState: getUsState(state),
  showOnlyWinners: getFilterToWinners(state),
  year: getElectionYear(state),
});

const mapDispatchToProps = dispatch => ({
  getInitialPledgers: year => dispatch(startSetPledgers(year)),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByDistrict: val => dispatch(selectionActions.setDistrict(val)),
  setFilters: filters => dispatch(selectionActions.setFilters(filters)),
  setInitialFilters: pledgers => dispatch(selectionActions.setInitialFilters(pledgers)),
  setUsState: usState => dispatch(selectionActions.setUsState(usState)),
  toggleFilterToWinners: filter => dispatch(selectionActions.toggleFilterToWinners(filter)),
});

PledgerDashboard.propTypes = {
  allDoYourJobDistricts: PropTypes.shape({}).isRequired,
  allPledgers: PropTypes.shape({}),
  getInitialPledgers: PropTypes.func.isRequired,
  mayorFeatures: PropTypes.arrayOf(PropTypes.shape({})),
  pledgersByDistrict: PropTypes.shape({}),
  pledgersByState: PropTypes.shape({}),
  resetSelections: PropTypes.func.isRequired,
  searchByDistrict: PropTypes.func.isRequired,
  selectedDistricts: PropTypes.arrayOf(PropTypes.number),
  selectedState: PropTypes.string,
  setInitialFilters: PropTypes.func.isRequired,
  setUsState: PropTypes.func.isRequired,
  showOnlyWinners: PropTypes.bool.isRequired,
  toggleFilterToWinners: PropTypes.func.isRequired,
  year: PropTypes.string.isRequired,
};

PledgerDashboard.defaultProps = {
  allPledgers: null,
  mayorFeatures: [],
  pledgersByDistrict: null,
  pledgersByState: null,
  selectedDistricts: [],
  selectedState: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(PledgerDashboard);
