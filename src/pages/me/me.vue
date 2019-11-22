<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="main" ref="domx">
      <div class="header_user">
        <div class="wai" flex>
          <div class="icon">
            <img :src="portrait">
          </div>
          <div class="font">
            <div class="nick">{{userData.nickName}}</div>
            <div class="idid">ID&nbsp:&nbsp{{userData.username}}</div>
            <div class="user_about" flex>
              <div class="guanzhu">关注<span>0</span></div>
              <div class="like">喜欢<span>0</span></div>
              <div class="fensi">粉丝<span>0</span></div>
            </div>
          </div>
          <div class="right"><img src="../../assets/right.svg"></div>
        </div>
        <div class="nei">
          <img :src="portrait">
        </div>
      </div>
      <div class="cell_list">
        <div class="cell" flex @click="toDynamic">
          <div class="left"><img src="../../assets/dongtai.svg"></div>
          <div class="center">个人动态</div>
          <div class="right">
            <img src="../../assets/right.svg">
          </div>
        </div>
        <div class="cell" flex @click="zwkf">
          <div class="left"><img src="../../assets/guanzhu.svg"></div>
          <div class="center">关注</div>
          <div class="right">
            <img src="../../assets/right.svg">
          </div>
        </div>
        <div class="cell" flex @click="zwkf">
          <div class="left"><img src="../../assets/quanzi.svg"></div>
          <div class="center">我的圈子</div>
          <div class="right">
            <img src="../../assets/right.svg">
          </div>
        </div>
        <div class="cell" flex @click="exit">
          <div class="left"><img src="../../assets/tuichu.svg"></div>
          <div class="center">退出登录</div>
          <div class="right">
            <img src="../../assets/right.svg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';

  import touxiang1 from "../../assets/touxiang1.jpg"
  import touxiang2 from "../../assets/touxiang2.jpg"
  import touxiang3 from "../../assets/touxiang3.jpg"
  import touxiang4 from "../../assets/touxiang4.jpg"
  import touxiang5 from "../../assets/touxiang5.jpg"
  import touxiang6 from "../../assets/touxiang6.jpg"
  import touxiang7 from "../../assets/touxiang7.jpg"
  import touxiang8 from "../../assets/touxiang8.jpg"
  import touxiang9 from "../../assets/touxiang9.jpg"
  import touxiang10 from "../../assets/touxiang10.jpg"
  import touxiang11 from "../../assets/touxiang11.jpg"
  import touxiang12 from "../../assets/touxiang12.jpg"

  export default {
    data() {
      return {
        pageTitle: '个人中心',
        userData: {
          username: localStorage.CDECY_USERNAME,
          nickName: localStorage.CDECY_NICKNAME,
          portrait: localStorage.CDECY_PORTRAIT,
          userGender: localStorage.CDECY_USERGENDER,
          userAge: localStorage.CDECY_USERAGE,
        },
        portrait: '',
        imgDomain: this.$imgDomain
      }
    },
    //载入组件
    components: {


    },
    //computed计算，数据
    computed: {

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
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {

      if (this.userData.portrait == 1) {
        this.portrait = touxiang1
      } else if (this.userData.portrait == 2) {
        this.portrait = touxiang2
      } else if (this.userData.portrait == 3) {
        this.portrait = touxiang3
      } else if (this.userData.portrait == 4) {
        this.portrait = touxiang4
      } else if (this.userData.portrait == 5) {
        this.portrait = touxiang5
      } else if (this.userData.portrait == 6) {
        this.portrait = touxiang6
      } else if (this.userData.portrait == 7) {
        this.portrait = touxiang7
      } else if (this.userData.portrait == 8) {
        this.portrait = touxiang8
      } else if (this.userData.portrait == 9) {
        this.portrait = touxiang9
      } else if (this.userData.portrait == 10) {
        this.portrait = touxiang10
      } else if (this.userData.portrait == 11) {
        this.portrait = touxiang11
      } else if (this.userData.portrait == 12) {
        this.portrait = touxiang12
      }

    },
    //方法 数据
    methods: {
      //退出登录
      exit() {
        MessageBox.confirm('确认退出吗?').then(action => {
          if (action == "confirm") {
            Bmob.User.logOut();
            localStorage.CDECY_NICKNAME = ""; //昵称
            localStorage.CDECY_USERNAME = ""; //账号
            localStorage.CDECY_PORTRAIT = ""; //存下头像
            localStorage.CDECY_USERGENDER = ""; //存下性别
            localStorage.CDECY_USERAGE = ""; //存下年龄
            localStorage.CDECY_REMINDID = "";
            localStorage.CDECY_ACCID = "";
            this.$router.push("/login")
          }
        });
      },
      //去我的动态页面
      toDynamic() {
        this.$router.push("/dynamic")
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
      //路由进入时判断是否有账号密码
      beforeRouteEnter(to, from, next) {
        next(vm => {
          var currentUser = Bmob.User.current();
          if (currentUser && localStorage.CDECY_NICKNAME && localStorage.CDECY_USERNAME && localStorage.CDECY_PORTRAIT && localStorage.CDECY_USERGENDER && localStorage.CDECY_USERAGE) {

          } else { //没有登录过去登录页面
            console.log("没有登录");
            vm.$router.push("/login");
          }
        });
      },

    }
  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;

  .main {
    padding-top: 46px;
    overflow-x: hidden;
  }

  .header_user {
    position: relative;
    height: 140*@B;

    .icon {
      width: 70*@B;
      height: 70*@B;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    .font {
      padding-left: 20*@B;
      width: 181*@B;

      .nick {
        font-size: 16*@B;
        line-height: 24*@B;
        padding-top: 4*@B;
        color: #fff
      }

      .idid {
        font-size: 14*@B;
        line-height: 20*@B;
        color: #DDDDDD;
      }

      .user_about {
        font-size: 14*@B;
        line-height: 22*@B;
        color: #fff;

        span {
          padding: 0 8*@B 0 5*@B;
          color: #BEBEBE;
        }
      }
    }

    .right {
      width: 10*@B;

      img {
        width: 100%;
        margin-top: 22*@B;
      }
    }

    .nei {
      height: 140*@B;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      overflow: hidden;

      img {
        width: 100%;
        -webkit-filter: blur(6px);
        filter: blur(6px);
        transform: scale(1) rotate(0deg) translate3d(0, 0, 0) translate(0, -25%);
      }
    }

    .wai {
      position: absolute;
      left: 20*@B;
      top: 30*@B;
      width: 100%;
      overflow: hidden;
      z-index: 100;
    }
  }

  .cell_list {
    .cell {
      height: 50*@B;
      line-height: 50*@B;
      padding-left: 16*@B;
      padding-right: 16*@B;
      border-bottom: 1px solid #f0f0f0;

      .left {
        width: 25*@B;
        padding-right: 16*@B;

        img {
          width: 100%;
          margin-top: 12*@B;
        }
      }

      .center {
        font-size: 14*@B;
        width: 231*@B;
      }

      .right {
        width: 15*@B;

        img {
          width: 100%;
          display: block;
          margin-top: 16*@B;
        }
      }
    }
  }
</style>