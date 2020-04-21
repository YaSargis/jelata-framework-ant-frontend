import { api } from 'src/defaults';

import { notification } from 'antd';
import axios from 'axios';

import { Configer } from './methods';

const Axios = axios.create({
  baseURL: api.url,
	timeout: 60000,
	withCredentials: true,
  headers: {
		'Content-Type': 'application/json',
	}
});

export const Get = function (url, params) {
	return Axios.get(url, {
		params: params || {}
	}).catch((err) => {
		notification['error']({
			message: 'Error',
			description: err.response.data.message || 'Unknown error'
		});
		throw err.response;
	});
}

export const GetNM = function (url, params) {
	return Axios.get(url, {
		params: params || {}
	}).catch((err) => {
		throw err.response;
	});
}

export const getTable = function (id //filte id
/*table, tablecolums*/) {
  // get data for select type filters
  return GetNM('/api/gettable', {
    /*tabname: table,
    tabcolums: tablecolums*/
    id:id
  }).catch(() => {
		throw new Error("Error");
	});
}

export const Post = function (data) {
	let params = data.params || {};
	return Axios.post(data.url, data.data, { params: params });
}

export const PostMessage = function (data) {
	return Post(data).catch((err) => {
		notification.error({
			message: 'Ошибка',
			description: Configer.searchByString(err, 'response,data,message') || 'Unknown error'
		});
		throw new Error("Error");
	});
}

export const Delete = function (data) {
	return Axios.delete(data.url, {
		data: data.data
	}).catch((err) => {
		notification.error({
			message: 'Error',
			description: Configer.searchByString(err, 'response,data,message') || 'Unknown error'
		});
		throw new Error("Ошибка");
	});
}

export const Put = function (data) {
	return Axios.put(data.url, data.data).catch(err => {
		notification.error({
			message: 'Error',
			description: Configer.searchByString(err, 'response,data,message') || 'Unknown error'
		});
		throw new Error("Error");
	});
}


export const apishka = (type, data, methodname, cb, err) => {
  // all API methods call functions
  axios({
    method: type,
    url: api._url + methodname,
    data: data,
    //params: params,
    withCredentials: true
  })
  .then(
    function(response) {
      cb(response.data) // on success callback
    }, (error) => {
      err( error ) // error callback
      let errText = 'Unknown error'
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
        message: 'Ошибка',
        description: errText
      });
      if (
          error.response &&
          error.response.status === 401 && !(
            window.location.href.indexOf('/login') === -1 ||
            window.location.href.indexOf('/home') === -1
          )
      ) {
        window.location.replace('/login')
      }
  });
}