<template>
    <div id="content" class="login-box register-box">
        <h3 class="login-title">
            {{title}}
        </h3>
        <div class="line"></div>
        <input type="text" v-model="iphoneNumber" placeholder="请输入手机号" ref="iphoneNumber">
        <input type="password" v-model="regPwd" placeholder="请输入6位以上的密码" ref="regPwd">
        <input type="password" v-model="confirmPwd" placeholder="请确认密码" ref="confirmPwd">
        <div class="message-code clearfix">
            <input type="text" v-model="messageCode" class="code-number" placeholder="请输入短信验证码">
            <span class="get-code" @click="getCode" v-if="isShow">获取验证码</span>
            <span class="get-code get-codding" v-if="isHide">
                <i class="countDown" id="seconds_show">{{countDown}} </i> 秒后重新获取</span>
        </div>
        <div @click="clickReg" class="login-btn">注册</div>
    </div>
</template>

<script>
import api_u from "../api/user";
import { setStore, getStore, removeStore } from "../util/util";
export default {
  data() {
    return {
      title: "欢迎回到猿计划",
      iphoneNumber: "",
      userName: "",
      regPwd: "",
      confirmPwd: "",
      messageCode: "",
      isShow: true,
      isHide: false,
      countDown: 60
    };
  },
  created() {
    document.title = "注册";
  },
  methods: {
    getCode: function() {
      this.countDown = 60;
      if (!/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(this.$refs.iphoneNumber.value)) {
        this.$message.error("请输入正确的手机号码");
        return;
      }

      if (!/^.{6,}$/.test(this.$refs.regPwd.value)) {
        this.$message.error("请输入6位数以上密码");
        return;
      }
      if (!this.confirmPwd) {
        this.$message.error("请确认密码");
        return;
      }
      if (this.regPwd !== this.confirmPwd) {
        this.$message.error("两次密码输入不一致");
        return;
      }
      api_u
        .Sendsms({
          mobile: this.iphoneNumber
        })
        .then(response => {
          if (response.data.status == 1) {
            this.$message.success("验证码发送成功");
            this.isShow = false;
            this.isHide = true;
            this.loop(
              60,
              () => {
                "use strict";
                this.countDown--;
              },
              () => {
                "use strict";
                this.isShow = true;
                this.isHide = false;
              }
            );
          }
        });
    },

    loop(longTime, callback, finishCallback) {
      "use strict";
      const start = Date.now();
      let i = 0; // 60s
      const coundownFun = () => {
        const current = Date.now();
        const duration = current - start; // 当间隔为n毫秒时，
        if (duration > (i + 1) * 1000) {
          callback();
          i++;
        }

        //TODO
        if (i != longTime) window.requestAnimationFrame(coundownFun);
        else finishCallback();
      };
      window.requestAnimationFrame(coundownFun);
    },
    async clickReg() {
      if (!/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(this.$refs.iphoneNumber.value)) {
        this.$message.error("请输入正确的手机号码");
        return;
      }
      if (!/^.{6,}$/.test(this.$refs.regPwd.value)) {
        this.$message.error("请输入6位数以上密码");
        return;
      }
      if (!this.confirmPwd) {
        this.$message.error("请确认密码");
        return;
      }
      if (this.regPwd !== this.confirmPwd) {
        this.$message.error("两次密码输入不一致");
        return;
      }
      if (!this.messageCode) {
        this.$message.error("请输入验证码");
        return;
      }
      try {
        const wechat = JSON.parse(getStore("weChat")) || '';
        const response = await api_u.register({
          mobile: this.iphoneNumber,
          pwd: this.regPwd,
          sms_code: this.messageCode,
          openid: wechat.openid || "",
          access_token: wechat.access_token || "",
          unionid: wechat.unionid || ""
        });
        const { data, info, status } = response.data;
        this.$store.commit("USER_LOGIN", data);
        if (status == "1") {
          this.$message.success("注册成功!");
          if (wechat) {
            this.$store.commit("USER_LOGIN", data);
            //                  	router.push('/user/userinfo')
            window.open("http://web.li-shang-bin.com/#/user/userinfo", "_self");
            removeStore("weChat");
          } else {
            this.$router.push("/login");
          }
        } else if (status == "0") {
          this.$message.error("手机验证码错误或已经被注册");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style scoped>
.code,
.code-number {
  width: 60% !important;
  margin-right: 5%;
  float: left;
  box-sizing: border-box;
}

.register-box .get-code {
  width: 35%;
  background: #46b036;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  float: left;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 6px;
}

.register-box .get-codding {
  background: #999;
}
</style>

