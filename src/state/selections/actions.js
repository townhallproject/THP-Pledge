import superagent from 'superagent';
import { values, reduce } from 'lodash';
import { firebaseUrl } from '../constants';
import { startSetDoYourJobDistricts } from '../do-your-job-district/actions';
import { startSetPledgers } from '../pledgers/actions';

export const setDistrict = payload => ({
  payload,
  type: 'SET_DISTRICT',
});

export const setUsState = payload => ({
  payload,
  type: 'SET_US_STATE',
});

export const resetSelections = () => ({
  type: 'RESET_SELECTIONS',
});

export const setElectionYear = payload => ({
  payload,
  type: 'SWITCH_ELECTION_YEAR',
});

export const setFilters = payload => ({
  payload,
  type: 'SET_FILTERS',
});

export const addFilterBy = payload => ({
  payload,
  type: 'ADD_FILTER_BY',
});

export const removeFilterBy = payload => ({
  payload,
  type: 'REMOVE_FILTER_BY',
});

export const setInitialFilters = payload => ({
  payload,
  type: 'SET_INITIAL_FILTERS',
});

export const toggleFilterToWinners = payload => ({
  payload,
  type: 'TOGGLE_FILTER_TO_WINNERS',
});

export const switchElectionYear = payload => (dispatch) => {
  dispatch(setElectionYear());
  Promise.all([dispatch(startSetDoYourJobDistricts(payload)), dispatch(startSetPledgers(payload))]).then(() => {
    dispatch(setElectionYear(payload));
  });
};

export const getDistrictFromZip = payload => (dispatch) => {
  if (!payload.query) {
    return dispatch(setDistrict({
      district: null,
      state: '',
    }));
  }
  return superagent.get(`${firebaseUrl}/zipToDistrict/${payload.query}.json`)
    .then((res) => {
      const districts = values(res.body);
      const toUpdate = reduce(districts, (acc, cur) => {
        acc.state = cur.abr;
        acc.districts.push(cur.dis);
        return acc;
      }, { districts: [] });
      dispatch(setDistrict(toUpdate));
    })
    .catch();
};
