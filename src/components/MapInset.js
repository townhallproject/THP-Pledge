import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { find } from 'lodash';

class MapInset extends React.Component {
  constructor(props) {
    super(props);
    this.addClickListener = this.addClickListener.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentWillReceiveProps(nextProps) {
    const {
      items,
      type,
    } = nextProps;
    this.map.metadata = { searchType: nextProps.searchType };
  }

  toggleFilters(layer, filter) {
    this.map.setFilter(layer, filter);
    this.map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  addClickListener() {
    const {
      stateName,
      setUsState,
    } = this.props;
    const { map } = this;

    map.on('click', () => {
      setUsState({ usState: stateName });
    });
  }

  handleReset() {
    this.removeHighlights();
    this.props.resetSelections();
  }

  initializeMap() {
    const {
      bounds,
      mapId,
      searchType,
      stateName,
    } = this.props;

    mapboxgl.accessToken =
        'pk.eyJ1IjoidG93bmhhbGxwcm9qZWN0IiwiYSI6ImNqMnRwOG4wOTAwMnMycG1yMGZudHFxbWsifQ.FXyPo3-AD46IuWjjsGPJ3Q';
    const styleUrl = 'mapbox://styles/townhallproject/cjgr7qoqr00012ro4hnwlvsyp';

    this.map = new mapboxgl.Map({
      container: mapId,
      doubleClickZoom: false,
      dragPan: false,
      scrollZoom: false,
      style: styleUrl,
    });

    // Set Mapbox map controls
    this.map.metadata = {
      searchType,
    };
    // map on 'load'
    this.map.on('load', () => {
      this.map.fitBounds(bounds, {
        easeTo: { duration: 0 },
        linear: true,
      });
      this.addClickListener();
    });
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
    return (
      <React.Fragment>
        <div id={mapId} className={mapClassNames} data-bounds={this.props.bounds} />
      </React.Fragment>
    );
  }
}

MapInset.propTypes = {
  bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  items: PropTypes.shape({}).isRequired,
  mapId: PropTypes.string.isRequired,
  resetSelections: PropTypes.func.isRequired,
  selectedState: PropTypes.string,
  setUsState: PropTypes.func.isRequired,
  stateName: PropTypes.string.isRequired,
};

MapInset.defaultProps = {
  selectedState: '',
};

export default MapInset;
