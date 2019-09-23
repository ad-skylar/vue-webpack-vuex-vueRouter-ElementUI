<template>
    <div id="content" class="login-box">
        <h3 class="login-title">
            {{title}}
        </h3>
        <div class="line"></div>
        <input type="text" v-model="mobileNumber" placeholder="请输入登录手机号">
        <input type="password" v-model="loginPwd" placeholder="6-16秘密，区分大小写，不能使用空格">
        <div class="content-form">
            <input type="checkbox" value="autoLogin">
            <label for="autoLogin" @click="isChecked" v-bind:class="{ 'class-checked': isHide, 'class-unchecked': isShow }">下次自动登录</label>
            <p class="fr">
                <span style="cursor:pointer">忘记密码?</span>
                <router-link to="/register">
                    <span class="to-register">立即注册</span>
                </router-link>
            </p>
        </div>
        <div class="login-btn" @click="clickLogin">登录</div>
        	<p>使用合作网站账号登录</p>
        	<a id="weChat" href="https://open.weixin.qq.com/connect/qrconnect?appid=wxc649fbdaa41fc636&response_type=code&scope=snsapi_login&redirect_uri=http%3a%2f%2fweb.li-shang-bin.com&login_type=jssdk&self_redirect=default">
        		<i class="icon iconfont icon-weixin"></i>
        	</a>
        <div id="login_container" ></div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { mapMutations } from 'vuex'

        
export default {	
    data() {
        return {
            title: '欢迎回到猿计划',
            isShow: true,
            isHide: false,
            mobileNumber: '',
            loginPwd: '',
            weChatPic:false
        }
    },
    create(){
        document.title = '登录'
    },
    methods: {
        ...mapMutations(
            ['USER_LOGIN']
        ),
         ...mapActions(['login']),
        isChecked() {
            if (this.isShow) {
                this.isShow = false;
                this.isHide = true;
            } else {
                this.isShow = true;
                this.isHide = false;
            }
        },
        clickLogin() {
            if (!this.mobileNumber) {
                this.$message.error('请输入手机号')
                return
            }
            if (!this.loginPwd) {
                this.$message.error('请输入密码')
                return
            }
            this.login({
                mobile: this.mobileNumber,
                pwd: this.loginPwd
            })
        }
    }
}
</script>

<style>
	.login-btn>p{
		line-height: 36px;
	}
	a#weChat>i{
		color:green;
		font-size: 36px;
	}
</style>

