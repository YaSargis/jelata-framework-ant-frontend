import React from 'react';
import { bools, actions } from 'src/defaults';
import qs from 'query-string';

import { apishka } from './api';
//import { MDLP_API } from './user_methods';
import { MyIcons } from './icons';

import {
  Row, Col, Icon, Input, InputNumber, Select, Checkbox, Button, Tooltip, Popconfirm, Menu, notification
} from 'antd';

import { Link } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;
const { SubMenu } = Menu;

export const saveUserSettings = (settings) => {
	// save uersettings json ( some views settings )

  apishka('POST', {settings: settings}, '/api/saveusersettings')


}

export const switchIcon = (icon) => {
  let arr = [
    { fa: 'fa fa-arrow-left', type: 'back', icon: 'arrow-left'},
    { fa: 'fa fa-edit', icon: 'edit' },
	{ fa: 'fa fa-plus', icon: 'plus'},
    { fa: 'fa fa-trash', icon: 'delete'},
    { fa: 'fa fa-times', icon: 'close'},
    { fa: 'fa fa-pie-chart', icon: 'pie-chart'},
    { fa: 'fa fa-download', icon: 'download'},
    { fa: 'fa fa-eye', icon: 'eye'},
    { fa: 'fa fa-pencil', icon: 'cn_pencil'},
    { fa: 'fa fa-graduation-cap', icon: 'cn_graduation-cap' },
    { fa: 'fa fa-pencil-square-o', icon: 'cn_pencil-square-o' },
    { fa: 'fa fa-print', icon: 'printer' },
    { fa: 'fa fa-list', icon: 'unordered-list' },
    { fa: 'fa fa-list-alt', icon: 'cn_list-alt' },
    {  fa: 'fa fa-check', icon: 'check' },
    {  fa: 'fa fa-file-text-o', icon: 'file-text' },
    { fa: 'fa fa-paper-plane', icon: 'cn_plane' }
  ];

  let sw = _.find(arr, x => x.fa === icon);

  if(sw) return sw.icon; else return icon;

}

