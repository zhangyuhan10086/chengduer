//自定义指令

import Vue from 'vue'

//页面标题
Vue.directive('pageTitle', {
  inserted: function (el, binding) {
    document.title = binding.value.content;

    let ua = navigator.userAgent;//判断浏览器版本
    
    //解决ios浏览器，ios微信浏览器 标题赋值问题
    if (/\bMicroMessenger\/([\d\.]+)/.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
        var i = document.createElement('iframe');
        i.src = '/favicon.ico';
        i.style.display = 'none';
        i.onload = function () {
            setTimeout(function () {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
    }

  }
})