import axios from 'axios'

export default {
    // 获取验证码
    Sendsms(data) {
        return axios.post('/Sendsms/send', data)
    },
    // 修改密码
    Forgetpwd(data) {
        return axios.post('/Forgetpwd/reset', data)
    },
    // 注册
    register(data) {
        return axios.post('/regist/index', data)
    },
    // 登录
    login(data) {
        return axios.post('/login/check', data)
    },
    //微信登录
    wxlogin(data) {
        return axios.post('/wxlogin/login', data)
    },
    // 修改个人信息
    userinfoUpdate(data, config) {
        return axios.post('/Userinfo/update', data, config)
    },
      // 微信jssdk所需信息
  weChatConfigMsg(params) {
    return axios.get('/wx/index', {
      params
    });
  },
}