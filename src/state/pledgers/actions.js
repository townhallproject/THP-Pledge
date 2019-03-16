import { values, mapValues } from 'lodash';
import request from 'superagent';
import { firebaseUrl } from '../constants';
import { switchElectionYear } from '../selections/actions';

export const setPledgers = pledgers => ({
  pledgers,
  type: 'SET_PLEDGERS',
});

export const startSetPledgers = year => (dispatch) => {
  const url = `${firebaseUrl}/town_hall_pledges/${year}.json`;
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
    dispatch(switchElectionYear(year));
    return (dispatch(setPledgers(pledgers)));
  });
};
