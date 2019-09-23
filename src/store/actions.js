import Vue from 'vue'
const vm = new Vue({})


import router from '../router'
import {
  setStore
} from '../util/util';
import api_u from '../api/user'
export default {

  login({
    commit
  }, payload) {
    return api_u.login(payload).then(response => {
      let res = response.data
      if (res.status == 0) {
        vm.$message.error('登录失败')
      }
      if (res.status == 1) {
        vm.$message.success('登录成功');
        commit('USER_LOGIN', res.data)
        router.push('/user/userinfo')
      }
    })
  },
  weChatLogin({
    commit
  }, payload) {
    return api_u.wxlogin(payload).then(response => {
      let res = response.data;

      if (res.status == 0) {

        router.push('/register')
        setStore('weChat', res.data)
      }
      if (res.status == 1) {
        vm.$message.success('登录成功');
        commit('USER_LOGIN', res.data)
        //      router.push('/user/userinfo')
        window.open("http://web.li-shang-bin.com/#/user/userinfo", "_self");
        console.log(window.location.href)
      }
    })
  },

  userlogout({
    commit
  }) {
    commit('USER_LOGOUT');
    router.push({
      path: '/login'
    });
  },


}
