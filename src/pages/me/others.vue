<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="main" v-show="domOff">
      <div class="header">
        <x-header>他人信息</x-header>
      </div>
      <div class="header_user">
        <div class="nei">
          <img :src="userInfo.portrait">
        </div>
      </div>
      <div class="wai">
        <div class="icon">
          <img :src="userInfo.portrait">
        </div>
        <div class="font">
          <div class="nick" flex>
            <p>{{userInfo.nickName}}</p>
            <div class="userGender" v-if="userInfo.userGender=='男'"><img src="../../assets/nan.svg"></div>
            <div class="userGender" v-if="userInfo.userGender=='女'"><img src="../../assets/nue.svg"></div>
            <div class="age">{{userInfo.userAge[0]}}岁</div>
          </div>
          <div class="user_about" flex>
            <div class="guanzhu">关注<span>0</span></div>
            <div class="like">喜欢<span>0</span></div>
            <div class="fensi">粉丝<span>0</span></div>
          </div>
        </div>
      </div>
      <div class="pic_list">
        <div class="item" v-for="item in shuoData" @click="toComment(item.id)">
          <div class="pic">
            <img v-if="item.picList && item.picList.length" v-lazy="imgDomain+item.picList[0]" :src="imgDomain+item.picList[0]">
            <img :src="userInfo.portrait">
          </div>
          <div class="font">
            <p>{{item.content}}</p>
          </div>
        </div>
      </div>
      <div class="more_loading" v-show="shuoData.length>=15">
        <div class="font" v-show="moreLoading" @click="loadMore">点击加载更多···</div>
        <div class="icon" v-show="!moreLoading">
          <mt-spinner type="triple-bounce" color="#25ccde"></mt-spinner>
        </div>
      </div>
    </div>
    <loading-item :loadingOff="zyhloading"></loading-item>
  </div>
</template>

