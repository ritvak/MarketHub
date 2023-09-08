import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import SidebarReducer from './sidebarReducer';
import ChatReducer from './chatReducer';

const nonRemovalReducers = [];

const reducer = combineReducers({
  auth: AuthReducer,
  sidebar: SidebarReducer,
  chat: ChatReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    const tempState = Object.entries(state).reduce((acc, val) => {
      const [key, value] = val;
      if (!nonRemovalReducers.includes(key)) {
        acc[key] = {};
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
    return reducer(tempState, action);
  }
  return reducer(state, action);
};

export default rootReducer;
