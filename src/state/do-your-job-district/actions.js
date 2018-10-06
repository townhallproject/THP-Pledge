import {
  values,
  mapValues,
} from 'lodash';
import request from 'superagent';
import { firebaseUrl } from '../constants';

export const setDoYourJobDistricts = payload => ({
  payload,
  type: 'SET_DO_YOUR_JOB_DISTRICTS',
});

export const startSetDoYourJobDistricts = () => (dispatch) => {
  const url = `${firebaseUrl}/do_your_job_districts.json`;
  return request(url).then((result) => {
    const allDistricts = mapValues(result.body, (value, key) => {
      value.key = key;
      return value;
    });

    return (dispatch(setDoYourJobDistricts(allDistricts)));
  });
};
