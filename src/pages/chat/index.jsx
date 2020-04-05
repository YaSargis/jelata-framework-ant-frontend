import React from 'react';
import { Layout, Button, Drawer, Icon, Avatar, Tooltip } from 'antd';
const { Sider, Content, Header } = Layout;

import { api } from 'src/defaults';

import enhance from './enhance';
import MenuChat from './components/menu';
import MainFrame from './components/main-frame';
import ControlPanel from './components/control-panel';
import ModalInitGroupChat from './components/modal-init';
import ModalInitPersonChat from './components/modal-initPerson';

const Chat = ({
  openModalInit, set_state, carouselRef,
  openDrawerPanel, getData, openModalInitPerson,
  carouselRefPerson, chatId, dataListChats,
  chatName, chatPhotoUri
}) => {
  return (
    <Layout style={styles.mainLayout}>
      <Sider width={300} style={styles.sider}>
        <div
          style={{
            color: 'white',
            height: 64,
            backgroundColor: '#3e4f5f',
            borderRight: '#c1c1c1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Tooltip title='Create a Group'>
            <Icon
              style={{
                fontSize: 30,
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 10,
                padding: 5
              }}
              onClick={() => set_state({ openModalInit: true })}
              type='usergroup-add'
            />
          </Tooltip>
          <Tooltip title='Save'>
            <Icon
              style={{
                fontSize: 30,
                marginLeft: 20,
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 10,
                padding: 5
              }}
              type='user-add'
              onClick={() => set_state({ openModalInitPerson: true })}
            />
          </Tooltip>
        </div>
        <div style={styles.dividerSider}>Chats</div>
        <MenuChat set_stateUpComponent={set_state} dataListChats={dataListChats} />
        <ModalInitGroupChat
          getDataUpComp={getData}
          openModalInit={openModalInit}
          carouselRef={carouselRef}
          set_stateUpComponent={set_state}
        />
        <ModalInitPersonChat
          getDataUpComp={getData}
          openModalInitPerson={openModalInitPerson}
          carouselRefPerson={carouselRefPerson}
          set_stateUpComponent={set_state}
        />
      </Sider>
      {chatId ? (
        <Layout style={styles.secondLayout}>
          <Header style={styles.header}>
            <div style={styles.header__nameChat}>
              <span style={{ paddingRight: 10 }}>
                {chatPhotoUri ? (
                  <Avatar src={api._url + chatPhotoUri} size={42} className='chat__avatar' />
                ) : (
                  <Avatar icon='question' size={42} className='chat__avatar' />
                )}
              </span>
              {chatName}
            </div>
            <Button onClick={() => set_state({ openDrawerPanel: true })}>Settings</Button>
          </Header>
          <Content>
            <MainFrame dataListChats={dataListChats} />
            <Drawer
              title='Settings'
              onClose={() => set_state({ openDrawerPanel: false })}
              visible={openDrawerPanel}
              width={516}
            >
              <ControlPanel
                chatId={chatId}
                dataListChats={dataListChats}
                setStateUpComp={set_state}
                getDataUpComp={getData}
              />
            </Drawer>
          </Content>
        </Layout>
      ) : (
        <Layout style={styles.thirdLayout}>
          <div style={styles.containerInit} className='slide-in-elliptic-top-fwd'>
            <div style={{ textAlign: 'center' }}>
              Choose users
            </div>
            <div style={{ textAlign: 'center' }}>or create chat</div>
            <div>
              <Button
                style={styles.sider__btn}
                onClick={() => set_state({ openModalInit: true })}
                icon='usergroup-add'
              >
                Create gruop
              </Button>
              <Button
                style={styles.sider__btn}
                onClick={() => set_state({ openModalInitPerson: true })}
                icon='user-add'
              >
                Create dialog
              </Button>
            </div>
          </div>
        </Layout>
      )}
    </Layout>
  );
};

const styles = {
  mainLayout: {
    height: '100%'
  },
  secondLayout: {
    backgroundColor: 'white'
  },
  thirdLayout: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `no-repeat url('./public/fon4.jpg')`,
    backgroundOrigin: 'border-box',
    backgroundPosition: 'center'
  },
  sider: {
    backgroundColor: '#3e4f5f'
  },
  sider__icon: {
    position: 'absolute',
    top: 25,
    left: 20,
    color: 'aliceblue'
  },
  sider__btn: {
    margin: '16px auto',
    display: 'block',
    width: 160
  },
  header: {
    backgroundColor: '#4486c5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  header__nameChat: {
    color: 'aliceblue',
    fontSize: 25
  },
  dividerSider: {
    background: '#fff',
    display: 'block',
    textAlign: 'center',
    borderRight: '1px solid #c1c1c1',
    borderBottom: '1px solid #c1c1c1',
    padding: '5px'
  },
  containerInit: {
    background: '#98cdfb',
    borderRadius: 10,
    padding: 40
  }
};

export default enhance(Chat);
