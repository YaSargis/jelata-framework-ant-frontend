import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { Spin } from 'antd';

import _ from 'lodash';

import 'src/styles/index.scss';

import LoginForm from 'src/pages/login';
import Dashboard from 'src/pages/dashboard';

import enhance from './enhance';

const App = (props) => {
  let { isLogin, location } = props;
  return _.isBoolean(isLogin) ? isLogin ? <Switch><Route component={Dashboard} location={location} /><Redirect to='/dashboard' /></Switch>
    : <Switch>
        <Route path='/login' component={LoginForm} exact />
        <Redirect to='/login' />
      </Switch> : <Spin />
}

export default enhance(App);