export function visibleCondition(data,visible_condition, inputs) {
  data = data || {}
	if (data[0])
		data = data[0]

  if (!inputs) {
    inputs = {}
  }
  if (!visible_condition || visible_condition.length === 0 ) {
    return true;
  } else {
    let a = true

    visible_condition.forEach((item) => {
      if (item.operation.js === ">") {
        if ((data[item.col.key]!==undefined  &&  data[item.col.key]!==null && data[item.col.key]>item.value) ||

          (data[item.col.key] === undefined && inputs[item.col.value]!==undefined && inputs[item.col.value]!==null  && inputs[item.col.value]>item.value)) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "===") {
        if ( (data[item.col.key]!==undefined  && data[item.col.key]!==null && data[item.col.key].toString()===item.value) ||
        (data[item.col.key] === undefined && inputs[item.col.value]!==undefined  && inputs[item.col.value]!==null && inputs[item.col.value].toString()===item.value)
        ) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "<") {
        if ((data[item.col.key]!==undefined  && data[item.col.key]!==null && data[item.col.key]<item.value) ||
        (data[item.col.key] === undefined && inputs[item.col.value]!==undefined  && inputs[item.col.value]!==null && inputs[item.col.value]<item.value)
        ) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "!==") {



        if ((data[item.col.key]!==undefined  && data[item.col.key]!==null && data[item.col.key].toString() !== item.value) ||
        (data[item.col.key] === undefined && inputs[item.col.value]!==undefined  && inputs[item.col.value]!==null && inputs[item.col.value].toString()!==item.value)
        ) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === ">=") {
        if ((data[item.col.key]!==undefined && data[item.col.key]!==null && data[item.col.key] >= item.value) ||
        (data[item.col.key] === undefined && inputs[item.col.value]!==undefined  && inputs[item.col.value]!==null && inputs[item.col.value]>=item.value)
        ) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "<=") {
        if ((data[item.col.key]!==undefined && data[item.col.key]!==null && data[item.col.key] <= item.value) ||
        (data[item.col.key] === undefined && inputs[item.col.value]!==undefined && inputs[item.col.value]!==null && inputs[item.col.value]<=item.value)
        ) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "===null" ) {
        if (data[item.col.key] === null || data[item.col.key] === undefined ) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "!==null" ) {
        if (!(data[item.col.key] === null || data[item.col.key] === undefined )) {

          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "indexOf") {

        if ((data[item.col.key] && (data[item.col.key]).indexOf(item.value)!==-1) || (inputs[item.col.value] &&(inputs[item.col.value]).indexOf(item.value)!==-1)) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "likeOr") {
        const arr = item.value.split(',');

        if(_.isEmpty(arr)) {
          return a = false;
        }
        const presenceToArray = (value) => {
          let result = false;
          let arrBooleans = [];

          [value].forEach((item) => {
            arr.forEach((it)=>{
              let itemResult = item.includes(it);

              arrBooleans.push(itemResult);
            })
          });

          (arrBooleans.find((item) => item === true)) ? result = true : null;

          return result;
        }

        if ((data[item.col.key] && presenceToArray(data[item.col.key])) || (inputs[item.col.value] && presenceToArray(inputs[item.col.value]) )) {
          a = true && a
        } else {
          a = false
        }
      }
      else if (item.operation.js === "in") {
        if ( item.value.split(',').filter((x) => data[item.col.key] && x === data[item.col.key].toString()).length > 0) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "not in") {
        if ( item.value.split(',').filter((x) => data[item.col.key] && x === data[item.col.key].toString()).length === 0) {
          a = true && a
        } else {
          a = false
        }
      } else if (item.operation.js === "contain") {
        if (typeof(data[item.col.key]) === 'object'  && (data[item.col.key] || []).filter((x) => x == item.value).length > 0 )
          a = true
        else
          a = false
      }
    })
    return a
  }
}



export const QueryBuilder = (item, el, config, inputs, checked) => {
  // build Link type action query by action parameters config
  // for every row actions
  let { parametrs, paramtype } = el,
      _query = '';

  if(parametrs) {
    //if(paramtype && paramtype === 'link') {

	  let link_parametrs = parametrs.filter((x) => x.query_type === 'link')
	  if (link_parametrs.length > 0) _query = '/';

      link_parametrs.forEach((obj, index) => {
        if (obj.paramcolumn) {
          _query += item[(_.find(config, o => o.title === obj.paramcolumn.value) || {}).key] + '/'
        }
        else if (obj.paraminput) {
          _query += inputs[obj.paraminput] + '/'
        }
        else {
			let cConst = obj.paramconst
			if (cConst === '_checked_')
				cConst = JSON.stringify(checked || [])
           _query += cConst + '/';
        }
        parametrs.length !== index+1 ? _query += '&' :  null
      })

	  let query_parametrs = parametrs.filter((x) => x.query_type === 'query')
	  if (query_parametrs.length > 0) _query += '?';

      query_parametrs.forEach((obj, index) => {
		if(!obj.paramt || obj.paramt === 'sample') {
          if(obj.paramcolumn) {
            _query += obj.paramtitle + '=' + item[(_.find(config, o => o.title === obj.paramcolumn.value) || {}).key]
          }
          else if (obj.paraminput) {
            _query += obj.paramtitle + '=' + inputs[obj.paraminput]
          }
          else {
			let cConst = obj.paramconst
			if (cConst === '_checked_')
				cConst = JSON.stringify(checked || [])
            _query += obj.paramtitle + '=' + cConst;
          }
          parametrs.length !== index+1 ? _query += '&' :  null
        };
      })



  }
  return _query;
};

export function QueryBuilder2(item, itm, config, inputs, checked) {
  // build Link type action query by action parameters config
  // for one row actions

  if (item && item[0]) {
    item = item[0]
  }
  let squery = ''
  if (itm.act.indexOf('?') === -1)
    squery = '?'
  if (itm.parametrs) {
    itm.parametrs.forEach((obj) => {
      if (obj.paramcolumn) {
        let opc = obj.paramcolumn;
        squery += obj.paramtitle + "=" +
          (
            item[(_.find(config, (o)=> ( o.title === opc.value || (o.fn && o.title === opc.value)  )) || {}).key]
              || inputs[(_.find(config, ((o)=> o.title === opc.value)) || {}).title]
          ) + '&'
      }
      else if (obj.paraminput) {
        squery += obj.paramtitle + '=' + inputs[obj.paraminput] + '&'
      }
      else {
		let cConst = obj.paramconst
		if (cConst === '_checked_')
			cConst = JSON.stringify(checked || [])
        squery += (obj.paramtitle ? obj.paramtitle + "=" : '') + cConst + '&'
      }
    })
  }

  squery = squery.substring(0,squery.length-1)
  return squery
}

export function bodyBuilder(itm, inputs, config, data, checked) {
  // item - inputs
  // build API method body by action parameters config
  let body = {}
  if (itm.parametrs) {
    itm.parametrs.map((obj) => {
      if (!obj.paramt || obj.paramt === 'simple')
        if (obj.paramcolumn) {
			if  (  data && data[0]) {
				body[obj.paramtitle] = data[0][(config.filter((x)=> (
					x.col === obj.paramcolumn.label || x.title === obj.paramcolumn.value
				))[0] || {}).key];
			};

			if (!body[obj.paramtitle] && data) {
			    body[obj.paramtitle] = data[(config.filter((x)=> (
	                x.col === obj.paramcolumn.label || x.title === obj.paramcolumn.value
	            ))[0] || {}).key];
			}

			if  ( !body[obj.paramtitle]) {
				body[obj.paramtitle] = inputs[obj.paramcolumn.value];
		    };
        }
		else if (obj.paraminput) {
          	body[obj.paramtitle] = inputs[obj.paraminput]
        }
        else {
			let cConst = obj.paramconst
			if (cConst === '_checked_')
				cConst = JSON.stringify(checked || [])

			body[obj.paramtitle] = cConst;

        }
    })
  };
  return body;
}

export const Configer = {
  parseJSON: (json) => {
    let _obj = [];

    t(json, null, _obj);

    function t(json, parent, n_obj) {
      json.forEach((el,i) => {
        setTimeout
        let new_name = Configer.nanoid();

        el.name = new_name;
        el.parent = parent;

        let s = Configer.omit(['content'], el);

        n_obj.push(s);

        if(el.content) t(el.content, new_name, n_obj);
      })
    }
    return _obj;
  },
  nanoid: (size) => {
    let str = 'ObjectSymhasOwnProp-0123456789ABCDEFGHIJKLMNQRTUVWXYZ_dfgiklquvxz';
    size = size || 21;

    let id = '';
    while ( 0 < size-- ) {
      id += str[Math.random() * 64 | 0]
    }

    return id
  },
  omit: (arr, obj) => {
    let result = Object.assign({}, obj);

    for (let i = 0; i < arr.length; i++) {
      delete result[arr[i]];
    }

    return result;
  },
  searchByString: (obj, propString) => {

    if(!propString) return obj;
    var prop, props = propString.split(',');
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];
      var candidate = obj[prop];
      if(candidate) obj = candidate; else break;
    };
    return obj[props[i]];
  },
  render: (config, parent, data, _onChange, api_data) => { // (config, parent, values, handlerValues, api_data)
    if(Array.isArray(config) && config.length > 0) {
      let _json = _.filter(config, o => {
        if(o.parent === parent) return true; else false;
      });

      return _json.map((_el, i) => {
        let el = {..._el};
        let p = el.params,
            m = el.mods || {},
            visible = true;
        if(typeof m['visible'] !== "undefined") {
          /*
            mods: {
              visible: {
                data: 'viewtype',
                reverse: true | false,
                value: ['table', 'tiles']
              } | true/false
            },
          */
          if(_.isObject(m.visible)) {
            if(Array.isArray(m.visible.value)) {
              if(_.find(m.visible.value, o => o === data[m.visible.data])) visible = true; else visible = false;
            } else {
              //
              if(data[m.visible.data] === m.visible.value) visible = true; else visible = false;
            }
            if(m.visible.reverse) visible = !visible;
          } else visible = m.visible;
        };
        if(el.parent === el.name) {
          alert('LOOP! ' + el.name);
          return false;
        };
        let s_value;
        if(el.binding) {
          s_value = Configer.searchByString(data, el.binding);
          if(el.binding.split(',').length > 1) {
            el.binding = el.binding.split(',')[el.binding.split(',').length - 1 ]
          };
        }
        // disabled
        let disable = false;
        if(p.disabled) {
          if(_.isObject(p.disabled)) {

           if(p.disabled.d_data) {
             switch (p.disabled.d_val) {
               case 'notnull':
               if(data[p.disabled.d_data]) disable = true;
               break;
               default:
                 if(data[p.disabled.d_data] === p.disabled.d_val) disable = true;
                 break;
                }
              } else disable = true;
              if(p.disabled.d_flip) disable = !disable;
          } else disable = true;
        }
        if(visible) {
          switch (el.block) {
            case 'button':

                return <Col span={24} key={i+el.name}>
                  <Col span={24}><label >&nbsp;</label></Col>
                  <Col span={24}>
                    <Button
                      type={p.type || 'default'}
                      className={p.css || ''}
                      onClick={p.f_onClick}
                    >
                      {
                        p.label || 'Button'
                      }
                    </Button>
                  </Col>
                </Col>
              break;
            case 'div':

              return <div key={i + el.name} className={p.css || ''}>
                {
                  // children
                  Configer.render(config, el.name, data, _onChange, api_data)
                }
              </div>
              break;
            case 'row':
                return <Row gutter={p.gutter || 0} style={p.style || {}} key={i+el.name}>
                  {
                    // children
                    Configer.render(config, el.name, data, _onChange, api_data)
                  }
                </Row>
              break;
            case 'col':
                return <Col key={i+el.name} style={p.style || {}} span={p.span || 24}>
                  {
                    // children
                    Configer.render(config, el.name, data, _onChange, api_data)
                  }
                </Col>
              break;
            case 'input':

              switch (el.type) {
                case 'text':
                  return <Col span={24} key={i+el.name}>
                      <Col span={24}><label >{p.label}</label></Col>
                      <Col span={24}>
                        <Input
                          placeholder={p.placeholder || '...'}
                          value={s_value || ''}
                          disabled={p.disabled ? true: false}
                          onChange={(event) => {
                            if(p.max) {
                              event.target.maxLength = p.max;
                              event.target.value.length === p.max ? notification.open({
                                message: 'max value',
                                description: `${p.max} symbol`,
                                icon: <Icon type="warning" />
                              }) : null
                            }
                            data[el.binding] = event.target.value;
                            _onChange(data, el);
                          }}
                        />
                      </Col>
                    </Col>
                  break;
                case 'number':
                  return <Col span={24} key={i+el.name}>
                    <Col span={24}><label >{p.label}</label></Col>
                    <Col span={24}>
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder={p.placeholder || '...'}
                        value={s_value || ''}
                        disabled={p.disabled ? true: false}
                        min={_.isNumber(p.min) ? p.min : -Infinity}
                        max={p.max || Infinity}
                        onChange={(event) => {
                          if(typeof event === 'number') {
                            data[el.binding] = event;
                            _onChange(data, el);
                          } else if(event === null) {
                            data[el.binding] = null;
                            _onChange(data, el);
                          }
                        }}
                      />
                    </Col>
                  </Col>
                  break;
                case 'textarea':
                  return <Col span={24} key={i+el.name}>
                    <Col span={24}><label >{p.label}</label></Col>
                    <Col span={24}>
                      <TextArea
                        placeholder={p.placeholder || '...'}
                        value={s_value || ''}
                        disabled={p.disabled ? true: false}
                        onChange={(event) => {
                          data[el.binding] = event.target.value;
                          _onChange(data, el);
                        }}
                        autosize={p.autosize || { minRows: 4 }}
                      />
                    </Col>
                  </Col>
                  break;
              }
              break;
            case 'select':

              let _arr = [];
              if(_.isString(p.data)) {
                _arr = api_data[p.data] ? [...api_data[p.data]] : [] ;
              };
              let ss_value;
              if(p.labelInValue) {
                ss_value = [];
                if(s_value && Array.isArray(s_value)) {
                  s_value.forEach((el) => {
                    let _el = el;
                    _el.key = el[p.api_id];
                    ss_value.push(_el);
                  })
                }
              } else ss_value = s_value;

              if(p.mode === 'multiple'){
                if(p.labelInValue) {
                  // labelInValue true and multi
                  ss_value = [];
                  if(s_value && Array.isArray(s_value)) {
                    s_value.forEach((el) => {
                      let _el = el;
                      _el.key = el[p.api_id];
                      ss_value.push(_el);
                    })
                  }
                } else {
                  // labelInValue false and multi
                  ss_value = [];
                  if(s_value && Array.isArray(s_value)) {
                    s_value.forEach((el) => {
                      ss_value.push(el[p.api_text] || 'error')
                    })
                  }
                }
              } else {
                if(p.labelInValue) {
                  // labelInValue true and not multi
                  s_value ? s_value.key = s_value[p.api_text] || Configer.nanoid(5) : Configer.nanoid(5);
                  ss_value = s_value || []
                } else {
                  // labelInValue false and not multi
                  ss_value = s_value
                }
              }
              return <Col span={24}  key={i+el.name}>
                <Col span={24}><label >{p.label}</label></Col>
                <Col span={24}>
                  {
                    _.isArray(_arr) ? <Select
                      onFocus={p.funcs ? p.funcs.onFocus || null : null}
                      disabled={disable || false}
                      labelInValue={p.labelInValue || false}
                      mode={p.mode || 'default'}
                      showSearch={p.showSearch || false}
                      value={ss_value}
                      placeholder={p.placeholder}
                      style={{ width: '100%' }}
                      onDeselect={(_val) => {
                        if(p.mode === 'multiple') {
                          p.labelInValue ?
                            data[el.binding] = _.filter(ss_value, o => o.key !== _val.key)
                            : data[el.binding] = _.filter(ss_value, o => o !== _val);
                          _onChange(data, _el);
                        }
                      }}
                      onSelect={(v_val, option) => {
                        let _val = option.props.item[p.api_id];
                        if(p.mode === 'multiple') {
                          if(p.labelInValue) {
                            if(Array.isArray(data[el.binding]))
                              data[el.binding].push(option.props.item);
                              else data[el.binding] = [option.props.item];
                          } else data[el.binding] = _val;
                        } else data[el.binding] = p.labelInValue ? option.props.item : _val;
                        _onChange(data, _el, data[el.binding]);
                      }}
                      filterOption={(input, option) => {
                        return option.props.value ? option.props.item[p.api_text].toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
                      }}
                    >
                      {
                        _arr.length > 0 ? _arr.map((item, i_arr) => {
                          return (
                            <Option key={item.key || i_arr} item={item} value={item.key ? item.key + '⋈' + item[p.api_id] : item[p.api_id]}>
                              <div>{item[p.api_text || 'text']}</div>
                              <div style={{fontSize: 12, color: 'grey'}}>{item[p.item_path]}</div>
                            </Option>
                          )
                        }) : null
                      }
                    </Select> : 'select is incorrect'
                  }
                </Col>
              </Col>
              break;
            case 'checkbox':

              return <Col span={24} key={i+el.name}>
                <Col span={24}>&nbsp;</Col>
                <Col span={24}>
                  <Tooltip placement="topLeft" title={ p.placeholder || ''}>
                    <Checkbox
                      checked={s_value || false}
                      onChange={(event) => {
                        data[el.binding] = event.target.checked;
                        _onChange(data, el);
                      }}
                    >{p.label}</Checkbox>
                  </Tooltip>
                </Col>
              </Col>
              break;
            case 'span':

              return <Col span={24} key={i+el.name}>
                  <Col span={24}>{ p.label || '&nbsp;'}</Col>
                  <Col span={24}>
                      {(() => {
                        switch (el.type) {
                          case 'icon':
                            let men_icon = data[el.binding] ? switchIcon(data[el.binding]).split('_') : '';
                            // return <Icon style={{ fontSize: '1.4em'}} type={data[el.binding]} />
                            return data[el.binding] ? (men_icon[0] === 'cn') ?
                                    <Icon component={MyIcons[men_icon[1]]} />
                                      : <Icon type={switchIcon(data[el.binding])} /> : <Icon type='' />
                            break;
                          default:
                            return <span>{data[el.binding]}</span>;
                            break;
                        }
                      })()}
                  </Col>
                </Col>
              break;
          }
        }
      })
    }
  }
};

