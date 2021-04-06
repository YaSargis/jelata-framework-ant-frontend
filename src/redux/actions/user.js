export const GET_MENUAPP = 'GET_MENUAPP';
export const SET_OPEN_KEYS = 'SET_OPEN_KEYS';
export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS';
export const SET_COLLAPSE_STATUS = 'SET_COLLAPSE_STATUS';
export const GET_CHAT_ID = 'GET_CHAT_ID';
export const IS_CUSTOM_STYLE = 'IS_CUSTOM_STYLE';

export const get_menu = data => {
  return dispatch => {
    dispatch({
      type: GET_MENUAPP,
      usermenu: data.data.outjson.usermenu,
      custom_menu: data.data.outjson.menus,
      status: true
    });
  };
};

export const reset_app = () => {
  return dispatch => {
    dispatch({
      type: GET_MENUAPP,
      usermenu: [],
      custom_menu: [],
      status: false,
      favorits_menu: []
    });
  };
};

// статус авторизации (true/false)
export const set_login_status = status => {
  return dispatch => {
    dispatch({
      type: SET_LOGIN_STATUS,
      status: status || false
    });
  };
};

export const set_open_keys = keys => {
  return dispatch => {
    dispatch({
      type: SET_OPEN_KEYS,
      keys: keys || []
    });
  };
};

// ........... chat
export const get_chat_id = () => {
  const chat_id = JSON.parse(sessionStorage.getItem('chat_id'));
  return dispatch => {
    dispatch({
      type: GET_CHAT_ID,
      payload: chat_id || null
    });
  };
};

export const set_chat_id = id => {
  sessionStorage.setItem('chat_id', JSON.stringify(id));
  return dispatch => {
    dispatch({
      type: GET_CHAT_ID,
      payload: id
    });
  };
};

// ........ end chat

export const set_user_style_status = status => {
  return dispatch => {
    dispatch({
      type: IS_CUSTOM_STYLE,
      status: status || false
    })
  }
}
