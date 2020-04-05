import { compose, withState,withHandlers, lifecycle } from 'recompose';
import { Get } from 'src/libs/api';

const enhance = compose(
  withState('values', 'changeValues', {}),
  withState('params', 'changeParams', []),
  withState('inputs', 'changeInputs', {}),
  withState('selections', 'changeSelections', []), // helper { ptitle: {} | [] } - для селекта []
  withHandlers({
    getData: ({ match, changeValues, changeParams }) => () => {
      Get('/api/report', {
        id: match.params.id
      }).then((res) => {
        document.title = res.data.outjson.title;

        changeValues({...res.data.outjson});
        changeParams([...res.data.outjson.params]);
      });
    },
    getSelectOptions: ({ changeSelections, selections }) => (ptitle, substr, api_id) => {
      Get('/api/methodinfo', {
        id: api_id
      }).then((res) => {
        const dataTypeString = res.data.outjson.methotypename;
        if(dataTypeString === "get") {
          Get(`/api/${res.data.outjson.methodname}`, {
            substr:substr
          }).then((res) => {
            let sel = selections;
            sel[ptitle] = res.data.outjson;
            changeSelections(sel);
          })
        } else {
          Error('Methotypename of data is not GET request');
        }
      })
    },
    getReportFile: ({ inputs, values }) => () => {
      let params = '?';
		  Object.keys(inputs).forEach((x) => params += x +'=' + JSON.stringify(inputs[x]) + '&');
		  params += 'filename=' + values.filename + '&template=..' + values.template_path;
      console.log('open report', '/rep/'+ values.path + params );
      window.open('/rep/'+ values.path + params);
    }
  }),
  lifecycle({
    componentDidMount() {
      const { getData } = this.props;
      getData();
    },
    componentDidUpdate(prevProps) {
      const { selections } = this.props;
      if (selections !== prevProps.selections) {
        // console.log('this is selection:',selections)
      }
    }
  })
);

export default enhance;
