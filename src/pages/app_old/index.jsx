import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { Spin } from 'antd';

import _ from 'lodash';

import 'src/styles/index.scss';

import LoginForm from 'src/pages/login';
import Dashboard from 'src/pages/dashboard';

import enhance from './enhance';

const App = (props) => {
  //let { isLogin, location } = props;
  return  <Switch><Route component={Dashboard} location={location} /><Redirect to='/dashboard' /></Switch>
}

export default enhance(App);
