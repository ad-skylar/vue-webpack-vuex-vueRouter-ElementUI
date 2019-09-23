<template>
  <div class="reset-pwd">
    <p class="usercenter-title">修改密码</p>
    <div class="phone item" ref="iphoneNumber">
      <label>手机号 : </label>
      <span>{{userlogin.mobile}}</span>
    </div>

    <div class="new-pwd item">
      <label>新密码 : </label>
      <el-input type="password" class="" placeholder="请输入新密码" v-model="password"></el-input>
    </div>
    <div class="confirm-pwd item">
      <label>确认密码 : </label>
      <el-input type="password" placeholder="请再次输入密码" v-model="repassword"></el-input>
    </div>
    <div class="message-code item">
      <label>验证码 : </label>
      <el-input type="text" class="message-code-number" placeholder="请输入验证码" v-model="messageCode"></el-input>
      <span class="get-code" @click="getCode" v-if="isShow">获取验证码</span>
      <span class="get-code get-codding" v-if="isHide">
        <i class="countDown" id="seconds_show">{{countDown}} </i> 秒后重新获取</span>
    </div>
    <div class="submit-userInfo  cursor" @click="postBtn">提交</div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import api_u from '../../api/user'
export default {
  computed: {
    ...mapState([
      'userlogin'
    ])
  },
  data() {
    return {
      password: '',
      repassword: '',
      messageCode: '',
      isShow: true,
      isHide: false,
      countDown: 60
    }
  },
  methods: {

    getCode: function() {
      this.countDown = 60; 
      api_u.Sendsms({
        "mobile": this.userlogin.mobile
      }).then(response => {
        if (response.data.status == 1) {
          this.$message.success('验证码发送成功')
          this.isShow = false;
          this.isHide = true;
          this.loop(60, () => {
            "use strict";
            this.countDown--;
          }, () => {
            "use strict";
            this.isShow = true;
            this.isHide = false;
          })
        }
      })
    },
    loop(longTime, callback, finishCallback) {
      "use strict";
      const start = Date.now();
      let i = 0; // 60s
      const coundownFun = () => {
        const current = Date.now();
        const duration = (current - start); // 当间隔为n毫秒时，
        if (duration > (i + 1) * 1000) {
          callback();
          i++;
        }

        //TODO
        if (i != longTime) window.requestAnimationFrame(coundownFun);
        else finishCallback();
      }
      window.requestAnimationFrame(coundownFun);
    },
    postBtn() {

      if (!(/^.{6,}$/.test(this.password))) {
        this.$message.error('请输入6位数以上密码')
        return
      }
      if (!this.repassword) {
        this.$message.error('请确认密码')
        return
      }
      if (this.password !== this.repassword) {
        this.$message.error('两次密码输入不一致')
        return
      }
      if (!this.messageCode) {
        this.$message.error('请输入验证码')
        return
      }
      api_u.Forgetpwd({
        "mobile": this.userlogin.mobile,
        "pwd": this.password,
        "pwd2": this.repassword,
        "sms_code": this.messageCode
      }).then(response => {
        var res = response.data
        if (res.status == 1) {
          this.$message.success('修改成功!请重新登录！')

          this.$router.push('/login')

        }else{
          this.$message.success('验证码错误！')
          
        }
      })
    }


  },

}
</script>

<style scoped>
.el-input {
  width: 200px;
}

.message-code input,
.new-pwd input,
.confirm-pwd input {
  height: 26px;
  border: 1px solid #ccc;
  width: 120px;
  margin-right: 8px;
  text-indent: 10px;
}

.get-code {
  background-color: green;
  text-align: center;
  color: #eee;
  padding: 4px 10px;
  cursor: pointer;
  /* position: relative;
  right: 60px; */
  border-radius: 6px
}

.new-pwd input {
  width: 200px;
}

.confirm-pwd input {
  width: 200px;
}

.message-code-number {
  /* position: relative;
  left: 10px;; */
}

.get-codding {
  background: #999;
}
</style>
