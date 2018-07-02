import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router' 
import store from './vuex/store'
import axios from 'axios'

import polyfill from 'babel-polyfill'

import home from './components/home.vue'
import editimg from './components/editimg.vue'
import timeLine from './components/timeLine.vue'
import classGrowList from './components/classGrowList.vue'
import albumList from './components/albumList.vue'
import photoList from './components/photoList.vue'

Vue.use(VueRouter);
Vue.prototype.$http = axios;

const routes = [
  {path: '/', component: home},  
  {path: '/home', component: home},      //这里是为了让输入错误路径和空路径时默认显示home的内容  
  {path: '/editimg', component: editimg},      //图片编辑页
  {path: '/timeLine', component: timeLine},      //时光轴页面
  {path: '/classGrowList', component: classGrowList},      //班级空间页面
  {path: '/albumList', component: albumList},      //班级相册
  {path: '/photoList', component: photoList},      //班级相册----图片列表页面
  
];  

// 声明一个路由对象                        
const router = new VueRouter({
  //mode: 'history',
  routes
})



new Vue({
  store,
  router,
  el: '#app',          // 挂载点，挂载在id为appx的组件上  
  template: '<App/>',    // 模版名称
  components: { App }
  //render: h => h(App)
})