/**

 * @param {*} item
 * @param {*} el
 * @param {*} config
 * @param {*} inputs - props.location.search
 * @param {*} history - props.history
 */
export const handlerGoLink = (item, el, config, inputs, history) => {
  let url = ''
  if(!el.isforevery) {
    url = QueryBuilder2(item, el, config, inputs)
  } else {
    url = QueryBuilder(item, el, config, inputs);
  };
  history.push(el.act + url);
};


export const menu_creator = () => (menu_creator, items, isParent) => {
    let model = {
      id: null,
      title: 'label',
      to: 'to',
      icon: 'icon'
    };
    if(Array.isArray(items)) if(items.length > 0) {
      return items.map((el,i) => {
        let men_icon = el[model.icon] ? switchIcon(el[model.icon]).split('_') : '';
        if(el.childs && el.childs > 0) {
          return <SubMenu
              key={el.id || i+'user'}
              title={
                <span>
                  { el[model.icon] ? (men_icon[0] === 'cn') ?
                      <Icon component={MyIcons[men_icon[1]]} />
                    : <Icon type={switchIcon(el[model.icon])} /> : <Icon type='' />  }
                    <span>{(el.istitle)? el[model.title] : null }</span>
                    {(el.ws)? <b style={{color:'blue'}}>{' ' + el.notif_count}</b> : null}
                </span>
              }
            >
              { menu_creator(menu_creator, el.items || [], el.childs > 0) }
            </SubMenu>
        } else {
          return <Menu.Item key={el.id || i+'user'}>
            <Link to={el[model.to]} title={ el[model.title] }>
              { el[model.icon] ? (men_icon[0] === 'cn') ?
                  <Icon component={MyIcons[men_icon[1]]} />
                : <Icon type={switchIcon(el[model.icon])} /> : <Icon type='' />  }
              <span>{(el.istitle)? el[model.title] : null }</span>
              {(el.ws)? <b style={{color:'blue'}}>{' ' + el.notif_count}</b> : null}
            </Link>
          </Menu.Item>
        }
      })
    } else return null;
};
