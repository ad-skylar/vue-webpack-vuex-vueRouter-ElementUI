<template>
  <div class="commentPage" @click="boxClick">
    <div v-for="(item,index) in commentList" class="border_bottom">
      <div class="box box-dis">
        <div class="left fl">
          <img class="avatar" :src='item.avatar' alt="">
        </div>
        <div class="right">
          <div class="author_name">
            <label class="dis_name">{{item.nick_name}}:</label>
            <div class="comment_contents">{{item.content}}</div>
          </div>
          <!-- 二级回复 -->
          <div class="" @click="stop($event)">

            <a href="javascript:;" class="clickShow" :class='{cur:isShow===index}' @click="isShow = index">
              <div v-if="item.child" class="reply">({{ArrayLength(item.child)}}) 回复</div>
              <div v-if="!item.child" class="reply">回复</div>
            </a>
            <!-- <a href="javascript:;">展开收起</a> -->
            <div class="t_t_box" :class='{cur:isShow===index}'>
              <textarea class="textarea_two" v-model="commentTwo" autofocus="autofocus"></textarea>
              <a href="javascript:;" style='' @click="postCommentTwo(item.topic_comment_id,item.avatar,item.nick_name,'',item.user_id)" class="comment-btn-two">回复</a>
            </div>
          </div>
          <div class="date" :class='{cur:isShow===index}'>{{item.c_time | moment}}</div>
        </div>
      </div>
      <!-- 父级的index影响子级 -->
      <div v-for="(item2,index2) in item.child" v-if="index==isShow">
        <div class="box-child ">
          <div class="left fl" style="width: 6%;padding: 0 10px;">
            <div class="">
              <img class="avatar" :src='item2.avatar' alt="">
            </div>
          </div>
          <div class="right">
            <div class="author_name">
              <label class="dis_name">
                <span class="dis_name reply_name">{{item2.nick_name}} 回复 </span>
              </label>
              <label class="dis_name reply_name">&nbsp;{{item2.p_nick_name}}: </label>
              <div class="comment_contents"> {{item2.content}} </div>
            </div>
          </div>
          <!-- 楼中楼 -->
          <div @click="stop($event)">

            <div class="reply">
              <a href="javascript:;" class="clickShow" :class='{cur:box===index && isShow2===index2}' @click="box=index, isShow2=index2">添加回复</a>
            </div>
            <!-- 满足两个条件： 当前点击的父级下 当前元素 -->
            <div class="t_t_box" style="overflow:hidden" :class='{cur:box===index && isShow2===index2}'>
              <textarea class="textarea_two" v-model="commentThree" autofocus="autofocus"></textarea>
              <a href="javascript:;" style='' @click="postCommentThree(item2.topic_comment_id,item2.avatar,item2.nick_name,item2.double_deck_id,item2.user_id)" class="comment-btn-two">添加回复</a>

            </div>
          </div>
          <div class="date">{{item2.c_time | moment}}</div>
        </div>

      </div>

    </div>
    <div class="more" v-if="page<last_page">
      <a href="javascript:;" @click="loadMore">加载更多</a>
    </div>
  </div>
</template>
<script>
import api_a from '../../api/article'
import moment from 'moment'
import { bus } from '../../util/util'

export default {
  props: [
    'userlogin',
  ],
  filters: {
    moment(value) {
      var value = parseInt(value) * 1000
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  data() {
    return {

      commentList: '',
      page: 1,
      last_page: '',  //总页数

      // 评论框的双向绑定
      commentTwo: '',
      commentThree: '',
      // 二级回复评论框的展示
      isShow: -1,
      // 楼中楼评论框的展示
      isShow2: -1,
      // 楼中楼父级的标志，同时满足两个条件楼中楼评论框才显示
      box: '',
    }
  },
  mounted() {
    this.getComment();
    var self = this
    bus.$on('get', function(page) {
      this.page=page;
      self.getComment();
    })
  },

  methods: {
    boxClick(){
 this.isShow = -1;
      this.isShow2 = -1;
    },
    // 评论分页展示
    getComment(flag) {
      api_a.getCommentsList(
        {
          "topic_id": this.$route.params.topic_id,
          'page': this.page
        }).then(response => {
          let res = response.data.data
          this.last_page = res.last_page
          if (flag) {
            this.commentList = this.commentList.concat(res.list)

          } else {
            this.commentList = res.list;

          }
        })



    },
    loadMore() {
      this.page++
      this.getComment(true)
    },
    // 返回一个数组对象的长度
    ArrayLength(obj) {
      var objType = typeof obj;
      if (objType == "string") {
        return obj.length;
      } else if (objType == "object") {
        var objLen = 0;
        for (var i in obj) {
          objLen++;
        }
        return objLen;
      }
    },





    // 评论评论
    postCommentTwo(topic_comment_id, p_avatar, p_nick_name, double_deck_id,p_user_id) {
      // 未登录提示！
      if (!this.userlogin) {
        this.$emit('alert')
        return;
      }
      if (!this.commentTwo) {
        this.$message.error('请输入评论内容！')
        return;
      }
      api_a.doubleDeckAdd({
        'p_user_id':p_user_id,
        "user_id": this.userlogin.user_id,
        "avatar": this.userlogin.avatar,
        "nick_name": this.userlogin.nick_name,
        "content": this.commentTwo,
        "topic_comment_id": topic_comment_id,
        "p_avatar": p_avatar,
        "p_nick_name": p_nick_name,
        "p_id": double_deck_id
      })
        .then(response => {
          if (response.data.status == 1) {
            this.$message.success('发布成功!')
            this.page = 1;
            this.isShow = -1;
            this.isShow2 = -1;  //change
            this.commentTwo = '';
            this.getComment();


          }
        })
    },


    // 回复楼中楼

    postCommentThree(topic_comment_id, p_avatar, p_nick_name, double_deck_id,p_user_id) {
      // 未登录提示！
      if (!this.userlogin) {
        this.$emit('alert')
        return;
      }
      if (!this.commentThree) {
        this.$message.error('请输入评论内容！')
        return;
      }
      api_a.doubleDeckAdd({
        'p_user_id':p_user_id,
        "user_id": this.userlogin.user_id,
        "avatar": this.userlogin.avatar,
        "nick_name": this.userlogin.nick_name,
        "topic_comment_id": topic_comment_id,
        "content": this.commentThree,
        "p_avatar": p_avatar,
        "p_nick_name": p_nick_name,
        // 所对应值是每个评论特有的id
        "p_id": double_deck_id
      })
        .then(response => {
          if (response.data.status == 1) {
            this.$message.success('发布成功!');
            this.page = 1;
            this.commentThree = '';
            this.isShow2 = -1;
            this.isShow = -1;//change
            this.getComment();

          }
        })
    },
    boxClick(ev) {
      this.isShow = -1;
      this.isShow2 = -1;
    },
    stop(event) {
      event.cancelBubble = true;

    }




  }
}
</script>
