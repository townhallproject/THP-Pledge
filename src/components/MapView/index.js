import React from 'react';
import chroma from 'chroma-js';
import PropTypes from 'prop-types';
import {
  filter,
  map,
  mapKeys,
  values,
  includes,
} from 'lodash';
import geoViewport from '@mapbox/geo-viewport';
import { stateAbrvToName, fips, numOfDistricts } from '../../data/dictionaries';
import {
  DYJD_COLOR,
  PLEDGED_COLOR,
} from '../constants';

import {
  takenThePledge,
  totalPledgedInDistricts,
  totalPledgedInCategory,
  totalPledgedInState,
  zeroPadding,
  formatPledger,
} from '../../utils';

import bboxes from '../../data/bboxes';
import states from '../../data/states';
import MapInset from '../../components/MapInset';

import './popover.scss';
import './style.scss';
import MbMap from '../../utils/mapbox-map';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.filterDistrict = ['any'];
    this.includedStates = ['in', 'NAME'];

    this.addPopups = this.addPopups.bind(this);
    this.addClickListener = this.addClickListener.bind(this);
    this.setStateStyle = this.setStateStyle.bind(this);
    this.setDistrictStyle = this.setDistrictStyle.bind(this);
    this.showStateTooltip = this.showStateTooltip.bind(this);
    this.showDistrictTooltip = this.showDistrictTooltip.bind(this);
    this.setStateStyleMask = this.setStateStyleMask.bind(this);
    this.focusMap = this.focusMap.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.highlightDistrict = this.highlightDistrict.bind(this);
    this.districtSelect = this.districtSelect.bind(this);
    this.removeHighlights = this.removeHighlights.bind(this);
    this.addStateLayers = this.addStateLayers.bind(this);
    this.setStateDoYourJob = this.setStateDoYourJob.bind(this);
    this.setInitialStyles = this.setInitialStyles.bind(this);
    this.state = {
      alaskaItems: props.items.AK,
      filterStyle: 'state',
      hawaiiItems: props.items.HI,
      popoverColor: 'popover-has-data',
    };
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentWillReceiveProps(nextProps) {
    const {
      selectedState,
      districts,
    } = nextProps;
    this.map.metadata = { selectedState: nextProps.selectedState };
    if (selectedState) {
      this.setStateStyleMask(selectedState);
      const bbname = selectedState.toUpperCase();
      this.map.metadata.level = 'districts';
      if (this.state.filterStyle === 'state') {
        this.setState({ filterStyle: 'district' });
      }
      if (districts.length > 0) {
        const stateFIPS = states.find(cur => cur.USPS === bbname).FIPS;
        // highlight district
        const districtPadded = zeroPadding(districts[0]);
        const geoID = `${stateFIPS}${districtPadded}`;
        const selectObj = {
          district: districtPadded,
          geoID,
          state: nextProps.selectedState,
        };
        this.districtSelect(selectObj);
      }
      const stateBB = bboxes[bbname];
      return this.focusMap(stateBB);
    }
    this.setStateStyleMask();
    this.map.metadata.level = 'state';
    this.setState({ filterStyle: 'state' });
    return this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
  }

  componentDidUpdate(prevProps, prevState) {
    // changing between coloring by state and coloring by district
    const mapStyle = {
      district: this.setDistrictStyle,
      state: this.setStateStyle,
    };
    if (prevState.filterStyle !== this.state.filterStyle || prevProps.selectedState !== this.props.selectedState) {
      mapStyle[this.state.filterStyle]();
      // clearing any previous popups
      this.popup.remove();
    }
  }

  setDistrictStyle() {
    const {
      items,
      selectedState,

    } = this.props;

    const { map, mbMap } = this;

    map.setLayoutProperty('states-fill', 'visibility', 'none');
    mbMap.addDYJDistrictFillLayer();
    Object.keys(items).forEach((state) => {
      if (!items[state]) {
        return;
      }
      Object.keys(items[state]).forEach((district) => {
        let count = 0;
        const districtId = zeroPadding(district);
        const fipsId = fips[state];
        const geoid = fipsId + districtId;
        count += filter((items[state][district]), 'pledged').length;
        if (state !== selectedState) {
          mbMap.setFeatureState({
            id: Number(geoid),
            source: 'districts',
          }, {
            pledged: false,
          });
        } else {
          mbMap.setFeatureState({
            id: Number(geoid),
            source: 'districts',
          }, {
            pledged: count > 0,
          });
        }
      });
    });
  }

  setStateStyleMask(state) {
    if (state) {
      const filterSetting = ['!=', 'ref', state];
      this.toggleFilters('state-mask', filterSetting);
    } else {
      this.map.setLayoutProperty('state-mask', 'visibility', 'none');
    }
  }

  setStateDoYourJob() {
    const {
      allDoYourJobDistricts,
    } = this.props;
    const thisMap = this.mbMap;

    thisMap.addStateAndDistrictOutlineLayers();

    mapKeys(fips, (fip, state) => {
      thisMap.setFeatureState(Number(fip), 'states', {
        doYourJobDistrict: false,
      });
      for (let step = 0; step <= numOfDistricts[state]; step++) {
        // highlight district
        const districtPadded = zeroPadding(step);
        const geoID = `${fip}${districtPadded}`;
        thisMap.setFeatureState(Number(geoID), 'districts', {
          doYourJobDistrict: false,
        });
      }
    });

    Object.keys(allDoYourJobDistricts).forEach((code) => {
      const state = code.split('-')[0];
      const districtNo = code.split('-')[1];
      if (isNaN(Number(districtNo))) {
        thisMap.setFeatureState(
          Number(fips[state]), 'states',
          {
            doYourJobDistrict: true,
          },
        );
      } else {
        thisMap.setFeatureState(
          Number(fips[state] + districtNo),
          'districts',
          {
            doYourJobDistrict: true,
          },
        );
      }
    });
  }

  setStateStyle() {
    const {
      map,
    } = this;
    if (!map.getLayer('states-fill')) {
      this.addStateLayers();
    } else {
      this.showLayer('states-fill');
    }
    if (map.getLayer('districts-fill')) {
      this.hideLayer('districts-fill');
    }
  }

  // Handles the highlight for districts when clicked on.
  highlightDistrict(geoid) {
    let filterSettings;
    // Filter for which district has been selected.
    if (typeof geoid === 'object') {
      filterSettings = ['any'];

      geoid.forEach((i) => {
        filterSettings.push(['==', 'GEOID', i]);
      });
    } else {
      if (geoid.substring(0, 2) === '42') {
        filterSettings = ['all', ['==', 'DISTRICT', geoid.substring(2)]];
        this.toggleFilters('selected-border-pa', filterSettings);
        return;
      }
      filterSettings = ['all', ['==', 'GEOID', geoid]];
    }
    // Set that layer filter to the selected
    this.toggleFilters('selected-fill', filterSettings);
    this.toggleFilters('selected-border', filterSettings);
  }

  toggleFilters(layer, filterSettings) {
    this.map.setFilter(layer, filterSettings);
    this.showLayer(layer);
  }

  showLayer(layer) {
    this.map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  hideLayer(layer) {
    this.map.setLayoutProperty(layer, 'visibility', 'none');
  }

  districtSelect(feature) {
    if (feature.state) {
      this.highlightDistrict(feature.geoID);
    } else {
      const visibility = this.map.getLayoutProperty('selected-fill', 'visibility');
      if (visibility === 'visible') {
        this.map.setLayoutProperty('selected-fill', 'visibility', 'none');
        this.map.setLayoutProperty('selected-border', 'visibility', 'none');
        this.map.setLayoutProperty('selected-border-pa', 'visibility', 'none');
      }
    }
  }

  showStateTooltip(state) {
    const { items } = this.props;
    const name = stateAbrvToName[state];
    const itemsInState = items[state];
    let tooltip = `<h4>${name}</h4>`;
    if (itemsInState && totalPledgedInState(itemsInState)) {
      this.setState({ popoverColor: 'popover-has-data' });
      if (itemsInState.Gov) {
        tooltip += '<h4>Governor\'s race</h4>';
        itemsInState.Gov.forEach((item) => {
          if (item.status === 'Nominee') {
            tooltip += formatPledger(item);
          }
        });
      }
      if (itemsInState.Sen) {
        tooltip += '<h4>Senate race</h4>';
        itemsInState.Sen.forEach((item) => {
          if (item.status === 'Nominee') {
            tooltip += formatPledger(item);
          }
        });
      }
      const totalDistricts = totalPledgedInDistricts(itemsInState);

      tooltip += `<h4>U.S. House pledge takers: <strong>${totalDistricts}</strong></h4>`;
      tooltip += '<div><em>Click for district details</em></div>';
    } else {
      this.setState({ popoverColor: 'popover-no-data' });
      tooltip += '<div><em>No one has taken the pledge</em></div>';
    }
    return tooltip;
  }

  showDistrictTooltip(state, district) {
    const { items } = this.props;
    let tooltip = `<h4>${state} ${district}</h4>`;
    if (!items[state]) {
      return null;
    }
    const people = items[state][district] ? items[state][district] : [];
    if (people.length) {
      const incumbent = filter(people, 'incumbent')[0];
      if (incumbent) {
        tooltip += `<div>Incumbent <strong>${incumbent.displayName}</strong>${takenThePledge(incumbent)}</div>`;
      }
      const totalR = filter(people, { pledged: true, incumbent: false, party: 'R' }).length;
      const totalD = filter(people, { pledged: true, incumbent: false, party: 'D' }).length;
      const totalI = filter(people, { pledged: true, incumbent: false, party: 'I' }).length;
      tooltip += `<div>Republican pledge takers: <strong>${totalR}</strong></div>`;
      tooltip += `<div>Democratic pledge takers: <strong>${totalD}</strong></div>`;
      tooltip += `<div>Independent pledge takers: <strong>${totalI}</strong></div>`;
    } else {
      tooltip += '<div>No one in this district has signed the pledge yet.</div>';
    }
    return tooltip;
  }

  addPopups(layer) {
    const { map } = this;
    this.popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
    });
    const { items } = this.props;

    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [layer, 'district_interactive_pa'] });
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

      if (features.length) {
        const feature = features[0];
        // ABR:"ME",
        // GEOID:"2302"
        // NAME:"Maine"
        // STATEFP:"23"
        const { properties } = feature;
        const stateAbr = properties.ABR ? properties.ABR : 'PA';
        const district = properties.DISTRICT ? properties.DISTRICT : properties.GEOID.substring(2);
        let tooltip;
        if (map.metadata.level === 'districts') {
          if (!items[stateAbr]) {
            return undefined;
          }
          tooltip = this.showDistrictTooltip(stateAbr, Number(district));
        } else {
          tooltip = this.showStateTooltip(stateAbr);
        }
        if (tooltip) {
          return this.popup.setLngLat(e.lngLat)
            .setHTML(tooltip)
            .addTo(map);
        }
      }
      return undefined;
    });
    map.on('mouseleave', 'district_interactive', () => {
      this.popup.remove();
    });
  }

  focusMap(bb) {
    if (!bb) {
      return;
    }
    const height = window.innerHeight;
    const width = window.innerWidth;
    const view = geoViewport.viewport(bb, [width / 2, height / 2]);
    if (view.zoom < 2.5) {
      view.zoom = 2.5;
    } else {
      view.zoom -= 0.5;
    }
    this.map.flyTo(view);
  }

  removeHighlights() {
    this.map.setLayoutProperty('selected-fill', 'visibility', 'none');
    this.map.setLayoutProperty('selected-border', 'visibility', 'none');
    this.map.setLayoutProperty('selected-border-pa', 'visibility', 'none');
  }

  handleReset() {
    this.removeHighlights();
    this.props.resetSelections();
  }
  // Creates the button in our zoom controls to go to the national view
  makeZoomToNationalButton() {
    document.querySelector('.mapboxgl-ctrl-compass').remove();
    if (document.querySelector('.mapboxgl-ctrl-usa')) {
      document.querySelector('.mapboxgl-ctrl-usa').remove();
    }
    const usaButton = document.createElement('button');
    usaButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-usa';
    usaButton.innerHTML = '<span class="usa-icon"></span>';

    usaButton.addEventListener('click', this.handleReset);
    document.querySelector('.mapboxgl-ctrl-group').appendChild(usaButton);
  }

  addClickListener(searchByDistrict) {
    const { map } = this.mbMap;
    return (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['district_interactive', 'district_interactive_pa'],
      });
      const feature = {};
      if (features.length > 0) {
        feature.state = features[0].properties.ABR;
        feature.district = features[0].properties.GEOID ? features[0].properties.GEOID.substring(2, 4) : features[0].properties.DISTRICT;
        feature.geoID = features[0].properties.GEOID;
        let districts = [Number(feature.district)];
        if (!feature.state && features[0].properties.DISTRICT) {
          feature.state = 'PA';
        }
        if (map.metadata.selectedState !== feature.state) {
          districts = [];
        }
        searchByDistrict({
          districts,
          state: feature.state,
        });
      }
    };
  }

  initializeMap() {
    const {
      selectedState,
      searchByDistrict,
    } = this.props;


    this.mbMap = new MbMap({
      attributionControl: false,
      container: 'map',
    });
    // Set Mapbox map controls
    this.map = this.mbMap.map;
    const bounds = [
      [-128.8, 23.6],
      [-65.4, 50.2],
    ];
    this.mbMap.setInitalState(this.setInitialStyles, bounds, this.addClickListener(searchByDistrict), selectedState);
    this.makeZoomToNationalButton();

    this.addPopups('district_interactive');
  }

  setInitialStyles() {
    this.setStateStyle();
    this.setStateDoYourJob();
  }

  addStateLayers() {
    const {
      items,
    } = this.props;
    const {
      mbMap,
    } = this;
    mbMap.stateChloroplethFill(items);
  }

  render() {
    const {
      districts,
      selectedState,
      resetSelections,
      searchByDistrict,
      setUsState,
      items,
    } = this.props;
    return (
      <React.Fragment>
        <div id="map" className={this.state.popoverColor}>
          <div className="map-overlay" id="legend">
            <MapInset
              items={items.AK}
              stateName="AK"
              districts={districts}
              selectedState={selectedState}
              resetSelections={resetSelections}
              searchByDistrict={searchByDistrict}
              setUsState={setUsState}
              mapId="map-overlay-alaska"
              bounds={[[-170.15625, 51.72702815704774], [-127.61718749999999, 71.85622888185527]]}
            />
            <MapInset
              items={this.state.hawaiiItems}
              stateName="HI"
              districts={districts}
              selectedState={selectedState}
              resetSelections={resetSelections}
              searchByDistrict={searchByDistrict}
              setUsState={setUsState}
              mapId="map-overlay-hawaii"
              bounds={[
                [-161.03759765625, 18.542116654448996],
                [-154.22607421875, 22.573438264572406]]}
            />
          </div>
        </div>

      </React.Fragment>
    );
  }
}

MapView.propTypes = {
  districts: PropTypes.arrayOf(PropTypes.number),
  items: PropTypes.shape({}).isRequired,
  resetSelections: PropTypes.func.isRequired,
  searchByDistrict: PropTypes.func.isRequired,
  selectedState: PropTypes.string,
  setUsState: PropTypes.func.isRequired,
};

MapView.defaultProps = {
  districts: [],
  selectedState: '',
};

export default MapView;
