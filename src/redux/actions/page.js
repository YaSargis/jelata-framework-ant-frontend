export const SET_GETONE = 'SET_GETONE';

// Сохраняем GetOne
export const set_get_one = (data_one) => {
  return dispatch => {
    dispatch({
      type: SET_GETONE,
      getone: data_one || {}
    })
  }
};
