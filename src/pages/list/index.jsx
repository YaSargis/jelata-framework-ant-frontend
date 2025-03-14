import React from 'react'
import _ from 'lodash'
import {
	Row, Col, Layout, Spin, Card, Collapse, Icon
} from 'antd'

const { Content } = Layout

import { handlerGoLink, visibleCondition } from 'src/libs/methods'
import MyHeader from 'src/pages/layout/header'
import ActionsBlock from 'src/pages/layout/actions'

import FilterList from './components/filters'

import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory from 'react-bootstrap-table2-editor'
import {listConfigGenerate} from './components/listConfig'
import {listDataGenerate} from './components/listData'
import {PegiNation} from './components/pagination'
import { expandRowGenerator } from './components/expandRow'
import enhance from './enhance'


const { Panel } = Collapse
const keyTable = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15 >> c/4).toString(16))
let tCount = (((LaNg || {}).tCount ||{})[LnG || 'EN'] || 'count')
let Empty = (((LaNg || {}).Empty ||{})[LnG || 'EN'] || 'empty')
const TableComp = ({
	origin = {}, history, ready, allProps, getData,
	pagination, handlerPaginationPage,
	filters, filter, changeFilter, isorderby,
	listData = [], listColumns, listActions,
	listConfig, params, changeFilters,
	compo, loading, changeLoading, handlerGetTable, set_state, location,
	get_params, onChangeInput, expandState,
	collapseAll, onChangeCollapse, localChangeCollapse,
	localActiveKey, changePagination, changeChecked, checked, onSaveRow
}) => {
	if (ready) {
		
		const settings_views = JSON.parse( localStorage.getItem('usersettings')) || {'views':{}}
		let settings_table = ( settings_views['views'] || {} )[location.pathname] || {}

			let arr_hide = settings_table.hide || []
		// -----------------------------
		function showTotal(total) {
			return allProps.isfoundcount ? `count: ${total}` : ''
		}

		let pagin = PegiNation(
			allProps, location, listConfig, listColumns, arr_hide, filter,
			pagination, filters, showTotal, handlerPaginationPage, changePagination, getData,
			changeFilter, changeFilters, changeLoading, handlerGetTable, params
		)
		const rows = listDataGenerate(
			listData, listConfig, listActions, filters, origin, history, location,
			checked, getData, get_params, changeChecked, changeLoading
		)

		const columns2 = listConfigGenerate(
			listConfig, listData, listActions, arr_hide, params, history, isorderby,
			changeChecked, set_state, onChangeInput, getData 
		)

		const expandRow = expandRowGenerator (
			listData, params, listConfig, history, origin, expandState, set_state
		)

		function renderBlock() {
			return (
				<>
					{compo ? (
						<ActionsBlock
							key='sd1' actions={origin.acts}
							origin={origin} data={listData}
							params={params} history={history}
							location={location} getData={getData}
							checked={checked} setLoading = {changeLoading}
						/>
					) : null}
					{pagin}
					<div key='sd2' className='size_table'>
						<Spin spinning={loading} tip='loading...'>
							{origin.viewtype === 'tiles' ? (	// ветка плиток (tiles)
								<div
									className={
										!allProps.classname || allProps.classname === ''? 'fr_tiles'
										: allProps.classname
									}
								>
									{( ready ? rows : []).map((el, i) => {
										return (
											<Card key={'tile_' + i} className='tiles_el'>
												<Col>
													{listConfig.filter((cnf) => cnf.key !== 'rownum').map((conf, ind) => {
														return conf.visible === true ? (
															<div> {
																(conf.key !== '__actions__')? (
																	<Col
																		span={conf.width || 12} key={'lfa_' + ind}
																		className={conf.classname}
																		style={{ borderBottom: '1px dashed #ececec' }}
																		onDoubleClick = {() => {
																			let action = _.find(listActions, x =>
																				x.ismain === true && visibleCondition(el, x.act_visible_condition, params.inputs)
																			)
																			if (action) {
																				switch (action.type) {
																					case 'Link':
																						handlerGoLink(listData[i], action, listConfig, params.inputs, history)
																						break
																				}
																			}
																		}}
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
														) : null})}
												</Col>
											</Card>
										)})
									}
								</div>
							) : ( 
								<React.Fragment key={keyTable}>
									<div style={{ overflowX: 'auto' }}>
										<label
											style={{ fontSize: '9px' }}
										>
											{tCount} : {allProps.foundcount}
										</label>
										<BootstrapTable
											 classes={
											 !allProps.classname || allProps.classname === ''
											 ? 'tabtab list_table'
											 : allProps.classname
											 } // try to apply CSS class
											 keyField={'id'} data={rows} columns={columns2}
											 expandRow={(origin.acts.filter(x => x.type === 'Expand')[0])? expandRow : {} }
											 noDataIndication={() => (
											 <label style={{ color: '#c1bbbb' }}>{Empty}</label>
											 )}
											 cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
										 />
										<label
											style={{ fontSize: '9px' }}
										>
											{tCount} : {allProps.foundcount}
										</label>
									 </div>
								</React.Fragment>
							)}
						</Spin>
					 </div>
					{pagin} 
				 </>
			)
		}

		return (
			<Collapse
				activeKey={localChangeCollapse ? localActiveKey : collapseAll ? [] : ['1']}
				onChange={onChangeCollapse}
			>
				<Panel header={allProps.title.toUpperCase()} key='1'>
					<Content key='s3' className='f_content_app'>
					<h3>{params.inputs._sub_title}</h3>
					<Row style={{display:'flex'}}>
						<ActionsBlock
							actions={origin.acts} origin={origin}
							data={listData} params={params}
							history={history} location={location}
							getData={getData} checked={checked}
							setLoading = {changeLoading} position={2}
						/>
					</Row>
					{(allProps.filters.filter((f) => f.position === 2).length > 0)?
						<Collapse style={{ margin: '10px'}} expandIcon={({ isActive })=>(
								<div style={{color:(isActive)?'black':'#1890ff'}}>
									<Icon type='filter' />
								</div>
							)} >
							<Panel key = 'fltrup1'>
								
									<FilterList
										getData={getData} allProps={allProps} path={location.pathname}
										filter={filter} changeFilter={changeFilter} filters={filters}
										changeFilters={changeFilters} listConfig={listConfig}
										listColumns={listColumns} changeLoading={changeLoading}
										arr_hide={arr_hide} handlerGetTable={handlerGetTable}
										pagination = {pagination}	changePagination = {changePagination}
										styleType='up' params={params}
									 />
								
							</Panel>
						</Collapse>
						: null
					}
						{compo ? null : (
							<MyHeader key='s1' history={history} title={''}>
								<ActionsBlock
									actions={origin.acts} origin={origin}
									data={listData} params={params}
									history={history} location={location}
									getData={getData} checked={checked}
									setLoading = {changeLoading}
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
							.tabtab { border-collapse: collapse width: 100%}
						`
					}}
				></style>
			</Collapse>
		)
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
	)
}

export default enhance(TableComp)
