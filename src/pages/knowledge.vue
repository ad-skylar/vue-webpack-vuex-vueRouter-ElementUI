<template>
 <div class="view" style="padding-bottom:100px;">
      <div class="all_section">
          <nav class="hot_nav">
              <div class="hot_topic">
                  <a>全部</a>
                  <a>html</a>
                  <a>java</a>
                  <a>php</a>
              </div>
          </nav>
          <div class="item_content">
             <!-- *****项目介绍******* -->
              <div class="item_intro">
                <div class="intro_left">
                  <h5>{{knowledgeTheme.name}}</h5>
                  <p>{{knowledgeTheme.brief}}</p>
                </div>
                <div class="intro_right">
                  <h1>{{knowledgeTheme.second_name}}</h1>
                  <p><span></span>自学成才不求人<span></span></p>
                </div>
              </div>
              <!-- *****项目知识点******* -->
              <div class="item_detail" v-for="(item,index) in knowledgeList" :key="index">
                <h4><span class="round"></span>{{item.name}}</h4>
                <p class="study_way">学习途径</p>             
                  <div class="first_title" v-for="(first,index) in item.child" :key="index">                       
                    <router-link :to="{path:`/knowledges/detail/${first.cate_id}`}">
                      <div class="goto_knoledge_detail ">{{first.name}}<i class="el-icon-arrow-right"></i></div>
                    </router-link>                                                            
                  </div>                      
                <div class="item_task" >
                  <div class="tasks"  v-for="(items,index) in item.task" :key="index">
                    <h5>任务{{index+1}}</h5>
                    <div class="tasks_title margin8">{{items.title}}</div>
                    <div class="level margin8">Lv.{{items.level}}</div>
                    <div class="item_results margin8" v-html="items.info"></div>
                    <div class="task_enter margin8">
                      <router-link  :to="{path:`/knowledges/taskDetail/${items.task_id}`}">
                        <span class="goto_detail">查看详情</span>
                      </router-link>
                      <span class="get_task" @click="receiveTask(items.task_id)"   v-on:alert='alertDialog'>领取任务</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>
      <alert-dig v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></alert-dig>
 </div>
</template>
<style lang="scss" scoped>
.el-collapse-item__header:hover {
  background: red;
}
.hot_nav {
  padding: 20px 0;
  overflow: hidden;
  border-bottom: 1px solid #000;
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
.item_intro {
  background-color: #607D8B;
  display: flex;
  padding: 10px 10px;
  color: #fff;
  margin-top: 20px;
}
.item_intro .intro_left {
  width: 75%;
  padding-right: 10px;
  border-right: 1px solid #fff;
}
.intro_left p {
  text-indent: 10px;
  margin-top: 10px;
}
.item_intro .intro_right {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.intro_right span {
  border-top: 1px solid #fff;
  width: 15%;
  display: inline-block;
}
.intro_right p {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.intro_right p span:first-of-type {
  margin-right: 1.5%;
}
.intro_right p span:last-of-type {
  margin-left: 1.5%;
}

.goto_knoledge_detail i {
  float: right;
}
.el-collapse-item__header__arrow {
  float: right !important;
  line-height: 43px !important;
}
.goto_knoledge_detail {
  padding: 5px 10px;
  height: 26px;
  line-height: 26px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: #ededed;
  &:hover{
  background-color: #607D8B;
  color:#fff;
    
  }
}
.goto_knoledge_detail i {
  float: right;
  line-height: 26px;
}

.item_detail {
  padding: 10px 10px;
  margin-top: 20px;
  border: 1px solid #eee;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
}
.item_detail h4 {
  display: flex;
  align-items: center;
}
.item_detail .round {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #ea0f2d;
  margin-right: 8px;
  border-radius: 50%;
}
.item_detail a {
  color: #48576a;
}
.study_way {
  margin-left: 10px;
  margin: 20px 0;
  background-color: #607D8B;
  width: 80px;
  padding: 2px 0;
  border-radius: 20px;
  color: #fff;
  text-align: center;
}

.item_task {
  display: flex;
  margin-top: 20px;
  justify-content: flex-start;
}
.item_task .tasks {
  border: 1px solid #eee;
  width: 32%;
  box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
  margin-right: 18px;
}
.tasks h5 {
  background-color: #607D8B;
  color: #fff;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
}
.margin8 {
  margin: 10px 10px;
}
.level {
  color: #666;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
}
.item_results {
  line-height: 20px;
  height: 46px;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.task_enter {
  display: flex;
  justify-content: space-between;
}
.goto_detail {
  text-align: center;
  display: inline-block;
  color: #ea0f2d;
  border: 1px solid #ea0f2d;
  padding: 2px 15px;
  border-radius: 8px;
  cursor: pointer;
}
.get_task {
  text-align: center;
  display: inline-block;
  color: #fff;
  background-color: rgba(202, 20, 45, 0.83);
  padding: 2px 15px;
  border-radius: 8px;
  cursor: pointer;
}
.get_task_style {
  text-align: center;
  display: inline-block;
  color: #fff !important;
  background-color: #ea0f2d;
  padding: 0 18px;
  border-radius: 30px;
  cursor: pointer;
  height: 20px;
  line-height: 20px;
}
.sub_title {
  margin-bottom: 10px;
  background-color: #ededed;
}

.task_style {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>

<script>
import api_K from "../api/knowledge";
import { mapState } from "vuex";
import AlertDig from "../components/Dialog";
export default {
  data() {
    return {
      loading: true,
      //课程名称介绍
      knowledgeTheme: "",
      //课程阶段
      knowledgeList: "",
      //课程任务
      knowledgeTask: "",
      showDialog: false,
      dialogOption: {
        title: "请先登陆",
        text: "登陆后您可以畅所欲言",
        cancelButtonText: "我偏不",
        confirmButtonText: "去登陆"
      }
    };
  },
  created() {
    this.getKnowledge();
    document.title = "知识体系";
  },
  computed: {
    ...mapState(["userlogin"])
  },
  components: {
    AlertDig
  },
  methods: {
    getKnowledge() {
      api_K.getKnowledge().then(({ data }) => {
        this.knowledgeTheme = data.data.course;
        this.knowledgeList = data.data.tree;
      });
    },
    alertDialog() {
      this.showDialog = true;
      this.$refs.dialog
        .confirm()
        .then(() => {
          this.showDialog = false;
          this.$router.push("/login");
        })
        .catch(() => {
          this.showDialog = false;
        });
      return;
    },
    receiveTask(task_id) {
      // 未登录提示！
      if (!this.userlogin) {
        this.alertDialog();
        return;
      }
      api_K
        .receiveTask({
          user_id: this.userlogin.user_id,
          task_id: task_id,
          token: this.userlogin.token
        })
        .then(response => {
          if (response.data.status == 1) {
            this.$message.success("任务领取成功!");
          } else if (response.data.status == 0) {
            this.$message.error("任务已经领取了，请勿重新领取！");
          }
        });
    }
  }
};
</script>