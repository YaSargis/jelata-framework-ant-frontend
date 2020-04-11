import React from 'react';
import qs from 'query-string';
import { connect } from 'react-redux';

import axios from 'axios';

import { compose, lifecycle, withHandlers } from 'recompose';

import { Tooltip, Icon, Popconfirm, notification, Modal, Spin } from 'antd';

import { visibleCondition, switchIcon, QueryBuilder, QueryBuilder2, bodyBuilder } from 'src/libs/methods';

import { PostMessage, Delete, Get, Put } from 'src/libs/api';
import { MyIcons } from 'src/libs/icons';

import { toggleLoading } from 'src/redux/actions/helpers';

const ActionsBlock = ({
  actions, data, params,
  loading, type = 'form', checked,
  onSave, goBack, goLink,goLinkTo, onDelete, onCallApi, popup, calendar
}) => {
  if(calendar) type = 'table';
  let _actions = _.filter(actions, x => {
    x.isforevery = x.isforevery || false;
    x.isforevery = _.isNumber(x.isforevery) ? x.isforevery === 1 ? true : false : x.isforevery;
    if(x.isforevery === (type === 'table') && visibleCondition(data, x.act_visible_condition, params.inputs)) return x;
  });
  return _actions.filter((act)=>act.type !== 'onLoad' &&  act.type !== 'Expand').map( (el, i) => {
    let men_icon = el.icon ? switchIcon(el.icon).split('_') : '',
      _value = (type !== 'table') ? <span>{el.title}</span> : null,
      _val = el.title,
      place_tooltip = (type !== 'table') ? 'topLeft' : 'left'; // текст на кнопку

		const onAction = (el) => {
			switch (el.type) {
				case 'Link':
						goLink(el)
						break;
				case 'LinkTo':
						goLinkTo(el)
						break;
				case 'Back':
					 goBack(el)
					 break;
				case 'API':
					 onCallApi(el)
					 break;
				case 'Save':
					 onSave(el)
					 break;
				case 'Save&Redirect':
	 			   onSave(()=>goLink(el));
					 //goLink(el);
	 				 break;
				case 'Delete':
					 onDelete(el)
					 break;
				case undefined:
					 goLink(el)
					 break;
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
						{ el.icon ? (men_icon[0] === 'cn') ?
								<Icon component={MyIcons[men_icon[1]]} />
							: <Icon type={switchIcon(el.icon)} /> : <Icon type='' />
						}
						{ _value }
					</button>
				)

		}

		return (
			<Tooltip key={'s1'+i} placement={place_tooltip} title={el.title || ''}>
					{((el.actapiconfirm === true &&  el.type === 'API') || el.type === 'Delete')? (
						<Popconfirm placement="bottom" title="Confirm" okText="Yes" cancelText="No" onConfirm = {()=>onAction(el)}>
							<a style={{display:'hide'}}/>
							<FmButton confirmed={false} el = {el} />
						</Popconfirm>
					) : <FmButton confirmed={true} el = {el} />
				}

			</Tooltip>
		)
  });
};

const enhance = compose(
  connect(
    state => ({
      loading: state.helpers.loading
    }),
    dispatch => ({
      toggleLoading: (status) => dispatch(toggleLoading(status)),
    })
  ),
  withHandlers({


  }),
  withHandlers({
    goLink: ({ data, origin, location, history, checked }) => (el) => {
      let url = ''
      if(!el.isforevery) {
        url = QueryBuilder2(data, el, origin.config, location ? qs.parse(location.search) : {}, checked);
      } else {
        url = QueryBuilder(data, el, origin.config,  location ? qs.parse(location.search) : {}, checked);
      };
      history.push(el.act + url);
    },
	  goLinkTo: ({ data, origin, location, history,checked }) => (el) => {
      let url = ''
      if(!el.isforevery) {
        url = QueryBuilder2(data, el, origin.config, location ? qs.parse(location.search) : {}, checked);
      } else {
        url = QueryBuilder(data, el, origin.config, location ? qs.parse(location.search) : {}, checked);
      };

      window.open(el.act + url);
    },
    onCallApi: ({  getData, origin = {}, data, location, toggleLoading, params, checked }) => (config_one) => {
      toggleLoading(true); 
      let uri = config_one.act;
      function call() {
        let body = {}
        if (config_one.actapitype === "GET") {
          uri = uri + QueryBuilder(data, config_one, origin.config, location ? qs.parse(location.search) : null, checked);
        } else {
          body = bodyBuilder(config_one, params.inputs, origin.config, data, checked);
        }
        let id_key = origin.config.filter((item) => item.col.toUpperCase() === 'ID' && !item.fn && !item.related )[0].key

		switch (config_one.actapitype) {
          case 'GET':
            Get(uri, body).then((res) => {
				if (res && res.data && res.data._redirect) {
					window.location.href = res.data._redirect
			    }
				if (res && res.data && res.data.message) {
					notification['success']({
						message: res.data.message
					});
				}
				if (!config_one.isforevery) {
					getData(data[id_key], getData);
				} else {
					getData(getData, {});
				}

            }).catch( err => {
              toggleLoading(false);
            })
            break;
            case 'POST':
              PostMessage({
                url: uri,
                data: body,
            }).then(res => {
				if (res && res.data && res.data._redirect) {
					window.location.href = res.data._redirect
			    }
				if (res && res.data && res.data.message) {
					notification['success']({
						message: res.data.message
					});
				}
				if (!config_one.isforevery) {
					getData(data[id_key], getData);
				} else {
					getData(getData, {});
				}
            }).catch( err => {
              toggleLoading(false);
            })
            break;
            case 'PUT':
              Put({
                url: uri,
                data: body
              }).then(res => {
				if (res && res.data && res.data.message) {
					notification['success']({
						message: res.data.message
					});
				}
				if (res && res.data && res.data._redirect) {
					window.location.href = res.data._redirect
			    }
				if (!config_one.isforevery) {
					getData(data[id_key], getData);
				} else {
					getData(getData, {});
				}
				console.log('res:', res)
	        }).catch( err => {
                console.log('ERR POST API:', err)
                toggleLoading(false); 
              })
            break;
            case 'DELETE':
              Delete({
                url: uri,
                data: body
              }).then((res) => {
				if (res && res.data && res.data.message) {
					notification['success']({
						message: res.data.message
					});
				}
				if (res && res.data && res.data._redirect) {
					window.location.href = res.data._redirect
			    }
		        if (!config_one.isforevery) {
					getData(data[id_key], getData);
				} else {
					getData(getData, {});
				}
				toggleLoading(false)
				console.log('res:', res)
			}).catch(() => toggleLoading(false));
            break;
        }
      }
      if (!config_one.actapimethod || config_one.actapimethod === 'simple') {
        call();
      } //else if(config_one.actapimethod === 'mdlp') {
        // (el, itm,  config, inputs, history, getData, data) => {
        //MDLP_API(config_one)
      //}
      else toggleLoading(false); //

    },
    onDelete: ({ getData, data, origin, toggleLoading }) => () => {
      toggleLoading(true); // запускаем прелоадер
      let id_title = _.filter(origin.config, o => o.col.toUpperCase() === 'ID' && !o.fn && !o.relatecolumn)[0].key;
      Delete({
        url: '/api/deleterow',
        data: {
          tablename: origin.table,
          id: data[id_title],
          viewid: origin.viewid ||origin.id
        }
      }).then((res) => {
        getData(getData);
      }).catch( () => {
        toggleLoading(false); 
      })
    },
    goBack: ({ history }) => () => {
      history.goBack();
    }
  }),
);

export default enhance(ActionsBlock);
