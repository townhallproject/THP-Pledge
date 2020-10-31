import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import MbMap from '../utils/mapbox-map';

class MapInset extends React.Component {
  constructor(props) {
    super(props);
    this.addClickListener = this.addClickListener.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.setStateStyle = this.setStateStyle.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.colorDistrictsByPledgersAndDJYD = this.colorDistrictsByPledgersAndDJYD.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentWillReceiveProps(newProps) {
    const {
      allDoYourJobDistricts,
      winnersOnly,
    } = this.props;
    const {
      mbMap,
    } = this;
    if (newProps.winnersOnly !== winnersOnly) {
      mbMap.colorDistrictsByPledgersAndDJYD(allDoYourJobDistricts, newProps.items, null, newProps.winnersOnly);
    }
  }

  componentDidUpdate() {
    this.map.resize();
  }

  onLoad() {
    this.colorDistrictsByPledgersAndDJYD();
  }

  setStateStyle() {
    const {
      items,
    } = this.props;
    const {
      mbMap,
    } = this;
    mbMap.stateOutline(items);
  }

  handleReset() {
    this.removeHighlights();
    this.props.resetSelections();
  }

  colorDistrictsByPledgersAndDJYD() {
    const {
      items,
      allDoYourJobDistricts,
      winnersOnly,
    } = this.props;
    const {
      mbMap,
    } = this;
    mbMap.colorDistrictsByPledgersAndDJYD(allDoYourJobDistricts, items, null, winnersOnly);
  }

  addClickListener() {
    const {
      stateName,
      setUsState,
    } = this.props;

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

    this.mbMap.setInitalState('inset', this.setStateStyle, bounds, {
      easeTo: { duration: 0 },
      linear: true,
    }, this.addClickListener(), selectedState, this.onLoad);
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
  allDoYourJobDistricts: PropTypes.shape({}).isRequired,
  bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  items: PropTypes.shape({}),
  mapId: PropTypes.string.isRequired,
  resetSelections: PropTypes.func.isRequired,
  selectedState: PropTypes.string,
  setUsState: PropTypes.func.isRequired,
  stateName: PropTypes.string.isRequired,
  winnersOnly: PropTypes.bool.isRequired,
};

MapInset.defaultProps = {
  items: {},
  selectedState: '',
};

export default MapInset;
