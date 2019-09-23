import axios from 'axios'
import {
  API_ROOT
} from '../util/config'
axios.defaults.baseURL = API_ROOT //配置全局的基本URl，一次配置，全局共享
// 按模块划分api 
// article  前台文章相关
//konwledge  知识体系相关
//my      后台我的操作
//user   用户个人信息
// 剩下还没想好怎么划分的暂时在本页


export default {

  // 查询消息通知，返回消息数量
  myInfoNum(data) {
    return axios.post('/notify/index', data)
  },
  //查询未读评论详情
  myInfoList(data) {
    return axios.post('/notify/commentlist', data)
  },
  // 活动列表activity页面
  ActivityList() {
    return axios.post('/activity/activityList')
  },
  // 轮播图（index页面）

  bannerList() {
    return axios.post('/banner/bannerList')
  },
  // 轮播活动详情
  ActivityDetail(data) {
    return axios.post('/activity/activityDetail', data)
  },
  //活动报名
  activityJoin(data) {
    return axios.post('/activity/activityJoin', data)
  },

}
