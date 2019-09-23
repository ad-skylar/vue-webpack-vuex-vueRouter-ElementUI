Vue.config.productionTip = false

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'




import "../src/assets/mavon-editor/css/index.css";//编辑器预览样式，同时也是文章详情页样式
import 'element-ui/lib/theme-default/index.css'//element-ui样式
import "../src/assets/css/reset.css";//重置样式、文章代码高亮主题
import "../src/assets/css/ui.css";// 改变某些elementui原有样式
import "../src/assets/css/iconfont/iconfont.css"

// 按需引用element
import {
  Pagination,
  Option,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Select,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Tabs,
  TabPane,
  Loading,
  Message,
  Card,
  Button
} from 'element-ui'

Vue.use(Pagination)
Vue.use(Option)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Loading.directive)
Vue.use(Card)
Vue.use(Button)
Vue.prototype.$message = Message

// Vue.prototype.Url='http://api.iplanfly.com'   //正式域名
Vue.prototype.Url = 'http://api.li-shang-bin.com' // 测试服务器



new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