<script>
  import { XHeader } from 'vux';
  import { Toast } from 'mint-ui';
  import loadingItem from '../components/loading.vue'; //loading模块

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
        pageTitle: '他人信息',
        userData: "", //用户信息
        shuoData: [], //数据
        dataNumber: 15,
        skip: 0,
        accid: this.$route.params.id,
        userInfo: {
          portrait: "",
          nickName: "",
          userGender: "",
          userAge: "",
        }, //用户信息
        zyhloading: true,
        moreLoading: true, //加载更多loding
        domOff: false,
        imgDomain: this.$imgDomain
      }
    },
    //载入组件
    components: {
      XHeader,
      loadingItem
    },
    //computed计算，数据
    computed: {

    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {

      this.getShuoData();
      this.getUserInfo();
    },
    //方法 数据
    methods: {
      toTop() {
        if (document.documentElement && document.documentElement.scrollTop)
        {
          document.documentElement.scrollTop = 0;
        }
        else if (document.body)
        {
          document.body.scrollTop = 0;
        };
      },
      //获得个人资料
      getUserInfo() {
        let _this = this;
        //var User = Bmob.Object.extend("_User");
        var query = Bmob.Query('_User');
        //查询单条数据，第一个参数是这条数据的objectId值
        query.get(_this.accid).then(obj => {
          _this.toTop();
          _this.domOff = true; //展示页面
          // 查询成功，调用get方法获取对应属性的值
          _this.userInfo.portrait = obj.portrait;
          _this.userInfo.nickName = obj.nickName;
          _this.userInfo.userGender = obj.userGender;
          _this.userInfo.userAge = obj.userAge;


          if (_this.userInfo.portrait == 1) {
            _this.userInfo.portrait = touxiang1
          } else if (_this.userInfo.portrait == 2) {
            _this.userInfo.portrait = touxiang2
          } else if (_this.userInfo.portrait == 3) {
            _this.userInfo.portrait = touxiang3
          } else if (_this.userInfo.portrait == 4) {
            _this.userInfo.portrait = touxiang4
          } else if (_this.userInfo.portrait == 5) {
            _this.userInfo.portrait = touxiang5
          } else if (_this.userInfo.portrait == 6) {
            _this.userInfo.portrait = touxiang6
          } else if (_this.userInfo.portrait == 7) {
            _this.userInfo.portrait = touxiang7
          } else if (_this.userInfo.portrait == 8) {
            _this.userInfo.portrait = touxiang8
          } else if (_this.userInfo.portrait == 9) {
            _this.userInfo.portrait = touxiang9
          } else if (_this.userInfo.portrait == 10) {
            _this.userInfo.portrait = touxiang10
          } else if (_this.userInfo.portrait == 11) {
            _this.userInfo.portrait = touxiang11
          } else if (_this.userInfo.portrait == 12) {
            _this.userInfo.portrait = touxiang12
          }
        });
      },

      //获得说说数据
      getShuoData() {
        let _this = this;
        // var ShuoShuo = Bmob.Object.extend("ShuoShuo");
        var query = Bmob.Query('ShuoShuo');
        query.equalTo("accid", '==', _this.accid); //按类型搜索
        query.limit(_this.dataNumber);
        query.skip(_this.skip);
        query.order("-createdAt");
        query.find().then(results => {
          _this.zyhloading = false; //请求到数据关闭加载动画
          _this.skip += _this.dataNumber;
          _this.moreLoading = true; //底下loding图标开关
          // _this.loading=false;
          // _this.$refs.loadmore.onTopLoaded();
          if (results.length == 0 && _this.shuoData.length != 0) {
            Toast({
              message: '已无更多数据~',
              position: 'center',
              duration: 2000
            });
            // _this.loading=true;
          }
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var data = {
              content: "", //文字内容
              name: "", //发言的用户名字
              picList: [], //发布的图片
              createAt: "", //发布的时间
              clname: "", //classname判断几张图样式不一样
              portrait: "", //头像
              id: "",
            }
            data.content = results[i].content; //文字内容
            data.name = results[i].name; //发言的用户名字
            data.picList = results[i].picList; //发布的图片
            data.portrait = results[i].portrait; //头像
            data.type = results[i].type; //标签类型
            data.tipHot = results[i].tipHot; //标签热度
            data.id = results[i].objectId; //id
            data.commentNum = results[i].commentNum //评论数量
            if (data.picList && data.picList.length == 1) {
              data.clname = "picOne"
            } else if (data.picList && data.picList.length == 2) {
              data.clname = "picTwo"
            } else if (data.picList && data.picList.length >= 2) {
              data.clname = "picThree"
            };
            data.createAt = results[i].createdAt;
            _this.shuoData.push(data);
          };
          _this.zanwuOff = _this.shuoData.length == 0 ? true : false;
        })
      },
      //===========================
      //加载更多
      loadMore() {
        this.moreLoading = false; //出现进度条
        this.getShuoData();
      },
      //======去评论页
      toComment(id) {
        this.$router.push("/comment/" + id)
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
    height: 140*@B;

    .nei {
      height: 140*@B;
      overflow: hidden;

      img {
        width: 100%;
        -webkit-filter: blur(6px);
        filter: blur(6px);
        transform: scale(1) rotate(0deg) translate3d(0, 0, 0) translate(0, -25%);
      }
    }
  }

  .wai {
    width: 100%;
    overflow: hidden;
    margin-top: -24*@B;
    transform: scaleX(1);

    .icon {
      width: 60*@B;
      height: 60*@B;
      overflow: hidden;
      border-radius: 50%;
      margin: 0 auto;

      img {
        width: 100%;
      }
    }

    .font {
      text-align: center;
      font-size: 14*@B;
      padding-top: 5*@B;
      padding-bottom: 10*@B;

      .user_about {
        width: 320*@B;
        justify-content: center;

        .like {
          margin: 0 10*@B;
        }

        span {
          padding-left: 3*@B;
          color: #BEBEBE;
        }
      }

      .nick {
        justify-content: center;

        .userGender {
          padding-left: 4*@B;
          width: 15*@B;

          img {
            width: 100%;
          }
        }

        .age {
          padding-left: 3*@B;
        }
      }
    }
  }

  .pic_list {
    .item {
      position: relative;
      margin-bottom: 10*@B;

      .pic {
        height: 140*@B;
        overflow: hidden;

        img {
          width: 100%;
          min-height: 280*@B;
          transform: translate(0, -25%; )
        }
      }

      .font {
        position: absolute;
        left: 0;
        bottom: 5*@B;
        padding: 0 16*@B;

        p {
          height: 16*@B;
          line-height: 16*@B;
          white-space: nowrap;
          width: 288*@B;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 14*@B;
          color: #fff;
        }
      }
    }
  }

  .more_loading {
    height: 36*@B;
    background: #F5F5F5;

    .icon {
      height: 36*@B;
      text-align: center;
      line-height: 36*@B;
    }

    .font {
      text-align: center;
      font-size: 12*@B;
      line-height: 36*@B;
      height: 36*@B;
    }
  }
</style>