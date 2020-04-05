import React from 'react';
import { connect } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import moment from 'moment';

import { Avatar, Button, Modal, List, Input, Popconfirm, Empty, Icon, notification } from 'antd';
const { Search } = Input;

import { Delete, Get, PostMessage } from 'src/libs/api';
import { set_chat_id } from 'src/redux/actions/user';

const ControlPanel = ({dataListChats, chatId, setStateUpComp, set_state, isModalDelMemberOpen, filterUsers, selectedUser, deleteSelf, isAddAdmin,
                       deleteUser, valueSearch, showAllUsers, isModalAddMemberOpen, findUser, findedUsers, addUser, isModalAdminOpen, addAdmin,
                       deleteAdmin, changeGroupSet, isModalMainOpen, valueTitle, isModalPicOpen, imageUrl, setStateFile, objAvatarFile}) => {
  const chat = dataListChats.find(obj => obj.id === chatId);
  const creator = chat.creator;
  const admins = chat.dialog_admins.filter(item => item !== creator.id);
  const adminsObj = admins.map(item => {
    for(let i = 0; i < chat.users.length; ++i){
      if(item === chat.users[i].id) {
        return chat.users[i];
      }
    }
  });

  return <React.Fragment>
    <div>
      <div>
        <div style={{textAlign: 'center'}}>CReated date: </div>
        <div style={{textAlign: 'center', fontWeight: 'bolder', fontSize: 24}}>
          {moment(chat.created).format('DD.MM.YYYY')}
        </div>
      </div>
      { chat.dialog_type_name === 'group' ? <div style={{margin: '20px 0', borderRadius: 10, ...styles.buttons}}>
            <Button onClick={()=>set_state({isModalMainOpen: true})}>Change title</Button>
            <Button onClick={()=>set_state({isModalPicOpen: true})}>Change </Button>
      </div> : null }
      <div>
        <div>Admins</div>
        <div style={styles.admins}>
          <div>
            <div style={{textAlign: 'center', fontSize: 20, height: 25}}><Icon type='crown' /></div>
            <Avatar
              icon="user"
              src={creator.photo[0].src}
              size={46}
            />
            <div style={styles.login}>{creator.login}</div>
            <div style={{fontSize: 10, textAlign: 'center'}}>Owner</div>
          </div>
          {adminsObj.map(item => <div key={item.login + 'admins'}>
            <Avatar
              icon="user"
              src={item.photo[0].src}
              size={46}
            />
            <div style={styles.login}>{item.login}</div>
            <div style={{fontSize: 10, textAlign: 'center'}}>admin</div>
          </div>)}
        </div>
      </div>
      {chat.dialog_type_name === 'group' ? chat.isadmin ? <div style={styles.buttons}>
                                            <Button size='small' type='primary' onClick={()=> set_state({isModalAdminOpen: true, isAddAdmin: true})}>Add admin</Button>
                                            <Button size='small' type='danger' onClick={() => set_state({isModalAdminOpen: true})}>Delete admin</Button>
                                          </div> : null
        : null}
      <div style={{marginTop: 20}}>
        <div>Users</div>
        <div style={styles.members}>
          { chat.users ? chat.users.map(item => <div key={item.login}>
            <Avatar
                icon="user"
                src={item.photo !== null ? item.photo[0].src : false}
                size={46}
              />
              <div style={styles.login}>{item.login}</div>
          </div>
          ) : <Empty />}
        </div>
      </div>
    </div>
    { chat.dialog_type_name === 'group' ? chat.isadmin ? <div style={styles.buttons}>
      <Button
        size='small'
        type='primary'
        onClick={() => set_state({isModalAddMemberOpen: true})}
      >
      Add User
      </Button>
      <Button
        size='small'
        type='danger'
        onClick={() => {
          setStateUpComp({ openDrawerPanel: false });
          set_state({isModalDelMemberOpen: true});
        }}
      >
        Delete user
      </Button>
    </div> : null : null }
    {chat.dialog_type_name === 'group' ? <div style={{marginTop: 40, textAlign: 'center'}}>
      <Popconfirm
        title='Are you sure?'
        okText='Yes'
        cancelText='No'
        onConfirm={() => deleteSelf()}
      >
        <Button type='danger'>Leave the group</Button>
      </Popconfirm>
    </div> : null }
    <Modal
      centered
      title='Change title'
      visible={isModalMainOpen}
      onCancel={() => set_state({isModalMainOpen: false})}
      onOk={()=> changeGroupSet('title', valueTitle)}
    >
      <Input
        value={valueTitle}
        onChange={e=>set_state({valueTitle: e.target.value})}
      />
    </Modal>
    <Modal
      centered
      title='Change image'
      visible={isModalPicOpen}
      onCancel={()=>set_state({isModalPicOpen: false, objAvatarFile: {}, imageUrl: ''})}
      onOk={()=>changeGroupSet('image', objAvatarFile)}
    >
      <div>
        <label
          htmlFor='avatarChangePic'
        >
          <div style={styles.avatar_contain}>
            {imageUrl ? <img
              src={imageUrl}
              width={400}
              style={styles.avatarImg}
            /> : <div style={styles.avatarNull}>Choose the image</div>}
          </div>
        </label>
        <input
          type = 'file'
          accept='image/*'
          id='avatarChangePic'
          style={{visibility: 'hidden', height: 1}}
          onChange = {(e) => setStateFile(e) }
        />
      </div>
    </Modal>
    <Modal
      centered
      title='Delete user'
      onCancel={()=>set_state({isModalDelMemberOpen: false, selectedUser: [], valueSearch: ''})}
      visible={isModalDelMemberOpen}
      footer={<Button onClick={()=>set_state({isModalDelMemberOpen: false, selectedUser: [], valueSearch: ''})} >cancel</Button>}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20, marginTop: 20}}>
        <Button onClick={()=>showAllUsers()} type="primary">
          Show all
        </Button>
        <Search
          placeholder='Поиск'
          style={{ width: 300 }}
          onSearch={value => filterUsers(value)}
          value={valueSearch}
          onChange={e => set_state({valueSearch: e.target.value})}
        />
      </div>
      <List
        bordered
        dataSource={selectedUser}
        renderItem={item => {
          return <List.Item style={{display: 'flex', justifyContent: 'space-around'}} key={item.id}>
            <Avatar icon='user' src={item.photo[0].src} />
            <div>{item.login}</div>
            <Popconfirm
              title='Are you sure?'
              okText="Yes"
              cancelText="No"
              onConfirm={() => deleteUser(item.id)}
            >
            <Button type='danger'>
              Удалить
            </Button>
            </Popconfirm>
          </List.Item>
        }}
      />
    </Modal>
    <Modal
      centered
      title='Add user'
      onCancel={()=>set_state({isModalAddMemberOpen: false, valueSearch: '', findedUsers: []})}
      visible={isModalAddMemberOpen}
      footer={<Button onClick={()=>set_state({isModalAddMemberOpen: false, valueSearch: '', findedUsers: []})} >Cancel</Button>}
    >
      <div style={{display: 'flex', justifyContent: 'added', marginBottom: 20, marginTop: 20}}>
        <Search
          placeholder='Search'
          style={{ width: 300 }}
          onSearch={value => findUser(value)}
          value={valueSearch}
          onChange={e => set_state({valueSearch: e.target.value})}
        />
      </div>
      <List
        bordered
        dataSource={findedUsers}
        renderItem={item => {
          return <List.Item style={{display: 'flex', justifyContent: 'space-around'}} key={item.id}>
            <Avatar icon='user' src={item.photo[0].src} />
            <div>{item.login}</div>
            <Button
              type='primary'
              onClick={() => addUser(item.id)}
            >
              Add
            </Button>
          </List.Item>
        }}
      />
    </Modal>
    <Modal
      centered
      title={isAddAdmin ? 'Add admin' : "Delete admin"}
      visible={isModalAdminOpen}
      onCancel={()=>set_state({isModalAdminOpen: false, valueSearch: '', selectedUser: [], isAddAdmin: false})}
      footer={<Button onClick={()=>set_state({isModalAdminOpen: false, valueSearch: '', selectedUser: [], isAddAdmin: false})} >Cancel</Button>}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20, marginTop: 20}}>
        <Button onClick={()=>showAllUsers()} type="primary">
          Show all
        </Button>
        <Search
          placeholder='Search'
          style={{ width: 300 }}
          onSearch={value => filterUsers(value)}
          value={valueSearch}
          onChange={e => set_state({valueSearch: e.target.value})}
        />
      </div>
      <List
        bordered
        dataSource={selectedUser}
        renderItem={item => {
          return <List.Item style={{display: 'flex', justifyContent: 'space-around'}} key={item.id}>
            <Avatar icon='user' src={item.photo[0].src} />
            <div>{item.login}</div>
            {isAddAdmin ? item.isadmin ? <Button disabled>admin</Button>
                              : <Popconfirm
                                title='Are you sure?'
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => addAdmin(item.id)}
                                >
                                  <Button type={isAddAdmin ? 'primary': 'danger'}>
                                    { isAddAdmin ? "Add" : 'Delete' }
                                  </Button>
                                </Popconfirm>
                : item.isadmin ? <Popconfirm
                                  title='Are you sure?'
                                  okText="YEs"
                                  cancelText="No"
                                  onConfirm={() => deleteAdmin(item.id)}
                                  >
                                    <Button type={isAddAdmin ? 'primary': 'danger'}>
                                      { isAddAdmin ? "Add" : 'Delete' }
                                    </Button>
                                  </Popconfirm>
                  : <Button disabled>Участник</Button>}
          </List.Item>
        }}
      />
    </Modal>
  </React.Fragment>
};

