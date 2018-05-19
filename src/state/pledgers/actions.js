import { values, mapValues } from 'lodash';
import request from 'superagent';
import { firebaseUrl } from '../constants';

export const setPledgers = pledgers => ({
  pledgers,
  type: 'SET_PLEDGERS',
});

export const startSetPledgers = () => (dispatch) => {
  const url = `${firebaseUrl}/town_hall_pledges.json`;
  return request(url).then((result) => {
    const allPledgers = result.body;
    const pledgers = mapValues(allPledgers, pledgersInstate =>
      values(pledgersInstate));
    return (dispatch(setPledgers(pledgers)));
  });
};
