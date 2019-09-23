<template>
  <div id="myCollection" class="myCollection">
    <div class="usercenter-title my-note">
      <p>主题</p>
      <ul class="title-list">
        <li>分类</li>
        <li>回复</li>
        <li>浏览</li>
        <li>发布时间</li>
        <li>操作</li>
      </ul>
    </div>

    <div class="article-content-wrap my-note" v-for="(item,index) in articleList" :key="index">
      <p class="article-title" @click="selectArticle(item)">{{item.title}}</p>
      <ul class="article-property title-list">
        <li>{{type[item.type]}}</li>
        <li>{{item.comment_num}}</li>
        <li>{{item.browser_num}}</li>
        <li>{{item.c_time | moment}}</li>
        <li @click="cancelCollect(item.topic_id)" class="cancel">
          取消收藏
        </li>

      </ul>
    </div>
    <div class="block" style="margin-top:40px;">

      <el-pagination  v-show= "showPage" layout="prev, pager, next" :total="total" :page-size="limit" @current-change="handle">
      </el-pagination>
    </div>
   <!-- *********** -->
    <div class="empty"  v-show="showEmpty">
      <p> <img src="~@/assets/images/star_empty.svg"></p>
      <p>你还没有任何收藏，快去看看<router-link to="/home">文章</router-link>吧!</p>
  </div>
    <dig v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></dig>
  </div>
  
</template>

<script>
import moment from 'moment'
import Dig from '../../components/Dialog'
import { mapMutations, mapState } from 'vuex'
import api_M from '../../api/my'
import api_A from '../../api/article'
export default {
  components: {
    Dig
  },
  filters: {
    moment(value) {
      var value = parseInt(value) * 1000
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
  }
  ,
  data() {
    return {
      //  警告弹出框
      showDialog: false,
      //收藏为空
      showEmpty : false,
      //分页显示
      showPage : false,
      dialogOption: {
        title: '',
        text: '确认删除吗？',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      },


      type: {
        "1": '所有分类',
        "2": '经验分享',
        "3": '入门学习',
        "4": '成果分享',
      },

      page: 1,
      total: 0,
      limit: 10,
      articleList: '',
    }
  },
  computed: {

    ...mapState([
      'userlogin'
    ])

  },
  methods: {
    handle(val) {
      this.page = val;
      this.getList()
    },

    selectArticle(article) {
      this.$router.push(
        { path: `/article/${article.topic_id}` }
      )

    },

    getList() {

      api_M.mycollection({
        page : this.page,
        user_id: this.userlogin.user_id,
        token: this.userlogin.token,
      }).then(({ data }) => {
        const res = data.data.list;
     
        this.total = res.total
        this.articleList = res.data
        if( this.articleList == ""){
          this.showEmpty = true;
          this.showPage =false;
        }else{
          this.showPage =true;
          this.showEmpty = false;
        }

      })
    },
    //取消收藏
    cancelCollect(_id) {
      this.showDialog = true;
      this.$refs.dialog.confirm().then(() => {
        this.showDialog = false;
        api_A.topicCollect({
          user_id: this.userlogin.user_id,
          topic_id: _id,
          token: this.userlogin.token
        }).then(res => {           
          if (res.data.status == 1 && res.data.data.tab == 2)
            this.$message.success('删除成功')
          this.getList(1);
        })
      }).catch(() => {
        this.showDialog = false;
      })
      return;
    }
  },
  created() {
    this.getList();
  }
}
</script>

<style>
.myCollection {
  font-size: 15px;
}

.my-note {
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
}

.myCollection ul {
  list-style: none
}

.title-list {
  display: flex;
}

.title-list img {
  width: 18px;
}

.title-list li {
  width: 90px;
  text-align: center;
  cursor: pointer;
}

.title-list li:last-of-type {
  padding-right: 0;
}

.article-content-wrap .article-title {
  color: #000;
  cursor: pointer;
}

.article-title:hover {
  color: red
}

.article-content-wrap {
  height: 66px;
  border-bottom: 1px solid #ddd;
  align-items: center;
}

.article-property {
  color: #999;
}


/* 分页 */

.pagination {
  position: relative;
  margin-top: 20px;
}

.pagination li {
  display: inline-block;
  margin: 0 5px;
}

.pagination li a {
  padding: .5rem 1rem;
  display: inline-block;
  border: 1px solid #ddd;
  background: #fff;

  color: #ea0f2d;
}

.pagination li a:hover {
  background: #eee;
}

.pagination li.active a {
  background: #ea0f2d;
  color: #fff;
}
</style>