import React from 'react';
import _ from 'lodash';
import { Icon, Row, Col, Layout, Spin, Divider, Popconfirm, Card, Button, Modal } from 'antd';
const ButtonGroup = Button.Group;
const { Content } = Layout;

import MyHeader from 'src/pages/layout/header';
import enhance from './enhance';

import { Configer } from 'src/libs/methods';

const new_col = {
  "path":null,
  "heigh":null,
  "width":null
}

const Compo = ({
  views, renderJson, ready, handlerSaveForm,
  values, handlerValues, changeValues,
  helper, changeHelper, handlerValuesHelper
}) => {
  const api_data = {
    views: views || []
  }
  return [
    <MyHeader key='s1' title={''}>
      <Button type='dashed' icon='save' onClick={handlerSaveForm}>Save</Button>
    </MyHeader>,
    <Spin key='s2' spinning={!ready}>
      <Content
        className={`content_app get_one_form`}
      >
        {
          ready ? [<Col key='s1' style={{ marginBottom: '8px'}}>
            {
              Configer.render(renderJson.basic, null, values, handlerValues, api_data)
            }
          </Col>,
          <Divider key='s2' />,
          <Col key='s3' style={{ marginBottom: '8px'}}>
            {
              values.config ? values.config.length > 0 ? values.config.map((el, i) => {
                let _width = 24;
                return [
                <Row key={'sr_i_' + i} gutter={8} >
                  {
                    el.cols.map((col, i_col) => {
                      col.width = col.width ? parseInt(col.width) : col.width;
                      if(i_col === 0)
                        _width = el.cols.length > 0 ?
                          _width - col.width
                          : 24;
                        else _width = _width - col.width;
                      let width = i_col === 0 ? 24 : Math.floor(el.cols.length > 1 ? 24 - _width : 24);

                      return <Col key={'col_d_' + i_col} span={col.width || width}>
                        <div style={{
                            position: 'absolute',
                            right: '0px',
                            height: '100%',
                            width: '2px',
                            background: 'rgba(24, 144, 255, 0.38)',
                          }}
                        >
                          <Button type='primary' icon="plus" shape="circle" size='small' style={{
                            top: '-20px',
                            left: '-11px',
                            zIndex: 1
                          }} onClick={()=>{
                              let s = {...new_col};
                              s.rownum = el.cols.length + 1;
                              s.width = _width;

                              el.cols.splice(i_col+1, 0, s);
                              changeValues(values);

                              helper.col = {...s};
                              helper.col_origin = s;
                              helper.new_col = i_col+1;
                              changeHelper(helper);
                            }}
                          />
                        </div>
                        <Card
                          size='small'
                          style={{ marginRight: '2px'}}
                          title={Configer.searchByString(col, 'path,title') || '--Not found--'}
                          extra={[
                            <Icon key='sawe_1' type="setting" title='Settings' onClick={()=>{
                              helper.col = {...col};
                              helper.col_origin = col
                              changeHelper(helper);
                              // helper.col_origin = values.config[i].cols[i_col];
                            }}/>,
                            <Divider key='sawe_2' type="vertical" />,
                            <Popconfirm
                              key='sawe_3'
                              title="Delete?"
                              onConfirm={()=>{
                                el.cols.splice(i_col, 1);
                                if(_.isEmpty(el.cols)) {
                                  values.config.splice(i, 1);
                                };
                                handlerValues(values);
                              }}
                              okText="YEs"
                              cancelText="No"
                            >
                              <Icon title='Delete' type='delete'/>
                            </Popconfirm>
                          ]}
                        >
                          {
                            helper.col ? helper.col_origin === col ?
                                <Modal
                                  title=""
                                  visible={true}
                                  onOk={() => {
                                    if(helper.new_col) {
                                      // add col
                                      values.config[i].cols[helper.new_col] = {...helper.col};
                                    } else {
                                      // edit col
                                      values.config[i].cols[i_col] = {...helper.col};
                                    }
                                    helper.col = null;
                                    helper.new_col = null;
                                    changeHelper(helper);
                                    changeValues(values);
                                  }}
                                  onCancel={() => {
                                    if(helper.new_col) {
                                      values.config[i].cols.splice(helper.new_col, 1);
                                      changeValues(values);
                                    }
                                    helper.col = null;
                                    helper.new_col = null;
                                    changeHelper(helper);
                                  }}
                                >
                                  { Configer.render(renderJson.views, null, helper.col, (val, elem) => handlerValuesHelper(val, elem, 'col'), api_data) }
                                </Modal>
                              : null : null
                          }

                        </Card>
                      </Col>
                    })
                  }
                </Row>,
                <div key={'sr_s_' + i} style={{
                    width: '20%',
                    height: '2px',
                    background: 'rgba(24, 144, 255, 0.38)',
                    margin: '2px 0px'
                  }}
                >
                  <Button type='primary' icon="plus" shape="circle" size='small' style={{
                    top: '-11px',
                    left: '-8px',
                    zIndex: 1
                  }} onClick={()=>{
                      let new_row = {
                        "cols":[{
                            "rownum":1,
                            "path":null,
                            "heigh":null,
                            "width":null
                          }]
                      };
                      let s = {...new_row};
                      s.rownum = el.rownum + 1;
                      values.config.splice(i+1, 0, s);
                      changeValues(values);
                    }}
                  />
                </div>
                ]
              }) : <div style={{
                    width: '20%',
                    height: '2px',
                    background: 'rgba(24, 144, 255, 0.38)',
                    margin: '2px 0px'
                  }}
                >
                  <Button type='primary' icon="plus" shape="circle" size='small' style={{
                    top: '-11px',
                    left: '-8px',
                    zIndex: 1
                  }} onClick={()=>{
                      let new_row = {
                        "cols":[{
                            "rownum":1,
                            "path":null,
                            "heigh":null,
                            "width":null
                          }]
                      };
                      let s = {...new_row};
                      s.rownum = 1;
                      values.config = [s];
                      changeValues(values);
                    }}
                  />
                </div> : <div style={{
                    width: '20%',
                    height: '2px',
                    background: 'rgba(24, 144, 255, 0.38)',
                    margin: '2px 0px'
                  }}
                >
                  <Button type='primary' icon="plus" shape="circle" size='small' style={{
                    top: '-11px',
                    left: '-8px',
                    zIndex: 1
                  }} onClick={()=>{
                      let new_row = {
                        "cols":[{
                            "rownum":1,
                            "path":null,
                            "heigh":null,
                            "width":null
                          }]
                      };
                      let s = {...new_row};
                      s.rownum = 1;
                      values.config = [s];
                      changeValues(values);
                    }}
                  />
                </div>
            }
          </Col>]
        : null}
      </Content>
    </Spin>
  ]
};

export default enhance(Compo);
