import { filter, flatten, values } from 'lodash';
import moment from 'moment';

import { STILL_ACTIVE } from '../components/constants';

export function takenThePledge(record) {
  return record.pledged ? ' has taken the pledge.' : ' has not taken the pledge.';
}

export const isActiveCandidate = person => STILL_ACTIVE.includes(person.status);
export const isActivePledger = person => (person.pledged && STILL_ACTIVE.includes(person.status));

export const totalPledgedInState = itemsInState => Object.keys(itemsInState)
  .reduce((acc, cur) => {
    acc += filter(itemsInState[cur], 'pledged').length;
    return acc;
  }, 0);

export const totalPledgedInCategory = (items, category) => filter(items[category], 'pledged').length;

export const totalPledgedInDistricts = itemsInState => Object.keys(itemsInState)
  .reduce((acc, cur) => {
    if (Number(cur)) {
      acc += filter(itemsInState[cur], 'pledged').length;
    }
    return acc;
  }, 0);

export const flattenPledgers = pledgerObject => flatten(values(pledgerObject));

export const totalIncumbentsForParty = (pledgerObject, party, incumbent) =>
  filter(flattenPledgers(pledgerObject), person =>
    person.incumbent === incumbent &&
    person.party === party &&
    person.pledged).length;

export const totalIncumbentsFor3rdParty = (pledgerObject, incumbent) =>
  filter(flattenPledgers(pledgerObject), person =>
    person.incumbent === incumbent &&
    person.pledged === true &&
    person.party !== 'R' &&
    person.party !== 'D').length;

export const zeroPadding = (district) => {
  const zeros = '00';
  const districtString = district.toString();
  return zeros.substring(0, zeros.length - districtString.length) + districtString;
};

export const isCurrentYear = year => year === moment().add(2, 'M').year().toString();
