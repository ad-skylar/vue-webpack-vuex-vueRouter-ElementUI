import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)


const mycollection = resolve => require(['@/pages/usercenter/mycollection'], resolve);
const mytask = resolve => require(['@/pages/usercenter/mytask'], resolve);
const home = resolve => require(['@/pages/home'], resolve);
const userCenter = resolve => require(['@/pages/usercenter'], resolve);
const userInfo = resolve => require(['@/pages/usercenter/userInfo'], resolve);
const resetPwd = resolve => require(['@/pages/usercenter/resetPwd'], resolve);
const myNote = resolve => require(['@/pages/usercenter/myNote'], resolve);
const login = resolve => require(['@/pages/login'], resolve);
const register = resolve => require(['@/pages/register'], resolve);
const Write = resolve => require(['@/pages/Write'], resolve);
const Article = resolve => require(['@/pages/Article/index'], resolve);
const knowledges = resolve => require(['@/pages/knowledges/taskDetail'], resolve);
const knowledge = resolve => require(['@/pages/knowledge'], resolve);
const NotFound = resolve => require(['@/pages/NotFound'], resolve);
const Index = resolve => require(['@/pages/Index'], resolve);
const myInfo = resolve => require(['@/pages/usercenter/myInfo'], resolve);
const Activity = resolve => require(['@/pages/Activity'], resolve);
const ActivityDetail = resolve => require(['@/pages/activityCenter/activityDetail'], resolve);
const detail = resolve => require(['@/pages/knowledges/detail'], resolve);
const Questions = resolve => require(['@/pages/Questions'], resolve);
const questionDetail = resolve => require(['@/pages/Questions/questionDetail'], resolve);

let router = new Router({
  routes: [{
      path: '/index/:tech_type?',
      component: Index
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/activity',
      component: Activity,
      name: '活动中心'
    },
    {
      path: '/activityCenter/activityDetail/:id?',
      component: ActivityDetail,
      name:'轮播图活动'
    },
    {
      path: '/home/:type?',
      components: {
        home: home
      },
      name: '主页'
    },
    {
      path: '/login',
      component: login,
      name: '登录'
    },
    {
      path: '/write',
      component: Write,
      name: '发帖',
      meta: {
        login: true
      }
    },
    {
      path: '/write/:topic_id?',
      component: Write,
      name: '编辑',
      meta: {
        login: true
      }
    },
    {
      path: '/register',
      component: register,
      name: '注册'
    },

    {
      path: '/article/:topic_id?',
      component: Article,
      name: '文章详情页'
    },
    {
      path: '/user',
      component: userCenter,
      children: [{
          path: '/',
          redirect: 'userinfo'
        },
        {
          path: 'userinfo',
          component: userInfo,
          name: '个人中心',
          meta: {
            login: true
          }
        },
        {
          path: 'resetpwd',
          component: resetPwd,
          name: '重置密码',
          meta: {
            login: true
          }
        },
        {
          path: 'mynote',
          component: myNote,
          name: '我的帖子',
          meta: {
            login: true
          }
        },
        {
          path: 'mycollection',
          component: mycollection,
          name: '我的收藏',
          meta: {
            login: true
          }
        },
        {
          path: 'mytask',
          component: mytask,
          name: '我的任务',
          meta: {
            login: true
          }
        },
        {
          path: 'myInfo',
          component: myInfo,
          name: '我的消息',
          meta: {
            login: true
          }
        }
      ]
    },
    {
      path: '/knowledge',
      component: knowledge,
      name: '知识体系'
    },
    
    {
      path: '/knowledges/taskDetail/:task_id?',
      component: knowledges,
      name: '知识体系任务详情'
    },
    {     
      path: '/knowledges/detail/:cate_id?',     
      component: detail,    
      name: '知识体系-html-详情页'        
    },
      {
      path: '/Questions/questionDetail',
      component: questionDetail,
      name: '任务-问题-详情页'
    },
    {
      path: '/Questions',
      component: Questions,
      name: '问题',
      meta: {
        login: true
      }
    },
    {
      path: '*',
      component: NotFound
    }
    
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((item) => item.meta.login)) {

    store.commit('INIT_STATE')
    if (!store.state.userlogin) {
      router.push({
        path: '/login'
      })

    } else {
      next();
    }
  } else {
    next()
  }
})

export default router;
