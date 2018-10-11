import {
  filter,
  mapKeys,
  isEmpty,
} from 'lodash';
import { 
  DYJD_COLOR, 
  PLEDGED_COLOR_LIGHT, 
  PLEDGED_COLOR_DARK,
  MISSING_MEMBER_COLOR,
} from '../../components/constants';
import { fips, numOfDistricts } from '../../data/dictionaries';
import { zeroPadding } from '../index';

export default class MbMap {
  static isStateWide(district) {
    if (district) {
      return isNaN(district) && district.toString().split('-').length < 2;
    }
    return false;
  }
  static createColorExpression(stops, colors, value) {
    const expression = ['interpolate', ['linear'],
      ['to-number', value],
    ];

    expression.push(0);
    expression.push('#e7e7e7');

    for (let i = 0; i < stops.length; i++) {
      expression.push(stops[i]);
      expression.push(colors[i]);
    }
    return expression;
  }

  constructor(opts) {
    mapboxgl.accessToken =
        'pk.eyJ1IjoidG93bmhhbGxwcm9qZWN0IiwiYSI6ImNqMnRwOG4wOTAwMnMycG1yMGZudHFxbWsifQ.FXyPo3-AD46IuWjjsGPJ3Q';
    const styleUrl = 'mapbox://styles/townhallproject/cjgr7qoqr00012ro4hnwlvsyp';

    this.map = new mapboxgl.Map({
      ...opts,
      style: styleUrl,
    });
  }

  addSources() {
    this.map.addSource('states', {
      data: '../data/states.geojson',
      type: 'geojson',
    });
    this.map.addSource('districts', {
      data: '../data/districts.geojson',
      type: 'geojson',
    });
  }

  setInitalState(type, setInitialStyles, bounds, boundsOpts, clickCallback, selectedState, onLoadCallback) {
    if (type === 'main') {
      this.map.addControl(new mapboxgl.AttributionControl(), 'top-left');
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.scrollZoom.disable();
      this.map.dragRotate.disable();
      this.map.touchZoomRotate.disableRotation();
    }
    this.map.metadata = {
      level: 'states',
      selectedState,
    };
    this.map.on('load', () => {
      this.addSources();
      this.map.fitBounds(bounds, boundsOpts);
      if (onLoadCallback) {
        onLoadCallback();
      }
      this.addClickListener(clickCallback);

      setInitialStyles();
    });
  }

  addClickListener(callback) {
    const {
      map,
    } = this;

    map.on('click', callback);
  }

  resetAllStateDYJFlagsToFalse() {
    const thisMap = this;
    mapKeys(fips, (fip, state) => {
      thisMap.setFeatureState(Number(fip), 'states', {
        doYourJobDistrict: false,
      });
      for (let step = 0; step <= numOfDistricts[state]; step++) {
        const districtPadded = zeroPadding(step);
        const geoID = `${fip}${districtPadded}`;
        thisMap.setFeatureState(Number(geoID), 'districts', {
          doYourJobDistrict: false,
        });
      }
    });
  }

  resetDoYourJobDistrictFlagsToFalse(selectedState) {
    const thisMap = this;
    mapKeys(fips, (fip, state) => {
      if (selectedState && selectedState === state) {
        return;
      }
      for (let step = 0; step <= numOfDistricts[state]; step++) {
        const districtPadded = zeroPadding(step);
        const geoID = `${fip}${districtPadded}`;
        thisMap.setFeatureState(Number(geoID), 'districts', {
          doYourJobDistrict: false,
        });
      }
    });
  }

  colorByDYJ(allDoYourJobDistricts, selectedState) {
    const mbMap = this;
    this.addStateAndDistrictDYJDLayers();
    this.addDYJDistrictFillLayer();

    this.resetAllStateDYJFlagsToFalse();
    this.resetDoYourJobDistrictFlagsToFalse(selectedState);
    Object.keys(allDoYourJobDistricts).forEach((code) => {
      const state = code.split('-')[0];
      const districtNo = code.split('-')[1];
      if (selectedState && state !== selectedState) {
        return;
      }
      if (isNaN(Number(districtNo))) {
        mbMap.setFeatureState(Number(fips[state]), 'states', {
          doYourJobDistrict: true,
        });
      } else {
        mbMap.setFeatureState(Number(fips[state] + districtNo), 'districts', {
          doYourJobDistrict: true,
        });
      }
    });
  }

  colorStatesByPledgerAndDJYD(allDoYourJobDistricts) {
    this.colorByDYJ(allDoYourJobDistricts);
  }

