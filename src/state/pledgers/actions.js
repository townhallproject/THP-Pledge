import moment from 'moment';
import { values, mapValues, filter } from 'lodash';
import request from 'superagent';
import { batchActions } from 'redux-batched-actions';


import { firebaseUrl } from '../constants';
import { switchElectionYear } from '../selections/actions';

export const setPledgers = pledgers => ({
  pledgers,
  type: 'SET_PLEDGERS',
});

export const setMayorGeoJson = features => ({
  features,
  type: 'SET_MAYOR_GEOJSON',
});

const makeMayorGeoJson = pledgers => (dispatch) => {
  const url = '../data/us_cities_new.geojson';
  return request(url).then((result) => {
    const usCities = result.body;
    const newFeatures = usCities.features.reduce((acc, cur) => {
      const {
        state,
        city,
      } = cur.properties;
      let numberOfPledgers = 0;
      if (pledgers[state]) {
        const numberOfCandidates = filter(pledgers[state], { city, role: 'Mayor' }).length;
        numberOfPledgers = pledgers[state].reduce((total, pledger) => {
          if (pledger.city && pledger.pledged && pledger.city === city) {
            total += 1;
          }
          return total;
        }, 0);
        if (numberOfCandidates) {
          const toReturn = {
            ...cur,
            properties: {
              ...cur.properties,
              numberOfCandidates,
              numberOfPledgers,
            },
          };
          acc.push(toReturn);
        }
      }
      return acc;
    }, []);
    return (dispatch(setMayorGeoJson(newFeatures)));
  });
};

const filterByStatus = ele => (ele.status === 'Lost Primary' && !ele.pledged) || !ele.status;

const filterByPledged = ele => ele.pledged;

export const startSetPledgers = year => (dispatch) => {
  const url = `${firebaseUrl}/town_hall_pledges/${year}.json`;
  return request(url).then((result) => {
    const allPledgers = result.body;

    const pledgers = mapValues(allPledgers, pledgersInstate =>
      values(pledgersInstate).filter((ele) => {
        // for at large districts
        // eslint-disable-next-line eqeqeq
        if (ele.district == 0) {
          ele.district = 1;
        }
        if (ele.incumbent) {
          return true;
        }
        if (year == moment().year()) {
          return filterByPledged(ele);
        }
        return !filterByStatus(ele);
      }));
    return dispatch(batchActions([
      makeMayorGeoJson(pledgers),
      setPledgers(pledgers),
    ]));
  });
};
