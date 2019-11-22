import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
Vue.use(Router)

const router = new Router({
  routes: [
  {
    path: '/', //顶层路由，对应index.html
    component: resolve => require(['../App'], resolve),
    meta: { keepAlive: false },
    children: [ //二级路由。对应App.vue
      //地址为空时跳转home页面
      {
        path: '',
        redirect: '/home' //没有地址时默认主页
      },
      {
        path: '/lo', //登录
        component: resolve => require(['../pages/login/logo'], resolve),
        meta: { keepAlive: false },
        children: [{
          path: '/register', //注册
          component: resolve => require(['../pages/login/register'], resolve),
          meta: { keepAlive: false }
        }, {
          path: '/login', //登录
          component: resolve => require(['../pages/login/login'], resolve),
          meta: { keepAlive: false }
        }],
      },
      {
        path: '/userSet', //用户设置
        component: resolve => require(['../pages/login/userSet'], resolve),
        meta: { keepAlive: false }
      },
      {
        path: '/home', //主页
        component: resolve => require(['../pages/home/home'], resolve),
        meta: { keepAlive: true }
      },
      {
        path: '/comment/:id', //评论
        component: resolve => require(['../pages/home/comment'], resolve),
        meta: { keepAlive: false }
      },
      {
        path: '/publish', //发布
        component: resolve => require(['../pages/home/publish'], resolve),
        meta: { keepAlive: false }
      },
      {
        path: '/me', //个人中心
        component: resolve => require(['../pages/me/me'], resolve),
        meta: { keepAlive: false }
      },
      {
        path: '/dynamic', //个人动态
        component: resolve => require(['../pages/me/dynamic'], resolve),
        meta: { keepAlive: false }
      },
      {
        path: '/others/:id', //查看他人信息
        component: resolve => require(['../pages/me/others'], resolve),
        meta: { keepAlive: false }
      },

      {
        path: '/news', //新闻发现
        component: resolve => require(['../pages/news/news'], resolve),
        meta: { keepAlive: false }
      },
      {
        path: '/mess', //消息
        component: resolve => require(['../pages/mess/mess'], resolve),
        meta: { keepAlive: false }
      },
      {
        path: '/commentMess/:accid', //被评论
        component: resolve => require(['../pages/mess/commentMess'], resolve),
        meta: { keepAlive: false }
      },
      {
        path: '/aite/:accid', //被@
        component: resolve => require(['../pages/mess/aite'], resolve),
        meta: { keepAlive: false }
      },
      {
        path: '/sysmess', //系统消息
        component: resolve => require(['../pages/mess/sysmess'], resolve),
        meta: { keepAlive: false }
      }

    ]
  }],
  // mode: 'history',
  // scrollBehavior (to, from, savedPosition) {
  //   console.log(to.path)
  //   if(to.path=="/home"){
  //     return savedPosition
  //   }else{
  //     return{x:0,y:0}
  //   }
  // },
  // if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { x: 0, y: 0 }
  //   }
  // }
})


router.beforeEach((to, from, next) => {
  // if(to.path=="/home" || to.path=="/me" || to.path=="/mess"){
  //   store.commit('updateHasHeader',{hasHeade:true});
  // }else{
  //   store.commit('updateHasHeader',{hasHeade:false});
  // };
  if (to.path == "/login" || to.path == "/register" || to.path == "/userSet") {
    store.commit('updateHasHeader', { hasHeade: false });
    next();
  } else {
    store.commit('updateHasHeader', { hasHeade: true });
    next();
  }
});
router.afterEach(function(to) {
  store.commit('updateLoadingStatus', { isLoading: false })
})
export default router