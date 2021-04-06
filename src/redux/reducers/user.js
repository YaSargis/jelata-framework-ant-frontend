import {
  GET_CHAT_ID,
  GET_MENUAPP,
  SET_OPEN_KEYS,
  SET_LOGIN_STATUS,
  SET_COLLAPSE_STATUS,
  IS_CUSTOM_STYLE
} from '../actions/user';

export const initStore = {
  custom_menu: [],
  usermenu: [],
  isLogin: true,
  collapsed: false,
  open_keys: [],
  favorits_menu: [],
  is_custom_style: false
};

const handlers = (state = initStore, action) => {
  switch (action.type) {
    case GET_MENUAPP: {
      return {
        ...state,
        custom_menu: action.custom_menu,
        usermenu: action.usermenu,
        isLogin: action.status
      }
    }
    case SET_LOGIN_STATUS: {
      return { ...state, isLogin: action.status }
    }
    case SET_OPEN_KEYS: {
      return { ...state, open_keys: action.keys }
    }
    case SET_COLLAPSE_STATUS: {
      return { ...state, collapsed: action.status }
    }
    case GET_CHAT_ID: {
      return {...state, chatId: action.payload}
    }
    case IS_CUSTOM_STYLE: {
      return {...state, is_custom_style: action.status}
    }
    default:
      return state;
  }
};

export default handlers;