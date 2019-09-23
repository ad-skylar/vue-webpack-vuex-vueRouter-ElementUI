<template>
  <div>
    <div  class="view ">
      <!--<div class="task_content">-->
        <!--<div class="task_title">-->
          <!--<p>{{task.title}}</p>-->
          <!--<span class="get_task" @click="receiveTask()"   v-on:alert='alertDialog'>领取任务</span>-->
        <!--</div>-->
        <!--<div class="task_intro">-->
          <!--<div class="level">lv.{{task.level}} </div>-->
          <!--<div v-html="task.info"> </div>-->
        <!--</div>-->
      <!--</div>-->
      <div class="task_report">
        <el-tabs type="border-card">
          <!--<el-tab-pane label="任务详情">-->
            <!--<div  v-if="task.problem" v-html="task.problem"> </div>-->
            <!--<div  v-else>暂无 </div>-->
          <!--</el-tab-pane>-->
          <!--<el-tab-pane label="任务动态">-->
            <!--<div  v-if="task.test_condition" v-html="task.test_condition"> </div>-->
            <!--<div  v-else>暂无 </div>-->
          <!--</el-tab-pane>-->
          <el-tab-pane label="问题">
            <el-button type="text" class="ask" @click="open">{{next}}</el-button>
            <!--<div  v-if="task.summary" v-html="task.summary"> </div>
            <div  v-else>暂无 </div>-->
            <div v-for="(some,index) in task">
              <div class="task_report_question">
                <!--<div class="answer fl">-->
                <!--<p>2</p>-->
                <!--<p>回答</p>-->
                <!--</div>-->
                <div class="content fl">
                  <!--<p class="user">-->
                  <!--<span class="author">风中的雪糕</span>-->
                  <!--<span class="date">3小时前回答</span>-->
                  <!--</p>-->
                  <router-link to="/Questions/questionDetail" style="color: #000;">
                    <p class="reason">{{some.nick_name}}</p>
                  </router-link>
                </div>
              </div>
              <hr>
            </div>
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage2"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="10"
                layout="sizes, prev, pager, next"
                :total="100">
              </el-pagination>
            </div>
          </el-tab-pane>

        </el-tabs>
      </div>

    </div>
    <alert-dig v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></alert-dig>
  </div>
</template>
<script>
  import api_K from '../api/knowledge'
  import { mapState } from "vuex";
  import AlertDig from "../components/Dialog";
  import { MessageBox } from 'element-ui';
  export default {
    data(){
      return{
        next:'提问',
        task : '',
        nick_name:'',
        showDialog: false,
        dialogOption: {
          title: "请先登陆",
          text: "登陆后您可以畅所欲言",
          cancelButtonText: "我偏不",
          confirmButtonText: "去登陆"
        },
        currentPage2: 5
      }
    },
    created() {
      this.dynamicDisplay();
    },
    computed: {
      ...mapState(["userlogin"])
    },
    components: {
      AlertDig
    },
    methods: {
      dynamicDisplay() {
        api_K
          .dynamicDisplay({
            "task_id":'task1'
          })
          .then(({ data }) => {
            this.task = data.data.list;
      
          })
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
        };
        api_K
          .receiveTask({
            user_id: this.userlogin.user_id,
            task_id:this.$route.params.task_id,
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
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      open() {
        MessageBox.prompt('请输入您的问题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '问题不能为空哦^^'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的问题是: ' + value
          });
          this.nick_name = value
          let layer = {
            nick_name : this.nick_name
          }
          this.task.push(layer)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .task_content{
    border: 2px solid #eee;
    margin-top: 30px;
  }
  .task_title{
    overflow: hidden;
    background-color: #eef1f6;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #d1dbe5;
  }
  .get_task{
    text-align: center;
    display: inline-block;
    color: #ea0f2d;
    border: 1px solid #ea0f2d;
    width: 80px;
    border-radius: 30px;
    cursor: pointer;
  }
  .task_title p{
    font-size: 14px;
  }
  .task_intro{
    padding: 15px 20px;
  }
  .level{
    font-size: 14px;
  }
  .task_intro p:last-of-type{
    line-height: 20px;
  }

  .task_report{
    overflow: hidden;
    margin:20px 0;
    min-height: 450px;
    position: relative;
    box-shadow: 0px 0px 5px #ccc;
    p{
      line-height: 26px;
    }
    .task_report_question{
      width: 100%;
      height: 30px;
      .answer{
        width: 50px;
        height: 50px;
        background: #ea0f2d;
        text-align: center;
        color:#fff;
        line-height: 20px;
      }
      .content{
        /*margin-left: 30px;*/
        .user{
          color: #383a42;
        }
        .date{
          color:#ccc;
          margin-left: 20px;
        }

      }
    }
    .ask{
        width: 90px;
        height: 20px;
        line-height: 3px;
        border: 1px solid red;
        border-radius: 10px;
        background-color: #fff;
        color:red;
        cursor:pointer;
        margin-left: 550px;
        margin-bottom: 20px;
        top: 93px;
        right: 260px;
        position: fixed;
      }

  }
  // 更改默认样式
  //tab切换面板
  .el-tabs--border-card{
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
