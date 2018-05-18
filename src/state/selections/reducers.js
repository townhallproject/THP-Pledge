import { uniqBy } from 'lodash';

const initialState = {
  districts: [],
  filters: 'init',
  usState: '',
  zipcode: '',
};

const filtersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'RESET_SELECTIONS':
      return {
        ...state,
        districts: initialState.districts,
        filters: initialState.filters,
        usState: initialState.usState,
        zipcode: initialState.zipcode,
      };
    case 'SET_DISTRICT':
      return {
        ...state,
        districts: payload.districts,
        usState: payload.state,
      };
    case 'SET_US_STATE':
      return {
        ...state,
        usState: payload.usState,
      };
    case 'SET_DISTANCE':
      return {
        ...state,
        distance: payload,
      };
    case 'SET_LAT_LNG':
      return {
        ...state,
        location: payload,
      };
    case 'RESET_LAT_LNG':
      return {
        ...state,
        location: {},
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: payload,
      };
    case 'SET_SEARCH_TYPE':
      return {
        ...state,
        searchType: payload,
      };
    case 'SET_INITIAL_FILTERS':
      return {
        ...state,
        filters: uniqBy(payload.events, 'issueFocus')
          .map(item => item.issueFocus)
          .filter(item => item !== 'Town Hall'),
      };
    default:
      return state;
  }
};

export default filtersReducer;
