import React from 'react'
import { compose, withHandlers, lifecycle, withStateHandlers } from 'recompose'
import { connect } from 'react-redux'
import _ from 'lodash'
import { notification } from 'antd'

import { menu_creator, saveUserSettings } from 'src/libs/methods'
import { apishka } from 'src/libs/api'
import { set_user_style_status } from 'src/redux/actions/user'

let chatSocket

let authErr = (((LaNg || {}).authErr ||{})[LnG || 'EN'] || 'Ошибка авторизации (явно вызванная исключение)')
const enhance = compose(
	connect(
		state => ({
			is_custom_style: state.user.is_custom_style
		}),
		dispatch => ({
			set_user_style_status: status => dispatch(set_user_style_status(status))
		})
	),
	withStateHandlers((
		inState = {
			custom_menu: [], user_detail: {}, collapsed: false, current_role: null
		}) => ({
			custom_menu: inState.custom_menu, user_detail: inState.user_detail,
			collapsed: inState.collapsed, current_role: inState.current_role
		}),
		{
		  set_state: (state) => (obj) => {
			let _state = {...state},
				keys = _.keys(obj)
			
			keys.map( k => _state[k] = obj[k])
			return _state
		  }
		}
	),

	withHandlers({
		getMenu: ({ set_state }) => () => {
			apishka( 'GET', {}, '/api/menus', (res) => {
					set_state({ 
						custom_menu: res.outjson.menus,
						user_detail: res.outjson.userdetail,
						current_role: res.outjson.current_role
					})
					localStorage.setItem('usersettings', JSON.stringify(res.outjson.userdetail.usersettings))
					localStorage.setItem('homepage', res.outjson.homepage)
					localStorage.setItem('ischat', res.outjson.ischat)
					localStorage.setItem('redirect401', res.outjson.redirect401)
					localStorage.setItem('login_url', res.outjson.login_url)

					localStorage.setItem('ischat', res.outjson.ischat)
					localStorage.setItem('mdlp_api', res.outjson.mdlp_api)          
					localStorage.setItem('user_orgid', res.outjson.userdetail.orgid)

				}, (err) => {
					if (err.response && err.response.status === 401) {
						throw new Error(authErr)
					} else {
						console.log('err menus:', err)
					}
				},
				(err) => {
					console.log('err menus:', err)
				}
			)
		},
		menu_creator: menu_creator,
		menuCollapseStateSave: ({ set_state }) => (collapseState) => {
			let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {views:{}}
			userSettings['menuCollapse'] = collapseState
			saveUserSettings(userSettings)
			localStorage.setItem('usersettings',JSON.stringify(userSettings))
			set_state({ collapsed: collapseState })
		}

	}),
	withHandlers({
		handleGlobalWS: ({ getMenu }) => () => {
			let ws = document.location.href.split('//')[1]
			let ws_protocol = document.location.href.split('//')[0].indexOf('s') !== -1? 'wss' : 'ws'
			ws = ws.split('/')[0]
		  
			ws = ws_protocol + '://' + ws + '/global_ws'
			let globalSocket = new WebSocket(ws)
			globalSocket.onopen = () => {
				globalSocket.send(JSON.stringify({}))
			}
			globalSocket.onmessage = (e) => {
				let globalData = JSON.parse(e.data)

				globalData.forEach((g_item) => {
					notification.success({
						message:g_item.message
					})
					apishka(
						'GET',  {id: g_item.id},  '/api/setsended'
					)
				})
				getMenu()
			}
		},
	}),
	lifecycle({
		componentDidMount(){
			const { handleGlobalWS, getMenu, set_state, set_user_style_status } = this.props
			let userSettings = JSON.parse(localStorage.getItem('usersettings'))
			if (userSettings && userSettings.menuCollapse !== undefined) {
				set_state({ collapsed: userSettings.menuCollapse })
			}

			if (userSettings && userSettings.is_custom_style !== undefined) {
				set_user_style_status(userSettings.is_custom_style)
			}

				/* create client session */
			let sesid = localStorage.getItem('sesid')
			if (!sesid) {
				sesid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15 >> c/4).toString(16))
				localStorage.setItem('sesid', sesid)
			}
			document.cookie = 'sesid=' + sesid

			/* redirect401 */
			let redirect401 = localStorage.getItem('redirect401')
			if (!redirect401) {
				localStorage.setItem('redirect401', '/login')
			}

			/* login url */
			let login_url = localStorage.getItem('login_url')
			if (!login_url) {
				localStorage.setItem('login_url', '/login')
			}

			getMenu()
			// handleChatWS()
			handleGlobalWS()
		},
		UNSAFE_componentWillMount() {
			let body = document.getElementsByTagName('body')[0]
			body.classList.remove('login_bckg')
		},
		componentDidUpdate(prevProps){
			const { chatId, set_first_id, location, handleChatWS, set_chat_id, handleGlobalWS } = this.props
			if(prevProps.chatId !== chatId) {
				chatSocket.close()
				handleChatWS()
			}
		}
	})
)

export default enhance
