import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router';

import * as moment from 'moment';
moment.locale('ru-Ru');
import locale from 'antd/es/date-picker/locale/ru_RU';

import {
  DatePicker, Row, Col, Button,
  Layout, Pagination, Input, Spin,
  Card, Icon, notification
} from 'antd';

const { Content } = Layout;

import { handlerGoLink, visibleCondition, Configer } from 'src/libs/methods';
import MyHeader from 'src/pages/layout/header';
import ActionsBlock from 'src/pages/layout/actions';
import enhance from './enhance';
import FilterList from './components/filter-list';
import { Collapse } from 'antd';
import FileGallery from 'src/components/file_gallery';
import { QueryBuilder } from 'src/libs/methods';
import List from 'src/pages/list';

import Select from '../Getone/components/select';
import MultiSelect from '../Getone/components/multiselect';
import Typeahead from '../Getone/components/typehead';
import MultiTypehead from '../Getone/components/multitypehead';
import Getone from 'src/pages/Getone';

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

const { Panel } = Collapse;
const keyTable = Configer.nanoid();

const TableComp = ({
  origin = {}, history, ready, allProps, getData,
  basicConfig, pagination, handlerPaginationPage,
  filters, filter, changeFilter, isorderby,
  listData = [], listColumns, listActions,
  listConfig, params, changeFilters,
  compo, loading, changeLoading,
  ts, type_list, handlerGetTable,
  changeTS, set_state, location,
  get_params, onChangeInput, expandState,
  collapseAll, onChangeCollapse, localChangeCollapse,
  localActiveKey, changePagination, changeChecked, checked
}) => {
  if (ready) {
    let settings_table = ((JSON.parse(localStorage.getItem('usersettings')) || {'views':{}})['views']|| {})[location.pathname] || {};

		let arr_hide = settings_table.hide || [];
    // -----------------------------
    function showTotal(total) {
      return allProps.isfoundcount ? `count: ${total}` : '';
    }
    let filter_show = _.isArray(allProps.filters)
      ? !_.isEmpty(allProps.filters)
        ? true
        : false
      : false;
    // -----------------------------
    let pagin = f => (
      <Row >
        <Col span={20}>
          {allProps.pagination ? (
            <Pagination
              pageSizeOptions={['10', '20', '30', '40', '100']}
              current={pagination.pagenum} pageSize={pagination.pagesize}
              total={pagination.foundcount} showSizeChanger={allProps.ispagesize}
              size='small' showTotal={showTotal}
              onChange={handlerPaginationPage} onShowSizeChange={handlerPaginationPage}
            />
          ) : null}
        </Col>
        <Col span={4}>
          <Button
            type='dashed'
            style={{ float: 'right' }}
            icon='filter'
            onClick={() => changeFilter(!filter)}
          />
          <FilterList
            getData={getData} allProps={allProps} path={location.pathname}
            filter={filter} changeFilter={changeFilter} filters={filters}
            changeFilters={changeFilters} listConfig={listConfig}
            listColumns={listColumns} changeLoading={changeLoading}
            arr_hide={arr_hide} handlerGetTable={handlerGetTable}
            changeTS={changeTS} basicConfig={basicConfig}
						pagination = {pagination}	changePagination = {changePagination}
          />
        </Col>
      </Row>
    );
    const rows = [];

    const columns2 = [];

    listConfig.forEach((item, ind) => {
			if (item.key == '__checker__') {
				columns2.push({
					dataField: item.key,
					text: item.title,
					title:  item.title,
					editable:false,
					headerFormatter: () => (
						<input
							onChange={(e)=>{
								let id_key = listConfig.filter((conf) => conf.col.toLowerCase() === 'id' && !conf.related)[0].key
								let chckd = [] // this is new checked array
								if (e.target.checked) {
									listData.forEach((col) => {
 								 		chckd.push(col[id_key])
 								 });
								}
								changeChecked(chckd)
							}}
							type='checkbox' />

					)
				})
			}

      if (item.visible && arr_hide.filter(hCol => hCol === item.title).length === 0 && item.key !== '__checker__') {
        const isEditableClass = (editable) => {
          if (editable) {
            return 'editable'
          } else {
            return ''
          }
        }
        let classname = item.classname + isEditableClass(item.editable)    
		columns2.push({
          dataField: item.key, text: item.title, title: () => item.title,
          events: {
            onDoubleClick: (e, column, columnIndex, row, rowIndex) => {
              let action = _.find(
                listActions,
                x =>
                  x.ismain === true &&
                  visibleCondition(listData[rowIndex], x.act_visible_condition, params.inputs)
              );
              if (action) {
                switch (action.type) {
                  case 'Link':
                    handlerGoLink(listData[rowIndex], action, listConfig, params.inputs, history);
                    break;
                }
              }
            }
          },
          headerTitle: true,
          editable: item.editable,
          style:
            listConfig.length - 1 !== ind
              ? {
                  maxWidth: item.width,
                  minWidth: item.width,
                  border: '1px solid #c8c8c8'
                }
              : {
                  hover: 'black', maxWidth: item.width,
                  minWidth: item.width, background: '#ffe8c9',
                  border: '1px solid #c8c8c8', paddingLeft: '.857em',
                  position: 'sticky',  right: 0
                },
          searchable: true,
          headerStyle:
            listConfig.length - 1 !== ind
              ? {
                  width: item.width, maxWidth: item.width,
                  minWidth: item.width, border: '1px solid #c8c8c8'
                }
              : {
                  maxWidth: item.width, minWidth: item.width,
                  background: '#ffe8c9', color: 'black',
                  border: '1px solid #c8c8c8', paddingLeft: '.857em',
                  position: 'sticky', right: 0
                },
          classes: classname,
          headerClasses: 'ant-table-header-column ant-table-column-has-actions',
          sort: isorderby,
          sortCaret: (order, column) => {
            if (!order)
              return (
                <span style={{ fontSize: 9 }}>
                  <Icon type='caret-up' />
                  <Icon type='caret-down' />
                </span>
              );
            else if (order === 'asc')
              return (
                <span style={{ fontSize: 9 }}>
                  <Icon style={{ color: 'red' }} type='caret-up' />
                  <Icon type='caret-down' />
                </span>
              );
            else if (order === 'desc')
              return (
                <span style={{ fontSize: 9 }}>
                  <Icon type='caret-up' />
                  <Icon style={{ color: 'red' }} type='caret-down' />
                </span>
              );
            return null;
          },
          onSort: (field, order) => {
            let inputs = params.inputs;
            let desc = '';
            if (order === 'desc') desc = order;
            let orderby = [{
                col: item.col, desc: desc,
                fn: item.fn, fncols: item.fncolumns,
                related: item.related, t: item.t
              }];
            inputs['orderby'] = orderby;
            params['inputs'] = inputs;
            set_state({ params: params }, getData(getData));
          },
          editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => {
            let colValItem = listData[rowIndex];
            let colVal = colValItem[column.dataField];

            switch (item.type) {
              case 'text':
              case 'number':
              case 'password':
                return (
                  <Input
                    type={item.type}
                    value={colVal ? colVal : ''}
                    onChange={e => {
                      listData[rowIndex][column.dataField] = e.target.value;

                      set_state({ listData: listData });
                      //onChangeData(event, item)
                    }}
                    onBlur={e => onChangeInput(e.target.value, item, rowIndex)}
                  />
                );
                break;
              case 'checkbox':
                return (
                  <Input
                    type={item.type}
                    checked={colVal}
                    onChange={e => {
                      listData[rowIndex][column.dataField] = e.target.checked;
                      onChangeInput(e.target.checked, item, rowIndex);
                      set_state({ listData: listData });
                    }}
                  />
                );
                break;
              case 'date':
                return (
                  <DatePicker
                    value={colVal ? moment(colVal, 'DD.MM.YYYY') : null}
                    onChange={(f, e) => {
                      listData[rowIndex][column.dataField] = e; //.target.value
                      onChangeInput(e, item, rowIndex);
                      set_state({ listData: listData });
                    }}
                    locale={locale}
                    format='DD.MM.YYYY'
                  />
                );
                break;
              case 'datetime':
                return (
                  <DatePicker
                    value={colVal ? moment(colVal, 'DD.MM.YYYY HH:mm') : null}
                    onChange={(f, ev) => {
                      listData[rowIndex][column.dataField] = e; //.target.value
                      onChangeInput(ev, item, rowIndex);
                      set_state({ listData: listData });
                    }}
                    locale={locale}
                    format='DD.MM.YYYY HH:mm'
                  />
                );
              case 'select':
              case 'select_api':
                return (
                  <Select
                    name={Configer.nanoid(5)} config={item}
                    data={colValItem} inputs={params.inputs}
                    onChangeInput={e => {
                      listData[rowIndex][column.dataField] = e; //.target.value
                      set_state({ listData: listData });
                      onChangeInput(e, item, rowIndex);
                    }}
                    location={location} globalConfig={listConfig}
                  />
                );
                break;
              case 'multiselect':
              case 'multiselect_api':
                return (
                  <MultiSelect
                    name={Configer.nanoid(5)} config={item}
                    data={colValItem} inputs={params.inputs}
                    onChangeInput={e => {
                      listData[rowIndex][column.dataField] = e; //.target.value
                      onChangeInput(e, item, rowIndex);
                      set_state({ listData: listData });
                    }}
                    location={location} globalConfig={listConfig}
                  />
                );
              case 'typehead':
              case 'typehead_api':
                return (
                  <Typeahead
                    name={Configer.nanoid(5)} config={item}
                    data={colValItem} inputs={params.inputs}
                    onChangeInput={e => {
                      listData[rowIndex][column.dataField] = e; //.target.value
                      onChangeInput(e.value, item, rowIndex);
                      set_state({ listData: listData });
                    }}
                    location={location} globalConfig={listConfig}
                  />
                );
                break;
              case 'multitypehead':
              case 'multitypehead_api':
                return (
                  <MultiTypehead
                    name={Configer.nanoid(5)} config={item}
                    data={colValItem} inputs={params.inputs}
                    onChangeInput={e => {
                      listData[rowIndex][column.dataField] = e; //.target.value
                      onChangeInput(e, item, rowIndex);
                      set_state({ listData: listData });
                    }}
                    location={location} globalConfig={listConfig}
                  />
                );
                break;
              default:
                return (
                  <input
                    value={colVal}
                    onChange={e => {
                      listData[rowIndex][column.dataField] = e.target.value;
                      set_state({ listData: listData });
                    }}
                    onBlur={e => onChangeInput(e.target.value, item, rowIndex)}
                  />
                );
            }
          }
        });
      }
    });
    listData.forEach((item, ind) => {
      let newItem = {};
      Object.keys(item).forEach(k => {
        let config = listConfig.filter(conf => conf.key === k)[0];
        let value = item[k];

        const colorRow = (args, config) => {
          /*
                function for type colorrow
                painting row in seleted color
              */
          let colorrowtitle;
          if (config.filter(x => x.type === 'colorrow').length > 0)
            colorrowtitle = config.filter(x => x.type === 'colorrow')[0].key;
          return args[colorrowtitle];
        };

        if (config && config.visible) {
          if (config.type === 'image' || config.type === 'images' || config.type === 'gallery') {
            newItem[k] = <FileGallery files={value || []} />;
          } else if (
            config.type === 'file' ||
            config.type === 'files' ||
            config.type === 'filelist'
          ) {
            newItem[k] = (
              <ul>
                {(value || []).map(x => (
                  <li key={x.uri}>
                    <div>
                      <div>{x.filename}</div>
                      <div>
                        <a target='_blank' rel='noopener noreferrer' href={x.uri}>
                          download
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            );
          } else if (config.type === 'link') {
            newItem[k] = (
              <div>
                {typeof value !== 'object' ? (
                  <a href={value} target='_blank' rel='noopener noreferrer'>
                    {' '}
                    {value}
                  </a>
                ) : (
                  <a href={(value || { link: '' }).link}
									 	 target={(value || {target:null}).target || '_blank'} rel='noopener noreferrer'>
                    {(value || { title: '' }).title}
                  </a>
                )}
              </div>
            );
          } else if (config.type === 'color' || config.type === 'colorpicker') {
            newItem[k] = <div style={{ width: 20, height: 20, backgroundColor: value }} />;
          } else if (config.type === 'select') {
            if (
              config.relation && config.relationcolums &&
              config.relationcolums.length > 0 &&
              config.relationcolums.filter((rlt) => rlt.value !== 'id').length>0 &&
              config.relationcolums.filter((rlt) => rlt.value !== 'id')[0].value
            ) {
                  let sel_col = config.relationcolums.filter((rlt) => rlt.value !== 'id')[0].value
                  let sel_key = (listConfig.filter((lc_) => lc_.col === sel_col && lc_.table === config.relation)[0]||{}).key
                  value = item[sel_key]
                  newItem[k] = (
                    <div style={{ color: colorRow(item, listConfig) }}>
                      {value !== undefined && value !== null ? (
                        typeof value === 'object' ? (
                          <span>{JSON.stringify(value)}</span>
                        ) : (
                          value.toString().split('\n').map((it, key) => {
                              return (
                                <span key={key}>{it}<br /></span>
                              );
                            })
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  )
            } else {
              newItem[k] = (
                <div style={{ color: colorRow(item, listConfig) }}>
                  {value !== undefined && value !== null ? (
                    typeof value === 'object' ? (
                      <span>{JSON.stringify(value)}</span>
                    ) : (
                      value.toString().split('\n').map((it, key) => {
                          return (
                            <span key={key}>{it}<br /></span>
                          );
                        })
                    )
                  ) : (
                    ''
                  )}
                </div>
              )
            }
          } else if (config.type === 'array') {
            newItem[k] = (
              <div>
                {value.length > 0 ? (
                  <Collapse defaultActiveKey={['1']}>
                    <Panel header={config.title} key='1'>
                      <table>
                        <thead>
                          <tr>
                            {Object.keys(value[0] || {}).map(i => {
                              return <th key={i}>{i}</th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {value.map(it => {
                            return (
                              <tr key={JSON.stringify(it)}>
                                {Object.keys(it).map(i => {
                                  return <td key={i}>{it[i]}</td>;
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </Panel>
                  </Collapse>
                ) : (
                  <div />
                )}
              </div>
            );
          }
					else if (config.type === 'checkbox') {
						newItem[k] = (
							<div>
								<input type='checkbox' disabled checked={value} />
							</div>
						);
					}
					else {

            newItem[k] = (
              <div style={{ color: colorRow(item, listConfig) }}>
                {value !== undefined && value !== null ? (
                  typeof value === 'object' ? (
                    //JSON.stringify()
                    <span>{JSON.stringify(value)}</span>
                  ) : (
                    value
                      .toString()
                      .split('\n')
                      .map((it, key) => {
                        return (
                          <span key={key}>
                            {it}
                            <br />
                          </span>
                        );
                      })
                  )
                ) : (
                  ''
                )}
              </div>
            );
          }
        }
      });
      let paramS = get_params();
      newItem['__actions__'] = (
        <ActionsBlock
          actions={listActions || []} origin={origin || {}}
          data={item || {}} params={paramS}
          history={history} location={location}
          getData={() => getData(getData, filters)}
          type='table' checked={checked}
        />
      );
      newItem['id'] = ind;
			const isCheckedRow = (item) => {
				let id_key = listConfig.filter((conf) => conf.col.toLowerCase() === 'id' && !conf.related)[0].key
				if (checked.filter((ch) => item[id_key] === ch).length>0) {
						return true
				}
				return false
			}
			newItem['__checker__'] = (
				<div>
					<input
						checked={isCheckedRow(item)}
						onChange={(e) => {
							let id_key = listConfig.filter((conf) => conf.col.toLowerCase() === 'id' && !conf.related)[0].key
							let Id = item[id_key]
							let chckd = checked
							if (e.target.checked) {
								chckd.push(Id)
							} else {
								chckd = chckd.filter((ch) => ch !== Id)
							}

							changeChecked(chckd)
						}}
						type='checkbox' />
				</div>
			)

      rows.push(newItem);
		});

    const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    };


    const expandRow = {
      renderer: (row, rowIndex) => {
        let expandAct = origin.acts.filter(x => x.type === 'Expand')[0];
        let inputs = {};
        let search = {};

        if (expandAct) {
          inputs = QueryBuilder(listData[rowIndex], expandAct, listConfig, history);
          search = { search: inputs, pathname: expandAct.act };
          const typeContent = expandAct.act.split('/')[1];

          switch (typeContent) {
            case 'list':
              return (
                <div>
                  <List
                    compo={true} location={search}
                    path={expandAct.act.split('/')[2]}
                    id_page={expandAct.act.split('/')[2]}
                  />
                </div>
              );
            case 'getone':
              return (
                <div>
                  tabForm
                  <Getone
                    compo={true} location={search}
                    path={expandAct.act.split('/')[2]}
                    id_page={expandAct.act.split('/')[2]}
                  />
                </div>
              );
            default:
              const openNotification = () => {
                notification.open({
                  message: `type ${typeContent} not correct  `,
                  description: 'use list or getone'
                });
              };
              return openNotification;
          }
        }
      },
      expanded: expandState,
      onExpand: (row, isExpand, rowIndex, e) => {
        let expandAct = origin.acts.filter(x => x.type === 'Expand')[0];

        if (expandAct) {
          const copyExpandState = [...expandState];
          const rowId = row.id;
          const indexRowToState = copyExpandState.findIndex(it => it === rowId);

          isExpand
            ? copyExpandState.includes(rowId)
              ? null
              : copyExpandState.push(row.id)
            : copyExpandState.splice(indexRowToState, 1);
          set_state({ expandState: copyExpandState });
        }
      }
    };



    function renderBlock() {
      return (
        <>
          {compo ? (
            <ActionsBlock
              key='sd1' actions={origin.acts}
              origin={origin} data={listData}
              params={params} history={history}
              location={location} getData={getData}
							checked={checked}
            />
          ) : null}
          {pagin(filter_show)}
          <div key='sd2' className='size_table'>
            <Spin spinning={loading} tip='loading...'>
              { origin.viewtype === 'tiles' ? (
                  <div className={
										!allProps.classname || allProps.classname === ''
											? 'fr_tiles'
											: allProps.classname
										}>
                    {(ready ? rows : []).map((el, i) => {
                      return (
                        <Card key={'tile_' + i} style={{ marginBottom: '5px' }}	>
                          <Col >
                            {listConfig.filter((cnf) => cnf.key !== 'rownum').map((conf, ind) => {
                              return conf.visible === true ? (
                                <div> {(conf.key !== '__actions__')? (
																		<Col
		                                  span={conf.width || 12} key={'lfa_' + ind}
																			className={conf.classname}
		                                  style={{ borderBottom: '1px dashed #ececec' }}
																			onDoubleClick = {() => {

														              let action = _.find(listActions, x =>
														                  x.ismain === true &&
														                  visibleCondition(el, x.act_visible_condition, params.inputs)
														              );
														              if (action) {
														                switch (action.type) {
														                  case 'Link':
														                    handlerGoLink(listData[i], action, listConfig, params.inputs, history);
														                    break;
														                }
														              }
														            }
																			}
		                                >
																				<div>
																					<div><b>{conf.title + ': '}</b></div>
			                                  	<div>{el[conf.key]}</div>
																				</div>
		                                </Col>
																	) : (
																		<Col
		                                  span={24} key={'lfa_' + ind}
		                                  style={{ borderBottom: '1px dashed #ececec' }}
		                                >
			                                  <div className='tiles_actions'>{el[conf.key]}</div>
		                                </Col>
																	)
																}

																</div>
                              ) : null;
                            })}
                          </Col>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <React.Fragment key={keyTable}>
                    <div style={{ overflowX: 'auto' }}>
                      <BootstrapTable
                        classes={
                          !allProps.classname || allProps.classname === ''
                            ? 'tabtab list_table'
                            : allProps.classname
                        } // try to apply CSS class
                        keyField={'id'} data={rows}
                        columns={columns2}
                        expandRow={(origin.acts.filter(x => x.type === 'Expand')[0])? expandRow:false }
                        noDataIndication={() => (
                          <label style={{ color: '#c1bbbb' }}>...empty...</label>
                        )}
                        cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
                      />
                      <label style={{ fontSize: '9px' }}>
                        count : {allProps.foundcount}
                      </label>
                    </div>
                  </React.Fragment>
                )}
            </Spin>
          </div>
          {pagin()}
        </>
      );
    }

    return (
      <Collapse
        activeKey={localChangeCollapse ? localActiveKey : collapseAll ? [] : ['1']}
        onChange={onChangeCollapse}
      >
        <Panel header={allProps.title.toUpperCase()} key='1'>
          <Content key='s3' className='f_content_app'>
            <h3>{params.inputs._sub_title}</h3>
            {compo ? null : (
              <MyHeader key='s1' history={history} title={''}>
                <ActionsBlock
                  actions={origin.acts} origin={origin}
                  data={listData} params={params}
                  history={history} location={location}
                  getData={getData} checked={checked}
                />
              </MyHeader>
            )}
            {compo ? (
              <div className='f_content_app'> {renderBlock()} </div>
            ) : (
              <Card key='s2' size='small' style={{ margin: compo ? '' : '10px' }}>
                {renderBlock()}
              </Card>
            )}
          </Content>
        </Panel>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .ant-collapse-content-box {padding:0 !important}
          .tabtab {
            border-collapse: collapse;
            width: 100%;
          }
        `
          }}
        ></style>
      </Collapse>
    );
  } else
    return (
      <Row
        style={{
          textAlign: 'center', background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px', marginBottom: '20px',
          padding: '150px 30px', margin: '20px 0'
        }}
      >
        {' '}
        <Spin />{' '}
      </Row>
    );
};

export default enhance(withRouter(TableComp));
