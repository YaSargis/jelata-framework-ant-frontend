import React from 'react'
import {compose, withHandlers, withStateHandlers} from 'recompose'
import { apishka } from 'src/libs/api'
import _ from 'lodash'


import {
	Drawer, Row, Col, Input, Divider, Button,
	List, Checkbox, Tooltip, Select, DatePicker ,
	Collapse, Icon
} from 'antd'
import Filters from './filters'
import { saveUserSettings } from 'src/libs/methods'
let bClose = (((LaNg || {}).bClose ||{})[LnG || 'EN'] || 'close')
let shCols = (((LaNg || {}).shCols ||{})[LnG || 'EN'] || 'show/hide columns')
const { Panel } = Collapse



const FilterList = ({
	filter, filters, allProps, getData, changeLoading,
	changeFilter, changeFilters, handlerColumnHider, apiData,
	indeterminate, listColumns, arr_hide, pagination, changePagination, params,
	styleType // up, left 
}) => {
	if (styleType === 'up')
		return (
			<div>
				<Row key='sawadee2' gutter={4}>
					<Collapse
						bordered={false}
						defaultActiveKey={['up_filter']}
						expandIcon={({ isActive }) => <Icon type='caret-right' rotate={isActive ? 90 : 0} />}
					>
						<Panel header='' key='up_filter' >
							<Filters 
								filter={filter} filters={filters} allProps={allProps}
								getData={getData} changeLoading={changeLoading}
								changeFilter={changeFilter}
								apiData={apiData} indeterminate={indeterminate} changeFilters = {changeFilters}
								pagination={pagination} changePagination={changePagination} styleType={styleType} params={params}
							/>
						</Panel>
					</Collapse>
				</Row>
			</div>
		)
	else 
		return (
			<Drawer
				visible={filter} width={450}
				closable={false}
				onClose={() => changeFilter(!filter)}
				maskStyle={{backgroundColor: 'rgba(0,0,0, 0.12)'}}
			>
				<Row key='sawad1' gutter={4}>
					<Filters 
						filter={filter} filters={filters} allProps={allProps}
						getData={getData} changeLoading={changeLoading}
						changeFilter={changeFilter} 
						apiData={apiData} indeterminate={indeterminate} changeFilters = {changeFilters}
						pagination={pagination} changePagination={changePagination} styleType={styleType}  params={params}
						
					/>
				</Row>
				<Divider key='sawad2' style={{ margin: '15px 0 0 0' }}/>
				<Row key='sawad3' gutter={4}>
					<Button type='link' icon='close' style={{ color: '#ef1010' }} onClick={()=>changeFilter(false)}>{bClose}</Button>
				</Row>
				<Row key='sawad5' gutter={4}>
					<br/>
					<List
						size='small' header={<div>{shCols}</div>}
						bordered dataSource={listColumns}
						renderItem={item => {
							return (
								<List.Item>
									<Checkbox
										checked={_.findIndex(arr_hide, x => x === item.title) === -1}
										onChange={(ev) => handlerColumnHider(ev, item)}
									>
										{item.title}
									</Checkbox>
								</List.Item>
							)
						}}
					/>
				</Row>
			</Drawer>
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
		handlerColumnHider: ({ path }) => (ev, item) => {
			// userSettings from global

			let userSettings = JSON.parse(localStorage.getItem('usersettings')) || {views:{}}
			let viewsSettings = {}

			if (!userSettings['views']) { // if not views key
				userSettings['views'] = {}
			}

			if (userSettings['views'][path]) { // if not view in views object
				viewsSettings = userSettings['views'][path]
			}

			if (viewsSettings.hide) {
				let ind = _.findIndex(viewsSettings.hide, (x) => x === item.title);
				if(ind !== -1) viewsSettings.hide.splice(ind, 1); else viewsSettings.hide.push(item.title)
			} else {
				viewsSettings.hide = [item.title]
			}
			userSettings['views'][path] = viewsSettings
			localStorage.setItem('usersettings', JSON.stringify(userSettings))
			
			saveUserSettings(userSettings)
		}
	})
)

export default enhance(FilterList)