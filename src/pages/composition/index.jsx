import React, { useState, useEffect } from 'react';
import { Spin, Row, Col, Button } from 'antd';
import MyHeader from 'src/pages/layout/header';

import List from 'src/pages/list';
import GetOne from 'src/pages/Getone';

import { Get } from 'src/libs/api';


const CompositionNew = ({ history, path, compo, location, match }) => {

  let [_state, setState] = useState({}),
    { loading = false, values = {}, id_page = null, init = false, btnCollapseAll = false } = _state;
  function set_state(obj) {
    let st = {..._state},
      keys = _.keys(obj);

    keys.map( k => { st[k] = obj[k] });
    setState(st);
  };

  function getData(_id, type) {
    Get('/api/compobypath', {
      path: _id
    }).then((res) => {
			document.title = res.data.outjson.title;
      set_state({
        id_page: _id,
        loading: false,
        init: type ? true : init,
        values: {...res.data.outjson}
      });
    });
  };
  let _id = compo ? path : match.params.id;

  function collapseActivityState(){
    set_state({btnCollapseAll: !btnCollapseAll});
  }

  useEffect(() => {
    if(id_page !== _id && id_page !== null) {
      setState({
        loading: true,
        values: {}
      });
      getData(_id);
    } else {
      _.isNull(id_page) ? getData(compo ? path : match.params.id, 'init') : null;
    }
  }, [_id]);

    return <div
      tabIndex={0}
      onKeyDown={e => {
        if(e.keyCode === 48 && e.altKey && e.ctrlKey) {
          collapseActivityState()
        }
      }}
      >
    {!compo ? <MyHeader key='s1' history={history} title={''}>
    </MyHeader> : null }
    <Row
      key='s2'
      style={{ margin: '0 10px' }}
    >
      <div style={{display: 'flex', justifyContent: 'right', padding: '10px 0'}}>
        <Button
          type='primary'
					ghost
          size='small'
          onClick={ collapseActivityState }
          icon = {btnCollapseAll ? 'plus-square' : 'minus-square'}
        >
          { !btnCollapseAll ? 'Свернуть' : 'Развернуть' } все
        </Button>
      </div>
      <Spin tip='Loading...' spinning={loading || false}>
        {
          id_page === _id ? !loading ? values.config ? _.isArray(values.config) ? values.config.map((Item, ikf) => {
            return <Row key={ikf} gutter={8} type='flex' justify='center' align='middle'>
              {Item.cols.map((x, isk) => {
                return <Col key={isk} span={x.width || 24}>
                  {(() => {	switch(x.path.viewtype) {
                    case 'table':
                    case 'tiles':
                      return <List compo = {true} path = {x.path.path} history = {history} location={location} btnCollapseAll={btnCollapseAll} />
                    case 'form full':
                    case 'form not mutable':
                      return <div>
                        <h4>{ null }</h4>
                        <GetOne compo = {true} path = {x.path.path}  history = {history} location={location} values={values} btnCollapseAll={btnCollapseAll} />
                      </div>

                  }})()}
                </Col>
              })}
            </Row>
          }) : null : null : null : null
        }
      </Spin>
    </Row>
  </div>

}

export default CompositionNew;
