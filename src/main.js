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



import Bmob from "hydrogen-js-sdk";

Bmob.initialize("d14353db713716063dfa76f61e7f19e5", "1f70df73361fa3a85e6bfd9e9092576f");




Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app-box',
  store,
  router,
  render: h => h(main)
})