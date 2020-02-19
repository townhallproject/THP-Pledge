import { filter, flatten, values } from 'lodash';
import moment from 'moment';

import { PLEDGED_COLOR, STATUS_WON } from '../components/constants';

export function takenThePledge(record) {
  return record.pledged ? ' has taken the pledge.' : ' has not taken the pledge.';
}

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
  filter(flattenPledgers(pledgerObject), { incumbent, party, pledged: true }).length;

export const totalIncumbentsFor3rdParty = (pledgerObject, incumbent) =>
  filter(flattenPledgers(pledgerObject), person => person.incumbent === incumbent && person.pledged === true && person.party !== 'R' && person.party !== 'D').length;

export const zeroPadding = (district) => {
  const zeros = '00';
  const districtString = district.toString();
  return zeros.substring(0, zeros.length - districtString.length) + districtString;
};
export const formatWinner = person => (
  person.status === STATUS_WON ? '<span><i class="anticon anticon-check"></i></span>' : '');

export const formatPledger = (item) => {
  const title = item.incumbent ? `${formatWinner(item)} ${item.role}. ${item.displayName}* <span class=${item.party}>(${item.party}) </span> ${item.pledged ? '<strong>PLEDGED</strong>' : '<strong>NOT PLEDGED</strong>'} ${item.missingMember ? '<strong style="color:red;">MISSING</strong>' : ''}` :
    `${formatWinner(item)} ${item.displayName} <span class=${item.party}>(${item.party})</span> ${item.pledged ? '<strong>PLEDGED</strong>' : '<strong>NOT PLEDGED</strong>'}`;
  return `<div style="color:${item.pledged ? `${PLEDGED_COLOR};` : 'none;'}">${title}</div>`;
};

export const isCurrentYear = year => year === moment().year().toString();
