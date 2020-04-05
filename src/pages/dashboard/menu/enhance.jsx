import React from 'react';

import { menu_creator } from 'src/libs/methods';

import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';

import { get_menu, set_login_status, set_open_keys } from 'src/redux/actions/user';
import { set_loading } from 'src/redux/actions/loader';

import { MyIcons } from 'src/libs/icons';

const enhance = compose(
  connect(
    state => ({
      isLogin: state.user.isLogin,
      usermenu: state.user.usermenu,
      menu_app: state.user.menu_app,
      open_keys: state.user.open_keys
    }),
    dispatch => ({
      getMenu: (data) => dispatch(get_menu(data)),
      set_loading: (status) => dispatch(set_loading(status)),
      set_login_status: (status) => dispatch(set_login_status(status)),
      set_open_keys: (keys) => dispatch(set_open_keys(keys))
    })
  ),
  withState('selectedKeys', 'changeSelectedKeys', []),
  withHandlers({
    menu_creator: menu_creator,
    handlerOpenChange: ({ open_keys, set_open_keys }) => (_openKeys) => {
      const latestOpenKey = _openKeys.find(key => open_keys.indexOf(key) === -1);
      if(_openKeys) {
        set_open_keys([latestOpenKey])
      } else set_open_keys([])
    }
  })
)

export default enhance;