import {
  PLEDGED_COLOR,
  STATUS_WON,
} from '../constants';
import { isActiveCandidate } from '../../utils';

export const formatWinner = person => (
  person.status === STATUS_WON ? '<span><i class="anticon anticon-check"></i></span>' : '');

export const formatIncumbentTitle = item => `${formatWinner(item)} ${item.role}. ${item.displayName}* <span class=${item.party}>(${item.party}) </span> ${item.pledged ? '<strong>PLEDGED</strong>' : ''} ${item.missingMember ? '<strong style="color:red;">MISSING</strong>' : ''}`;


export const formatPersonRow = (item) => {
  const title = item.incumbent ? formatIncumbentTitle(item) :
    `${formatWinner(item)} ${item.displayName} <span class=${item.party}>(${item.party})</span> ${item.pledged ? '<strong>PLEDGED</strong>' : ''}`;
  return `<div class=${isActiveCandidate(item) ? 'active' : 'lost'} style="color:${item.pledged ? `${PLEDGED_COLOR};` : 'none;'}">${title}</div>`;
};
