<template>
 <div class="view"   v-loading="loading" style="padding-bottom:100px;margin-top:40px;">
  <el-carousel :interval="5000" arrow="always">
    <el-carousel-item v-for="item in ActivityLists" :key="item.activity_id">
    <router-link :to="`/activityCenter/activityDetail/${item.activity_id}`"  :style="{ 'background-image': `url(${item.activity_img} )`,'background-repeat':'no-repeat','display':'block','background-size':'100% 100%' ,'width':'100%','height':'100%'}"></router-link>
    </el-carousel-item>
  </el-carousel>
     
      <div class="hot_section">
          <nav class="hot_nav">
              <div class="hot_topic">
                  <router-link :to="{path:'/index'}" exact>热门文章</router-link>
                  <!-- <router-link :to="{path:'/index/html'}">html</router-link>
                  <router-link :to="{path:'/index/java'}">java</router-link>
              <router-link :to="{path:'/index/php'}">php</router-link> -->

           <router-link  exact :to="{path:`/index/${item.cate_name}`}" v-for="(item,index) in cateList" :key="index">{{item.cate_name}}</router-link>


              </div>
          </nav>
          <div class="hot_post" v-for="(item,index) in articleList" :key="index">
                <div class="hot_author">
                <span>
                    {{item.nickname}}</span> ·<span>
                      {{item.c_time | timeago}}</span> ·<span>
                        {{item.type | type}}
                      </span>
                </div>
                <router-link :to="{path:`/article/${item.topic_id}`}">
                  <div class="hot_title">   
                        {{item.title}}
                    
                      <div class="handelInfo">
                        <div>
                          <span class="imgBorder"><img src="~@/assets/images/assignment.svg" ></span><span class="nums">{{item.comment_num}}</span>
                        </div>  
                        <div>
                          <span class="imgBorder"><img src="~@/assets/images/zan.svg" ></span><span class="nums">{{item.like_num}}</span>
                        </div>           
                      </div>
                  </div>
                </router-link>
          </div>

      </div>
           <div class="block" style="margin-top:40px;">

            <el-pagination layout="prev, pager, next" :total="total" :page-size="limit" @current-change="handle">
            </el-pagination>
        </div>

 </div>
</template>

<script>
import api from "../api";
import api_A from '../api/article'
import slideShow from "../components/slideShow";
import moment from "moment";
import { mapState,mapActions } from "vuex";
export default {
  watch: {
    $route: function() {
      var tech_type = this.$route.params.tech_type;
      if (tech_type) {
        this.par = "";
      } else {
        this.par = "index_hot";
      }
      this.tech_type = this.setTech_type(tech_type);
      this.page = 1;

      this.getArticleList();
    }
  },
  created() {
 
      var urlObj = this.getUrlVars(window.location.href);
  
      if (urlObj.code) {
        //如果有code那么证明是微信扫码过来的
        this.weChatLogin({code: urlObj.code});
        return;
      }
    this.getArticleList();
    this.bannerList();
    this.getcatelist();
    document.title = '首页'
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
    ...mapActions(["weChatLogin"]),     
      getUrlVars(url) {
        var hash;
        var myJson = {};
        var hashes = url.slice(url.indexOf("?") + 1).split("&");
        var arr = [];
        for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split("=");
          if (myJson.hasOwnProperty(hash[0])) {
            myJson[hash[0]] = myJson[hash[0]] + "," + hash[1];
          } else {
            myJson[hash[0]] = hash[1];
          }
        }
        return myJson;
      },
    getcatelist() {
      api_A.getCatelist().then(({ data }) => {
        this.cateList = data.data.tech;
      });
    },
    bannerList() {
      api.bannerList().then(({ data }) => {
        this.ActivityLists = data.data;
      });
    },
    handle(val) {
      this.page = val;
      this.getArticleList();
    },
    setTech_type(data) {
      if (data == "html") {
        return 1;
      }
      if (data == "php") {
        return 2;
      }
      if (data == "java") {
        return 3;
      }
    },
    getArticleList() {
      this.tech_type = this.setTech_type(this.$route.params.tech_type);
      api_A
        .getArticlesList({
          par: this.par,
          tech_type: this.tech_type,
          tsort: this.tsort
        })
        .then(({ data }) => {
          this.articleList = data.data.data;
          this.total = data.data.total;
          this.loading = false;
        });
    }
  },
  components: {
    slideShow
  },
  data() {
    return {
      par: "index_hot",
      cateList: "",
      loading: true,
      ActivityLists: "",
      total: 0,
      limit: 10,
      articleList: {},
      page: 1,
      tech_type: ""
    };
  }
};
</script>
<style lang="scss" scoped>
.hot_nav {
  padding: 20px 0;
  overflow: hidden;
  border-bottom: 1px solid #000;
  .hot_article {
    float: left;
    font-weight: normal;
    margin-right: 40px;
    font-size: 16px;
  }
}
.hot_article {
  float: left;
  margin-right: 30px;
  font-size: 16px;
}
.hot_topic {
  font-size: 15px;
  float: left;
  a {
    color: #2e3135;
    margin-right: 23px;
    font-weight: 700;
  }
}
.hot_post {
  padding: 14px 0;
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
.handelInfo {
  float: right;
}
.handelInfo div {
  float: left;
  margin-right: 10px;
  position: relative;
  padding-right: 12px;
}
.handelInfo img {
  width: 16px;
  display: inline-block;
  vertical-align: middle;
}
.handelInfo span {
  display: inline-block;
  font-size: 12px;
  color: #909090;
}
.imgBorder {
  text-align: center;
  border: 1px solid #cc8565;
  border-radius: 50%;
  background-color: #cc8565;
  height: 20px;
  width: 20px;
}
.nums {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
