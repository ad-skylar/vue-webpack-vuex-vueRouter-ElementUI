<template>
<div class="view">
   <div :style="{'background-image':`url(${list.activity_img} )`,'margin-top':'40px'}" class="act_img">
     <p></p>
     <span>{{list.activity_name}}</span>
   </div>
    <section class="act_box">
      <div>
        <h2>活动周期</h2><p>{{list.activity_cycle}}</p>
      </div>
      <div>
        <h2>活动运用技术</h2><p>{{list.activity_skill}}</p>
      </div>
      <div>
        <h2>活动特点</h2><p>{{list.activity_rule}}</p>
      </div>
      <div class="join_activity">
       <button @click="joinActivity()" type="button" :style="{'display':list.activity_status ? 'block':'none'}" >参与活动</button>
      </div>
    </section>
     <alert-dig v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></alert-dig>
     
     <div v-show="showMessage"  class="el-message-box__wrapper" style="z-index: 60002;">
       <div class="el-message-box">
          <div class="el-message-box__content">
            <div class="el-message-box__message">
              <p>{{activityInfo}}</p></div><div class="el-message-box__input" style="display: none;">
            </div>
          </div>
          <div class="el-message-box__btns">
              <button type="button" class="el-button el-button--default el-button--small el-button--primary "><span @click="close()">确定</span></button>
         </div>
      </div>
    </div>
      <!-- 遮罩层 -->
    <div class="dialog" v-show="mask" @click="cancelSubmit()">
      <div class="mask"></div>
    </div>
</div>
</template>
<script>
import api from "../../api";
import { mapState } from "vuex";
import AlertDig from "../../components/Dialog";
export default {
  data() {
    return {
      list: "",
      activityInfo: "",
      showDialog: false,
      dialogOption: {
        title: "请先登陆",
        text: "登陆后您可以畅所欲言",
        cancelButtonText: "我偏不",
        confirmButtonText: "去登陆"
      },
      //遮罩层
      mask: false,
      showMessage: false
    };
  },
  created() {
    api
      .ActivityDetail({ activity_id: this.$route.params.id })
      .then(({ data }) => {
        this.list = data.data;
      });
  },
  methods: {
    joinActivity() {
      console.log("fdss");
      if (!this.userlogin) {
        this.alertDialog();
        return;
      }
      api
        .activityJoin({
          activity_id: this.$route.params.id,
          user_id: this.userlogin.user_id
        })
        .then(({ data }) => {
          //遮罩层
          this.mask = true;
          this.showMessage = true;
          this.activityInfo = data.info;
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
    close() {
      this.mask = false;
      this.showMessage = false;
    }
  },
  computed: {
    ...mapState(["userlogin"])
  },
  components: {
    AlertDig
  }
};
</script>
<style lang="scss" scoped>
.act_img {
  width: 100%;
  height: 300px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  position: relative;
  p {
    margin-top: 200px;
    background-color: #fff;
    opacity: 0.3;
    height: 100px;
  }
  span {
    position: absolute;
    bottom: 20px;
    color: #fff;
    display: block;
    color: #fff;
    font-size: 36px;
    text-align: center;
    width: 100%;
  }
}
.act_box h2 {
  font-weight: 400;
  padding: 12px 0;
  font-size: 20px;
  border-bottom: 1px solid #efefef;
  color: #666;
}
.act_box {
  margin-top: 20px;
  position: relative;
}
.act_box p {
  margin-top: 10px;
  color: #999;
}
.join_activity button {
  border: 0;
  flex: 1;
  margin: 0 12px;
  padding: 0;
  height: 40px;
  font-size: 17px;
  font-weight: 500;
  border-radius: 5px;
  color: #986f28;
  background: #ffcd70;
  display: block;
  width: 100%;
  cursor: pointer;
}

.join_activity {
  margin: auto;
  width: 400px;
  margin-top: 30px;
}
.el-message-box__wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
.message-box {
  display: inline-block;
  width: 420px;
  padding-bottom: 10px;
  vertical-align: middle;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  font-size: 18px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: left;
  overflow: hidden;
  backface-visibility: hidden;
}
.el-message-box__content {
  position: relative;
  padding: 10px 15px;
  color: #606266;
  font-size: 14px;
  margin-top: 10px;
}
.el-message-box__btns {
  text-align: right;
}
</style>
