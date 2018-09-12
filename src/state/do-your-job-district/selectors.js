import { createSelector } from 'reselect';
import { values } from 'lodash';

export const getDoYourJobDistricts = (state) => state.doYourJobDistricts.districts;

export const totalDoYourJobCount = createSelector([getDoYourJobDistricts], (doyourjobdistrictObj) => (
    values(doyourjobdistrictObj).length
))