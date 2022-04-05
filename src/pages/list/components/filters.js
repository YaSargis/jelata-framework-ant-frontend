import React from 'react'
import {
	Row, Col, Input, Button,
	Checkbox, Tooltip, Select, DatePicker
} from 'antd'
import {compose, withHandlers, withStateHandlers} from 'recompose'
import locale from 'antd/es/date-picker/locale/ru_RU'
import moment from 'moment'
import { saveUserSettings } from 'src/libs/methods'
import { apishka } from 'src/libs/api'
let filterOK = (((LaNg || {}).filterOK ||{})[LnG || 'EN'] || 'ok')
let filterClean = (((LaNg || {}).filterClean ||{})[LnG || 'EN'] || 'clean')
const Filters = ({
	filter, filters, allProps, getData, changeLoading,
	changeFilter, handlerFilters, handlerGetTable, onOK,
	handlerTriCheck, apiData, indeterminate, changeFilters,
	pagination, changePagination, styleType, path, params
	
}) => {
	
	let position = '1'
	if (styleType === 'up')
		position = '2'
	return (
		<div>
			{
				allProps.filters ? (
					Array.isArray(allProps.filters) &&
					allProps.filters.filter((x) => x.position == position).length > 0
				) ? allProps.filters.filter((x) => x.position == position).map((p, ixs)=> {
					return ( 
						<Row key={JSON.stringify(p)}>
							{(() => {
								switch (p.type) {
									case 'substr':
										return [
											<Col key='s44' span={24}><label >{p.title}</label></Col>,
											<Col key='s33' span={24}>
												<Input.Search placeholder={p.title || '...'}
														value={filters[p.column]}
														size='small'
														onKeyUp={(event) => {
														  if(event.keyCode === 13) {
																onOK()
														  }
														}}
														onChange={(event) => handlerFilters(p.column, event.target.value) }
												/>
											</Col>
										]
									break
									case 'date_between':
										return [
												<Col key='s1' span={24}><label >{p.title}</label></Col>,
												<Col key='s2' span={24}>
													<input placeholder={p.title || '...'}
														value={filters[p.column]} type='date' 
														className = 'ant-input'
														onChange={(event) => handlerFilters(p.column, event.target.value) }
													/>
												</Col>
											]
										break
									case 'multijson':
									case 'select':
									case 'multiselect':
										let s_value
										if (p.type === 'multijson' || p.type === 'multiselect') {
											//filters[p.column] &&
											//Array.isArray(filters[p.column]) ?
												s_value = filters[p.column]//.map((x, i_c)=> {x['key'] = i_c})
												|| []
										} else s_value = filters[p.column]
										return [
											<Col key='s3' span={24}><label >{p.title}</label></Col>,
											<Col key='s4' span={24}>
												<Select
													labelInValue={(p.type === 'multijson' || p.type === 'multiselect')? true : false}
													mode={ (p.type === 'multijson' || p.type === 'multiselect') ? 'multiple' : 'default' }
													showSearch={true}
													value={filters[p.column]}
													placeholder={p.title}
													style={{ width: '100%' }}
													onFocus={()=>handlerGetTable(p)}
													onDeselect={(_val) => {
													  if(p.type === 'multijson' || p.type === 'multiselect') {
														filters[p.column] = s_value.filter(o => o && o.key !== _val.key)
														handlerFilters(p.column, filters[p.column])
													  }
													}}
													onSelect={(_val, option) => {
													  if(p.type === 'multijson' || p.type === 'multiselect') {
																	_val['value'] = _val.key
														if(Array.isArray(filters[p.column]))
														  filters[p.column].push(_val)
														  else filters[p.column] = [_val]
													  } else filters[p.column] = _val
													  handlerFilters(p.column, filters[p.column])
													}}
												  >
													{
													  apiData[p.title] ? Array.isArray(apiData[p.title]) ? (()=> {
														return apiData[p.title].map((it_m, i_arr) => {
														  return <Option key={i_arr} item={it_m} value={it_m.value}>{ it_m.label }</Option>
														})
													  })() : null : null
													}
												  </Select>
											</Col>
										]
										break
									case 'typehead':
										return [
											<Col key='s1' span={24}><label >{p.title}</label></Col>,
											<Col key='s2' span={24}>
												<Input.Search
													placeholder={p.title || '...'}
													value={filters[p.title]}
													onKeyUp={(event) => {
														if(event.keyCode === 13) {
															onOK()
														}
													}}
													onChange={(event) => handlerFilters(p.title, event.target.value) }
												/>
											</Col>
										]
										break
									case 'period':
										let _dates = [],
											_format = 'YYYY-MM-DD'
										filters[p.column] ? filters[p.column].date1 ? _dates.push(moment(filters[p.column].date1, _format)) : null : null
										filters[p.column] ? filters[p.column].date2 ? _dates.push(moment(filters[p.column].date2, _format)) : null : null
										return [
											<Col key='s1' span={24}><label >{p.title}</label></Col>,
											<Col key='s2' span={24}>
											  {/*
												value = [start date, end date]
											  */}
											  <DatePicker.RangePicker
													value={_dates}
													format={_format}
													onKeyUp={(event) => {
														if(event.keyCode === 13) {
															onOK()
														}
													}}
													locale={locale}
													onChange={(momentDates, dates) => {
														let v = {
															date1: dates[0],
															date2: dates[1],
														}
														handlerFilters(p.column, v)
													}}
											  />
											</Col>
										]
										break
										case 'check':
											return [
												<Col key='s1' span={24}><label >{p.title}</label></Col>,
												<Col key='s2' span={24}>
												  <Tooltip placement='topLeft' title={p.title || ''}>
													<Checkbox
														checked={ filters[p.column] || null}
														indeterminate={filters[p.column] === null || filters[p.column] === undefined ?true:false}
														onClick={(e)=>{
															handlerTriCheck(p.column, filters[p.column])
														 }}
													>{p.title}</Checkbox>
												  </Tooltip>
												</Col>
											]
											break
										default:
											return <Col>{p.type}</Col>
								}})()
							}
						</Row>
					)
				}) : null : null
			}
			<Row key='sawad3' gutter={4}>
				<Button type='link' icon='check' 
					onClick={onOK}
				>
					{filterOK}
				</Button>
				<Button type='link' style = {{color:'red'}} icon='close' onClick={()=>{
						let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {views:{}}
						
						let viewsSettings = {}
						if (!userSettings['views']) { // if not views key
							userSettings['views'] = {}
						}

						if (userSettings['views'][params.path]) { // if not view in views object
							viewsSettings = userSettings['views'][params.path]
						}
						viewsSettings['filters'] = {}
						userSettings['views'][params.path] = viewsSettings
						localStorage.setItem('usersettings', JSON.stringify(userSettings))
						
						saveUserSettings(userSettings)
						filters = {}
						changeFilters(filters)
						changeLoading(true)
						// changeFilter(false)
						pagination.pagenum = 1
						changePagination(pagination)
						getData(getData, {})
					}}
				>
					{filterClean}
				</Button>
			</Row>
		</div>
	)
}

