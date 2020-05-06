import React from 'react';
import { Layout, Button, Icon } from 'antd';
const { Content } = Layout;
import { Configer } from 'src/libs/methods';
import { Link } from 'react-router-dom';

import _ from 'lodash';

import enhance from './enhance';
import MyHeader from 'src/pages/layout/header';

const Home = ({ favorits_menu, custom_menu, handlerDeleteButton, usermenu, set_favorits_menu }) => {
  document.title= 'Home';

	location.href = localStorage.getItem('homepage') || '/composition/home'

  return [
    <MyHeader key='s1' />,
    <Content
      key='s2'
      className='content_app'
    >
      <h3>Favorite</h3>
      { !(_.isEmpty(favorits_menu)) ? favorits_menu.map((item) => {

        return (
          <form
            key={item.path}
            style={{display: 'inline', margin: '10px'}}>
            <fieldset style={{display: 'inline', border: '1px solid #c6c6c6'}}>
              <legend
                style={{display: 'inline', width: 'auto'}}>
                <input
                  style={{fontSize: '14px', fontWeight: 'bolder'}}
                  value={item.title}
                  placeholder="Change Title..."
                  onChange={(e)=>{
                    const copyFavorMenu = [...favorits_menu];
                    const pageIndex = copyFavorMenu.findIndex((it) => it.path === item.path);
                    copyFavorMenu[pageIndex].title = e.target.value;

                    set_favorits_menu(copyFavorMenu);
                  }}
                  onKeyDown={(e)=>{
                    if(e.key==='Enter') {
                      e.preventDefault()
                    }
                  }}
                 />
              </legend>
              <Button.Group key={Configer.nanoid()}  style={{margin: '10px'}}>
                  <Link to={item.path}>
                    <Button>
                      {
                        !(_.isEmpty(custom_menu)) ? _.find(custom_menu[0].menu, (it) => it.path === item.path) !== undefined ? _.find(custom_menu[0].menu, (it) => it.path === item.path).title : item.path : null  
                      }
                    </Button>
                  </Link>
                  <Button onClick={ () => handlerDeleteButton(item) } type='danger' ><Icon type="delete" /></Button>
              </Button.Group>
            </fieldset>
          </form>
        )
      }) :  "Yet no favorite menu..." }
    </Content>
  ]
}

export default enhance(Home);
