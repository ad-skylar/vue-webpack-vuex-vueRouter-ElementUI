<template>
  <div id="myCollection" class="myCollection">
    <div class="usercenter-title my-note">
      <ul class="title-list">
        <li :class="{active:active == 0}"  @click="status(0,0)">进行中</li>
        <li :class="{active:active == 1}" @click="status(1,1)">已完成</li>
        <li :class="{active:active == 2}" @click="status(2,2)">未通过</li>
      </ul>
    </div>
    <div class="status-list">
      <div v-show="taskStatus">
        <div class="article-content-wrap my-note" v-for="(item,index) in taskList" :key="index">
          <ul  class="task-property">
            <li>{{item.c_time | moment}}</li>
            <li>{{item.title}}</li>
            <li>lv.{{item.level}}</li>
          </ul>
          <div @click="submitTaskPop(item.status,item.task_receive_id)" class="submitTask">{{statusText}}</div>          
        </div>
        <div class="block" style="margin-top:40px;">
          <el-pagination  v-show= "showPage" layout="prev, pager, next" :total="total" :page-size="limit" @current-change="handle">
          </el-pagination>
        </div>
      </div>
      
      <!-- 弹窗 -->
      
      <!-- 提交页面       -->
      <div class="submit-wrap" v-show="statusPop.submitWrap">
        <div class="task-instruction">
          <textarea placeholder="说明/备注/建议..."/>
        </div>
        <div style="display:flex; background: #efefef;padding:15px 0 15px 15px;width:100% ;position:absolute;bottom:0" >
          <div class="github-text">
            <i class="el-icon-edit"></i>
            <input placeholder="输入github地址" v-model="githubUrl">
          </div>
          <div  class="submitTask-button"  @click="submitTask()"><span>提交</span></div> 
        </div> 
      </div>
      <!-- 提交成功 -->
      <div class="submit-success" v-show="statusPop.submitSuccess">
        <h3>Congratulations</h3>
        <p>宝剑锋从磨砺出，梅花香自苦寒来！</p>
        <p>您的答案等待猿计划教研组评审，具体通知在我的任务里查看结果</p>
        <div class="finished"><span @click="cancelSubmit()">完成</span></div>
      </div>
      <!-- 评审意见 -->
      <div class="submit-wrap evaluation-wrap" v-show="statusPop.evaluationWrap">
          <p class="evaluation-title">评价意见</p>
          
          <div class="evaluation-content" v-html="this.getcomments.comment">
          </div>
          <div class="finished" style="background-color:#fff"><span @click="cancelSubmit()">确定</span></div>
      </div>
    <!-- 未通过原因 -->
      <div class="submit-wrap evaluation-wrap" v-show="statusPop.failed" >
          <p class="evaluation-title">未通过原因</p>
          <div class="evaluation-content" v-html="this.getcomments.failedReason">           
          </div>
          <div class="finished" style="background-color:#fff"><span @click="cancelSubmit()">确定</span></div>
      </div>

    </div>
   
  
   <!-- *********** -->
    <div class="empty"  v-show="showEmpty">
      <p>暂无</p>
  </div>
  
  <div>
    
  </div>
  <!-- 遮罩层 -->
  <div class="dialog" v-show="mask" @click="cancelSubmit()">
    <div class="mask"></div>
   </div>
    </div>
  </div>
  </div>
  
</template>

