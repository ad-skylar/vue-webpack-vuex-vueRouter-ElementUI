<template>
  <div id="userList" class="user-info">
    <!-- <div class="photo">
      <img :src="photosrc">
    </div>
    <div class="side_info">
      <p class="side_name">{{sideName}}</p>
      <p>{{selfIntroduction}}</p>
    </div> -->
    <div class="user-tab-list">
      <nav>
        <router-link to="/user/userinfo"> 我的信息
        </router-link>
        <router-link to="/user/resetpwd">修改密码</router-link>
        <router-link to="/user/mynote">我的帖子</router-link>
        <router-link to="/user/mycollection">我的收藏</router-link>
        <router-link to="/user/myInfo">我的消息</router-link>
        <router-link to="/user/mytask">我的任务</router-link>
      </nav>
    </div>
  </div>
</template>
<script>
export default {
  name: 'userList',
  data() {
    return {
      sideName: "慵懒的猫",
      selfIntroduction: "青春须早为，岂能长少年",
    }
  },
}
</script>

<style>
.list-item label {
  font-size: 15px;
  font-weight: 600;
  padding-right: 20px;
}

.user-info {
  height: 500px;
  border-right: 1px solid #bababa;
  font-size: 15px;
  width: 160px;
  padding-right: 10px;
}

.user-tab-list {
  width: 100%;
}

.photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 20px auto;
}

.photo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #eee;
}

.side_info {
  text-align: center;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #efefef;
  width: 83%;
  margin: 0 auto;
  padding-bottom: 2px;
}

.side_name {
  color: #878787;
  margin-bottom: 10px;
}

.user-info label {
  font-weight: 600;
  padding-right: 10px;
}

.user-info span {
  font-size: 14px;
  color: #6d6d6d;
}

.usercenter-title {
  margin-top: 20px;
  line-height: 30px;
  border-bottom: 1px solid #010101;
}

.user-tab-list {
  float: left;
}

.user-tab-list nav a {
  display: block;
  margin: 0 auto;
  text-align: center;
  color: #020202;
  font-size: 15px;
  height: 58px;
  line-height: 74px;
  border-bottom: 1px solid #bababa;
  font-weight: 600;
  width: 83%;
}

.item {
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  height: 80px;
}
.user-tab-list .router-link-active {
  color: #ea0f2d;
}
  .submit-userInfo {
    background-color: #ea0f2d;
    color: #fff;
    margin-top: 25px;
    text-align: center;
    height: 26px;
    line-height: 26px;
    font-size: 15px;
    width: 80px;
    border-radius: 3px;
    cursor:pointer;
  }
  /**空 */
.empty{
    text-align: center;
    margin-top: 20%;
}
.empty  p{
  margin-bottom: 20px;
}
.empty a{
  color : #ea0f2d;
}
.empty img{
  width : 30px;
}
</style>
