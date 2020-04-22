import React, {Fragment} from 'react';
import { compose, withStateHandlers, withHandlers, lifecycle } from 'recompose';
import { Modal, Button, notification, Select,
        Spin, Avatar } from 'antd';
import { api } from 'src/defaults';
import { apishka } from 'src/libs/api';

let timer = {};

const ContentToModal = ({userData, valueSelect, fetching, getListData, onChangeSelect, createChatRoom, listEmpty}) => {
  return <Fragment>
    <div>
      <div>Users</div>
      <Select
        notFoundContent={fetching ? <Spin size="small" /> : listEmpty ? <div style={styles.listEmpty}>User not found</div> : null}
        placeholder='Search...'
        value={valueSelect}
        onChange={value => onChangeSelect(value)}
        onSearch={getListData}
        style={styles.select}
        size='large'
        showSearch
        autoFocus
      >
        {userData.map(userObj => (
          <Select.Option key={userObj.login}>
            {userObj.avatar === null ? <Avatar icon='user' /> : <Avatar src={userObj.avatar}/> }
            <span style={styles.option__name}>{userObj.login}</span>
          </Select.Option>
        ))}
      </Select>
    </div>
    <div style={styles.btn__secondContainer}>
      <Button
        type='primary'
        onClick={() => createChatRoom()}
      >
        Create
     </Button>
    </div>
</Fragment>
};

const enhance = compose(
  withStateHandlers(
    ({
      inState = {
        userData: [],
        valueSelect: [],
        arrUserForSubmit: [],
        fetching: false,
        listEmpty: false
      }
    }) => ({
      userData: inState.userData,
      valueSelect: inState.valueSelect,
      arrUserForSubmit: inState.arrUserForSubmit,
      fetching: inState.fetching,
      listEmpty: false
    }),
    {
      set_state: state => obj => {
        let _state = {...state},
            keys = Object.keys(obj);
        keys.map(key => _state[key] = obj[key]);
        return _state;
      }
    }
  ),
  withHandlers({
    getListData: ({ set_state }) => (_substr) => {
      if(_substr === '') {
        return;
      }
      set_state({fetching: true})
      timer['listUserSelect'] ? clearTimeout(timer['listUserSelect']) : null;
      const getDataSelect = new Promise(resolve => {
        timer['listUserSelect'] = setTimeout(() => {
	  
		  apishka('GET', {}, '/api/dialogs_usersearch?substr=' + _substr, (res) => {
			let dat = _.sortBy(res.outjson, ['login']);
            resolve(dat);
		  })
        }, 100)
      });

      return getDataSelect.then(res => {
        set_state({fetching: false});
        if(res.length === 0) set_state({listEmpty: true});
        const preparedOptions = res.map(item => {
          return {
            login: item.login,
            avatar: item.photo === null ? null : api._url + item.photo[0].uri,
            id: item.id
          }
        });

        set_state({userData: preparedOptions})
      })
    },
    onChangeSelect: ({ userData, set_state }) => value => {
      let arr = [];
      userData.forEach(it => {
        if(it.login === value){
          arr.push(it.id);
        }
      });
      set_state({
        valueSelect: value,
        arrUserForSubmit: arr
      });
    }
  }),
  withHandlers({
    createChatRoom: ({ arrUserForSubmit, userData, set_stateUpComponent, set_state, getDataUpComp }) => () => {
      if(userData.length === 0) {
        notification['error']({
          message: 'Choose users'
        });
        return;
      }

      let  _data = {
          config: {type: 'image'},
          reciver_user_id: arrUserForSubmit[0],
        };

	  apishka('POST', _data, '/api/dialog_personal_create', (res) => {
        getDataUpComp();
        set_stateUpComponent({ openModalInitPerson: false, statusCreateChat: true });
        notification['success']({
          message:'created'
        });
        set_state({
          arrUserForSubmit: [],
          userData: [],
          valueSelect: []
        });
      } )
    },
  })
);

const ContentToModalEnhanced = enhance(ContentToModal);

const ModalInitPersonChat = ({ openModalInitPerson, set_stateUpComponent, getDataUpComp }) => {
  return <Modal
    centered
    visible={openModalInitPerson}
    title="Initial chat"
    onCancel={() => set_stateUpComponent({ openModalInitPerson: false })}
    footer={null}
  >
    <ContentToModalEnhanced
      getDataUpComp={getDataUpComp}
      set_stateUpComponent={set_stateUpComponent} />
  </Modal>
};

const styles = {
  btn__firstContainer: {
    textAlign: 'center'
  },
  btn__secondContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100
  },
  btn: {
    marginTop: 50
  },
  option__name: {
    marginLeft: 10
  },
  select: {
    width: '100%'
  },
  listEmpty: {
    textAlign: 'center'
  }
};

export default ModalInitPersonChat;
