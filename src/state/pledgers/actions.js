import { values, mapValues } from 'lodash';
import getData from '../../logics/getData';
import { firebaseUrl } from '../constants';

export const setPledgers = pledgers => ({
  pledgers,
  type: 'SET_PLEDGERS',
});

export const setFeaturesHome = featuresHome => ({
  featuresHome,
  type: 'SET_FEATURES_HOME',
});

export const startSetPledgers = () => (dispatch) => {
  const url = `${firebaseUrl}/town_hall_pledges.json`;
  return getData(url).then((result) => {
    const allPledgers = result.body;
    const pledgers = mapValues(allPledgers, pledgersInstate =>
      values(pledgersInstate));
    return (dispatch(setPledgers(pledgers)));
  });
};
