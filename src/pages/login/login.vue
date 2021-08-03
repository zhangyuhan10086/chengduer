<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="logoInput">
      <div class="input_top">
        <input class="name" type="text" v-model="username" placeholder="请输入账号" />
      </div>
      <div class="input_bot">
        <input class="password" type="password" v-model="password" placeholder="请输入密码" />
      </div>
    </div>
    <div class="btns">
      <div class="button" @click="login()">登录</div>
      <div class="register" flex="main:justify">
        <router-link to="/register">
          <p class="zhuce">注册账号</p>
        </router-link>
        <p class="wangji" @click="youge">游客模式</p>
      </div>
    </div>
    <loading-item :loadingOff="loading"></loading-item>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import { Spinner } from 'mint-ui';
  import loadingItem from '../components/loading.vue';
  import Vue from "vue";
  import store from '../../store';
  Vue.component(Spinner.name, Spinner);
  export default {
    data() {
      return {
        pageTitle: "登录",
        username: "", //账号
        password: "", //密码
        loading: false, //全屏loding开关
      }
    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {
      if (this.$route.query.username) {
        this.username = this.$route.query.username;
        this.password = this.$route.query.password;
      };
    },

    //载入组件
    components: {
      loadingItem,
    },
    methods: {
      youge() {
        store.commit('uptabArr', { tabArr: 1 });
        this.$router.push("/home")
      },
      //登录
      login() {
        let _this = this;
        if (!_this.username) {
          Toast(
          {
            message: '请输入账号~',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        if (!_this.password) {
          Toast(
          {
            message: '请输入密码~',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        _this.loading = true; //开启loading
        Bmob.User.login(_this.username, _this.password).then(user => {
          _this.loading = false; //关闭loading
          if (user.code == 101) {
            Toast({
              message: '密码或账号有误~',
              position: 'center',
              duration: 2000
            });
          } else {
            localStorage.CDECY_ACCID = user.objectId; //存下用户id
            localStorage.CDECY_USERNAME = user.username; //账号
            if (user.nickName == "" || user.nickName == undefined || user.portrait == "" || user.portrait == undefined || user.userGender == "" || user.userGender == undefined || user.userAge == "" || user.userAge == undefined) {
              console.log('信息不全');
              _this.$router.push("/userSet")
            } else {
              localStorage.CDECY_NICKNAME = user.nickName; //昵称
              localStorage.CDECY_PORTRAIT = user.portrait; //存下头像
              localStorage.CDECY_USERGENDER = user.userGender; //存下性别
              localStorage.CDECY_USERAGE = user.userAge; //存下年龄
              store.commit('uptabArr', { tabArr: 1 });
              _this.$router.push("/home")
            };
            //红点提醒
            //var Remind = Bmob.Object.extend("Remind");
            var query = Bmob.Query('Remind');
            query.equalTo("accid", '==', localStorage.CDECY_ACCID);
            // 查询所有数据
            query.find().then(obj => {
              localStorage.CDECY_REMINDID = obj[0].objectId; //提醒消息对应id
            });
          }
        });

      }
    }
  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;


  .logoInput {
    input {
      color: #FFF;
      padding-left: 60*@B;
      line-height: 35px;
      font-size: 14px;
      outline: none;
      border: none;
      width: 210*@B;
      height: 35px;
    }

    .input_top {
      border-bottom: 1px solid #BEBEBE;
      margin: 5*@B 16*@B 0;
    }

    .input_bot {
      border-bottom: 1px solid #BEBEBE;
      margin: 5*@B 16*@B 0;
    }

    .name {
      background: url(../../assets/user.svg) no-repeat 30*@B 8px;
      background-size: 20px;
    }

    .password {
      background: url(../../assets/password.svg) no-repeat 30*@B 8px;
      background-size: 20px;
    }
  }

  .btns {
    padding-top: 20px;
    font-size: 14px;

    .button {
      margin: 0 16*@B;
      width: 288*@B;
      background: #25ccde;
      color: #fff;
      text-align: center;
      line-height: 35px;
      height: 35px;
      border-radius: 4px;
    }

    .register {
      padding: 15px 30*@B 0;

      .zhuce {
        color: #fff;
      }

      .wangji {
        color: rgb(235, 140, 0);
      }
    }
  }

  ::-webkit-input-placeholder {
    color: #fff;
  }
</style>