const enhance = compose(
  connect(
    null,
    dispatch => ({
      set_chat_id: id => dispatch(set_chat_id(id))
    })
  ),
  withStateHandlers(
    ({
      inState = {
        isModalDelMemberOpen: false,
        isModalAddMemberOpen: false,
        isModalMainOpen: false,
        selectedUser: [],
        valueSearch: '',
        isShowAllUsers: false,
        findedUsers: [],
        isAddAdmin: false,
        valueTitle: '',
        imageUrl: '',
        objAvatarFile: {},
      }
    }) => ({
      isModalDelMemberOpen: inState.isModalDelMemberOpen,
      isModalAddMemberOpen: inState.isModalAddMemberOpen,
      isModalMainOpen: inState.isModalMainOpen,
      selectedUser: inState.selectedUser,
      valueSearch: inState.valueSearch,
      isShowAllUsers: inState.isShowAllUsers,
      findedUsers: inState.findedUsers,
      isAddAdmin: inState.isAddAdmin,
      valueTitle: inState.valueTitle,
      imageUrl: inState.imageUrl,
      objAvatarFile: inState.objAvatarFile
    }),
    {
      set_state: state => obj => {
        let _state = {...state},
            keysObj = Object.keys(obj);
        keysObj.map(key => _state[key] = obj[key]);
        return _state;
      }
    }
  ),
  withHandlers({
    filterUsers: ({dataListChats, chatId, set_state}) => value => {
      set_state({isShowAllUsers: false});
      const _value = value.toLocaleLowerCase();
      const chat = dataListChats.find(obj => obj.id === chatId);
      const filteredUsers = chat.users.filter(item => item.login.toLocaleLowerCase().includes(_value));
      set_state({selectedUser: filteredUsers})
    },
    deleteUser: ({chatId, getDataUpComp, set_chat_id, set_state}) => id => {
      Delete({
        url: '/api/dialog_removeuser',
        data: {
          id: chatId,
          user_to_remove: id
        }
      }).then(() => {
        set_state({selectedUser: [], isModalDelMemberOpen: false, valueSearch: ''});
        getDataUpComp();
        set_chat_id(chatId);
      });
    },
    showAllUsers: ({dataListChats, chatId, set_state, }) => () => {
      const chat = dataListChats.find(obj => obj.id === chatId);
      set_state({selectedUser: chat.users, isShowAllUsers: true});
    },
    findUser: ({set_state}) => value => {
      if(value === '') return;
      Get('/api/dialogs_usersearch',{
        substr: value
      }).then(res => {
        let { data } = res;
        let _data = _.sortBy(data.outjson, ['login']);
        set_state({findedUsers: _data});
      })
    },
    addUser: ({chatId, getDataUpComp, set_chat_id, set_state}) => id => {
      PostMessage({
        url: 'api/dialog_adduser',
        data: {
          user_to_add: id,
          id: chatId
        }
      }).then(() => {
        set_state({findedUsers: [], isModalAddMemberOpen: false, valueSearch: ''});
        getDataUpComp();
        set_chat_id(chatId);
      })
    },
    deleteSelf: ({chatId, set_chat_id, getDataUpComp, setStateUpComp}) => () => {
      PostMessage({
        url: '/api/dialog_leave',
        data: {
          id: chatId
        }
      }).then(() => {
        setStateUpComp({openDrawerPanel: false});
        set_chat_id(false);
        getDataUpComp();
      })
    },
    addAdmin: ({chatId, set_state, getDataUpComp}) => id => {
      PostMessage({
        url: '/api/dialog_addadmin',
        data : {
          user_to_add: id,
          id: chatId
        }
      }).then(() => {
        set_state({selectedUser: [], isModalAdminOpen: false, valueSearch: '', isAddAdmin: false});
        getDataUpComp();
        set_chat_id(chatId);
      }).catch(() => {
        set_state({selectedUser: [], isModalAdminOpen: false, valueSearch: '', isAddAdmin: false})
      })
    },
    deleteAdmin: ({chatId, set_state, getDataUpComp}) => id => {
      Delete({
        url: '/api/dialog_removeadmin',
        data : {
          admin_to_remove: id,
          id: chatId
        }
      }).then(() => {
        set_state({selectedUser: [], isModalAdminOpen: false, valueSearch: '', isAddAdmin: false});
        getDataUpComp();
      }).catch(() => {
        set_state({selectedUser: [], isModalAdminOpen: false, valueSearch: '', isAddAdmin: false})
      })
    },
    setStateFile: ({set_state}) => event => {
      const reader = new FileReader;
      const file = event.target.files[0];
      reader.addEventListener("load", function () {
        set_state({imageUrl: reader.result})
      }, false);
      if(file) {
        reader.readAsDataURL(file);
        set_state({objAvatarFile: file});
      }
    },
    changeGroupSet: ({chatId, set_state, getDataUpComp, objAvatarFile}) => (type, value) => {
      if(type==='title') {
        PostMessage({
          url: '/api/dialog_edit',
          data: {
            id: chatId,
            title: value
          }
        }).then(() => {
          set_state({valueTitle: '', isModalMainOpen: false});
          getDataUpComp();
          notification['success']({
            message: 'Done'
          })
        })
      } else {
        let _data = new FormData();
        _data.append('file_0', objAvatarFile);
        _data.append('config', JSON.stringify({type:'image'}));
        _data.append('id', chatId);
        PostMessage({
          url: '/api/dialog_edit',
          data: _data
        }).then(()=> {
          set_state({objAvatarFile: {}, isModalPicOpen: false, imageUrl: ''});
          getDataUpComp();
          notification['success']({
            message: 'Done'
          })
        })
      }
    }
  })
)

const styles= {
  admins: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    backgroundColor: '#bafdaf',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10
  },
  login: {
    textAlign: 'center',
    backgroundColor: '#4686bf',
    color: 'aliceblue',
    borderRadius: 10,
    fontSize: 12,
    padding: '0 2px'
  },
  members: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#bafdaf',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ccc'
  },
  avatar_contain: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  avatarNull: {
    width: 100,
    height: 100,
    border: '1px dashed',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
};

export default enhance(ControlPanel);