<script>
import api_K from '../../api/knowledge'
import moment from "moment";
import { mapMutations, mapState } from "vuex";
import api_M from '../../api/my'
export default {
  filters: {
    moment(value) {
      var value = parseInt(value) * 1000;
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  data() {
    return {
      //  警告弹出框
      showDialog: false,
      //收藏为空
      showEmpty: false,
      //分页显示
      showPage: false,
      page: 1,
      total: 0,
      limit: 10,
      taskList: "",
      type: 0,
      active: 0,
      statusText: "提交任务",
      //任务状态内容
      taskStatus: true,
      //遮罩层
      mask: false,
      githubUrl: "",
      //状态弹窗默认隐藏 
      statusPop:{
        // 提交页面
        submitWrap: false,
        // 提交成功
        submitSuccess: false,
        //评审意见
        evaluationWrap: false,
        //未通过原因
        failed: false,
      },
      //获取后台返回任务评价
      getcomments:{
        comment : '',
        failedReason :'',
      },
      taskId :''
    };
  },
  computed: {
    ...mapState(["userlogin"])
  },
  methods: {
    handle(val) {
      this.page = val;
      this.getList();
    },

    status(type, index) {
      this.active = index;
      if (type == 0) {
        this.statusText = "提交任务";
      } else if (type == 1) {
        this.statusText = "查看评价建议";
      } else {
        this.statusText = "查看原因";
      }
      this.getList(type, index);
    },
    //获取我的任务列表
    getList(type, index) {
      api_M
        .queryPageList({
          page: this.page,
          user_id: this.userlogin.user_id,
          token: this.userlogin.token,
          status: type,
          limit: 10
        })
        .then(({ data }) => {
          const res = data.data;
          this.total = res.total_page;
          this.taskList = res.list;
        
          if (this.taskList == "") {
            this.showEmpty = true;
            this.showPage = false;
          } else {
            this.showPage = true;
            this.showEmpty = false;
          }
        });
    },
    //事件点击对应相应的状态跳出弹窗
    submitTaskPop(type, task_receive_id) {
      this.taskId = task_receive_id;
      //遮罩层
      this.mask = true;
      //alert(type);
      this.taskStatus = false;
      //进行中
      if (type == 0) {
        this.statusPop.submitWrap = true;
      } else if (type == 1) {
        this.statusPop.evaluationWrap = true;
        this.getTaskComment(task_receive_id);
      } else {
        
        //审核未通过
        this.statusPop.failed = true;
        this.getFailedReason(task_receive_id);
        
      }
      return  this.taskId ;
    },
    //输入github后提交任务 这是点击事件
    submitTask() {
      if (!this.githubUrl) {
        this.$message.error("please inter githubUrl！");
        return;
      } else if (this.githubUrl.indexOf("github.com") == -1) {
        this.$message.error("请输入正确的地址！");
      } else {
        //向后台传送项目路径
        this.sendTaskgithub();
      }
    },
    //submitTask 传送github地址
    sendTaskgithub() {
  
      api_K
        .submitTask({
          task_receive_id: this.taskId,
          token: this.userlogin.token,
          github: this.githubUrl
        })
        .then(({ data }) => {
      
          if(data.status == 1){
            this.statusPop.submitSuccess = true;
            this.statusPop.submitWrap = false;
          }
        });
    },
    //获取未通过原因getFailedReason
    getFailedReason(task_receive_id) {
      api_K
        .getFailedReason({
          task_receive_id: task_receive_id,
          token: this.userlogin.token,
        })
        .then(({ data }) => {
          this.getcomments.failedReason = data.data.reason;        
        });
    },
    //获取任务评价getTaskComment
    getTaskComment(task_receive_id) {
      api_K
        .getTaskComment({
          task_receive_id: task_receive_id,
          token: this.userlogin.token,
        })
        .then(({ data }) => {
          if(data.data.comment){
            this.getcomments.comment = data.data.comment;
          }else{
            this.getcomments.comment ="暂无评价,正在审核中..."
          }
          
          
        });
    },
    //取消提交任务 / 点击遮罩层弹窗消失
    cancelSubmit() {
      this.taskStatus = true;
      this.statusPop.submitWrap = false;
      this.statusPop.evaluationWrap = false;
      this.statusPop.submitSuccess = false;
      this.statusPop.failed = false;
      this.mask = false;
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style>
.active {
  color: #ea0f2d;
}
.myCollection {
  font-size: 15px;
}

.my-note {
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
}

.myCollection ul {
  list-style: none;
}

.title-list {
  display: flex;
}
.status-list {
  position: relative;
  z-index: 50002;
}
.title-list img {
  width: 18px;
}
.submitTask {
  color: #ea0f2d;
  padding: 0 10px;
  border: 1px solid #ea0f2d;
  border-radius: 10px;
  cursor: pointer;
  float: right;
}

.title-list li {
  text-align: center;
  cursor: pointer;
  padding: 10px 20px;
}
.article-content-wrap .article-title {
  color: #000;
  cursor: pointer;
}
.article-content-wrap {
  height: 66px;
  border-bottom: 1px solid #ddd;
  align-items: center;
}

.task-property {
  color: #999;
  display: flex;
}
.task-property li {
  min-width: 200px;
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
  padding: 0.5rem 1rem;
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
/**收藏为空 */
.empty {
  text-align: center;
  margin-top: 20%;
}
.empty p {
  margin-bottom: 20px;
}
.empty a {
  color: #ea0f2d;
}
.empty img {
  width: 30px;
}
/* 弹窗 */
.submit-wrap {
  border: 1px solid #eee;
  width: 90%;
  min-height: 400px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 20px auto;
  position: relative;
  overflow: hidden;
  background-color: #fff;
}
.task-instruction {
  width: 100%;
  min-height: 300px;
  position: relative;
}
.task-instruction textarea {
  width: 96%;
  height: 96%;
  text-indent: 10px;
  position: absolute;
  left: 2%;
  top: 4%;
  color: #a2a2a2;
}
.close i {
  font-size: 16px;
}
.submit-wrap input {
  background: #efefef;
}
.el-icon-edit {
  color: #878787;
  font-size: 18px;
}
.github-text {
  width: 80%;
  float: left;
  border-right: 2px solid #d2d2d2;
}
.github-text i {
  width: 4%;
}
.github-text input {
  width: 94%;
  line-height: 30px;
}
.submitTask-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
}
.submitTask-button span,
.finished span {
  color: #ea0f2d;
  border: 1px solid #ea0f2d;
  border-radius: 10px;
  cursor: pointer;
  padding: 0 20px;
}
/* 提交成功 */
.submit-success {
  text-align: center;
  border: 1px solid #eee;
  width: 300px;
  height: 200px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px 100px;
  position: relative;
  margin: 20px auto;
  background: #fff;
  overflow: hidden;
}
.submit-success h3 {
  color: #ea0f2d;
  height: 48px;
  line-height: 48px;
}
.submit-success p {
  height: 36px;
  line-height: 36px;
}
.finished {
  position: absolute;
  bottom: 0px;
  right: 0;
  left: 0;
  background-color: #efefef;
  padding: 10px 0;
  display: flex;
  justify-content: center;
}
/* 评价意见 */
.evaluation-wrap .evaluation-title {
  height: 48px;
  line-height: 48px;
  background-color: #efefef;
  text-align: center;
  font-size: 16px;
}
.evaluation-content {
  padding: 20px 40px;
}
.evaluation-content p {
  color: #a2a2a2;
  line-height: 28px;
}
.el-message {
  z-index: 999999 !important;
}
</style>