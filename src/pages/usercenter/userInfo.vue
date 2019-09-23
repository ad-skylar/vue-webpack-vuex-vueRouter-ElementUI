<template>
  <div class="person_info">
    <p class="usercenter-title">个人信息</p>
    <div class="phpto item">

      <img class="photo-img" :src="userlogin.avatar">
      <div class="reset-photo cursor">

        <span @click="uploadImg">更换头像</span><input ref="filebtn" class="load-img" type="file" accept='image/jpg,image/jpeg,image/png' @change="getFile($event)">

      </div>
    </div>
    <div class="phone item">
      <label>注册手机号</label>
      <span>{{this.userlogin.mobile}}</span>
    </div>
    <div class="name item">
      <label>昵称</label>
      <el-input type="text" v-model="nick_name" style="width:200px;"></el-input>
    </div>
    <div class="sex item">
      <label>性别</label>
      <div class="field">
        <span>男</span> <input class="checkbtn" type="radio" value="1" v-model="sex">
        <span>女</span><input class="checkbtn" type="radio" value="2" v-model="sex">
      </div>
    </div>

    <div class="submit-userInfo " @click="submitForm($event)" ref="submit">提交</div>
  </div>
</template>

<script>

import { mapState, mapMutations } from "vuex";
import api_U from '../../api/user'
import api from '../../api'
export default {
  computed: {
    ...mapState(["userlogin"])
  },
  data() {
    return {
      avatar: "",
      nick_name: "",
      sex: "1"
    };
  },
  methods: {
    ...mapMutations(["USER_LOGIN"]),
    getmyInfoNum() {
      api
        .myInfoNum({
          user_id: this.userlogin.user_id
        })
        .then(({ data }) => {
          var comment_num = data.data.comment_num;
          if (comment_num) {
            this.MESSAGE_INIT(comment_num);
          } else {
            this.MESSAGE_EMPTY();
          }
        });
    },
        ...mapMutations(['MESSAGE_ADD',"MESSAGE_INIT",'MESSAGE_EMPTY']),
    init() {
      this.nick_name = this.userlogin.nick_name;
      this.sex = this.userlogin.sex;
    },

    uploadImg() {
      this.$refs.filebtn.click();
    },
    submitForm(event) {
      let formData = new FormData();
      formData.append("token", this.userlogin.token);
      formData.append("nick_name", this.nick_name);
      formData.append("avatar", this.avatar);
      formData.append("user_id", this.userlogin.user_id);
      formData.append("sex", this.sex);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      api_U.userinfoUpdate(formData, config).then(response => {
        // 重新更新一下个人信息
        this.USER_LOGIN(response.data.data);
        if (response.data.status == 1) {
          this.$message.success("修改成功");
        }
      });
    },
    getFile(event) {
      this.avatar = event.target.files[0];
      this.$refs.submit.click();
    }
  },
  created() {
    this.init();
    this.getmyInfoNum();
  }
};
</script>
<style>
.item label {
  width: 100px;
  /* text-align: right; */
}

.field,
.reset-photo {
  float: left;
}

.load-img {
  display: none;
}

.sex,
.phpto {
  overflow: hidden;
}

.field input {
  -webkit-appearance: none;
  padding: 5px !important;
  border: 1px solid #ddd;
  border-radius: 50%;
  vertical-align: middle;
  cursor: pointer;
}

.field span {
  margin-right: 5px;
  vertical-align: middle;
}

.photo-img {
  width: 60px;
  height: 60px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #ddd;
  margin-right: 10px;
}

.checkbtn:checked {
  border-color: #ea0f2d;
  background-color: #ea0f2d;
}
</style>