  colorDistrictsByPledgersAndDJYD(allDoYourJobDistricts, items, selectedState) {
    const mbMap = this;
    this.stateOutline(items);
    this.colorByDYJ(allDoYourJobDistricts, selectedState);
    Object.keys(items).forEach((state) => {
      if (!items[state] || isEmpty(items[state])) {
        return;
      }
      Object.keys(items[state]).forEach((district) => {
        let count = 0;
        let missingMember = 0;
        const districtId = zeroPadding(district);
        const fipsId = fips[state];
        const geoid = fipsId + districtId;
        count += filter((items[state][district]), { pledged: true }).length;
        missingMember += filter((items[state][district]), { missingMember: true }).length;

        mbMap.setFeatureState(
          Number(geoid),
          'districts', {
            pledged: count > 0,
            missingMember: missingMember > 0,
          },
        );
      });
    });
  }

  stateOutline(items) {
    const mbMap = this;
    this.addStatesFillLayer();
    Object.keys(items).forEach((state) => {
      let count = 0;
      let missingMember = 0;
      Object.keys(items[state]).forEach((district) => {
        missingMember += filter(
          (items[state][district]),
          ele => ele.missingMember === true &&
          ele.status === 'Nominee' &&
          MbMap.isStateWide(district),
        ).length;
        count += filter(
          (items[state][district]),
          ele => ele.pledged === true &&
           ele.status === 'Nominee' &&
           MbMap.isStateWide(district),
        ).length;
      });

      mbMap.setFeatureState(
        Number(fips[state]),
        'states',
        { statePledged: count > 0, missingMember: missingMember > 0 },
      );
    });
  }

  addStatesFillLayer() {
    if (this.map.getLayer('states-outline-line')) {
      return;
    }
    if (!this.map.getSource('states')) {
      this.addSources();
    }
    this.map.addLayer({
      id: 'states-missingmember-line',
      type: 'line',
      source: 'states',
      paint: {
        'line-color': MISSING_MEMBER_COLOR,
        'line-width': 2,
        'line-opacity': ['case',
          ['boolean', ['feature-state', 'missingMember'], true],
          0.8,
          0,
        ],
      },
    }, 'district_interactive');
    this.map.addLayer({
      id: 'states-outline-line',
      type: 'line',
      source: 'states',
      paint: {
        'line-color': PLEDGED_COLOR_DARK,
        'line-width': 2,
        'line-opacity': ['case',
          ['boolean', ['feature-state', 'statePledged'], true],
          1,
          0,
        ],
      },
    }, 'district_interactive');
  }

  addDYJDistrictFillLayer() {
    if (this.map.getLayer('districts-fill')) {
      return;
    }
    if (!this.map.getSource('districts')) {
      this.addSources();
    }
    this.map.addLayer({
      id: 'district-missingmember-line',
      type: 'fill',
      source: 'districts',
      paint: {
        'fill-color': ['case',
          ['boolean', ['feature-state', 'missingMember'], true],
          MISSING_MEMBER_COLOR,
          PLEDGED_COLOR_LIGHT,
        ],
        'fill-opacity': ['case',
          ['boolean', ['feature-state', 'missingMember'], true],
          0.2,
          0,
        ],
        'fill-outline-color': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], false],
          MISSING_MEMBER_COLOR,
          '#6e6e6e',
        ],
      },
    }, 'district_high_number');

    this.map.addLayer({
      id: 'districts-fill',
      type: 'fill',
      source: 'districts',
      paint: {
        'fill-color': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],
          DYJD_COLOR,
          PLEDGED_COLOR_LIGHT,
        ],
        'fill-opacity': ['case',
          ['boolean', ['feature-state', 'pledged'], true],
          0.9,
          0,
        ],
        'fill-outline-color': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],

          PLEDGED_COLOR_DARK,
          '#6e6e6e',
        ],
      },
    }, 'district_high_number');
  }

  addStateAndDistrictDYJDLayers() {
    if (this.map.getLayer('dyj-states-outline')) {
      return;
    }
    if (!this.map.getSource('districts')) {
      this.addSources();
    }
    this.map.addLayer({
      id: 'dyj-states-outline',
      type: 'line',
      source: 'states',
      paint: {
        'line-color': DYJD_COLOR,
        'line-width': 2,
        'line-opacity': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],
          1,
          0,
        ],
      },
    });

    this.map.addLayer({
      id: 'dyj-district-level-color-fill',
      paint: {
        'fill-color': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],
          DYJD_COLOR,
          PLEDGED_COLOR_LIGHT,
        ],
        'fill-opacity': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],
          1,
          0,
        ],
        'fill-outline-color': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],
          PLEDGED_COLOR_LIGHT,
          'white',
        ],
      },
      source: 'districts',
      type: 'fill',
    }, 'state border');
  }

  setFeatureState(featureId, source, state) {
    this.map.setFeatureState({
      id: Number(featureId),
      source,
    }, {
      ...state,
    });
  }
}
