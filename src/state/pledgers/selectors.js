import { reduce, mapValues } from 'lodash';
import { createSelector } from 'reselect';

import {
  getUsState,
  getDistricts,
} from '../selections/selectors';

export const getAllPledgers = state => state.pledgers.allPledgers;
export const groupPledgerByDistrict = createSelector(
  [
    getAllPledgers,
  ],
  (allPledgers) => {
    if (!allPledgers) {
      return null;
    }

    return mapValues(allPledgers, allPledgersInState => reduce(allPledgersInState, (acc, cur) => {
      if (cur.district) {
        if (!acc[cur.district]) {
          acc[cur.district] = [];
        }
        acc[cur.district].push(cur);
      } else {
        if (!acc.statewide) {
          acc.statewide = [];
        }
        acc.statewide.push(cur);
      }
      return acc;
    }, {}));
  },
);

export const getPledgersByUsState = createSelector(
  [
    groupPledgerByDistrict,
    getUsState,
  ],
  (
    pledgersGroupedByDistrict,
    usState,
  ) => {
    if (usState === '') {
      return pledgersGroupedByDistrict;
    }
    const toReturn = pledgersGroupedByDistrict[usState] ? pledgersGroupedByDistrict[usState] : null;
    console.log('returning from state lookup', toReturn)
    return { [usState]: toReturn };
  },
);


export const getPledgersByDistrict = createSelector(
  [
    getPledgersByUsState,
    getUsState,
    getDistricts,
  ],
  (
    pledgersInState,
    usState,
    districts,
  ) => {
    if (districts.length === 0 || usState === '') {
      return pledgersInState;
    }
    console.log('current settings', usState, districts, pledgersInState);
    if (pledgersInState[usState]) {
      return { [usState]: null };
    }
    const toReturn = reduce(districts, (acc, cur) => {
      acc[cur] = pledgersInState[usState][cur];
      return acc;
    }, {});
    console.log(toReturn)
    return { [usState]: toReturn };
  },
);
