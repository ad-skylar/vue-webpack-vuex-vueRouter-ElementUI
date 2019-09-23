<template>
  <div>
    <div  class="view ">
      <div class="task_content">
        <div class="task_title">
          <p>{{task.title}}</p>
          <span class="get_task" @click="receiveTask()"   v-on:alert='alertDialog'>领取任务</span>
        </div>
        <div class="task_intro">
           <div class="level">lv.{{task.level}} </div>
           <div v-html="task.info"> </div>
        </div>
      </div>
      <div class="task_report">
        <el-tabs type="border-card">
          <el-tab-pane label="任务详情">
             <div  v-if="task.problem" v-html="task.problem"> </div>
             <div  v-else>暂无 </div>
          </el-tab-pane>
          <el-tab-pane label="任务动态">
          	<addTaskDamic :userlogin='userlogin' v-on:alert='alertDialog'></addTaskDamic>
          <comments :userlogin='userlogin' v-on:alert='alertDialog'></comments>
          </el-tab-pane>
 
        </el-tabs>
      </div>

    </div>
    <alert-dig v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></alert-dig>
  </div>
</template>
<script>
import api_K from "../../api/knowledge";

import { mapState } from "vuex";
import comments from "./comments";
import addTaskDamic from "./addTaskDynamic";
import AlertDig from "../../components/Dialog";
import { MessageBox } from "element-ui";

export default {
  data() {
    return {
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
    this.getTaskDetail();
    this.dynamicDisplay();
  },
  computed: {
    ...mapState(["userlogin"])
  },
  components: {
    AlertDig,
    comments,
    addTaskDamic
  },
  methods: {
    dynamicDisplay() {
      api_K
        .dynamicDisplay({
          task_id: "task1"
        })
        .then(({ data }) => {
          this.task = data.data.list;
        });
    },
    getTaskDetail() {
      api_K
        .getTaskDetail({
          task_id: this.$route.params.task_id
        })
        .then(({ data }) => {
          this.task = data.data;
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
    receiveTask() {
      // 未登录提示！
      if (!this.userlogin) {
        this.alertDialog();
        return;
      }
      api_K
        .receiveTask({
          user_id: this.userlogin.user_id,
          task_id: this.$route.params.task_id,
          token: this.userlogin.token
        })
        .then(response => {
          if (response.data.status == 1) {
            this.$message.success("任务领取成功!");
          } else if (response.data.status == 0) {
            this.$message.error("任务已经领取了，请勿重新领取！");
          }
        });
    },

  }
};
</script>

<style lang="scss" scoped>
.fl {
  float: left;
}
.fr {
  float: right;
}
.task_content {
  border: 2px solid #eee;
  margin-top: 30px;
}
.task_title {
  overflow: hidden;
  background-color: #eef1f6;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d1dbe5;
}
.get_task {
  text-align: center;
  display: inline-block;
  color: #ea0f2d;
  border: 1px solid #ea0f2d;
  width: 80px;
  border-radius: 30px;
  cursor: pointer;
}

.task_title p {
  font-size: 14px;
}
.task_intro {
  padding: 15px 20px;
}
.level {
  font-size: 14px;
}
.task_intro p:last-of-type {
  line-height: 20px;
}

.task_report {
  overflow: hidden;
  margin: 20px 0;
  min-height: 450px;
  position: relative;
  box-shadow: 0px 0px 5px #ccc;
  p {
    line-height: 26px;
  }


}
// 更改默认样式
//tab切换面板
.el-tabs--border-card {
  border: none;
  box-shadow: none;
  min-height: 400px;
}
.el-tabs__item {
  color: #000;
}
.el-tabs__item.is-active {
  color: #ea0f2d;
}
</style>
