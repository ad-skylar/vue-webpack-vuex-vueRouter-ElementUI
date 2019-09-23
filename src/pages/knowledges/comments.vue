<template>
  <div class="commentPage" @click="boxClick">
    <div v-for="(item,index) in commentList" class="border_bottom" :key = 'index'>
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
              <a href="javascript:;" style='' @click="postCommentTwo(item.task_dynamic_id,item.avatar,item.nick_name,'',item.user_id)" class="comment-btn-two">回复</a>
            </div>
          </div>
          <div class="date" :class='{cur:isShow===index}'>{{item.c_time | moment}}</div>
        </div>
      </div>
      <!-- 父级的index影响子级 -->
			<div  v-if="index == isShow" >
				<div v-for="(item2,index2) in item.child" :key = 'index2'>
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
								<a href="javascript:;" style='' @click="postCommentThree(item2.task_dynamic_id,item2.avatar,item2.nick_name,item2.double_deck_id,item2.user_id)" class="comment-btn-two">添加回复</a>

							</div>
						</div>
						<div class="date">{{item2.c_time | moment}}</div>
					</div>

				</div>
			</div>
   

    </div>
    <div class="more" v-if="page<last_page">
      <a href="javascript:;" @click="loadMore">加载更多</a>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { bus } from '../../util/util'

import api_K from '../../api/knowledge'
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
      api_K.dynamicDisplay(
        {
          "task_id": this.$route.params.task_id,
          'page':this.page
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
    postCommentTwo(task_dynamic_id, p_avatar, p_nick_name, double_deck_id,p_user_id) {
      // 未登录提示！
      if (!this.userlogin) {
        this.$emit('alert')
        return;
      }
      if (!this.commentTwo) {
        this.$message.error('请输入评论内容！')
        return;
      }
      api_K.doubleDynamicsAdd({
        'p_user_id':p_user_id,
        "user_id": this.userlogin.user_id,
        "avatar": this.userlogin.avatar,
        "nick_name": this.userlogin.nick_name,
        "content": this.commentTwo,
        "task_dynamic_id": task_dynamic_id,
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

    postCommentThree(task_dynamic_id, p_avatar, p_nick_name, double_deck_id,p_user_id) {
      // 未登录提示！
      if (!this.userlogin) {
        this.$emit('alert')
        return;
      }
      if (!this.commentThree) {
        this.$message.error('请输入评论内容！')
        return;
      }
      api_K.doubleDynamicsAdd({
        'p_user_id':p_user_id,
        "user_id": this.userlogin.user_id,
        "avatar": this.userlogin.avatar,
        "nick_name": this.userlogin.nick_name,
        "task_dynamic_id": task_dynamic_id,
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
<style scoped>
	.commentPage {
		background: #f7f8fa;
		margin-top: 20px; 
		 width:80%;
		margin: auto;
	}
	
	.box {
		display: flex;
		margin-bottom: 1rem;
		margin-top: 0;
	}
	
	.box .left {
		width: 6%;
		padding: 0 10px;
		padding-left: 0;
	}
	
	.box .right {
		flex: 1;
	}
	
	.box .left,
	.box .right {
		float: left;
		text-align: left;
	}
	
	.avatar {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		border: 1px solid #ddd;
	}
	
	.author {
		display: inline-block;
		position: relative;
		top: 10px;
	}
	
	.author img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 1px solid #ddd;
	}
	
	.author_name {
		display: inline-block;
		line-height: 25px;
		display: flex;
	}
	
	.date {
		display: block;
		height: 22px;
		line-height: 22px;
		clear: left;
		float: right;
		margin-right: 16px;
	}
	
	.main_content {
		padding-left: 0;
	}
	
	.cursor {
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		color: #333;
		font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
		font-size: 16px;
		line-height: 1.5;
		word-wrap: break-word;
	}
	
	.footnote {
		height: 41px;
		width: 100%;
		line-height: 56px;
		border-bottom: 1px solid #dcdcdc;
	}
	
	.footnote span {
		margin-right: 8px;
	}
	
	.dis_name {
		color: rgb(21, 19, 19);
		font-size: 15px;
		font-weight: bold;
		float: left;
		white-space: nowrap;
	}
	
	.comment_contents {
		float: left;
		padding-left: 10px;
		font-size: 14px;
		font-weight: normal;
		word-wrap: break-word;
		word-break: break-all;
	}
	
	.box-dis {
		padding: 0 0 1rem 0;
		padding: 10px 10px;
	}
	
	.box-child {
		border: 1px solid #dcdcdc;
		width: 90%;
		margin-left: 9%;
		padding: 10px;
		padding-left: 0;
		box-sizing: border-box;
		overflow: hidden;
	}
	
	.border_bottom {
		border-bottom: 1px solid #dcdcdc;
		padding: 10px 10px;
	}
	/* 回复 */
	
	.reply {
		float: right;
		height: 22px;
		line-height: 22px;
	}
	/* 被回复者 */
	
	.reply_name {
		font-weight: normal;
	}
	/* 评论按钮 */
	
	.comment-btn {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
		color: #fff;
		background: #dc2929;
		border-radius: 4px;
		font-size: 14px;
		padding: 6px 12px;
		margin-top: 10px;
		display: inline-block;
		float: right;
	}
	
	.comment-btn:hover,
	.comment-btn-two:hover {
		background: rgba(255, 0, 0, 0.68);
	}
	
	.t_t_box {
		display: none;
	}
	
	.t_t_box.cur {
		display: block;
		overflow: hidden;
		background: #efefef;
		padding: 0 16px;
		margin-left: 1%;
	}
	/* 评论框样式 */
	
	.textarea {
		border: 1px solid #ccc;
		width: 100%;
		height: 90px;
		border-radius: 6px;
		margin-top: 15px;
		padding: 5px;
		font-size: 14px;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
		box-sizing: border-box;
	}
	/* 楼中评论框 */
	
	.textarea_two {
		border: 1px solid #ccc;
		width: 100%;
		height: 80px;
		border-radius: 6px;
		margin-top: 15px;
		padding: 5px;
		font-size: 14px;
		-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
		float: left;
		box-sizing: border-box;
	}
	/* 楼中楼按钮 */
	
	.comment-btn-two {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
		color: #fff;
		background: #dc2929;
		border-radius: 4px;
		font-size: 14px;
		padding: 6px 12px;
		display: inline-block;
		float: right;
		margin: 15px 0;
	}
	/* 点击显示 */
	
	.clickShow {
		color: rgba(230, 22, 22, 0.88);
	}
	
	.clickShow.cur {
		display: none;
	}
	/* 收藏 点赞 */
	
	.someHandel {
		// width :80%;
		margin: auto;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid #ccc;
		padding: 20px 0;
	}
	
	.otherHadel {
		width: 180px;
		height: 50px;
		border: 1px solid #dc2929;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-radius: 20px;
		padding: 0 10px;
	}
	
	.otherHadel span {
		height: 30px;
		display: inline-block;
		display: flex;
		justify-content: center;
		line-height: 30px;
		flex: 1;
		color: #dc2929;
		cursor: pointer;
	}
	
	.otherHadel span:first-of-type {
		border-right: 1px solid #dc2929;
	}
	
	.otherHadel span>img {
		width: 25px;
		height: 25px;
		opacity: 0.8;
	}
	.more{
		font-size: 16px;
		line-height: 18px;
		color: black;
		padding: 15px 0;
		text-align: center;
	}
</style>