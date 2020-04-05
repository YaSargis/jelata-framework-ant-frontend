import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';

import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;

import enhance from './enhance';
import { MyIcons } from 'src/libs/icons';

import Home from 'src/pages/Home';

/*
Убрал пока
<SubMenu
	key="sub1-s"
	title={
		<span>
			<Icon type="user" />
			<span>Кабинет пользователя</span>
		</span>
	}
>
	{ menu_creator(menu_creator, usermenu, false) }
</SubMenu>*/

const MenuBox = ({
  usermenu,menu_creator,
  open_keys, handlerOpenChange
}) => {
  return (
    <Menu
      theme="dark" mode="inline"
      openKeys={open_keys}
      onOpenChange={handlerOpenChange}
    >


    </Menu>
  )
}

export default enhance(MenuBox);
