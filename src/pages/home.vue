<template>
  <section v-loading="loading" element-loading-customClass="test" class="view">

    <ul class="label-list user-page">
      <li @click="setType('')">
        <span></span>所有分类
      </li>
      <li @click="setType('jingyan')">
        <span></span>经验分享
      </li>
      <li @click="setType('rumen')">
        <span></span>入门学习
      </li>
      <li @click="setType('chengguo')">
        <span></span>成果分享
      </li>
    </ul>
    <div class="label-list-line"></div>
    <div class="">
      <div class="class_tab">
        <ul>
          <li :class="{ tab_active: isActive==1 }" @click=" changeActive('new',1)">最新</li>
          <li :class="{ tab_active: isActive==2 }" @click="changeActive('hot',2)">热门</li>
        </ul>
      </div>
      <!--<table class="table">-->
      <!--<thead>-->
      <!--<tr class="talbe_head">-->
      <!--<td>主题</td>-->
      <!--<td>分类</td>-->
      <!--<td>回复</td>-->
      <!--<td>浏览</td>-->
      <!--<td>发布时间</td>-->
      <!--</tr>-->
      <!--</thead>-->
      <!--<tbody class="">-->
      <!--<tr class="tabody" v-for="(item,index)  in articleList" :key="index">-->
      <!--<td>-->
      <!--<router-link :to="{path:`/article/${item.topic_id}`}">{{item.title}}</router-link>-->
      <!--</td>-->
      <!--<td>{{type[item.type]}}</td>-->
      <!--<td>{{item.comment_num}}</td>-->
      <!--<td>{{item.browser_num}}</td>-->
      <!--<td>{{item.c_time|moment}}</td>-->
      <!--</tr>-->
      <!--</tbody>-->
      <!--</table>-->

      <div class="hot_post" v-for="(item,index) in articleList" :key="index">
        <div class="hot_author">
                    <span>
                        {{item.nickname}}</span> ·<span>
                          {{item.c_time | timeago}}</span> ·<span>
                            {{item.type | type}}
                          </span>
        </div>
        <div class="hot_title">
          <router-link :to="{path:`/article/${item.topic_id}`}">
            {{item.title}}
          </router-link>

        </div>
      </div>
    </div>
    <div class="block" style="margin-top:40px;">

      <el-pagination layout="prev, pager, next" :total="total" :page-size="limit" @current-change="handle">
      </el-pagination>
    </div>

    <goTop></goTop>
    <FooterMsg></FooterMsg>

  </section>
</template>

<script>
import goTop from "../components/Scrolltop";
import FooterMsg from "../components/FooterMsg";
import { mapMutations, mapActions, mapState } from "vuex";
import { setStore, getStore, removeStore } from "../util/util";
import moment from "moment";
import api_A from '../api/article'
export default {
  created() {
    this.typeUrl = this.$route.params.type;
  
    this.getArticleList();
    document.title = '文章'
  },
  components: {
    goTop,
    FooterMsg
  },
  data() {
    return {
      loading: true,
      total: 0,
      limit: 10,
      page: 1,
      articleList: "",
      isActive: 1,
      tsort: "",
      type: {
        "1": "所有分类",
        "2": "经验分享",
        "3": "入门学习",
        "4": "成果分享"
      },
      typeUrl: ""
    };
  },
  computed: {
    ...mapState(["userlogin"]),
    typeId: {
      get: function() {
        if (this.typeUrl == "jingyan") {
          return "2";
        }
        if (this.typeUrl == "rumen") {
          return "3";
        }
        if (this.typeUrl == "chengguo") {
          return "4";
        }
      },
      set: function() {}
    }
  },
  filters: {
    timeago(updated) {
      var updated = parseInt(updated) * 1000;
      moment.locale("zh-cn");
      return moment(updated).fromNow();
    },
    type(data) {
      if (data == 2) {
        return "经验分享";
      }
      if (data == 3) {
        return "入门学习";
      }
      if (data == 4) {
        return "成果分享";
      }
    }
  },
  methods: {
    ...mapMutations(["USER_LOGIN"]),
    handle(val) {
      this.page = val;
      this.getArticleList();
    },
    changeActive(tsort, index) {
      this.isActive = index;
      this.tsort = tsort;
      this.page = 1;
      this.getArticleList();
    },
    getArticleList() {
      api_A
        .getArticlesList({
          user_id: this.userlogin.user_id,
          page: this.page,
          type: this.typeId || "",
          tsort: this.tsort || ""
        })
        .then(response => {
          let res = response.data.data;
          this.articleList = res.data;
          this.total = res.total;
          this.loading = false;
        });
    },
    setType(index) {
      this.typeUrl = index;
      this.$router.push(`/home/${index}`);
      this.page = 1;
      this.getArticleList();
    }
  }
};
</script>
<style lang="scss">
.hot_post {
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  .hot_author {
    color: #909090;
    margin-bottom: 10px;
    font-size: 12px;
    span {
      margin-right: 5px;
    }
  }
  .hot_title {
    color: #2e3135;
    font-weight: 500;
    font-size: 17px;
    a {
      color: #2e3135;
    }
  }
}

.label-listv {
  display: flex;
  align-items: center;
}

.label-list-line {
  border-bottom: 1px solid #ddd;
}

.label-list {
  list-style: none;
}

.label-list li {
  padding: 10px;
  cursor: pointer;
  margin-right: 20px;
}

.label-list li > span {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 8px;
}

.label-list li:first-of-type span {
  background: #259a25;
}

.label-list li:nth-of-type(2) span {
  background: #259d94;
}

.label-list li:nth-of-type(3) span {
  background: #26719b;
}

.label-list li:nth-of-type(4) span {
  background: #9c2698;
}

.topic_top {
  width: 100%;
  border-bottom: 1px solid #dcdcdc;
  height: 40px;
}

.tab {
  margin-left: 20%;
  width: 100%;
}

.tab li {
  float: left;
  display: flex;
  height: 40px;
  align-items: center;
  margin-right: 40px;
}

.tab li div {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
}

.class_tab ul {
  display: inline-block;
  padding: 10px 0;
}

.class_tab ul li {
  display: inline-block;
  padding: 7px 14px;
  cursor: pointer;
}

.class_tab ul li:hover {
  cursor: pointer;
}

.class_tab span {
  padding: 10px 30px;
  margin-top: 7px;
  background: #e30713;
  border-radius: 20px;
  cursor: pointer;
  float: right;
}

.class_tab {
  color: #000000;
  width: 100%;
}

.tab_active {
  background: #e7171e;
  color: #ffffff;
}

.table {
  width: 100%;
  clear: both;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
  padding: 20px 0;
}

.talbe_head {
  border-bottom: 1px solid #010101;
  font-size: 16px;
  color: #000;
  height: 30px;
  font-weight: normal;
}

.table tr td:first-child {
  width: 50%;
  text-align: left;
}

.tabody {
  height: 54px;
  border-bottom: 1px solid rgb(220, 226, 229);
  color: #000000;
}

.tabody a {
  color: #000;
  // -webkit-transition: all .7s;
  // -moz-transition: all .7s;
  // transition: all .7s;
}

.tabody a:hover {
  color: #e30713;
  text-decoration: underline;
  // padding-left: 15px;
}

.tabody td {
  color: #858585;
  font-size: 15px;
  font-weight: normal;
}

.loading img {
  display: block;
  margin: 0 auto;
}
</style>
