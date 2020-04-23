import React from 'react';
import { compose, lifecycle } from 'recompose';
import { List, Avatar, Icon } from 'antd';
import { api } from 'src/defaults';
import { connect } from 'react-redux';
import { set_chat_id } from 'src/redux/actions/user';

const MenuChat = ({ dataListChats, set_chat_id, chatId }) => {
	return <List
    style={styles.sider__list}
    itemLayout="horizontal"
    dataSource={dataListChats}
    renderItem={item => {
      const colorItem = chatId === item.id ? '#98cdfb' : 'aliceblue';
      const colorText = chatId === item.id ? {padding: '0 10px 0', backgroundColor: '#4586c2', color: 'white', display: 'inline', borderRadius: 10} : null;
      return (
      <List.Item
        className='chat__menuItem'
        style={{...styles.sider__listItem, backgroundColor: colorItem}}
        onClick={() => {set_chat_id(item.id)}}
      >
       <List.Item.Meta
        avatar={(item.photo && item.photo.length > 0) ? <Avatar size={42}  className='chat__avatar' src={api._url + item.photo[0].uri}/> :
                                           item.dialog_type_name === 'group' ? <Avatar  size={42} style={styles.list_avatarIcon} icon='team' /> : <Avatar size={42}  style={styles.list_avatarIcon} icon='user' />}
        title={<div style={{fontSize: 18, ...colorText}}>
                <span>{item.dialog_type_name === 'group' ? <Icon type='team' style={{paddingRight: 10}} /> : null}{item.title}</span>
                {item.unreaded > 0 ? <span style={{color: 'aliceblue', position: "absolute", right: 30, padding: '1px 7px', backgroundColor: 'grey', borderRadius: '50%'}}>{item.unreaded}</span> : null }
              </div>}
        description={
            item.last_message === null ? "Created. No messages" : <div>
                                                    <span style={{color: 'blue'}}>{item.last_message.ismine ? "You" : item.last_message.login }: </span>
                                                    <span>
                                                      {item.last_message.message_text === '' ? "file/image"
                                                                                              : item.last_message.message_text.length > 79 ? item.last_message.message_text.slice(0, 79).concat('...')
                                                                                                                                            : item.last_message.message_text}
                                                    </span>
                                                </div>
        }
       />
      </List.Item>
    )}}
  />
};

const enhance = compose(
  connect(
    state => ({
      chatId: state.user.chatId
    }),
    dispatch => ({
      set_chat_id: id => dispatch(set_chat_id(id)),

    })
  ),
  // lifecycle({

  // })
);

const styles = {
  sider__list: {
    borderRight: '1px solid #c1c1c1',
    overflow: 'auto',
    maxHeight: 'calc(100vh - 116px)'
  },
  sider__listItem: {
    borderBottom: '1px solid grey'
  },
  list_avatarIcon: {
    marginLeft: 5
  }
}

export default enhance(MenuChat);
