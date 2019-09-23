<template>
  <div id="header" class="header">
    <div class="view">
      <div class="logo-box" @click='Topath("index")'>
        <img class="logo fl" :src="imgsrc">
        <h2 class="team-title fl">
          猿计划
        </h2>
      </div>

      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" >
         <el-menu-item index="9"  @click='Topath("user/myInfo")'>
          <router-link to="/user/myInfo" exact>未读消息<span v-if="messageNum">{{messageNum}}</span></router-link>
        </el-menu-item>
        <el-menu-item index="1" @click='Topath("index")'>
          <router-link to="/index" exact>首页</router-link>
        </el-menu-item>
        <el-menu-item index="8" @click='Topath("knowledge")'>
          <router-link to="/knowledge" exact>知识体系</router-link>
        </el-menu-item>
         <el-menu-item index="10" @click='Topath("activity")'>
          <router-link to="/activity" exact>活动中心</router-link>
        </el-menu-item>
        <el-menu-item index="7" @click='Topath("home")'>
          <router-link to="/home" exact>文章</router-link>
        </el-menu-item>
        <!-- <el-menu-item index="6" @click='Topath("action")'>
          <router-link to="/action" exact>实战</router-link>
        </el-menu-item> -->
        <el-menu-item index="5" @click='Topath("write")' v-if="userlogin">
          <router-link to="/write" exact>写文章</router-link>
        </el-menu-item>
             <!-- <el-menu-item index="10" @click='Topath("questions")'>
          <router-link to="/Questions" exact>问题</router-link>
        </el-menu-item> -->
        <el-menu-item index="2" @click='Topath("login")' v-if="!userlogin">
          <router-link to="/login" exact>登陆</router-link>
        </el-menu-item>
        <el-menu-item index="3" @click='Topath("register")' v-if="!userlogin">
          <router-link to="/register" exact>注册</router-link>
        </el-menu-item>
        <el-submenu index="4" v-if="userlogin" class="myCenter">
          <template slot="title">
            <a href="javascript:;" @click="Topath('user')" class="avatarbox"><img :src='userlogin.avatar' alt="" class="avatar"></a>
          </template>
 
          <el-menu-item index="2-1" @click="Topath('user')">个人中心</el-menu-item>
          <el-menu-item index="2-1" @click="Topath('user/resetpwd')">修改密码</el-menu-item>
          <el-menu-item index="2-1" @click="Topath('user/mynote')">我的帖子</el-menu-item>
          <el-menu-item index="2-1" @click="Topath('user/mycollection')">我的收藏</el-menu-item>
          <el-menu-item index="2-1" @click="Topath('user/mytask')">我的任务</el-menu-item>
          <el-menu-item index="2-2" @click="logout">退出</el-menu-item>
        </el-submenu>
      </el-menu>

      <dig v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></dig>
    </div>
  </div>
</template>

<script>
import api from "../api";
import { mapMutations, mapState } from "vuex";
import img_logo from "../assets/images/logo.png";
import Dig from "../components/Dialog";
import $ from "jquery";

export default {
  created() {
    this.websocketInit();
    this.INIT_STATE();
    this.getmyInfoNum();
  },
  components: {
    Dig
  },
  data() {
    return {
      showinfoNum: true,
      infoNum: "",
      showDialog: false,
      dialogOption: {
        title: "",
        text: "确认注销吗？",
        cancelButtonText: "取消",
        confirmButtonText: "确定"
      },
      activeIndex: "",
      imgsrc: img_logo
    };
  },
  computed: {
    ...mapState(["userlogin","messageNum"])
  },
  methods: {
    getmyInfoNum() {
      api
        .myInfoNum({
          user_id: this.userlogin.user_id
        })
        .then(({ data }) => {
          var comment_num=data.data.comment_num
          if(comment_num){
            this.MESSAGE_INIT(comment_num)
          }else{
            this.MESSAGE_EMPTY()
          }
        });
    },
    websocketInit() {
      const that = this;
      const ws = new WebSocket("ws://60.205.209.68:8282");
      ws.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const type = data.type || "";
        switch (type) {
          // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
          case "init":
            // 利用jquery发起ajax请求，将client_id发给后端进行uid绑定
            $.post(
              "http://api.li-shang-bin.com/iweb/Websocket/bind",
              { client_id: data.client_id, user_id: that.userlogin.user_id },
              function(data) {},
              "json"
            );
            break;
          case "comment":
            console.log(e.data);
            that.MESSAGE_ADD();
          default:
        }
      };
    },
    ...mapMutations(["INIT_STATE", "USER_LOGOUT",'MESSAGE_ADD',"MESSAGE_INIT",'MESSAGE_EMPTY']),
    logout() {
      this.$store.dispatch("userlogout");
      this.MESSAGE_EMPTY();
    },

    Topath(path) {
      this.$router.push({ path: `/${path}` });
    },
  }
};
</script>

<style>

</style>

