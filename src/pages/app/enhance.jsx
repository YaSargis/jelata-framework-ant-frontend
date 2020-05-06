import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import _ from 'lodash';

import { get_menu, set_login_status, get_chat_id } from 'src/redux/actions/user';
import { set_loading } from 'src/redux/actions/loader';

import { apishka } from 'src/libs/api';
const enhance = compose(
  connect(
    (state) => ({
      isLogin: state.user.isLogin, isLoading: state.loader.isLoading,
      state: state, custom_menu: state.user.custom_menu,
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
          localStorage.setItem('homepage', res.outjson.homepage)
          localStorage.setItem('redirect401', res.outjson.redirect401)
          localStorage.setItem('login_url', res.outjson.login_url)
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

			/* create client session */
			let sesid = localStorage.getItem('sesid')
			if (!sesid) {
				sesid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15 >> c/4).toString(16))
				localStorage.setItem('sesid', sesid)
			}
			document.cookie = 'sesid=' + sesid
			/* create client session */

			/* redirect401 */
			let redirect401 = localStorage.getItem('redirect401')
			if (!redirect401) {
				localStorage.setItem('redirect401', '/login')
			}
			/* redirect401 */

			/* login url */
			let login_url = localStorage.getItem('login_url')
			if (!login_url) {
				localStorage.setItem('login_url', '/login')
			}
			/* login url */

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
      if(!prevProps.isLogin ) { 
        isLogin ? ( ()=> {
          getData()
        })() : null;
      }
    }
  })
)

export default enhance;
