import { reduce, mapValues } from 'lodash';
import { createSelector } from 'reselect';

import {
  getUsState,
  getDistricts,
} from '../selections/selectors';

export const getAllPledgers = state => state.pledgers.allPledgers;
export const groupByStateAndDistrict = createSelector(
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
        if (!acc[cur.role]) {
          acc[cur.role] = [];
        }
        acc[cur.role].push(cur);
      }
      return acc;
    }, {}));
  },
);

export const getPledgersByUsState = createSelector(
  [
    groupByStateAndDistrict,
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
    if (!pledgersInState[usState]) {
      return { [usState]: null };
    }
    const toReturn = reduce(districts, (acc, cur) => {
      acc[cur] = pledgersInState[usState][cur];
      return acc;
    }, {});
    return { [usState]: toReturn };
  },
);
