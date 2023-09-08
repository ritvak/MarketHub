import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers/reducer';
import { isProduction } from '../helpers/utils';

const bindMiddleware = middleware => {
  if (!isProduction) {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const store = createStore(reducer, bindMiddleware([thunk]));

export default store;
