
import axios from 'axios'

export default {
  //知识体系树状页显示
  getKnowledge(data) {
    return axios.post('/know/tree', data)
  },
  //知识点详情
  getKnowledgeDetail(data) {
    return axios.post('/know/knowdetail', data)
  },

  //领取任务
  receiveTask(data) {
    return axios.post('/task/receivetask', data)
  },
  //知识体系任务详情
  getTaskDetail(data) {
    return axios.post('/know/taskdetail', data)
  },
  //任务动态列表
  dynamicDisplay(data) {
    return axios.post('/dynamic/dynamicOneClass', data)
  },

  //添加任务动态
  taskDynamicAdd(data) {
    return axios.post('/dynamic/taskDynamicAdd', data)
  },
   
  // 二级动态评论
  doubleDynamicsAdd(data) {
    return axios.post('/dynamic/doubleDynamicsAdd', data)
  },

    //提交任务传送githup地址
    submitTask(data) {
      return axios.post('/task/add_github', data)
    },
    
  //获取任务评价
  getTaskComment(data) {
    return axios.post('/task/review_comment', data)
  },
    //获取未通过原因
    getFailedReason(data) {
      return axios.post('/task/review_reason', data)
    },
}
