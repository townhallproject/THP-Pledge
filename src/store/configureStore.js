import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import pledgers from '../state/pledgers/reducers';
import selections from '../state/selections/reducers';
import doYourJobDistricts from '../state/do-your-job-district/reducers';

export default () => {
  const store = createStore(
    combineReducers({
      doYourJobDistricts,
      pledgers,
      selections,
    }),
    applyMiddleware(thunk),
  );
  return store;
};
