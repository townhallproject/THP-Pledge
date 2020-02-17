import {
  includes,
  forEach,
  reduce,
  mapValues,
  filter,
} from 'lodash';
import { createSelector } from 'reselect';

import {
  getUsState,
  getDistricts,
  getFilterBy,
  getFilterToWinners,
  getElectionYear,
} from '../selections/selectors';
import { INCLUDE_STATUS, STILL_ACTIVE, STATUS_WON } from '../../components/constants';
import { isCurrentYear } from '../../utils';

export const getAllPledgers = state => state.pledgers.allPledgers;

export const getMayorFeatures = state => state.pledgers.mayorFeatures;

export const getFilteredPledgers = createSelector([getAllPledgers], (allPledgers) => {
  if (!allPledgers) {
    return null;
  }
  return mapValues(allPledgers);
});

export const allTotalPledged = createSelector([getAllPledgers], (allPledgers) => {
  if (!allPledgers) {
    return null;
  }

  return reduce(allPledgers, (acc, pledgersInState) => {
    acc += filter(pledgersInState, 'pledged').length;
    return acc;
  }, 0);
});

export const allPledgersOnBallot = createSelector([getAllPledgers, getFilterToWinners, getElectionYear], (allPledgers, onlyShowWinners, year) => {
  if (!allPledgers) {
    return null;
  }
  if (isCurrentYear(year)) {
    return reduce(allPledgers, (acc, pledgersInState) => {
      acc += filter(pledgersInState, person => person.pledged && includes(STILL_ACTIVE, person.status)).length;
      return acc;
    }, 0);
  }
  const includeArray = onlyShowWinners ? [STATUS_WON] : INCLUDE_STATUS;

  return reduce(allPledgers, (acc, pledgersInState) => {
    acc += filter(pledgersInState, person => person.pledged && includes(includeArray, person.status)).length;
    return acc;
  }, 0);
});

export const groupByStateAndDistrict = createSelector(
  [
    getFilterBy,
    getFilteredPledgers,
  ],
  (filterObj, allPledgers) => {
    if (!allPledgers) {
      return null;
    }
    return mapValues(allPledgers, allPledgersInState => reduce(allPledgersInState, (acc, cur) => {
      let include = true;
      forEach(filterObj, (value, key) => {
        if (!includes(value, cur[key])) {
          include = false;
        }
      });
      if (cur.district) {
        if (!acc[cur.district]) {
          acc[cur.district] = [];
        }
        if (include) {
          acc[cur.district].push(cur);
        }
      } else if (cur.city) {
        const key = `${cur.role} - ${cur.city}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        if (include) {
          acc[key].push(cur);
        }
      } else {
        if (!acc[cur.role]) {
          acc[cur.role] = [];
        }
        if (include) {
          acc[cur.role].push(cur);
        }
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
      const district = Number(cur);
      acc[district] = pledgersInState[usState][district];
      return acc;
    }, {});
    return { [usState]: toReturn };
  },
);
