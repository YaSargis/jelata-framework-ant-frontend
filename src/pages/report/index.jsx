import React from 'react'
import enhance from './enhance'
import { Card, Button, Input, AutoComplete, Col } from 'antd'
import Select from 'react-select'

const Report = ({ 
	values, params, set_state, inputs, selections,
	getSelectOptions, getReportFile 
}) => {
	const { title } = values
	//const { Option } = Select
	const { Option } = AutoComplete;
	let reportGenerate = (((LaNg || {}).reportGenerate ||{})[LnG || 'EN'] || 'Generate')
	return [
		<Card key='1l'>
			<h2>{title}</h2>
				{params.map((item) => {
					return (<div key={item.id+item.ptitle}>
						{(() => {
							switch(item.typename) {
								case "select":
									let ptitle = item.id + item.ptitle
									return (
										<Col span={24} key = {ptitle}>
											<div><b>{item.ptitle}</b></div>
											<Select
												styles={{container: base => ({
													...base, width: '40%'
												}),}}
												onChange = {
													(e) => {
														let inp = inputs 
														inp[item.func_paramtitle] = e
														set_state({ inputs: inp })
														
													}
												}
												defaultValue = {inputs[item.func_paramtitle]}
												onFocus = {() => getSelectOptions(ptitle,null,item.apimethod)}
												options={selections[ptitle]}
											/>
										</Col>
									)
								case "multiselect":
									return (
										<div key = {item.ptitle + item.id}>
											<div><b>{item.ptitle}</b></div>
											<Select
												isMulti
												styles={{container: base => ({
													...base, width: '70%'
												}),}}
												onChange = {(...args) => {
													let inp = inputs,
														e = args[0]
														_.isNull(e) ?
														delete inp[item.func_paramtitle]
														: inp[item.func_paramtitle] = e
														set_state({ inputs: inp })
												}}
												devaultValue = {inputs[item.func_paramtitle]}
												onFocus = {() => getSelectOptions(ptitle,null,item.apimethod)}
												options={selections[ptitle]}
											/>
										</div>
									)
								case "typehead":
									return (
										<div key = {item.title}>
											<div><b>{item.ptitle}</b></div>
											<div>
												<AutoComplete
													onFocus={() => getSelectOptions(ptitle, null, item.apimethod)}
													placeholder={item.ptitle}
													style={{ width: 600 }}
													devaultValue = {inputs[item.func_paramtitle]}
													onChange = {(e) => {
														
														//let inp = inputs
														//const findedObj = selections.find((it) => it.label===e)
														//inp[item.func_paramtitle] = findedObj
														//set_state({ /*inputs: inp,*/ substr:e })
														getSelectOptions(ptitle, e, item.apimethod)
													}}
													onSelect = {(e) => {
														
														let inp = inputs 
														inp[item.func_paramtitle] = e
														set_state({ inputs: inp })
														
													}}
												>
													{
														selections ? selections[ptitle] ? selections[ptitle].map((it) => {
															return <Option key={it.id+it.label} value={it.value.toString()}>{it.label}</Option>
														}) : [] : []
													}
												</AutoComplete>
											</div>
										</div>
									)
								default:
									return (
										<div key={item.ptitle+item.id}>
											<div><b>{item.ptitle}</b></div>
											<Input
												style={{width: '30%'}}
												onChange = {(e) => {
													let inp = inputs
													inp[item.func_paramtitle] = e.target.value
													set_state({ inputs: inp })
												}}
												defaultValue={inputs[item.func_paramtitle]}
												type = {item.typename}
												placeholder = {item.ptitle} />
										</div>
									)
							}})()
						}
					</div>
				)}
			)}
			<Button onClick={ getReportFile } style={{ marginTop: '10px'}}>
				{reportGenerate}
			</Button>
		</Card>
	]
}

export default enhance(Report)
