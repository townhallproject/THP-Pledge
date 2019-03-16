import { values, mapValues } from 'lodash';
import request from 'superagent';
import { firebaseUrl } from '../constants';

export const setPledgers = pledgers => ({
  pledgers,
  type: 'SET_PLEDGERS',
});

export const startSetPledgers = () => (dispatch) => {
  const url = `${firebaseUrl}/town_hall_pledges/2018.json`;
  return request(url).then((result) => {
    const allPledgers = result.body;
    const pledgers = mapValues(allPledgers, pledgersInstate =>
      values(pledgersInstate).filter((ele) => {
        if (ele.incumbent) {
          return true;
        }
        if ((ele.status === 'Lost Primary' && !ele.pledged) || (ele.status === 'Active Primary Candidate' && !ele.pledged) || !ele.status) {
          return false;
        }
        return true;
      }));
    return (dispatch(setPledgers(pledgers)));
  });
};
