// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
// import FastClick from 'fastclick'
import router from './router'
import { Button, Cell } from 'mint-ui'
import './config/rem'
import 'flex.css'
import store from './store';
//过滤器
import * as filters from './filter/'

//配置过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

//图片懒加载
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  //error: '',
  loading: 'static/loading.png',
  attempt: 1
});
// Vue.prototype.$imgDomain = 'http://localhost:3002';
Vue.prototype.$imgDomain = 'http://47.102.120.166:3002';

Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
import main from './pages/main.vue'
//映入并使用vue-resource网络请求模块
import VueResource from 'vue-resource'
Vue.use(VueResource)
//指令
import directive from './directive/index'

// FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app-box',
  store,
  router,
  render: h => h(main)
})