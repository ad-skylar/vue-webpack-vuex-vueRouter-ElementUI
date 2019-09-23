<template>
	<div class="box">
		<el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="taskContent">
		</el-input>
		<span class="release_task" @click="releaseTask($event)">发布动态</span>
	</div>
</template>

<script>
import { bus } from "../../util/util";
import { mapState } from "vuex";
import api_K from '../../api/knowledge'
export default {
  data() {
    return {
      taskContent: ""
    };
  },
  computed: {
    ...mapState(["userlogin"])
  },
  methods: {
    releaseTask(event) {
      event.cancelBubble = true;
      if (!this.taskContent) {
        this.$message.error("请输入评论内容！");
        return;
      }
      // 未登录提示！
      if (!this.userlogin) {
        this.$emit("alert");
        return;
      }
      api_K
        .taskDynamicAdd({
          user_id: this.userlogin.user_id,
          task_id: this.$route.params.task_id,
          content: this.taskContent
        })
        .then(response => {
          if (response.data.status == 1) {
            this.$message.success("发布成功!");
            bus.$emit("get", "1");
            this.show_comment_replay = false;
            this.taskContent = "";
          } else {
            this.$message.error("发布失败!");
          }
        });
    }
  }
};
</script>

<style scoped>
.box {
  height: 215px;
}
.release_task {
  float: right;
  text-align: center;
  display: inline-block;
  color: #ea0f2d;
  border: 1px solid #ea0f2d;
  width: 120px;
  text-align: center;
  line-height: 35px;
  font-size: 16px;
  height: 35px;
  border-radius: 30px;
  cursor: pointer;
  margin: 20px 0px;
}
.release_taskL:hover {
  background-color: red;
  color: white;
}
</style>