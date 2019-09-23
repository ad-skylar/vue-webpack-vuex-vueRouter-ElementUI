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
          <el-tab-pane label="任务问题">
            <h2 class="reason">为什么会出现兼容的问题</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad consectetur debitis dignissimos ex explicabo maiores qui rerum sint totam, voluptas. Aliquid architecto consequatur debitis iure quam quas rem repudiandae temporibus?</p>
            <hr>
            <el-button type="danger" class="next">{{writeAnswer}}</el-button>
            <div v-for="(datalist,index) in task" class="answer_list">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <div class="zan"><i class="el-icon-caret-top" style="margin-right: 5px"></i>28</div>
                    <div class="userHeadImg"><img :src="datalist.avatar"></div>
                    <div class="user_name">泰戈尔</div>
                </div>
                <div  class="text item">
                  {{datalist.nick_name}}({{datalist.user_id}})---我要说点啥呢
                </div>
                <div class="footer">
                  <p>编辑于{{datalist.c_time}}</p>
                  <p><i class="el-icon-message"></i><span class="comment">添加评论</span></p>
                </div>
              </el-card>
            </div>


          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
    <alert-dig v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></alert-dig>
  </div>
</template>
<script>
import api_K from '../../api/knowledge'
  import { mapState } from "vuex";
  import AlertDig from "../../components/Dialog";
  export default {
    data(){
      return{
        writeAnswer:'写回答',
        task : '',
        showDialog: false,
        dialogOption: {
          title: "请先登陆",
          text: "登陆后您可以畅所欲言",
          cancelButtonText: "我偏不",
          confirmButtonText: "去登陆"
        },
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
  //【tab切换容器】
  .task_report{
    overflow: hidden;
    margin:20px 0;
    min-height: 450px;
    position: relative;
    box-shadow: 0px 0px 5px #ccc;
    p{
      line-height: 26px;
    }
    //【问题详情】
    .text {
      font-size: 14px;
    }
    .item {
      margin-bottom: 18px;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .box-card {
      width: 480px;
    }
    //【按钮】
    .next{
      width: 90px;
      height: 20px;
      line-height: 3px;
      border: 1px solid red;
      border-radius: 10px;
      background-color: #fff;
      color:red;
      cursor:pointer;
    }
    //【回答列表】
    .answer_list{
      padding-top: 10px;
      .el-card{
        width: 100%;
        //card头部
        .clearfix{
          height: 50px;
          line-height:50px;
          div{
            display: inline-block;
            height: 100%;
            float: left;
          }
          & div:last-of-type{
            margin-left: 10px;
            height: 50px;
            line-height: 50px;
          }
         .zan{
            display: inline-block;
            background: #ea0f2d;
            color: #fff;
            padding:0 5px;
            height: 20px;
            line-height: 20px;
            margin: 15px 5px 0px 0px;
          }
          .userHeadImg{
            display: inline-block;
            width: 50px;
            border-radius: 50%;
            background: #ddd;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
       //card底部
        .footer{
          p:first-of-type{
            color: #444d56;
            line-height: 30px;
          }
          p:last-of-type{
            color:red;
            .comment{
              margin-left: 5px;
              color: #444d56;
            }
          }
        }
      }
    }
    .answer_list:first-of-type{
      padding-top: 30px;
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
