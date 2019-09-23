import {
  INIT_STATE,
  USER_LOGIN,
  USER_LOGOUT,
  MESSAGE_ADD,
  MESSAGE_INIT,
  MESSAGE_EMPTY,
  // MESSAGE_MINUS
} from './mutation-types'

import {
  setStore,
  getStore,
  removeStore
} from '../util/util';


const matutaions = {
  [INIT_STATE](state) {
    let inituserlogin = getStore('userlogin'),
      messageNum = getStore('messageNum')
    if (inituserlogin) {
      state.userlogin = JSON.parse(inituserlogin);
    }
    if (messageNum) {
      state.messageNum = JSON.parse(messageNum);
    }
  },
  [USER_LOGIN](state, userlogin) {
    state.userlogin = userlogin;
    setStore('userlogin', state.userlogin);
  },

  [USER_LOGOUT](state) {
    state.userlogin = null;
    removeStore('userlogin')
  },
  [MESSAGE_ADD](state) {
    state.messageNum++
      setStore('messageNum', state.messageNum);
  },
  [MESSAGE_INIT](state,num){
    state.messageNum=num
    setStore('messageNum', state.messageNum);
  },
  [MESSAGE_EMPTY](state){
    state.messageNum=null    
    removeStore('messageNum')
  }

}

export default matutaions
