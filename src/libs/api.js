import { api } from 'src/defaults';

import { notification } from 'antd';
import axios from 'axios';

export const apishka = (type, data, methodname, cb = () => {}, err = () => {}) => {
	/* Call API methods with axios */
	axios({
		method: type,
		url: (methodname.indexOf('http') === -1)? api._url + methodname: methodname,
		data: data,
		params: ((type.toUpperCase() === 'GET')? data : {}),
		withCredentials: true,
		headers: {'Auth':localStorage.getItem('sesid')}
	}).then(function(response) {
		cb(response.data) // on success callback
	}, (error) => {
		
		let errText = (((LaNg || {}).unknownError ||{})[LnG || 'EN'] || 'Unknown error')
		if (
			error.response &&
			error.response.data &&
			error.response.data.message
		) {
			errText = error.response.data.message
		} else {
			console.log(methodname,':',error)
		}
		notification['error']({
			message: (((LaNg || {}).Error ||{})[LnG || 'EN'] || 'Error'),
			description: errText
		})
		let redirect401 = localStorage.getItem('redirect401')
		if (!redirect401 ||  redirect401 === 'undefined' || redirect401 === 'null') {
			redirect401 = '/login'
		}

		if (
			error.response && error.response.status === 401 &&
			window.location.pathname !== redirect401
		) {
			window.location.replace(redirect401)
		}
		err( error ) // error callback
	})
}
