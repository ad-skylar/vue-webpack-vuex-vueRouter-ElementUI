<template>
  <div class="detail">
    <header>
      <div>{{know.title}}</div>
    </header>
    <el-tabs type="border-card">
       <el-tab-pane label="详情">
         <div  class="content" v-if="know.content" v-html='know.content'></div>
         <div  class="content" v-else>暂无</div>
       </el-tab-pane>
       <el-tab-pane label="任务">
         <div class="content">
            <div class="item_task" v-if="this.task">
              <div class="tasks"  v-for="(item,index) in task" :key="index">
                <h5>任务{{index+1}}</h5>
                <div class="tasks_title margin8">{{item.title}}</div>
                <div class="level margin8">Lv.{{item.level}}</div>
                <div class="item_results margin8">{{item.info}}</div>
                <div class="task_enter margin8">
                  <router-link  :to="{path:`/knowledges/taskDetail/${item.task_id}`}">
                    <span class="goto_detail">查看详情</span>
                  </router-link>
                  <span class="get_task" @click="receiveTask(item.task_id)"   v-on:alert='alertDialog'>领取任务</span>
                </div>
              </div>
            </div>
            <div v-else>暂无</div>
         </div>
       </el-tab-pane>
    </el-tabs>
     <button class="next"> {{next}}</button>
    <alert-dig v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></alert-dig>
  </div>
  
</template>
<script>
import api_K from '../../api/knowledge'
import moment from "moment";
import { mapState } from "vuex";
import AlertDig from "../../components/Dialog";
export default {
  filters: {
    moment(value) {
      var value = parseInt(value) * 1000;
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  data() {
    return {
      next: "下一节",
      data: "",
      know: "",
      task: "",
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
    this.getKnowledgeDetail();
  },
  computed: {
    ...mapState(["userlogin"])
  },
  components: {
    AlertDig
  },
  methods: {
    getKnowledgeDetail() {
      api_K
        .getKnowledgeDetail({
          cate_id: this.$route.params.cate_id
        })
        .then(({ data }) => {
          this.data = data;

          this.know = data.data.know;
          this.task = data.data.task;
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
<style lang="scss">
.detail {
  margin: 100px auto 0;
  width: 80vw;
  box-shadow: 0px 0px 5px #ccc;
  position: relative;
}
header {
  background-color: #eef1f6;
  border-bottom: 1px solid #d1dbe5;
}
header {
  div {
    padding: 15px 16px;
    font-size: 14px;
  }
}

.content {
  padding: 20px 15px;
  min-height: 50vh;
  p {
    line-height: 20px;
  }
}
.next {
  width: 80px;
  height: 20px;
  border: 1px solid red;
  border-radius: 10px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  background-color: #fff;
  color: red;
  cursor: pointer;
}
.el-tabs--border-card {
  border: 0;
  box-shadow: none;
}
.el-tabs__item.is-active {
  color: #ea0f2d;
}
//任务

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
  background-color: #52dbad;
  color: #fff;
  text-align: center;
  line-height: 30px;
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
  padding: 0 18px;
  border-radius: 30px;
  cursor: pointer;
}
.get_task {
  text-align: center;
  display: inline-block;
  color: #fff;
  background-color: #ea0f2d;
  padding: 0 18px;
  border-radius: 30px;
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
.hover:hover,
.hover:hover {
  background-color: #caf4e6;
}
.task_style {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.padding10 {
  padding: 0 10px;
}
</style>
