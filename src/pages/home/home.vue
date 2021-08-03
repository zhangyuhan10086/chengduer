<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div v-show="!zyhloading">
      <div class="headerIn"></div>
      <mt-loadmore :top-method="loadTop" ref="loadmore">
        <div class="content">
          <div class="card" v-for="item in shuoData">
            <div class="card_top">
              <div class="author" flex>
                <div class="icon" @click="toPerson(item.accid)"><img :src="item.portrait+'?imageView2/1/w/200/interlace/0/q/100'"></div>
                <div class="nick">
                  <div class="name">{{item.name}}
                    <span class="tip">
                      <img src="../../assets/nue.svg" v-show="item.userGender=='女'" />
                      <img src="../../assets/nan.svg" v-show="item.userGender=='男'" />
                    </span>
                  </div>
                  <div class="time">{{item.createAt | formatDate}}</div>
                </div>
              </div>
            </div>
            <div class="sayContent" @click="toComment(item.id)">
              <div class="font">{{item.content}}</div>
              <div class="pic_list" flex>
                <div v-for="(pic,index) in item.picList" :class="item.clname" v-if="index<=2" :key="index">
                  <img v-lazy="imgDomain+pic" :src="imgDomain+pic">
                </div>
              </div>
              <div class="tips" flex>
                <div class="tip">{{item.type}}</div>
                <div class="hot">标签热度<span>{{item.tipHot}}</span></div>
              </div>
            </div>
            <div class="foot" flex>
              <div class="grid" @click="zwkf" flex>
                <img src="../../assets/tuijian.jpg">
                <p>推荐</p>
              </div>
              <div class="grid" @click="toComment(item.id)" flex>
                <img src="../../assets/pinglun.jpg">
                <p>{{item.commentNum}}评论</p>
              </div>
              <div class="grid" @click="zwkf" flex>
                <img src="../../assets/zan.jpg">
                <p>0赞</p>
              </div>
            </div>
          </div>
          <div class="more_loading">
            <div class="font" v-show="moreLoading" @click="loadMore">点击加载更多···</div>
            <div class="icon" v-show="!moreLoading">
              <mt-spinner type="triple-bounce" color="#25ccde"></mt-spinner>
            </div>
          </div>
        </div>
      </mt-loadmore>
      <transition name="fade" made="out-in">
        <div class="publish" v-if="publishOff" @click="toPublish()">
          <img src="../../assets/edit.svg" />
        </div>
      </transition>
    </div>
    <!-- <loading-item :loadingOff="zyhloading"></loading-item> -->
  </div>
</template>

