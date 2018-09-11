import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { totalPledgedInState } from '../utils';
import MbMap from '../utils/mapbox-map';

class MapInset extends React.Component {
  constructor(props) {
    super(props);
    this.addClickListener = this.addClickListener.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.setStateStyle = this.setStateStyle.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentDidUpdate() {
    this.map.resize();
  }

  setStateStyle() {
    const {
      items,
    } = this.props;
    const {
      mbMap,
    } = this;
    mbMap.stateChloroplethFill(items);
  }

  handleReset() {
    this.removeHighlights();
    this.props.resetSelections();
  }

  addClickListener() {
    const {
      stateName,
      setUsState,
    } = this.props;
    const { map } = this;

    return () => {
      setUsState({ usState: stateName });
    };
  }
  toggleFilters(layer, filterRules) {
    this.map.setFilter(layer, filterRules);
    this.map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  initializeMap() {
    const {
      bounds,
      mapId,
      selectedState,
    } = this.props;


    this.mbMap = new MbMap({
      container: mapId,
      doubleClickZoom: false,
      dragPan: false,
      scrollZoom: false,
    });

    this.map = this.mbMap.map;
    this.mbMap.setInitalState(this.setStateStyle, bounds, {
      easeTo: { duration: 0 },
      linear: true,
    }, this.addClickListener(), selectedState);
  }

  render() {
    const {
      selectedState,
      mapId,
    } = this.props;
    const mapClassNames = classNames({
      hidden: selectedState,
      inset: true,
    });
    if (this.map) {
      this.map.resize();
    }
    return (
      <React.Fragment>
        <div id={mapId} className={mapClassNames} data-bounds={this.props.bounds} />
      </React.Fragment>
    );
  }
}

MapInset.propTypes = {
  bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  mapId: PropTypes.string.isRequired,
  resetSelections: PropTypes.func.isRequired,
  selectedState: PropTypes.string,
  setUsState: PropTypes.func.isRequired,
  stateName: PropTypes.string.isRequired,
};

MapInset.defaultProps = {
  items: [],
  selectedState: '',
};

export default MapInset;
