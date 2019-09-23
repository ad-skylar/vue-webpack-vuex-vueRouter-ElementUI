import axios from 'axios'
export default {
  // 发帖子
  topicAdd(data) {
    return axios.post('/topic/topicAdd', data)
  },
  //编辑帖子
  topicEdit(data) {
    return axios.post('/topic/topicEdit', data)
  },

  // 删除帖子
  topicDel(data) {
    return axios.post('/topic/topicDel', data)
  },
  //  我的帖子列表
  getmyTopicList(page, data) {
    return axios.post('/topic/myTopicList?page=' + page, data)
  },
  //我的收藏
  mycollection(data, config) {
    return axios.post('/collect/myCollect', data, config)
  },
  // 上传文章里的图片
  uploadEditorImage(data, config) {
    return axios.post('/topic/uploadimg', data, config)
  },
   //我的任务列表
   queryPageList(data) {
    return axios.post('/Task/QueryPageList', data)
  },
}