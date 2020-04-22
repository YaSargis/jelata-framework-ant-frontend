import { api } from 'src/defaults';

import { notification } from 'antd';
import axios from 'axios';



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