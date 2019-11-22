<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="main">
      <div class="header">
        <x-header>被评论</x-header>
      </div>
      <zanwu-item :zanwuOff="zanwuOff"></zanwu-item>
      <div class="content">
        <div class="card" v-for="item in commentJson">
          <div class="user" flex>
            <div class="icon"><img :src="item.sponsorPortrait+'?imageView2/1/w/70/interlace/0/q/100'"></div>
            <div class="nick">
              <div class="nick_name">{{item.sponsorName}}</div>
              <div class="say_date">{{item.date | formatDate}}</div>
            </div>
          </div>
          <div class="say_what">
            {{item.commentfont}}
          </div>
          <div class="teizi" @click="toTeizi(item.shuoId)">
            去查看原帖>
          </div>
        </div>
      </div>
      <div class="more_loading" v-show="commentJson.length>=20">
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
  import BScroll from 'better-scroll';
  import loadingItem from '../components/loading.vue'; //loading模块
  import zanwuItem from '../components/zanwu.vue'; //zanwu模块
  import { Popup } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import { XHeader } from 'vux';
  import Vue from 'vue';


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


  Vue.component(Popup.name, Popup);

  export default {
    data() {
      return {
        pageTitle: '被评论',
        commentJson: [], //被评论的内容
        dataNumber: 20, //每页评论数量
        skip: 0,
        zyhloading: true, //自定义loading
        moreLoading: true, //底下加载条
        zanwuOff: "",
      }
    },
    //载入组件
    components: {
      loadingItem,
      XHeader,
      zanwuItem
    },
    //computed计算，数据
    computed: {

    },
    //离开这个路由时还原style
    beforeRouteLeave(to, from, next) {
      this.resetStyle(); //还原style
      next();
    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {
      if (document.documentElement && document.documentElement.scrollTop)
      {
        document.documentElement.scrollTop = 0;
      }
      else if (document.body)
      {
        document.body.scrollTop = 0;
      };
      this.initStyle();
      this.getCommentData(); //获得被评论的数据
      this.clearRemind();
    },
    //方法 数据
    methods: {
      //设置body背景色
      initStyle() {
        var screenW = document.documentElement.clientWidth;
        var oHtml = document.documentElement;
        var oBody = document.body;
        oHtml.style.background = "#f3f3f3";
        oBody.style.background = "#f3f3f3";
      },
      resetStyle() {
        var screenW = document.documentElement.clientWidth;
        var oHtml = document.documentElement;
        var oBody = document.body;
        oHtml.style.background = "#fff";
        oBody.style.background = "#fff";
      },
      //获得被评论的消息
      getCommentData() {
        let _this = this;
        var CommentData = Bmob.Object.extend("Comment");
        var query = new Bmob.Query(CommentData);
        query.equalTo("receiveAccid", localStorage.CDECY_ACCID);
        query.equalTo("louzhuId", localStorage.CDECY_ACCID);
        query.limit(_this.dataNumber);
        query.skip(_this.skip);
        query.descending("createdAt");
        // 查询所有数据
        query.find({
          success: function(results) {
            _this.zyhloading = false; //关闭loading
            _this.skip += _this.dataNumber;
            _this.moreLoading = true; //底下loding图标开关
            if (results.length == 0 && _this.commentJson.length != 0) {
              Toast(
              {
                message: '已无更多评论',
                position: 'center',
                duration: 2000
              });
              _this.skip = _this.commentJson.length;
            };
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var data = {
                commentfont: results[i].get("commentfont"),
                sponsorAccid: results[i].get("sponsorAccid"), //发起人accid
                sponsorName: results[i].get("sponsorName"), //发起人名字
                sponsorGender: results[i].get("sponsorGender"), //发起人性别
                sponsorPortrait: results[i].get("sponsorPortrait"), //发起人头像
                shuoId: results[i].get("shuoId"), //对应的说说id
                date: results[i].createdAt, //日期
              };
              if (data.sponsorPortrait == 1) {
                data.sponsorPortrait = touxiang1
              } else if (data.sponsorPortrait == 2) {
                data.sponsorPortrait = touxiang2
              } else if (data.sponsorPortrait == 3) {
                data.sponsorPortrait = touxiang3
              } else if (data.sponsorPortrait == 4) {
                data.sponsorPortrait = touxiang4
              } else if (data.sponsorPortrait == 5) {
                data.sponsorPortrait = touxiang5
              } else if (data.sponsorPortrait == 6) {
                data.sponsorPortrait = touxiang6
              } else if (data.sponsorPortrait == 7) {
                data.sponsorPortrait = touxiang7
              } else if (data.sponsorPortrait == 8) {
                data.sponsorPortrait = touxiang8
              } else if (data.sponsorPortrait == 9) {
                data.sponsorPortrait = touxiang9
              } else if (data.sponsorPortrait == 10) {
                data.sponsorPortrait = touxiang10
              } else if (data.sponsorPortrait == 11) {
                data.sponsorPortrait = touxiang11
              } else if (data.sponsorPortrait == 12) {
                data.sponsorPortrait = touxiang12
              }

              _this.commentJson.push(data);
            };
            _this.zanwuOff = _this.commentJson.length == 0 ? true : false;
          },
          error: function(error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
      },
      //去原帖
      toTeizi(id) {
        this.$router.push("/comment/" + id)
      },
      //加载更多
      loadMore() {
        this.moreLoading = false; //出现进度条
        this.getCommentData();
      },
      //清空未读提醒
      clearRemind() {
        var Remind = Bmob.Object.extend("Remind");
        var query = new Bmob.Query(Remind);
        //查询单条数据，第一个参数是这条数据的objectId值
        query.get(localStorage.CDECY_REMINDID, {
          success: function(remind) {
            // 查询成功，调用get方法获取对应属性的值
            remind.fetchWhenSave(true);
            remind.set("commentUnread", 0);
            remind.save();
          },
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;

  .main {
    padding-top: 48px;
    padding-left: 10*@B;
    padding-right: 10*@B;
  }

  .card {
    padding: 5*@B;
    background: #fff;
    margin-top: 10*@B;
    border-radius: 4*@B;

    .user {
      height: 30*@B;

      .icon {
        width: 30*@B;
        height: 30*@B;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .nick {
        padding-left: 8*@B;
        padding-top: 3*@B;
        font-size: 12*@B;

        .nick_name {
          height: 12*@B;
          line-height: 12*@B;
          color: #333;
        }

        .say_date {
          padding-top: 6*@B;
          height: 10*@B;
          line-height: 10*@B;
          color: #BEBEBE;
        }
      }
    }

    .say_what {
      padding-top: 10*@B;
      font-size: 12*@B;
      line-height: 20*@B;
      padding-bottom: 10*@B;
    }

    .teizi {
      background: #f3f3f3;
      padding: 0 5*@B;
      font-size: 12*@B;
      line-height: 20*@B;
      heigh: 20*@B;
      border-radius: 3*@B;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
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
</style>