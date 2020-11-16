import { createStore, combineReducers, applyMiddleware } from 'redux';
import {
  enableBatching,
} from 'redux-batched-actions';

import thunk from 'redux-thunk';


import pledgers, { initialState as pledgerInitialState } from '../state/pledgers/reducers';
import selections, { initialState as selectionsInitialState } from '../state/selections/reducers';
import doYourJobDistricts, { initialState as dyjdInitialState } from '../state/do-your-job-district/reducers';

const initialState = {
  doYourJobDistricts: dyjdInitialState,
  pledgers: pledgerInitialState,
  selections: selectionsInitialState,
};
export default () => {
  const store = createStore(
    enableBatching(combineReducers({
      doYourJobDistricts,
      pledgers,
      selections,
    }), initialState),
    applyMiddleware(thunk),
  );
  return store;
};
