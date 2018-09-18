import {
  uniqBy,
  mapValues,
} from 'lodash';

const initialState = {
  districts: [],
  filters: [],
  usState: '',
  zipcode: '',
  filterBy: { status: 'Nominee' },
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
    case 'ADD_FILTER_BY':
      console.log('add', payload);
      return {
        ...state,
        filterBy: {
          ...state.filterBy,
          ...payload,
        },
      };
    case 'REMOVE_FILTER_BY':
      console.log('remove', payload);
      const newState = delete state.filterBy[payload];
      console.log(newState)
      return {
        ...state,
        filterBy: {
          ...newState,
          },
      
      };
    case 'SET_INITIAL_FILTERS':
      return {
        ...state,
        filters: uniqBy(payload.pledgers, 'status')
          .map(item => item.status),
      };
    default:
      return state;
  }
};

export default filtersReducer;
