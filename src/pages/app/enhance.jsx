import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import _ from 'lodash';

import { get_menu, set_login_status, get_chat_id } from 'src/redux/actions/user';
import { set_loading } from 'src/redux/actions/loader';

import { apishka } from 'src/libs/api';
const enhance = compose(
  connect(
    (state) => ({
      isLogin: state.user.isLogin,
      isLoading: state.loader.isLoading,
      state: state,
      custom_menu: state.user.custom_menu,
      chatId: state.user.custom_menu
    }),
    dispatch => ({
      getMenu: (data) => dispatch(get_menu(data)),
      set_loading: (status) => dispatch(set_loading(status)),
      set_login_status: (status) => dispatch(set_login_status(status)),
      get_chat_id: () => dispatch(get_chat_id())
    })
  ),
  withHandlers({
    getData: ({ getMenu, set_settings, isLogin, set_login_status }) => () => {
      let root_spin = document.getElementById('spin_app_root');

      apishka( 'GET', {}, '/api/menus', (res) => {
          getMenu({data:res});
          localStorage.setItem('usersettings', JSON.stringify(res.outjson.userdetail.usersettings))
          localStorage.setItem('homepage', JSON.stringify(res.outjson.homepage))
          root_spin.setAttribute('style', 'display: none;');
        }, (err) => {
          if (err.response && err.response.status === 401) {
            isLogin ? set_login_status(false) : null;
            root_spin.setAttribute('style', 'display: none;');
          } else {
            alert('errrr menus')
            console.log('err menus:', err)
          }
        }
      )
    },
  }),
  lifecycle({
    componentDidMount() {
      const { get_chat_id } = this.props;
      get_chat_id();
    },
    componentWillMount() {
      const { getData,  isLogin, getMenu } = this.props;
      isLogin ? (()=>{
        getData()
      })() : null;
    },
    componentDidUpdate(prevProps) {
      const { getData, custom_menu, isLogin, state } = this.props;
      if(!prevProps.isLogin ) { // если был не авторизованным
        isLogin ? ( ()=> {
          getData()
        })() : null;
      }
    }
  })
)

export default enhance;
