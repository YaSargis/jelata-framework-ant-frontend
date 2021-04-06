import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './user';
import loader from './loader';
import helpers from './helpers';
import page from './page';
import settings from './settings';
import composition from './composition';
import { reducer as chat } from "src/pages/chat/reducer";
const appReducer = combineReducers({
  router: routerReducer,
  helpers,
  user,
  loader,
  page,
  settings,
  composition,
  chat
});

export default (state, action) => {
  return appReducer(state, action);
};