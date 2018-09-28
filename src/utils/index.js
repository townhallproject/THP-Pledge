import { filter, flatten, values } from 'lodash';
import { PLEDGED_COLOR } from '../components/constants';

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

export const zeroPadding = (district) => {
  const zeros = '00';
  const districtString = district.toString();
  return zeros.substring(0, zeros.length - districtString.length) + districtString;
};

export const formatPledger = (item) => {
  const title = item.incumbent ? `${item.role}. ${item.displayName}* <span class=${item.party}>(${item.party}) </span> ${item.pledged ? 'PLEDGED' : ''} ${item.missingMember ? '<strong style={color:"red";}>MISSING</strong>' : ''}` :
    `${item.displayName} <span class=${item.party}>(${item.party})</span> ${item.pledged ? '<strong>PLEDGED</strong>' : ''}`;
  return `<div style="color:${item.pledged ? `${PLEDGED_COLOR};` : 'none;'}">${title}</div>`;
};
