<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="main">
      <div class="cell" flex @click="toAite">
        <div class="left"><img src="../../assets/aite.svg" /></div>
        <div class="center">@我的<span v-show="aiteUnreadNum!=0">{{'（'+aiteUnreadNum+'）'}}</span></div>
        <div class="right"><img src="../../assets/right.svg"></div>
      </div>
      <div class="cell" flex @click="toCommentMess">
        <div class="left" style="background:#7eb3ff"><img src="../../assets/pinlun2.svg" /></div>
        <div class="center">被评论<span v-show="commentUnreadNum!=0">{{'（'+commentUnreadNum+'）'}}</span></div>
        <div class="right"><img src="../../assets/right.svg"></div>
      </div>
      <div class="cell" flex @click="zwkf">
        <div class="left" style="background:#fbd663"><img src="../../assets/zan3.svg" /></div>
        <div class="center">被赞</div>
        <div class="right"><img src="../../assets/right.svg" class="zan"></div>
      </div>
      <div class="cell" flex @click="toSys">
        <div class="left" style="background:#84da6f"><img src="../../assets/xitong.svg" /></div>
        <div class="center">系统通知<span v-show="sysUnreadNum!=0">{{'（'+sysUnreadNum+'）'}}</span></div>
        <div class="right"><img src="../../assets/right.svg"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import loadingItem from '../components/loading.vue'; //loading模块
  import { Popup } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import store from '../../store';
  import { mapState } from 'vuex';
  import Vue from 'vue';

  Vue.component(Popup.name, Popup);

  export default {
    data() {
      return {
        pageTitle: '消息',
        zonHeight: "", //
        id: this.$route.params.id, //说说id
        shuoData: {
          content: "", //文字内容
          name: "", //发言用户的名字
          picList: "", //发布的图片
          portrait: "", //用户的头像
          type: "", //标签类型
          accid: "",
        }, //说说数据
        loading: false, //loading模块控制开关
        popupVisible: false, //控住弹框
        commentfont: "", //评论内容
        commentArr: [], //评论数组
        loadingInfi: false, //无限滚动开关
        dataNumber: 20, //每页查询条数
        skip: 0, //忽略前面多少条
        moreLoading: true, //底下加载条
      }
    },
    //载入组件
    components: {
      loadingItem,

    },
    //computed计算，数据
    computed: {
      ...mapState({
        sysUnreadNum: state => state.vux.sysUnreadNum, //未读系统消息数量
        commentUnreadNum: state => state.vux.commentUnreadNum, //未读评论消息数量
        aiteUnreadNum: state => state.vux.aiteUnreadNum, //未读@消息数量
      })
    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {
      this.getRemind();
    },
    //方法 数据
    methods: {
      //去被评论页面
      toCommentMess() {
        this.$router.push("commentMess/" + localStorage.CDECY_ACCID)
      },
      //去被@页面
      toAite() {
        this.$router.push("aite/" + localStorage.CDECY_ACCID)
      },
      //去系统消息页面
      toSys() {
        this.$router.push("/sysmess")
      },
      //暂未开发
      zwkf() {
        Toast(
        {
          message: '暂未开发(┬＿┬)',
          position: 'center',
          duration: 2000
        });
      },
      //==
      //================一开始请求次收提示表
      getRemind() {
        var Remind = Bmob.Object.extend("Remind");
        var query = new Bmob.Query(Remind);
        //查询单条数据，第一个参数是这条数据的objectId值
        query.get(localStorage.CDECY_REMINDID, {
          success: function(data) {
            var sysUnread = data.get("sysUnread"); //未读系统消息   
            var commentUnread = data.get("commentUnread"); //未读被评论消息
            var aiteUnread = data.get("aiteUnread"); //未读被@的消息

            var totalUnread = sysUnread + commentUnread + aiteUnread; //总未读消息数量
            store.commit('updateCommentUnreadNum', { commentUnreadNum: commentUnread }); //提交评论数量
            store.commit('updateSysUnreadNum', { sysUnreadNum: sysUnread }); //提交系统消息数量
            store.commit('updateaiteUnreadNum', { aiteUnreadNum: aiteUnread }); //提交@消息数量  
            if (totalUnread != 0) {
              store.commit('updateHasMess', { hasMess: true }); //提交有未读
            } else {
              store.commit('updateHasMess', { hasMess: false }); //提交有未读
            }
          },
        });
      },
    },
    //路由进入时判断是否有账号密码
    beforeRouteEnter(to, from, next) {
      next(vm => {
        var currentUser = Bmob.User.current();
        if (currentUser && localStorage.CDECY_NICKNAME && localStorage.CDECY_USERNAME && localStorage.CDECY_PORTRAIT && localStorage.CDECY_USERGENDER && localStorage.CDECY_USERAGE) {

        } else { //没有登录过去登录页面
          alert("没有登录，请去登录");
          vm.$router.push("/login");
        }
      });
    },
  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;

  .main {
    padding-top: 48px;
  }

  .cell {
    padding: 0 10*@B;
    height: 55*@B;
    line-height: 55*@B;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14*@B;

    .left {
      width: 40*@B;
      height: 40*@B;
      background: #fd8a85;
      border-radius: 50%;
      overflow: hidden;
      margin-top: 7*@B;

      img {
        width: 22*@B;
        margin-left: 9*@B;
      }
    }

    .center {
      padding-left: 10*@B;
      width: 150*@B;
    }

    .right {
      width: 12*@B;
      padding-left: 85*@B;

      img {
        width: 100%;
      }
    }

    span {
      color: #ff4a1f;
      padding-left: 4*@B;
    }
  }
</style>