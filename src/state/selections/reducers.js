import { uniqBy } from 'lodash';
import { STATUS_WON, STATUS_NOMINEE, STATUS_ACTIVE } from '../../components/constants';

export const initialState = {
  currentElectionYear: '2020',
  districts: [],
  filterBy: {
    pledged: [true, false],
    status: [STATUS_WON, STATUS_NOMINEE, STATUS_ACTIVE],
  },
  filters: [],
  usState: '',
  zipcode: '',
};

const filtersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SWITCH_ELECTION_YEAR':
      return {
        ...state,
        currentElectionYear: payload,
      };
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
      return {
        ...state,
        filterBy: {
          ...state.filterBy,
          ...payload,
        },
      };
    case 'REMOVE_FILTER_BY':
      return {
        ...state,
        filterBy: {
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