const enhance = compose(
	withStateHandlers(({
		inState = {
			indeterminate: true,
			apiData: {}
		}
	}) => ({
		indeterminate: inState.indeterminate,
		apiData: inState.apiData
	}), {
		set_state: state => obj => {
			let _state = { ...state }
			_.keys(obj).map(k => {
				_state[k] = obj[k]
			});
			return _state
		}
	}),
	withHandlers({
		handlerFilters: ({ filters, changeFilters }) => (column, value) => {
			
			
			filters[column] = value
			changeFilters(filters)
		},
		handlerTriCheck: ({ filters, changeFilters, set_state }) => (column, value) => {
			if(value==null) {
				set_state({ indeterminate: false })
				filters[column] = true
				changeFilters(filters)
			}
			if(value === true) {
				filters[column] = false
				changeFilters(filters)
			}
			if(value === false) {
				set_state({ indeterminate: true })
				filters[column] = null
				changeFilters(filters)
			}
			
			
		},
		handlerGetTable: ({ apiData, set_state }) => (item) => {
			apishka('GET', {}, '/api/gettable?id=' + item.id, (res) => {
				 const _apiData = {...apiData}
				 _apiData[item.title] = res.outjson
				 set_state({ apiData: _apiData })
			})
		},
		onOK: ({getData, changePagination, changeLoading, params, filters, pagination }) => () => {
			let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {views:{}}
			console.log('patttttttth', params.path)
			let viewsSettings = {}
			if (!userSettings['views']) { // if not views key
				userSettings['views'] = {}
			}
			if (userSettings['views'][params.path]) { // if not view in views object
				viewsSettings = userSettings['views'][params.path]
			}
			viewsSettings['filters'] = filters
			userSettings['views'][params.path] = viewsSettings
			localStorage.setItem('usersettings', JSON.stringify(userSettings))
			saveUserSettings(userSettings)
			
			pagination.pagenum = 1
			changePagination(pagination)
			getData(getData)
			changeLoading(true)
		}
	})
)

export default enhance(Filters)
