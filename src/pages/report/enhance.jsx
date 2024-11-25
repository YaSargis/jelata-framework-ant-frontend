import { compose, withStateHandlers, withHandlers, lifecycle } from 'recompose'
import { apishka } from 'src/libs/api'

const enhance = compose(
	withStateHandlers(({
		  inState = {
			values: {}, params: [], inputs: {}, selections: []
		  }
		}) => ({
			 values: inState.values, params: inState.params, inputs: inState.inputs, selections: inState.selections   // helper { ptitle: {} | [] } - для селекта []
		}), {
			set_state: state => obj => {
				let _state = {...state},
					keys = Object.keys(obj);
				
				keys.map(k => _state[k] = obj[k]);
				return _state;
			}
		}
	),
	withHandlers({
		getData: ({ match, set_state }) => () => {
			apishka(
				'GET', {}, '/api/report?id='+match.params.id,
				(res) => {
				  document.title = res.outjson.title;
				  set_state({ 
					values: { ...res.outjson },
					params: [...res.outjson.params]
				  });
				},
			(err) => {}
		  )
		},
		getSelectOptions: ({ selections, set_state }) => (ptitle, substr, api_id) => {
			apishka(
				'GET', {}, '/api/methodinfo?id='+api_id,
				(res) => {
					const dataTypeString = res.outjson.methotypename;
					if(dataTypeString === 'get') {
						apishka( 
							'GET', {}, `/api/${res.outjson.methodname}?substr=` + substr,
							(res) => {
								let sel = selections
								sel[ptitle] = res.outjson
								set_state({ selections: sel })
							}, (err) => {}
						)
					} else {
						Error('Methotypename of data are not GET request');
					}
				},
				(err) => {}
			)
		},
		getReportFile: ({ inputs, values }) => () => {
			let params = '?'
				Object.keys(inputs).forEach((x) => {
			let inp = typeof(inputs[x]) === 'object' ? JSON.stringify(inputs[x]) : inputs[x]
				params += x +'=' + inp + '&'
			})
			params += 'filename=' + values.filename + '&template=..' + values.template_path
			console.log('open report', '/rep/'+ values.path + params )
			window.open('/rep/'+ values.path + params)
		}
	}),
	lifecycle({
		componentDidMount() {
			const { getData } = this.props
			getData()
		}
	})

)

export default enhance
