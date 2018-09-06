/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getAllPledgers,
  getPledgersByDistrict,
} from '../../state/pledgers/selectors';

import { startSetPledgers } from '../../state/pledgers/actions';

import { getUsState, getDistricts } from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';
import { startSetDoYourJobDistricts } from '../state/do-your-job-district/actions';
import { getDoYourJobDistricts } from '../state/do-your-job-district/selectors';

import MapView from '../../components/MapView';
import WebGlError from '../../components/WebGlError';
import CounterBar from '../../components/CounterBar';

import SearchBar from '../SearchBar';
import Table from '../../components/Table';

import './style.scss';

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
      getDoYourJobDistricts,
    } = this.props;
    getDoYourJobDistricts();
    getInitialPledgers()
      .then((returned) => {
        this.props.setInitialFilters(returned);
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
      allPledgers,
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
            items={pledgersByDistrict}
          />
        </div>
        <SearchBar
          items={pledgersByDistrict}
          mapType="pledger"
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
  pledgersByDistrict: getPledgersByDistrict(state),
  selectedDistricts: getDistricts(state),
  selectedState: getUsState(state),
});

const mapDispatchToProps = dispatch => ({
  getDoYourJobDistricts: () => dispatch(startSetDoYourJobDistricts()),
  getInitialPledgers: () => dispatch(startSetPledgers()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByDistrict: val => dispatch(selectionActions.setDistrict(val)),
  setFilters: filters => dispatch(selectionActions.setFilters(filters)),
  setInitialFilters: pledgers => dispatch(selectionActions.setInitialFilters(pledgers)),
  setUsState: usState => dispatch(selectionActions.setUsState(usState)),
});

pledgerDashboard.propTypes = {
  allPledgers: PropTypes.shape({}),
  getInitialPledgers: PropTypes.func.isRequired,
  pledgersByDistrict: PropTypes.shape({}),
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
  selectedDistricts: [],
  selectedState: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(pledgerDashboard);
