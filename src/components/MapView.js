import React from 'react';
import PropTypes from 'prop-types';
import { find, filter } from 'lodash';
import geoViewport from '@mapbox/geo-viewport';

import { pledgerShape } from '../state/pledgers/types';
import { stateAbrvToName } from '../data/dictionaries';

import bboxes from '../data/bboxes';
import states from '../data/states';
import MapInset from '../components/MapInset';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.filterDistrict = ['any'];
    this.includedStates = ['in', 'NAME'];

    this.addPopups = this.addPopups.bind(this);
    this.addClickListener = this.addClickListener.bind(this);
    this.setStateStyle = this.setStateStyle.bind(this);
    this.focusMap = this.focusMap.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.highlightDistrict = this.highlightDistrict.bind(this);
    this.districtSelect = this.districtSelect.bind(this);
    this.removeHighlights = this.removeHighlights.bind(this);
    this.insetOnClickEvent = this.insetOnClickEvent.bind(this);
    this.state = {
      popoverColor: 'popover-has-data',
      alaskaItems: {AK: props.items.AK},
      hawaiiItems: {HI: props.items.HI}
    };
  }

  componentDidMount() {
    const { items } = this.props;
    this.initializeMap();
  }

  componentWillReceiveProps(nextProps) {
    const {
      items,
      selectedState,
      districts,
    } = nextProps;
    this.map.metadata = { selectedState: nextProps.selectedState };
    if (selectedState) {
      let bbname = selectedState.toUpperCase();
      if (districts.length > 0) {
        const stateFIPS = states.find(cur => cur.USPS === bbname).FIPS;
        const zeros = '00';
        const districtString = districts[0].toString();
        const districtPadded =
          zeros.substring(0, zeros.length - districtString.length) +
          districtString;
        // highlight district
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
    return this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
  }

  insetOnClickEvent(e) {
    this.setState({ inset: false });
    const dataBounds = e.target.parentNode.parentNode.getAttribute('data-bounds').split(',');
    const boundsOne = [Number(dataBounds[0]), Number(dataBounds[1])];
    const boundsTwo = [Number(dataBounds[2]), Number(dataBounds[3])];
    const bounds = boundsOne.concat(boundsTwo);
    this.map.fitBounds(bounds);
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

  addPopups(layer) {
    const {map} = this;
    const {
      items,
    } = this.props;
    const popup = new mapboxgl.Popup({
    });

    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [layer] });
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

      if (features.length) {
        const feature = features[0];
        // ABR:"ME",
        // GEOID:"2302"
        // NAME:"Maine"
        // STATEFP:"23"
        const { properties } = feature;

        let name = stateAbrvToName[properties.ABR];
        let tooltip = '<h4>' + name + '</h4>'
        let itemsInState = items[properties.ABR]
        if (itemsInState) {
          this.setState({ popoverColor: `popover-has-data` });
          tooltip += `<div>Pledge takers:</div>`;
          if (itemsInState.Sen) {
            let totalstatewide = filter(itemsInState.Sen, 'pledged').length;
            tooltip += `<div>${totalstatewide} Senate candidates </div>`;
          }
          if (itemsInState.Gov) {
            let totalstatewide = filter(itemsInState.Gov, 'pledged').length;
            tooltip += `<div>${totalstatewide} candidates for governor </div>`;
          }
          let totalDistricts = Object.keys(itemsInState)
            .reduce((acc, cur)=> {
              acc += filter(itemsInState[cur], 'pledged').length;
              return acc;
            }, 0)
          tooltip += `<div>${totalDistricts} house candidates</div>`;
          tooltip += '<div><em>Click for details</em></div>'
        } else {
          this.setState({ popoverColor: `popover-no-data` });
          tooltip += '<div><em>No one has taken the pledge</em></div>'
        }
        return popup.setLngLat(e.lngLat)
          .setHTML(tooltip)
          .addTo(map);
      }
      return undefined;
    });
  }

  districtSelect(feature) {
    if (feature.state) {
      this.highlightDistrict(feature.geoID);
    } else {
      const visibility = this.map.getLayoutProperty('selected-fill', 'visibility');
      if (visibility === 'visible') {
        this.map.setLayoutProperty('selected-fill', 'visibility', 'none');
        this.map.setLayoutProperty('selected-border', 'visibility', 'none');
      }
    }
  }

  toggleFilters(layer, filterSettings) {
    this.map.setFilter(layer, filterSettings);
    this.map.setLayoutProperty(layer, 'visibility', 'visible');
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
      filterSettings = ['all', ['==', 'GEOID', geoid]];
    }
    // Set that layer filter to the selected
    this.toggleFilters('selected-fill', filterSettings);
    this.toggleFilters('selected-border', filterSettings);
  }

  addClickListener() {
    const {
      type,
      searchByDistrict,
      selectedState,
    } = this.props;
    const { map } = this;

    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(
        e.point,
        {
          layers: ['district_interactive'],
        },
      );
      const feature = {};
      if (features.length > 0) {
        feature.state = features[0].properties.ABR;
        feature.district = features[0].properties.GEOID.substring(2, 4);
        feature.geoID = features[0].properties.GEOID;
        let districts = [Number(feature.district)]
     
        if (map.metadata.selectedState !== feature.state){
          districts =[];
        }
        searchByDistrict({
          districts: districts,
          state: feature.state,
        });
      }
    });
  }

  setStateStyle() {
    const {map} = this;
    const { items } = this.props;
    const districts = map.getSource('district_interactive')
    let lowNumbers = ['in', 'ABR']
    let medNumbers = ['in', 'ABR']
    let highNumbers = ['in', 'ABR'];
    Object.keys(items).forEach((state)=>{
      let count = 0
      Object.keys(items[state]).forEach((district) => {
        count = count + filter((items[state][district]), 'pledged').length;
      })
      count < 4 ? lowNumbers.push(state) :
        count < 8 ? medNumbers.push(state) :
          highNumbers.push(state)
    })
  
    this.toggleFilters('high_number', highNumbers)
    this.toggleFilters('med_number', medNumbers)
    this.toggleFilters('low_number', lowNumbers)
  }


  removeHighlights() {
    this.map.setLayoutProperty('selected-fill', 'visibility', 'none');
    this.map.setLayoutProperty('selected-border', 'visibility', 'none');
  }

  handleReset() {
    this.removeHighlights();
    this.props.resetSelections();
    this.setState({ inset: true });
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

  initializeMap() {
    const { searchType } = this.props;

    mapboxgl.accessToken =
      'pk.eyJ1IjoidG93bmhhbGxwcm9qZWN0IiwiYSI6ImNqMnRwOG4wOTAwMnMycG1yMGZudHFxbWsifQ.FXyPo3-AD46IuWjjsGPJ3Q';
    const styleUrl = 'mapbox://styles/townhallproject/cjgr7qoqr00012ro4hnwlvsyp';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: styleUrl,
    });

    // Set Mapbox map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.scrollZoom.disable();
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();
    this.makeZoomToNationalButton();
    this.map.metadata = {
      searchType,
    };
    // map on 'load'
    this.map.on('load', () => {
      this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
      this.addClickListener();
      this.addPopups('district_interactive')
      this.setStateStyle()
    });
  }

  render() {
    const {
      districts,
      selectedState,
      resetSelections,
      searchByDistrict,
      searchType,
      setUsState,
    } = this.props;

    return (
      <React.Fragment>
        <div id="map" className={this.state.popoverColor}>
          <div className="map-overlay" id="legend">
            <MapInset
              items={this.state.alaskaItems}
              stateName="AK"
              districts={districts}
              selectedState={selectedState}
              resetSelections={resetSelections}
              searchByDistrict={searchByDistrict}
              searchType={searchType}
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
              searchType={searchType}
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
  setUsState: PropTypes.func.isRequired,
  searchType: PropTypes.string,
};

MapView.defaultProps = {
  districts: [],
};

export default MapView;