<script>
  //import Bmob from 'hydrogen-js-sdk'
  import Vue from 'vue'
  import { Toast } from 'mint-ui';
  import { InfiniteScroll } from 'mint-ui';
  import { Loadmore } from 'mint-ui';
  import { Spinner } from 'mint-ui';
  import loadingItem from '../components/loading.vue' //自己写的loding组件
  import store from '../../store';
  Vue.use(InfiniteScroll);
  Vue.component(Loadmore.name, Loadmore);
  Vue.component(Spinner.name, Spinner);

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



  //var BmobSocketIo = new Bmob.Socket()


  export default {
    data() {
      return {
        pageTitle: '主页',
        contentHeight: '', //内容高度
        scrollTop: '', //滚动条高度
        dataNumber: 15, //每页查询条数
        skip: 0, //忽略前面多少条
        shuoData: [], //说说数据 
        xiahuaNum: 0,
        loading: true, //无限滚动开关
        moreLoading: true, //底下loading开关
        publishOff: true, //发布按钮开关
        scrollArr: [], //记录滚动条位置判断是向上滑还是向下滑
        type: "", //标签类型
        zyhloading: true, //全屏加载动画
        imgDomain: this.$imgDomain,
      }
    },
    //路由离开时钩子
    beforeRouteLeave(to, from, next) {
      this.resetStyle();
      this.getScrollTop(); //记录滚动条位置
      console.log('beforeRouteLeave')
      next();
    },
    //载入组件
    components: {
      loadingItem,

    },
    watch: {

    },
    //computed计算，数据
    computed: {

    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {
      console.log(Bmob)
      console.log("home mounted")
      this.initStyle();
      //this.socketId();
      this.getShuoData();
      //this.getRemind();
    },
    //方法 数据
    methods: {
      //设置body背景色
      initStyle() {
        var oHtml = document.documentElement;
        var oBody = document.body;
        oHtml.style.background = "#f3f3f3";
        oBody.style.background = "#f3f3f3";
      },
      resetStyle() {
        var oHtml = document.documentElement;
        var oBody = document.body;

        oHtml.style.background = "#fff";
        oBody.style.background = "#fff";
      },
      //记录滚动条高度
      getScrollTop() {
        let this_ = this;
        if (document.documentElement && document.documentElement.scrollTop)
        {
          this_.scrollTop = document.documentElement.scrollTop;
        }
        else if (document.body)
        {
          this_.scrollTop = document.body.scrollTop;
        }
        sessionStorage.setItem('HOME_SCROLLVALUE', this_.scrollTop)

      },
      //回到记录的滚动条高度
      returnScrollValue() {
        let scrollHeight = sessionStorage.getItem('HOME_SCROLLVALUE'); //获得滚动条高度
        window.scrollTo(0, scrollHeight);

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
      //获得更多数据
      loadMore() {
        this.moreLoading = false; //底下出现进度条
        console.log("更多");
        this.getShuoData();
      },
      //下拉刷新
      loadTop() {
        console.log("下拉");
        this.skip = 0;
        this.shuoData.length = 0;
        this.getShuoData();
        this.getRemind();
        this.loading = false; //开启下拉
      },
      //获得说说数据
      getShuoData() {
        let _this = this;
        // var ShuoShuo = Bmob.Object.extend("ShuoShuo");
        var query = Bmob.Query('ShuoShuo');
        if (_this.type) {
          query.equalTo("type", _this.type); //按类型搜索

        };
        query.limit(_this.dataNumber);
        query.skip(_this.skip);
        query.order("-updatedAt");
        query.find().then(results => {
          _this.zyhloading = false; //请求到数据关闭加载动画
          _this.skip += _this.dataNumber;
          _this.moreLoading = true; //底下loding图标开关
          // _this.loading=false;
          _this.$refs.loadmore.onTopLoaded();
          if (results.length == 0) {
            Toast({
              message: '已无更多数据~',
              position: 'center',
              duration: 2000
            });
            _this.loading = true;
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
              accid: "",
            };
            var content = results[i].content;
            data.content = content.length > 60 ? content.substr(0, 60) + "..." : content; //文字内容
            data.name = results[i].name; //发言的用户名字
            data.picList = results[i].picList; //发布的图片
            data.portrait = results[i].portrait; //头像
            data.type = results[i].type; //标签类型
            data.tipHot = results[i].tipHot; //标签热度
            data.id = results[i].objectId; //标签热度
            data.commentNum = results[i].commentNum //评论数量
            data.accid = results[i].accid //评论数量
            data.userGender = results[i].userGender; //用户性别
            if (data.picList && data.picList.length == 1) {
              data.clname = "picOne"
            } else if (data.picList && data.picList.length == 2) {
              data.clname = "picTwo"
            } else if (data.picList && data.picList.length >= 2) {
              data.clname = "picThree"
            };
            //头像转换
            if (data.portrait == 1) {
              data.portrait = touxiang1
            } else if (data.portrait == 2) {
              data.portrait = touxiang2
            } else if (data.portrait == 3) {
              data.portrait = touxiang3
            } else if (data.portrait == 4) {
              data.portrait = touxiang4
            } else if (data.portrait == 5) {
              data.portrait = touxiang5
            } else if (data.portrait == 6) {
              data.portrait = touxiang6
            } else if (data.portrait == 7) {
              data.portrait = touxiang7
            } else if (data.portrait == 8) {
              data.portrait = touxiang8
            } else if (data.portrait == 9) {
              data.portrait = touxiang9
            } else if (data.portrait == 10) {
              data.portrait = touxiang10
            } else if (data.portrait == 11) {
              data.portrait = touxiang11
            } else if (data.portrait == 12) {
              data.portrait = touxiang12
            };
            data.createAt = results[i].createdAt;
            _this.shuoData.push(data);
          };
        })
      },
      //向下滑动隐藏发布按钮，向上滑动出现按钮
      publishShow() {
        let _this = this;
        var scrollTop;
        if (_this.scrollArr.length >= 500) {
          _this.scrollArr.length = 0
        }
        if (document.documentElement && document.documentElement.scrollTop)
        {
          scrollTop = document.documentElement.scrollTop;
          _this.scrollArr.push(scrollTop);
        }
        else if (document.body)
        {
          scrollTop = document.body.scrollTop;
          _this.scrollArr.push(scrollTop);
        };
        var le = _this.scrollArr.length;
        if (_this.scrollArr[le - 1] >= _this.scrollArr[le - 2]) {
          _this.publishOff = false
        };
        if (_this.scrollArr[le - 1] < _this.scrollArr[le - 2]) {
          _this.publishOff = true;
        }
      },
      //去发布页面
      toPublish() {
        this.$router.push("/publish")
      },
      //去评论页面
      toComment(id) {
        this.$router.push("/comment/" + id)
      },
      //socketio=================================
      socketId() {

        if (localStorage.CDECY_REMINDID) {
          BmobSocketIo.updateRow("Remind", localStorage.CDECY_REMINDID); //建立连接
          BmobSocketIo.onUpdateRow = function(tablename, objectId, data) {
            console.log(data);
            var sysUnread = data.sysUnread; //未读系统消息   
            var commentUnread = data.commentUnread; //未读被评论消息
            var aiteUnread = data.aiteUnread; //未读被@的消息
            var totalUnread = sysUnread + commentUnread + aiteUnread; //总未读消息数量

            store.commit('updateCommentUnreadNum', { commentUnreadNum: commentUnread }); //提交评论数量
            store.commit('updateSysUnreadNum', { sysUnreadNum: sysUnread }); //提交系统消息数量
            store.commit('updateaiteUnreadNum', { aiteUnreadNum: aiteUnread }); //提交@消息数量
            if (tablename == "Remind" && totalUnread != 0) {

              store.commit('updateHasMess', { hasMess: true }); //提交有未读
            } else if (tablename == "Remind" && totalUnread == 0) {

              store.commit('updateHasMess', { hasMess: false }); //提交有未读
            }
          };
        }
      },

      //================一开始请求次收提示表
      getRemind() {
        // var Remind = Bmob.Object.extend("Remind");
        var query = Bmob.Query('Remind');
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
      //====进入个人信息
      toPerson(id) {
        this.$router.push("/others/" + id)
      },

      //===========
    },
    //再次进入钩子
    activated() {
      console.log('再次进入Home')
      this.returnScrollValue();
      //this.socketId();
      //this.getRemind();
    },

  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;

  .headerIn {
    height: 46px;
  }

  .content {
    .card {
      background: #fff;
      font-size: 14*@B;
      border-bottom: 10px solid #F0F0F0;

      img {
        display: block;
      }

      .card_top {
        padding: 0 10*@B;
      }

      .author {
        padding-top: 10*@B;

        .icon {
          width: 50*@B;
          height: 50*@B;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            display: block;
          }
        }

        .nick {
          padding-left: 5*@B;
          padding-top: 2*@B;

          .name {
            padding-bottom: 4*@B;
            height: 24*@B;
            line-height: 24*@B;
            font-size: 14*@B;
            color: #3c3c3c;
            display: flex;

            .tip {
              height: 12*@B;
              font-size: 12*@B;
              margin-top: 5*@B;

              img {
                width: 12*@B;
              }
            }
          }

          .time {
            height: 20*@B;
            line-height: 20*@B;
            font-size: 12*@B;
            color: #5b5b5b;
          }
        }
      }

      .sayContent {
        .font {
          padding: 5*@B 10*@B;
        }

        .pic_list {
          flex-wrap: wrap;

          .picOne {
            width: 100%;
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          .picTwo {
            width: 157*@B;
            height: 157*@B;
            overflow: hidden;

            img {
              display: block;
              max-width: 400*@B;
              min-width: 300*@B;
              transfomm: translate(-25%, -25%)
            }
          }

          .picTwo:first-of-type {
            margin-right: 6*@B;
          }

          .picThree {
            width: 102*@B;
            height: 102*@B;
            overflow: hidden;

            img {
              display: block;
              min-width: 200*@B;
              max-width: 300*@B;
              transform: translate(-25%, -25%)
            }
          }

          .picThree:nth-of-type(2) {
            margin: 0 7*@B;
          }
        }

        .tips {
          border-bottom: 1px solid #E0E0E0;
          height: 35px;
          color: #6991ab;
          flex-wrap: wrap;
          padding-left: 10*@B;

          .tip {
            padding: 0 5px 0 20px;
            height: 24px;
            line-height: 24px;
            background: #f0f3fa url(../../assets/tip.svg) no-repeat 4px 7px;
            background-size: 12px;
            border-radius: 3px;
            margin-right: 5px;
            margin-top: 5px;
            font-size: 12px;
          }

          .hot {
            padding: 0 5px 0 20px;
            height: 24px;
            line-height: 24px;
            background: #f0f3fa url(../../assets/hot.svg) no-repeat 4px 7px;
            background-size: 12px;
            border-radius: 3px;
            margin-right: 5px;
            margin-top: 5px;
            font-size: 12px;
            color: #fe851a;

            span {
              padding-left: 4px;
            }
          }
        }
      }

      .foot {
        font-size: 12px;
        color: #989898;

        .grid {
          width: 33%;
          height: 40px;
          line-height: 40px;
          justify-content: center;

          img {
            width: 15px;
            height: 30px;
            padding-top: 4px;
          }

          p {
            padding-left: 5px;
          }
        }
      }
    }
  }

  .more_loading {
    height: 46*@B;
    background: #F5F5F5;

    .icon {
      height: 46*@B;
      text-align: center;
      line-height: 46*@B;
    }

    .font {
      text-align: center;
      font-size: 12*@B;
      line-height: 46*@B;
      height: 46*@B;
    }
  }

  .publish {
    width: 40px;
    height: 40px;
    background: #529fcd;
    border-radius: 50%;
    position: fixed;
    bottom: 20px;
    ;
    right: 5px;
    ;

    img {
      width: 17px;
      margin: 8px 13px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter,
  .fade-leave-to

  /* .fade-leave-active in <2.1.8 */
    {
    opacity: 0
  }

  image[lazy=loading] {
    width: 4px;
    height: 4px;
    margin: auto;
  }
</style>