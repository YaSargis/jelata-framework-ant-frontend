import React from 'react'
import Helmet from 'react-helmet'

import { Tabs, Form, Icon, Input, Button, Checkbox, List } from 'antd'

const { TabPane } = Tabs

import 'src/styles/index.scss'

import enhance from './enhance'

let passwordPlaceholder = (((LaNg || {}).passwordPlaceholder ||{})[LnG || 'EN'] || 'password')

let plLogin = (((LaNg || {}).plLogin ||{})[LnG || 'EN'] || 'login')
let loginForm = (((LaNg || {}).loginForm ||{})[LnG || 'EN'] || 'Log In')
let signIn = (((LaNg || {}).signIn ||{})[LnG || 'EN'] || 'sign in')
let oOr = (((LaNg || {}).oOr ||{})[LnG || 'EN'] || 'or')
let logSig = (((LaNg || {}).logSig ||{})[LnG || 'EN'] || 'Log in by digital signature')
let logPas = (((LaNg || {}).logPas ||{})[LnG || 'EN'] || 'Log in by login/password')
let Error = (((LaNg || {}).Error ||{})[LnG || 'EN'] || 'Error')


let config = {
	title: loginForm, login: plLogin,
	pass: passwordPlaceholder, remember: {
		visible: true, title: 'Remember me',
	},
	forgot: {
		visible: true, title: 'Forgot the password'
	}
}

const LoginForm = ({
	legacy, sertificats, select_scp, onSelectSert, onECP,
	handleSubmit, form, setTypeLogin, set_state, ready = true
}) => {
	let { getFieldDecorator } = form
	return (
		<div className={'tilt-in-fwd-tr login ' + (legacy ? '' : 'ecp_form_login') }>
			<div className='login_title'>
				<span>{config.title}</span>
			</div>
			<div className='login_fields'>
				<Form onSubmit={handleSubmit} className='login-form'>
					{legacy ? [
						<Form.Item key='s1'>
							{getFieldDecorator('username', {
								rules: [{ message: plLogin }],
							})(
								<Input
									prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder={plLogin}
								/>
							)}
						</Form.Item>,
						<Form.Item key='s2'>
							{getFieldDecorator('password', {
								rules: [{ message: passwordPlaceholder }],
							})(
								<Input
									prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
									type='password'
									placeholder={passwordPlaceholder}
								/>
							)}
						</Form.Item>
					] : [
						<Form.Item key='s1' className='sertificat_block'>
							{getFieldDecorator('certificate', {
							  rules: [{ message: 'Please select your certificat!' }],
							})(
								<List
									size='small'
									dataSource={sertificats}
									renderItem={item => (
										<List.Item key={item.id}
											className={ 'item_select_sert ' + (item.thumbprint === select_scp.thumbprint ? 'active' : '') }
											onClick={() => onSelectSert(item) }
										>
										<List.Item.Meta
										  title={item.sname}
										  description={item.valid}
										/>
									  </List.Item>
									)}
								/>
							)}
						</Form.Item>
					]}

					<Form.Item>
						<Button type='primary' htmlType='submit' className='login-form-button'>
							{loginForm}
						</Button>
						<span style={{
							display: 'flex',
							justifyContent: 'space-between'
						}}>
							<span>
								<span style={{ color: '#afb1be' }}>{oOr} </span>
								{}
							</span>
							<Button style={{ margin: '7px 0' }} size='small' type='dashed' ghost onClick={onECP}>
								{ !legacy ? logPas : logSig}
							</Button>
						</span>
					</Form.Item>
				</Form>
			</div>
		</div>
	)
}

export default Form.create({ name: 'normal_login' })(enhance(LoginForm))
