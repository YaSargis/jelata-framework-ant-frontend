import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, lifecycle, withStateHandlers } from 'recompose';
import _ from 'lodash';
import { notification, Avatar, Icon } from 'antd';

import { get_menu, set_login_status, set_open_keys, get_favorits_menu, set_first_id, set_chat_id, set_unreaded_status, get_chat_id} from 'src/redux/actions/user';
import { set_loading } from 'src/redux/actions/loader';
import { set_settings } from 'src/redux/actions/settings';

import { menu_creator, Configer } from 'src/libs/methods';
import { apishka } from 'src/libs/api';
import { api } from 'src/defaults';

let chatSocket;


const enhance = compose(
  connect(
    state => ({
      loading: state.helpers.loading,
      isLogin: state.user.isLogin,
      user_detail: state.user.user_detail,
      collapsed: state.user.collapsed,
      custom_menu: state.user.custom_menu,
      open_keys: state.user.open_keys,
      chatId: state.user.chatId
    }),
    dispatch => ({
      getMenu: (data) => dispatch(get_menu(data)),
      set_loading: (status) => dispatch(set_loading(status)),
      set_login_status: (status) => dispatch(set_login_status(status)),
      set_settings: (data) => dispatch(set_settings(data)),
      set_open_keys: (keys) => dispatch(set_open_keys(keys)),
      get_favorits_menu: () => dispatch(get_favorits_menu()),
      set_first_id: status => dispatch(set_first_id(status)),
      set_chat_id: id => dispatch(set_chat_id(id)),
      set_unreaded_status: status => dispatch(set_unreaded_status(status)),
      get_chat_id: () => dispatch(get_chat_id())
    })
  ),
  withStateHandlers(
    ({
      inState = {
        otherLocation: false
      }
    }) => ({
      otherLocation: inState.otherLocation
    }),
    {
      set_state: state => obj => {
        let _state = {...state},
            keys = _.keys(obj);
        keys.map(key => _state[key ] = obj[key]);
        return _state;
      },
    }),
  withHandlers({
    menu_creator: menu_creator,
    handlerOpenChange: ({ custom_menu, open_keys, set_open_keys }) => (_openKeys) => {
      const latestOpenKey = _openKeys.find(key => open_keys.indexOf(key) === -1);
      if(_openKeys) {
        set_open_keys([latestOpenKey])
      } else set_open_keys([])
    },
    handleGlobalWS: ({ getMenu}) => () => {
      let ws = document.location.href.split('//')[1];
      ws = ws.split('/')[0];
      ws = 'ws://' + ws + '/global_ws' //пока не работает в разных доменных именах
      let globalSocket = new WebSocket(ws);
      globalSocket.onopen = () => {
        globalSocket.send(JSON.stringify({}));
      };
      globalSocket.onmessage = (e) => {
        let globalData = JSON.parse(e.data)

        globalData.forEach((g_item) => {
          notification.success({
            message:g_item.message
          })
        })
        apishka(
          'GET',
          {},
          '/api/menus',
          (res) => {
            getMenu({data:res});
            localStorage.setItem('usersettings', JSON.stringify(res.outjson.userdetail.usersettings))
            localStorage.setItem('homepage', res.outjson.homepage)
          },
          (err) => {
            alert('err menus')
            console.log('err menus:', err)
          }
        )
      }
    },
    handleChatWS: ({ set_chat_id, set_unreaded_status, chatId, history, location, otherLocation, set_state }) => () => {
      let ws = document.location.href.split('//')[1];
      ws = ws.split('/')[0];
         ws = 'ws://' + ws + '/chats' //пока не работает в разных доменных именах
      //ws = 'ws://' + '94.230.251.78:8080' + '/chats';
      chatSocket = new WebSocket(ws);
      chatSocket.onopen = () => {
        chatSocket.send(JSON.stringify({}));
      };
      chatSocket.onmessage = event => {
        const resWS = JSON.parse(event.data);
        resWS.forEach(item => item['key'] = Configer.nanoid());
        if((resWS.length > 0)) {
          set_unreaded_status(true);
          resWS.map(item => {
            if( otherLocation || item.id !== chatId) {
              set_state({otherLocation: false})
              item.messages.map(it => {
              notification.open({
                icon: <Icon type='notification' />,
                style: { backgroundColor: '#bafdaf'},
                duration: 7,
                key: item.id,
                placement: 'bottomRight',
                message: <div>
                  <div>Новое сообщение <span><b>({item.title})</b></span></div>
                  <div className="notif__chat">
                  <div><Avatar size={42} className='chat__avatar' icon='user' src={api._url + it.photo['0'].uri} /></div>
                  <div className="notif__content">
                    <div className="notif__login">{it.login}</div>
                    <div>
                      { it.message_text.length > 100 ?  it.message_text.split('\n').map((peace, key) => {
                                                        return <span key={key}>{peace.slice(0, 100).concat('...')}<br/></span>
                                                      }) : it.message_text }
                    </div>
                  </div>
                </div>
                </div>,
                onClick: () => {
                  set_chat_id(item.id);
                  history.push('/chat')
                  notification.close(item.id);
                }
              });
              item.messages.forEach(it => {
                  apishka(
                    'GET',  {},  '/api/dialog_notif_setsended'
                  )
                });
              });
            }
          });
        }
      }
    }
  }),
  lifecycle({
    componentDidMount(){
      const { handleChatWS, get_chat_id , handleGlobalWS} = this.props;
      get_chat_id();
      handleChatWS();
      handleGlobalWS();
    },
    componentWillMount() {
      let { get_favorits_menu } = this.props;
      // удаляем класс логин с body
      let body = document.getElementsByTagName('body')[0];
      body.classList.remove("login_bckg");
      get_favorits_menu(); // получаем список избр. меню
    },
    componentDidUpdate(prevProps){
      const { chatId, set_first_id, location, handleChatWS, set_chat_id, handleGlobalWS } = this.props;

      if(prevProps.chatId !== chatId) {
        chatSocket.close();
        handleChatWS();
      }
      if(chatId && prevProps.location.pathname === '/chat') {
        if(location.pathname === '/chat' && location.hash === ''){
          set_first_id(true)
        }
      }
      if(location.pathname !== '/chat') {
        set_first_id(true);
        set_chat_id(null);
      }
    }
  })
)

export default enhance;
