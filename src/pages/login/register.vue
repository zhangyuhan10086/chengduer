<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="logoInput">
      <div class="input_top">
        <input class="name" type="text" v-model="username" maxlength="16" placeholder="请输入账号" />
      </div>
      <div class="input_bot">
        <input class="password" type="password" v-model="password" maxlength="16" placeholder="请输入密码" />
      </div>
    </div>
    <div class="btns">
      <div class="button" @click="zhucei()">注册</div>
      <router-link to="/login">
        <div class="button">返回</div>
      </router-link>
    </div>
    <loading-item :loadingOff="loading"></loading-item>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import loadingItem from '../components/loading.vue'; //loding组件
  export default {
    data() {
      return {
        pageTitle: "注册",
        username: "", //账号
        password: "", //密码
        loading: false, //loading开关
      }
    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {


    },
    //载入组件
    components: {
      loadingItem,
    },
    //方法
    methods: {
      //注册
      zhucei() {
        let _this = this;
        if (!_this.username) {
          Toast(
          {
            message: '请填写账号~',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        if (!_this.password) {
          Toast(
          {
            message: '请填写密码~',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        // if (!(/^[a-zA-Z][a-zA-Z0-9_]{5,15}$/.test(_this.username)) || !(/^[a-zA-Z][a-zA-Z0-9_]{5,15}$/.test(_this.password))) {
        //   Toast(
        //   {
        //     message: '账号、密码请以字母开头,长度6~16位.可以包含数字、字母',
        //     position: 'center',
        //     duration: 2000
        //   });
        //   return false;
        // };
        if (!(/^[a-zA-Z0-9_]{6,16}$/.test(_this.username)) || !(/^[a-zA-Z0-9_]{6,16}$/.test(_this.password))) {
          Toast(
          {
            message: '账号、密码长度6~16位.可以包含数字、字母',
            position: 'center',
            duration: 2000
          });
          return false;
        };

        _this.loading = true; //开启loading
        //创建类和实例（传服务器）
        var user = new Bmob.User();
        // var user=new User();
        user.set("username", _this.username);
        user.set("password", _this.password);
        user.signUp(null, {
          success: function(user) {
            console.log(user);
            _this.loading = false; //关闭loading
            if (user.get("code") == 202) {
              Toast(
              {
                message: '此账号已被注册~',
                position: 'center',
                duration: 2000
              });

            } else {
              Toast(
              {
                message: '注册成功~',
                position: 'center',
                duration: 2000
              });
              var accid = user.id;
              console.log(accid)
              var Remind = Bmob.Object.extend("Remind");
              var remind = new Remind();
              remind.set('sysUnread', 1); //系统未读
              remind.set('commentUnread', 0); //未读被评论
              remind.set('aiteUnread', 0); //未读被@
              remind.set('accid', accid); //id
              remind.save(null, {
                success: function(obj) {
                  localStorage.CDECY_REMINDID = obj.id; //提醒消息对应id
                  _this.$router.push({
                    path: '/login',
                    query: {
                      username: _this.username,
                      password: _this.password
                    }
                  }); //跳转去登录
                },
                error: function(obj, error) {
                  // 添加失败
                  console.log(error.description);
                }
              });
            }
          },
          error: function(user, error) {
            console.log(error);

          }
        });
      },

      //===================
    }
  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;

  .logo {
    height: 200px;
  }

  .logoInput {
    .input_top {
      border-bottom: 1px solid #BEBEBE;
      margin: 5*@B 16*@B 0;
    }

    .input_bot {
      border-bottom: 1px solid #BEBEBE;
      margin: 5*@B 16*@B 0;
    }

    input {
      color: #fff;
      padding-left: 60*@B;
      line-height: 35px;
      font-size: 14px;
      outline: none;
      border: none;
      width: 100%;
      height: 35px;
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

    .button {
      margin: 0 16*@B 12px;
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

      p:first-of-type {
        color: #FF79BC;
      }

      p:nth-of-type(2) {
        color: #fff;
      }
    }
  }

  ::-webkit-input-placeholder {
    color: #fff;
  }
</style>