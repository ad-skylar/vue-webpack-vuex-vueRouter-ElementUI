<template>
  <div>
     <div v-for="(item,index) in infoList" :key="index">
       
       <div class="info-box">

         <div><span>评论内容:</span>{{item.content}}</div>        
          <div><span>评论人:</span>{{item.nick_name}}</div>
    <div> <span>来自:</span>{{item.title}}</div>
         <a href="javascript:;" @click="toArticle(item.topic_id)">查看详情</a>
       </div>

     </div>
      <div class="empty"  v-show="showEmpty">
      <p> <img src="~@/assets/images/message.svg"></p>
      <p>暂无通知</p>
  </div>
  </div>
</template>
<script>
import api from "../../api";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      infoList: "",
      //没有消息
      showEmpty : true,
    };
  },
  computed: {
    ...mapState(["userlogin"])
  },
  created(){
    document.title = '我的消息'
  },
  methods: {
    ...mapMutations([
      "INIT_STATE",
      "USER_LOGOUT",
      "MESSAGE_ADD",
      "MESSAGE_INIT",
      "MESSAGE_EMPTY"
    ]),

    toArticle(topic_id) {
      var that = this;
      setTimeout(function() {
        that.getmyInfoNum();
      }, 200);
      this.$router.push("/article/" + topic_id);
    },
    getmyInfoNum() {
      api
        .myInfoNum({
          user_id: this.userlogin.user_id
        })
        .then(({ data }) => {
          var comment_num = data.data.comment_num;
          if (comment_num) {
            this.MESSAGE_INIT(comment_num);
            console.log(1);
          } else {
            console.log(2);

            this.MESSAGE_EMPTY();
          }
        });
    }
  },
  created() {
    api
      .myInfoList({
        user_id: this.userlogin.user_id
      })
      .then(({ data }) => {
        this.infoList = data.data;
        if(data.data.length){
          this.showEmpty =false;
        }else{
            this.showEmpty =true;
        }
      });
  }
};
</script>
<style lang="scss" scoped>
.info-box {
  font-size: 16px;
  margin-bottom: 3px;
  min-height: 80px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 5px;
  span {
    color: #909090;
  }
}
</style>

