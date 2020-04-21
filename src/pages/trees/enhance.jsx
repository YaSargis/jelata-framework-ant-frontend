import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import qs from 'query-string';

import { Get } from 'src/libs/api';

import { Configer } from 'src/libs/methods';

const enhance = compose(
  withState('values', 'changeValues', {}),
  withState('menu', 'changeMenu', []),
  withState('openedKeys', 'changeOpenedKeys', []),
  withState('rootKeys', 'changeRootKeys', []),
  withState('view', 'changeView', {}),
  withState('params', 'changeParams', {
    inputs: {}
  }),
  withState('ready', 'changeReady', true),
  withHandlers({
    handlerOpenChange: ({ openedKeys, rootKeys, changeOpenedKeys }) => (openKeys) => {
      const latestOpenKey = openKeys.find(key => openedKeys.indexOf(key) === -1);
      if (rootKeys.indexOf(latestOpenKey) === -1) changeOpenedKeys(openKeys); else changeOpenedKeys(latestOpenKey || []);
    }
  }),
  withHandlers({
    getData: ({ history, location, match, changeView, changeValues, changeReady, changeMenu, changeRootKeys }) => () => {
      Get('/api/treesbypath', {
        path: match.params.id
      }).then((res) => {
        document.title = res.data.outjson.title;
        
        changeValues({...res.data.outjson});
        let { branches, items } = res.data.outjson;
        let rootKeys = [];
        let h = location.hash ? true : false;
        if(_.isArray(branches)) {
          if(!_.isEmpty(branches)) {
            branches.map((el, i) => {
              if(el.ismain === true && !h) {
                let _view = _.find(items, x => x.key === el.key) ;
                history.push(location.pathname + location.search + '#' + _view.key);
                if(_view.path && _view.treeviewtype > 0) changeView(_view);
              }
              el.children ? rootKeys.push(el.key) : null
            });
            changeMenu(branches);
            if(location.hash) {
              let _view = _.find(items, x => ('#' + x.key) === location.hash);
              if(_view.path && _view.treeviewtype > 0) changeView(_view);
            }
          }
        };
        changeRootKeys(rootKeys);
        changeReady(true);
      });
    }
  }),
  withHandlers({
    handlerSelectMenu: ({ changeReady, history, values, location, changeView }) => (item) => {
      let _item = Configer.searchByString(item, 'item,props,data'),
          _view = _.find(values.items, x => x.key === _item.key) ;
      if(location.hash !== ('#'+_view.key)) {
        changeReady(false);
        history.push(location.pathname + location.search + '#' + _view.key);
        if(_view.path && _view.treeviewtype > 0) {
          changeView(_view);
        }
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      let { getData, changeReady, params, changeParams, match, location } = this.props;
      params.inputs = qs.parse(location.search);
      params.path = match.params.match;
      params.search = location.search;
      changeParams({...params});
      changeReady(false);
      getData();
    },
    componentDidUpdate(prevProps) {
      if(prevProps.location.hash !== this.props.location.hash) {
        if(this.props.ready === false) this.props.changeReady(true)
      };
      if(prevProps.location.search !== this.props.location.search) {
        this.props.getData();
        this.props.changeReady(false);  
      }
    }
  })
);

export default enhance;