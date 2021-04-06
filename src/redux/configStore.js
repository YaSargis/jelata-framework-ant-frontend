import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga'
import { fork } from "redux-saga/effects";
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';
import { main } from "src/pages/chat/sagas";

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware()

function* hello() {
  console.log('hello, i am Saga')
}

function* rootSaga() {
  yield fork(main)
}

function configureStore() {
  const store = createStore(
    reducers,
    composeWithDevTools(
      applyMiddleware(
        sagaMiddleware,
        thunk,
        routerMiddleware(history),        
      )
    )
  );

  sagaMiddleware.run(rootSaga)
  return store
}



export const store = configureStore();