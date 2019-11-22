<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="main">
      <img src="../../assets/city2.png" />
      <div class="login_item">
        <div class="logo">
          <p>剑网三成都双梦社区</p>
          <p style="font-size:12px;">跪求小姐姐设计个登录封面图！</p>
        </div>
        <div class="main_box">
          <transition name="router-slid" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageTitle: "登录",

      }
    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {


    },
    //载入组件
    components: {

    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;

  .main {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 100;
    overflow: hidden;

    img {
      width: 100%;
    }
  }

  .login_item {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 1000;
  }

  .logo {
    height: 130px;
    padding-top: 50*@B;
    font-size: 20px;
    color: #fff;
    text-align: center;
    color: #FF0000;
    font-weight: bold;
  }

  .router-slid-enter-active,
  .router-slid-leave-active {
    transition: all .4s;
  }

  .router-slid-enter,
  .router-slid-leave-active {
    transform: translate3d(60*@B, 0, 0);
    opacity: 0;
  }
</style>