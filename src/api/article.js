import axios from 'axios'

export default {
    //   分页获取文章列表
    getArticlesList(params) {
        return axios.get('/topic/topicList', {
            params
        });
    },
    // 获取一篇文章
    getOneArticle(data) {
        return axios.post('/topic/queryDetail', data)
    },

    //  分页获取评论列表
    getCommentsList(params) {
        return axios.get('/comment/commentOneClass', {
            params
        })
    },
    // 添加评论
    topicCommentAdd(data) {
        return axios.post('/comment/topicCommentAdd', data)
    },
    // 二级评论
    doubleDeckAdd(data) {
        return axios.post('/comment/doubleDeckAdd', data)
    },
    //帖子点赞
    topicApprove(data, config) {
        return axios.post('/like/topic_like', data, config)
    },

    //收藏帖子
    topicCollect(data, config) {
        return axios.post('/collect/topic_collect', data, config)
    },
    //文章分类(后台设置的html，php,技术分类等等)
    getCatelist() {
        return axios.post('/cate/catelist')
    },

}