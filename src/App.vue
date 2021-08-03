<template>
  <div>
    <!-- <loading v-model="isLoading"></loading> -->
    <loading-item :loadingOff="isLoading"></loading-item>
    <div>
      <div class="header" flex v-show="hasHeade">
        <div @click="clickTab(1)">
          <div class="home">
            <img v-show="tabArr!=1" src="./assets/home.svg" />
            <img v-show="tabArr==1" src="./assets/home2.svg" />
          </div>
        </div>
        <div to="/mess" @click="clickTab(2)">
          <div class="mess">
            <img v-show="tabArr!=2" src="./assets/message.svg" />
            <img v-show="tabArr==2" src="./assets/message2.svg" />
            <div class="redUnread" v-show="hasMess"></div>
          </div>
        </div>
        <div to="/me" @click="clickTab(3)">
          <div class="person">
            <img v-show="tabArr!=3" src="./assets/me.svg" />
            <img v-show="tabArr==3" src="./assets/me2.svg" />
          </div>
        </div>
      </div>
      <!-- <transition name="router-fade" mode="out-in"> -->
      <div>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </div>

      <!-- </transition> -->
      <!-- <transition name="router-fade" mode="out-in"> -->
      <!-- </transition>  -->
    </div>
  </div>
</template>

<script>
  import { Loading } from 'vux'
  import { mapState } from 'vuex'
  import loadingItem from './pages/components/loading.vue'
  import store from './store';
  
  // var BmobSocketIo = new Bmob.Socket("d14353db713716063dfa76f61e7f19e5")
  // BmobSocketIo.initialize("d14353db713716063dfa76f61e7f19e5");

  import { Tabbar, TabbarItem, ViewBox } from 'vux'
  export default {
    data() {
      return {

        tabUrl: ["/home", "/mess", "/me"],
      }
    },
    computed: {
      ...mapState({
        isLoading: state => state.vux.isLoading,
        hasHeade: state => state.vux.hasHeade,
        hasMess: state => state.vux.hasMess,
        tabArr: state => state.vux.tabArr,
      })
    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {
      console.log("张宇瀚欢迎您~作者联系方式；手机13618089058 ，qq450008307")

    },
    //路由进入时判断是否有账号密码
    beforeRouteEnter(to, from, next) {
      next(vm => {
        var currentUser = Bmob.User.current();
        if (currentUser && localStorage.CDECY_NICKNAME && localStorage.CDECY_USERNAME && localStorage.CDECY_PORTRAIT && localStorage.CDECY_USERGENDER && localStorage.CDECY_USERAGE) {
          console.log("去home")
          vm.$router.push("/home");
        } else { //没有登录过去登录页面
          // console.log("没有");
          // vm.$router.push("/login");
        }
      });
    },
    //载入组件
    components: {
      Tabbar,
      TabbarItem,
      Loading,
      loadingItem
    },
    methods: {
      //点击tab切换颜色
      clickTab(index) {
        store.commit('uptabArr', { tabArr: index });
        this.$router.push(this.tabUrl[index - 1]);
      },
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @B: 1/12rem;

  .header {
    height: 46px;
    width: 100%;
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    justify-content: space-around;
    background: #36465d;

    img {
      width: 22px;
      margin-top: 12px;
    }
  }

  .router-fade-enter-active,
  .router-fade-leave-active {
    transition: opacity .3s;
  }

  .router-fade-enter,
  .router-fade-leave-active {
    opacity: 0;
  }

  .mess {
    position: relative;
  }

  .redUnread {
    position: absolute;
    right: -3*@B;
    top: 12px;
    background: #ff4a1f;
    width: 7*@B;
    height: 7*@B;
    border-radius: 50%;
    overflow: hidden;
  }
</style>