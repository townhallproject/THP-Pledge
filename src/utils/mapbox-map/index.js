import { filter } from 'lodash';
import chroma from 'chroma-js';
import { DYJD_COLOR, PLEDGED_COLOR } from '../../components/constants';
import { fips } from '../../data/dictionaries';

export default class MbMap {
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

  setInitalState(type, setInitialStyles, bounds, boundsOpts, clickCallback, selectedState, onLoadCallback) {
    if (type === 'main'){

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
      this.map.fitBounds(bounds, boundsOpts);
      if (onLoadCallback) {

        onLoadCallback()
      }
      this.addClickListener(clickCallback);
      this.map.addSource('states', {
        data: '../data/states.geojson',
        type: 'geojson',
      });
      this.map.addSource('districts', {
        data: '../data/districts.geojson',
        type: 'geojson',
      });
      setInitialStyles();
    });
  }

  addClickListener(callback) {
    const {
      map,
    } = this;

    map.on('click', callback);
  }

  inidividualStateColor() {

  }

  addStatesFillLayer() {
    this.map.addLayer({
      id: 'states-fill',
      type: 'fill',
      source: 'states',
      paint: {
        'fill-color': '#847aa3',
        'fill-opacity': 1,
      },
    }, 'district_high_number');
  }

  stateChloroplethFill(items) {
    const mbMap = this;
    this.addStatesFillLayer();
    const domain = [];
    Object.keys(items).forEach((state) => {
      let count = 0;

      Object.keys(items[state]).forEach((district) => {
        count += filter((items[state][district]), {
          pledged: true,
          status: 'Nominee',
        }).length;
      });

      count = ((count / (Object.keys(items[state]).length * 2)) * 10);
      if (count > 0) {
        domain.push(count);
      }
      mbMap.setFeatureState(
        Number(fips[state]),
        'states',
        { colorValue: count || 0 },
      );
    });
    domain.sort((a, b) => parseInt(a) - parseInt(b));
    const colors = chroma.scale(['#d4d0f1', '#7366b7']).colors(4);
    const breaks = chroma.limits(domain, 'q', 3);
    this.map.setPaintProperty('states-fill', 'fill-color', MbMap.createColorExpression(breaks, colors, ['feature-state', 'colorValue']));
  }

  addDYJDistrictFillLayer() {
    if (this.map.getLayer('districts-fill')) {
      return;
    }
    this.map.addLayer({
      id: 'districts-fill',
      type: 'fill',
      source: 'districts',
      paint: {
        'fill-color': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],
          DYJD_COLOR,
          '#847aa3',
        ],
        'fill-opacity': ['case',
          ['boolean', ['feature-state', 'pledged'], true],
          0.6,
          0,
        ],
      },
    }, 'district_high_number');
  }

  addStateAndDistrictOutlineLayers() {
    this.map.addLayer({
      id: 'states-outline',
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
      id: 'district-outline',
      type: 'fill',
      source: 'districts',
      paint: {
        'fill-opacity': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],
          1,
          0,
        ],
        'fill-color': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],
          DYJD_COLOR,
          PLEDGED_COLOR,
        ],
        'fill-outline-color': ['case',
          ['boolean', ['feature-state', 'doYourJobDistrict'], true],
          PLEDGED_COLOR,
          'white',
        ],
      },

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
