import React from 'react'
import qs from 'query-string'

import axios from 'axios'

import { compose, lifecycle, withHandlers } from 'recompose'

import { Tooltip, Icon, Popconfirm, notification, Modal, Spin, Menu } from 'antd'

import { visibleCondition, switchIcon, QueryBuilder, QueryBuilder2, bodyBuilder } from 'src/libs/methods'

import { PostMessage, Delete, Get, Put, apishka } from 'src/libs/api'


import Getone from 'src/pages/Getone'
import List from 'src/pages/list'

const { SubMenu } = Menu

let Error = (((LaNg || {}).Error ||{})[LnG || 'EN'] || 'Error')
let signError = (((LaNg || {}).signError ||{})[LnG || 'EN'] || 'sign error')
let bClose = (((LaNg || {}).bClose ||{})[LnG || 'EN'] || 'close')
let Yes = (((LaNg || {}).Yes ||{})[LnG || 'EN'] || 'Yes')

const ActionsBlock = ({
	actions, data, params,
	loading, type = 'form', checked,
	onSave, goBack, goLink,goLinkTo, onDelete,
	onCallApi, popup, calendar, onModal, position=1//, toggleLoading
}) => {
	if(calendar) type = 'table'
	
	actions = actions.filter((act) => act.position === position)
	
	let _actions = _.filter(actions, x => {
		x.isforevery = x.isforevery || false
		x.isforevery = _.isNumber(x.isforevery) ? x.isforevery === 1 ? true : false : x.isforevery
		if (x.isforevery === (type === 'table') && visibleCondition(data, x.act_visible_condition, params.inputs)) return x
	})
	return _actions.filter((act)=>act.type !== 'onLoad' &&  act.type !== 'Expand').map( (el, i) => {
		let _value = (type !== 'table') ? <span>{el.title}</span> : null,
			_val = el.title,
			place_tooltip = (type !== 'table') ? 'topLeft' : 'left'

		const onAction = (el) => {
			switch (el.type) {
				case 'Link':
					goLink(el)
					break
				case 'LinkTo':
					goLinkTo(el)
					break
				case 'Back':
					goBack(el)
					break
				case 'API':
					onCallApi(el)
					break
				case 'Save':
					onSave(el)
					break
				case 'Save&Redirect':
					onSave(()=>goLink(el))

					break
				case 'Delete':
					onDelete(el)
					break
				case 'Modal':
					onModal(el)
					break
				case undefined:
					goLink(el)
					break
		}}

		const FmButton = (props) => {
			let el = props.el
			return (
				<button
					className={'fm-btn fm-btn-sm ' + el.classname}
					size='small'
					title={el.title}
					onClick={()=>{
						if (props.confirmed)
							onAction(el)
					}}
				>
					<Icon type={el.icon} />
					{ _value }
				</button>
			)
		}

		/*return (
			<Tooltip key={'s1'+i} placement={place_tooltip} title={el.title || ''}>
				{((el.actapiconfirm === true &&  el.type === 'API') || el.type === 'Delete')? (
					<Popconfirm placement='bottom' title={el.title} okText={Yes} cancelText={bClose} onConfirm = {()=>onAction(el)}>
						<a style={{display:'hide'}}/>
						<FmButton confirmed={false} el = {el} />
					</Popconfirm>
				) : <FmButton confirmed={true} el = {el} />}
			</Tooltip>
		)*/
	
		const CubMenu = (props) => {
			let childs = props.childs
			return childs.map((ell) => {
				
				
				return 	(<>{(ell.childs.length) > 0? (
					<SubMenu
						title={
							<span className="submenu-title-wrapper">
								<Icon type={el.icon}/>
								{el.title}
							</span>	
						}
					>
						<CubMenu childs={ell.childs} />
					</SubMenu>
					)
					:(
						<Menu.Item
							style={{position:'absolute', backgroundColor:'white', cursor:'pointer'}}
							key={'mnb'+ell.title}
							onClick={()=>{
								onAction(ell)
							}}
						
						>
							<Icon type={ell.icon}/>
							{ell.title}
						</Menu.Item>							
				)}
				</>
				)
			})
			
		}
		
		return 	(<> {
			(position === 1)? (
				<Tooltip key={'s1'+i} placement={place_tooltip} title={el.title || ''}>
					{((el.actapiconfirm === true &&  el.type === 'API') || el.type === 'Delete')? (
						<Popconfirm placement='bottom' title={el.title} okText={Yes} cancelText={bClose} onConfirm = {()=>onAction(el)}>
							<a style={{display:'hide'}}/>
							<FmButton confirmed={false} el = {el} />
						</Popconfirm>
					  ) : <FmButton confirmed={true} el = {el} />
					}
				</Tooltip>
					
			) : (
				<Menu mode='horizontal' style={{fontSize:13}}>
					{(el.childs.length) > 0? (
							<SubMenu
								title={
									<span className="submenu-title-wrapper">
										<Icon type={el.icon}/>
										{el.title}
									</span>	
								}
							>
								<CubMenu childs={el.childs} />
							</SubMenu>
						)
						:(
							<Menu.Item key={'mnb'+i}
								onClick={()=>{
									onAction(el)
								}}
							>
								<Icon type={el.icon}/>
								{el.title}
							</Menu.Item>							
						)
					}
				</Menu>
					
			)	
		}
		</>
		)
		
  })
}

