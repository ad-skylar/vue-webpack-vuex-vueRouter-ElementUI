<template>
    <main>
        <header-bar></header-bar>
         <div class="ReplaceHead"></div>
        <section>
 
                <router-view></router-view>
                <!-- <keep-alive> -->
                    <router-view name="home"></router-view>
                <!-- </keep-alive> -->
   
        </section>
    </main>
</template>

<script>
import HeaderBar from "./components/HeaderBar";
export default {
  name: "app",
  components: {
    HeaderBar
  }
};
</script>

<style>

.header{
   position:fixed;
   z-index: 999;
 }
 .ReplaceHead{
   width: 100%;
   height:64px;
   background-color: #fff;
 }
.user-page {
  display: flex;
  width: 1100px;
  margin: 10px auto;
}

.login-box {
  padding: 30px 60px;
  width: 300px;
  background: #fff;
  margin: 52px auto;
  box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
}

.login-title {
  color: #000;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  font-weight: normal;
}

.line {
  border-top: 1px solid #000;
}

.login-box input {
  width: 100%;
  margin-top: 20px;
  height: 30px;
  line-height: 30px;
  text-indent: 6px;
  border: 1px solid #ccc;
}

.login-box input:focus {
  outline: none;
  border: 1px solid #f20e33;
}

.login-box input[type="checkbox"] {
  display: none;
}

.login-box .class-unchecked {
  background: url("~@/assets/images/unckecked.svg") no-repeat left top;
  background-size: contain;
  padding-left: 26px;
  cursor: pointer;
}

.login-box .class-checked {
  background: url("~@/assets/images/checked.svg") no-repeat left top;
  background-size: contain;
  padding-left: 26px;
  cursor: pointer;
}

.content-form {
  margin-top: 20px;
  font-size: 12px;
  font-size: 14px;
}

.content-form p > span {
  margin-left: 15px;
}

.login-btn {
  height: 30px;
  background: #ea0f2d;
  margin-top: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #fff;
  width: 189px;
  margin: 30px auto;
  border-radius: 14px;
  cursor: pointer;
}

.to-register {
  color: #ea0f2d;
}
</style>

