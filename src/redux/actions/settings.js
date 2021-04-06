export const SET_SETTINGS = 'SET_SETTINGS';

// статус loading (true/false)
export const set_settings = (data) => {
  return dispatch => {
    dispatch({
      type: SET_SETTINGS,
      data: data || {}
    })
  };
};