const enhance = compose(

	withHandlers({
		SIGN_API: ({ getData, origin = {}, data, location, setLoading, checked}) => (config_one) => {
			let el = data, itm = config_one, config = origin.config, 
				inputs = location ? qs.parse(location.search) : null, 
				body = {}, args = {}

			let id_key = origin.config.filter((item) => item.col.toUpperCase() === 'ID' && !item.fn && !item.related )[0].key

			const paramBuild = new Promise((resolve, reject) => {
				let thumbprint = localStorage.getItem('thumbprint')
				if (config_one.parametrs && !_.isEmpty(config_one.parametrs)) {
					config_one.parametrs.forEach((obj) => {
						if (obj.paramcolumn) {
							if  (  data && data[0]) { 
								body[obj.paramtitle] = data[0][(config.filter((x)=> (
									x.col === obj.paramcolumn.label || x.title === obj.paramcolumn.value
								))[0] || {}).key]
							}
							if (!body[obj.paramtitle] && data) { 
								body[obj.paramtitle] = data[(config.filter((x)=> (
									x.col === obj.paramcolumn.label || x.title === obj.paramcolumn.value
								))[0] || {}).key]
							}
							if  ( !body[obj.paramtitle]) { 
								body[obj.paramtitle] = inputs[obj.paramcolumn.value]
							}	
						}
						else if (obj.paraminput) {
							body[obj.paramtitle] = inputs[obj.paraminput]
						} else {
							let cConst = obj.paramconst
							if (cConst === '_checked_')
								cConst = JSON.stringify(checked || [])
							body[obj.paramtitle] = cConst
						}


					}) 
					if (config_one.parametrs.filter((obj) => obj.paramt && (obj.paramt === 'sign' || obj.paramt === 'encode_and_sign')).length > 0) {
						config_one.parametrs.filter((obj) => obj.paramt && (obj.paramt === 'sign' || obj.paramt === 'encode_and_sign')).forEach((obj) => {
							let P = body[obj.paramtitle] 
							if (obj.paramt === 'encode_and_sign') 
								P = window.btoa(P)
							mdlp.signRequest(P, thumbprint).then((signature) => {
								console.log('sig:',signature)
								body[obj.paramtitle] = signature
								resolve(body)
							}).catch((err) => {
								notification['error']({
									message: Error, description: signError + err
								})
								reject(err)
							})
						})	
						
					} else resolve(body)
				}
				else
					resolve(body)
			})


			paramBuild.then((body) => {
				setLoading(true)		
				apishka(
					config_one.actapitype, body, config_one.act,
					(res) => {
						setLoading(false)
						if (res && res.message) {
							notification['success']({
								message: res.message
							})
						}
						if (res && res._redirect) {
							window.location.href = res._redirect
						}
						if (!config_one.isforevery) {
							getData(data[id_key], getData)
						} else {
							getData(getData, {})
						}
					},
					(err) => {
						setLoading(false)
					}
				)

			}).catch((err)=> {
				setLoading(false)
				console.log('promise parambuild err: ', err)
			})
		}
	}),
	withHandlers({
		goLink: ({ data, origin, location, history, checked }) => (el) => {
			let url = ''
			if(!el.isforevery) {
				url = QueryBuilder2(data, el, origin.config, location ? qs.parse(location.search) : {}, checked)
			} else {
				url = QueryBuilder(data, el, origin.config,  location ? qs.parse(location.search) : {}, checked)
			}
			history.push(el.act + url)
		},
		goLinkTo: ({ data, origin, location, history,checked }) => (el) => {
			let url = ''
			if(!el.isforevery) {
				url = QueryBuilder2(data, el, origin.config, location ? qs.parse(location.search) : {}, checked)
			} else {
				url = QueryBuilder(data, el, origin.config, location ? qs.parse(location.search) : {}, checked)
			}
			window.open(el.act + url)
		},
		onCallApi: ({
			getData, origin = {}, data, location,
			params, checked, setLoading, SIGN_API
		}) => (config_one) => {
			setLoading(true) 
			/*let uri = config_one.act
			/function call() {
				let body = {}
				if (config_one.actapitype === 'GET') {
					uri = uri + QueryBuilder(data, config_one, origin.config, location ? qs.parse(location.search) : null, checked)
				} else {
					body = bodyBuilder(config_one, params.inputs, origin.config, data, checked)
				}
				let id_key = origin.config.filter((item) => item.col.toUpperCase() === 'ID' && !item.fn && !item.related )[0].key
				apishka(
					config_one.actapitype, body, uri,
					(res) => {
						if (res && res.message) {
							notification['success']({
								message: res.message
							})
						}
						if (res && res._redirect) {
							window.location.href = res._redirect
						}
						if (!config_one.isforevery) {
							getData(data[id_key], getData)
						} else {
							getData(getData, {})
						}
					},
					(err) => {
						setLoading(false)
					}
				)
			}*/
	
			SIGN_API(config_one)
			setLoading(false)
		},
		onDelete: ({ getData, data, origin, setLoading }) => () => {
			setLoading(true)
			let id_title = _.filter(origin.config, o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn)[0].key
			apishka(
				'DELETE', {
					tablename: origin.table,
					id: data[id_title],
					viewid: origin.viewid ||origin.id
				}, '/api/deleterow',
				(res) => {
					getData(getData)
				},
				(err) => {
					setLoading(false)
				}
			)
		},
		onModal: ({getData, origin, data, location, history}) => (act) => {
			const typeContent = act.act.split('/')[1]
			let inputs = QueryBuilder(data, act, origin.config, history)

			if(!act.isforevery)
				inputs = QueryBuilder2(data, act, origin.config, location ? qs.parse(location.search) : {})

			let search = { search: inputs, pathname: act.act }

			const ModalContent =  (typeContent, search, act) => {
				switch (typeContent) {
					case 'list':
						return (
							<div>
								<List
									compo={true} location={search} history = {history}
									path={act.act.split('/')[2]} id_page={act.act.split('/')[2]}
								/>
							</div>
						)
					case 'tiles':
						return (
							<div>
								<List
									compo={true} location={search} history = {history}
									path={act.act.split('/')[2]} id_page={act.act.split('/')[2]}
								/>
							</div>
						)
					case 'getone':
						return (
							<div>
								<Getone
									compo={true} location={search} history = {history}
									path={act.act.split('/')[2]} id_page={act.act.split('/')[2]}
								/>
							</div>
						)
					default:
						const openNotification = () => {
							notification.open({
								message: `type ${typeContent} not correct  `,
								description: 'use list or getone'
							})
						}
					return openNotification
				}
			}
			Modal.success({
				title: act.title,
				okType:'dashed',
				width:'85%',
				content: (
					<div style = {{width:'100%'}}>
						{ModalContent(typeContent, search, act)}
					</div>
				),
				okText: <Icon type ='close' />,
				onOk: () => {
					let id_key = origin.config.filter((item) => item.col.toUpperCase() === 'ID' && !item.fn && !item.related )[0].key
					if (!act.isforevery) {
						getData(data[id_key], getData)
					} else {
						getData(getData, {})
					}
				}
			})
		},
		goBack: ({ history }) => () => {
			history.goBack()
		}
	}),
)

export default enhance(ActionsBlock)
