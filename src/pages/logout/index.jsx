import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';

import { reset_app, set_login_status } from 'src/redux/actions/user';
import { set_loading } from 'src/redux/actions/loader';

import { Get, Post } from 'src/libs/api';

const enhance = compose(
  connect(
    state => ({}),
    dispatch => ({
      reset_app: () => dispatch(reset_app()),
      set_loading: (status) => dispatch(set_loading(status)),
      set_login_status: (status) => dispatch(set_login_status(status))
    })
  ),
  lifecycle({
    componentWillMount() {
      let { reset_app, set_loading, set_login_status } = this.props;
      set_loading(true);
	  apishka(
        'POST',
        {}, '/auth/logout',
        (res) => {
			set_loading(false);
			localStorage.removeItem('sesid')
			window.location.replace('/')
        }, (err) => {
          set_loading(false);
        }
      )
    }
  })
);

const Logout = () => {
  return <div></div>
}

export default enhance(Logout);