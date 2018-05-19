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
        districts: [],
        usState: payload.usState,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: payload,
      };
    case 'SET_INITIAL_FILTERS':
      return {
        ...state,
        filters: uniqBy(payload.pledgers, 'status')
          .map(item => item.issueFocus)
      };
    default:
      return state;
  }
};

export default filtersReducer;
