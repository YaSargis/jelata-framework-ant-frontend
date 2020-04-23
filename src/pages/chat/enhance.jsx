import { compose, withStateHandlers, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import React from 'react';

import {
  get_chat_id,
  set_chat_id,
  set_first_id,
  set_unreaded_status
} from 'src/redux/actions/user';
import { apishka } from 'src/libs/api';

const enhance = compose(
  connect(
    state => ({
      chatId: state.user.chatId,
      is_unreaded_exist: state.user.is_unreaded_exist
    }),
    dispatch => ({
      get_chat_id: () => dispatch(get_chat_id()),
      set_chat_id: id => dispatch(set_chat_id(id)),
      set_first_id: status => dispatch(set_first_id(status)),
      set_unreaded_status: status => dispatch(set_unreaded_status(status))
    })
  ),
  withStateHandlers(
    ({
      inState = {
        openDrawerPanel: false, openModalInit: false, openModalInitPerson: false,
        carouselRef: React.createRef(), carouselRefPerson: React.createRef(),
        statusCreateChat: false, dataListChats: [],
        chatPhotoUri: '', chatName: '',
        getStatus: false
      }
    }) => ({
      openDrawerPanel: inState.openDrawerPanel,
      openModalInit: inState.openModalInit,
      openModalInitPerson: inState.openModalInitPerson,
      carouselRef: inState.carouselRef,
      carouselRefPerson: inState.carouselRefPerson,
      statusCreateChat: inState.statusCreateChat,
      dataListChats: inState.dataListChats,
      chatPhotoUri: inState.chatPhotoUri,
      chatName: inState.chatName,
      getStatus: inState.getStatus
    }),
    {
      set_state: state => obj => {
        let _state = { ...state },
          keys = _.keys(obj);
        keys.map(key => (_state[key] = obj[key]));
        return _state;
      }
    }
  ),
  withHandlers({
    getData: ({ set_state }) => () => {
      apishka('GET', {}, '/api/dialogs', (res) => {
        set_state({ dataListChats: res.outjson, getStatus: true });
      })
    }
  }),
  lifecycle({
    componentDidMount() {
      const { get_chat_id, getData, set_state } = this.props;
      get_chat_id();
      getData();
      set_state({ getStatus: false });
    },
    componentDidUpdate(prevProps) {
      const {
        chatId, dataListChats, set_state,
        statusCreateChat, set_chat_id, set_first_id,
        set_unreaded_status, is_unreaded_exist, getData
      } = this.props;
      if (is_unreaded_exist === true) {
        getData();
        set_unreaded_status(false);
      }
      // if(prevProps.chatId === null) {
      //   set_first_id(true);
      // }
      if (prevProps.chatId !== chatId) {
        if (chatId) {
          if (dataListChats.length > 0) {
            const findedObj = dataListChats.find(item => item.id === chatId);

            set_state({
              chatPhotoUri: findedObj.photo[0] ? findedObj.photo[0].uri : '',
              chatName: findedObj.title
            });
          }
        }
      }

      if (statusCreateChat === true && prevProps.dataListChats !== dataListChats) {
        const lastItem = dataListChats[0];
        set_chat_id(lastItem.id);
        set_state({ statusCreateChat: false, getStatus: false });
      }

      if (prevProps.dataListChats !== dataListChats && chatId) {
        if (dataListChats.length > 0) {
          const findedObj = dataListChats.find(item => item.id === chatId);
          try {
            set_state({
              chatPhotoUri: (findedObj.photo && findedObj.photo[0]) ? findedObj.photo[0].uri : '',
              chatName: findedObj.title
            });
          } catch (e) {
            console.error('inner', e.message);
            throw e;
          }
        }
      }
    }
  })
);

export default enhance;
