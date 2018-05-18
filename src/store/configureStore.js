import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import pledgers from '../state/pledgers/reducers';
import selections from '../state/selections/reducers';
import reporter from '../state/middleware/reporter';

export default () => {
  const store = createStore(
    combineReducers({ pledgers, selections }),
    applyMiddleware(thunk, reporter),
  );
  return store;
};
