<template>
<div class="view">
  <ul class="activityWarp" >
    <li v-for="item in ActivityLists" :key="item.activity_id">
      <router-link :to="`/activityCenter/activityDetail/${item.activity_id}`"  :style="{ 'background-image': `url(${item.activity_img} )`,'background-repeat':'no-repeat','display':'block','background-size':'100% 100%' ,'width':'450px','height':'155px','padding-top':'25px'}">
        <div class="activityInfo">
          <p><span>{{item.activity_start_time | moment}}</span>-<span>{{item.activity_end_time | moment}}</span></p>
          <p class="activityName">{{item.activity_name}}</p>
          <p class="activitySign">{{item.activity_status ? '参与活动':'活动结束'}}</p>
        </div>
        
      </router-link>
      
    </li>
    </ul>
</div>
</template>
<script>
import api from "../api";
import moment from "moment";
export default {
  data() {
    return {
      list: "",
      ActivityLists: "",
    };
  },
   filters: {
    moment(value) {
      var value = parseInt(value) * 1000
      return moment(value).format('YYYY-MM-DD');
    },
  },
  created() {
    this.ActivityList();
    document.title = '活动中心'
  },
  methods:{
     ActivityList() {
      api.ActivityList().then(({ data }) => {
        this.ActivityLists = data.data;
       
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.activityWarp{
    overflow: hidden;
    width: 100%;
    margin-top: 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    min-width: 500px;
  li{
    width: 450px;
    height: 180px; 
    margin: 10px;
  }
}
.activityInfo{
  border: 1px solid #fff;
  margin: auto;
  width: 210px;
  height: 130px;
  text-align: center;
  color: #fff;
}
.activityInfo p:first-of-type{
  margin-top:32px;
}
.activitySign{
  background-color: #fff;
  text-align: center;
  height: 22px;
  width: 62px;
  line-height: 22px;
  color: #ea0f2d;
  margin: auto;
  margin-top: 22px;
  border-radius: 4px;
}
.activityName{
  line-height: 48px;
  font-size: 30px;
}
</style>
