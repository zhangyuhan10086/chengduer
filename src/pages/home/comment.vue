<template>
  <div v-pageTitle="{content:this.pageTitle}" @touchmove="huadong">
    <div :class="animateClass">
      <x-header></x-header>
    </div>
    <div class="cheader" v-show="domOff" flex>
      <div class="center" flex>
        <div class="c_left" @click="toPerson(shuoData.accid)">
          <img :src="shuoData.portrait">
        </div>
        <div class="c_right">
          <div class="name">{{shuoData.name}}</div>
          <div class="tip">
            <img src="../../assets/nue.svg" v-show="shuoData.userGender=='女'" />
            <img src="../../assets/nan.svg" v-show="shuoData.userGender=='男'" />
          </div>
        </div>
      </div>
      <!-- <div class="right">
      <p :class="shuoData.userGender=='女' ? 'meizi' : ' ' ">关注</p>
    </div> -->
    </div>
    <div class="content" v-show="domOff">
      <div class="content_s">
        <div class="author_content">
          <p>{{shuoData.content}}</p>
          <div class="pic_list">
            <div class="pic" v-for="(pic,index) in shuoData.picList" :key="index">
              <img v-lazy="imgDomain+pic" :src="imgDomain+pic">
            </div>
          </div>
          <div class="date">发布于<span>{{shuoData.date | formatDate}}</span></div>
        </div>
        <div class="comment">
          <div class="comment_top">评论({{shuoData.commentNum}})</div>
          <div class="comment_C">
            <div class="item" v-for="item in commentArr">
              <div class="user" flex>
                <div class="icon" @click="toPerson(item.sponsorAccid)"><img :src="item.sponsorPortrait+'?imageView2/0/w/70/interlace/0/q/100'"></div>
                <div class="nick">
                  <div class="nick_name" flex>
                    <div>{{item.sponsorName}}</div>
                    <div class="louzhu" v-show="item.sponsorAccid==shuoData.accid"><img src="../../assets/louzhu.svg"></div>
                  </div>
                  <div class="say_date">
                    <span v-show="item.date!='刚才'">{{item.date | formatDate}}</span>
                    <span v-show="item.date=='刚才'">{{item.date}}</span>
                  </div>
                </div>
              </div>
              <div class="say_what">
                <p><span v-show="item.receivename!=shuoData.name">@{{item.receivename}}</span>{{item.commentfont}}</p>
              </div>
              <div class="huifu" @click="siren(item.sponsorAccid,item.sponsorName,item.sponsorPortrait,item.sponsorGender)">
                <img src="../../assets/huifu.svg">
              </div>
            </div>
          </div>
        </div>
        <div class="more_loading" v-show="commentArr.length>=20">
          <div class="font" v-show="moreLoading" @click="loadMore">点击加载更多···</div>
          <div class="icon" v-show="!moreLoading">
            <mt-spinner type="triple-bounce" color="#25ccde"></mt-spinner>
          </div>
        </div>
      </div>
    </div>
    <loading-item :loadingOff="loading"></loading-item>
    <div :class="animatedShuruClass" v-show="domOff" @click="openReply">
      <p>发布评论</p>
    </div>
    <mt-popup v-model="popupVisible" position="bottom" :closeOnClickModal="false">
      <div class="popUp">
        <div class="title" flex>
          <div class="close" @click="popupVisible=false"><img src="../../assets/close.svg" /></div>
          <div class="seed" @click="sayComment">发送</div>
        </div>
        <textarea id="tValue" placeholder="发布评论" v-model="commentfont"></textarea>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import loadingItem from '../components/loading.vue'; //loading模块
  import { Popup } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import { Lazyload } from 'mint-ui';
  import { XHeader } from 'vux';
  import store from '../../store';
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
        pageTitle: '评论',
        zonHeight: "", //
        id: this.$route.params.id, //说说id
        shuoData: {
          content: "", //文字内容
          name: "", //发言用户的名字
          picList: "", //发布的图片
          portrait: "", //用户的头像
          type: "", //标签类型
          accid: "",
          userGender: "", //性别
          age: "", //年龄

        }, //说说数据
        loading: true, //loading模块控制开关
        popupVisible: false, //控住弹框
        commentfont: "", //评论内容
        commentArr: [], //评论数组
        loadingInfi: false, //无限滚动开关
        dataNumber: 20, //每页查询条数
        skip: 0, //忽略前面多少条
        moreLoading: true, //底下加载条
        duilouzhu: "0", //0表示是对楼主回复 1表示对私人
        sirenReceiveAccid: "", //私人accid
        sirenReceivename: "", //私人名字
        sirenReceiveGender: "", //私人性别
        sirenReceivePortrait: "", //私人头像
        animateClass: "header animated", //头部header加动画
        animatedShuruClass: "shuru animated", //shuru框动画
        scrollArr: [], //滑动用数组
        bottomOff: false, //判断到底
        httpNum: 0,
        domOff: false,
        imgDomain: this.$imgDomain
      }
    },
    //载入组件
    components: {
      loadingItem,
      XHeader,
    },
    //computed计算，数据
    computed: {

    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {

      //获取屏幕高度
      // this.zonHeight=document.documentElement.clientHeight+"px";

      //获得说说数据
      this.getShuoData();
      this.getCommentData(); //获得评论数据

    },
    //路由离开钩子
    beforeRouteLeave(to, from, next) {
      store.commit('updateHasHeader', { hasHeade: true }); //显示tab头部
      next();
    },
    watch: {
      httpNum(val) {
        if (val == 2) {
          this.getDocumentHeight();
        }
      }
    },
    //方法 数据
    methods: {
      openReply() {
        var currentUser = Bmob.User.current();
        if (currentUser && localStorage.CDECY_NICKNAME && localStorage.CDECY_USERNAME && localStorage.CDECY_PORTRAIT && localStorage.CDECY_USERGENDER && localStorage.CDECY_USERAGE) {
          this.popupVisible = true;
          this.duilouzhu = '0'
        } else { //没有登录过去登录页面
          alert("没有登录，请去登录");
          this.$router.push("/login");
        }
      },
      //进入页面时就回到顶部
      toTop() {
        store.commit('updateHasHeader', { hasHeade: false }); //隐藏tab头部
        if (document.documentElement && document.documentElement.scrollTop)
        {
          document.documentElement.scrollTop = 0;
        }
        else if (document.body)
        {
          document.body.scrollTop = 0;
        };
      },
      //====进入个人信息
      toPerson(id) {
        this.$router.push("/others/" + id)
      },

      //初始betterscroll
      // initScroll(){
      //   this.domScroll=new BScroll(this.$refs.domx,{
      //     startX: 0,
      //     startY: 0,
      //     scrollY: true,
      //     momentum: true,
      //     bounce: false,
      //     deceleration: 0.001
      //   })
      // },
      //获得说说数据
      getShuoData() {
        let _this = this;
        var ShuoShuo = Bmob.Object.extend("ShuoShuo");
        var query = new Bmob.Query(ShuoShuo);
        query.get(_this.id, {
          success: function(results) {
            _this.toTop(); //回到顶部
            _this.httpNum++;
            _this.domOff = true;
            // 查询成功，调用get方法获取对应属性的值
            _this.shuoData.content = results.get("content"); //文字内容
            _this.shuoData.name = results.get("name"); //发言的用户名字
            _this.shuoData.picList = results.get("picList"); //发布的图片
            _this.shuoData.portrait = results.get("portrait"); //头像
            _this.shuoData.type = results.get("type"); //标签类型
            _this.shuoData.date = results.createdAt; //发布的日期
            _this.shuoData.userGender = results.get("userGender"); //用户性别
            _this.shuoData.accid = results.get("accid");
            _this.shuoData.commentNum = results.get("commentNum"); //评论数量
            _this.shuoData.age = results.get("userAge"); //年龄

            if (_this.shuoData.portrait == 1) {
              _this.shuoData.portrait = touxiang1
            } else if (_this.shuoData.portrait == 2) {
              _this.shuoData.portrait = touxiang2
            } else if (_this.shuoData.portrait == 3) {
              _this.shuoData.portrait = touxiang3
            } else if (_this.shuoData.portrait == 4) {
              _this.shuoData.portrait = touxiang4
            } else if (_this.shuoData.portrait == 5) {
              _this.shuoData.portrait = touxiang5
            } else if (_this.shuoData.portrait == 6) {
              _this.shuoData.portrait = touxiang6
            } else if (_this.shuoData.portrait == 7) {
              _this.shuoData.portrait = touxiang7
            } else if (_this.shuoData.portrait == 8) {
              _this.shuoData.portrait = touxiang8
            } else if (_this.shuoData.portrait == 9) {
              _this.shuoData.portrait = touxiang9
            } else if (_this.shuoData.portrait == 10) {
              _this.shuoData.portrait = touxiang10
            } else if (_this.shuoData.portrait == 11) {
              _this.shuoData.portrait = touxiang11
            } else if (_this.shuoData.portrait == 12) {
              _this.shuoData.portrait = touxiang12
            }


            // data.tipHot=results[i].get("tipHot");   //标签热度
            //数据请求成功 new一个scroll

            _this.loading = false;
            console.log(_this.shuoData)
          },
          error: function(object, error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
      },
      //私人回复
      siren(accid, name, touxiang, xingbei) {
        this.duilouzhu = "1";
        this.sirenReceiveAccid = accid; //私人accid
        this.sirenReceivename = name; //私人名字
        this.sirenReceiveGender = xingbei; //私人性别
        this.sirenReceivePortrait = touxiang; //私人头像
        this.popupVisible = true;
      },
      //发布评论
      sayComment() {
        let _this = this;
        if (!_this.commentfont) {
          return false;
        }
        if (_this.commentfont.length > 200) {
          Toast(
          {
            message: '评论字数不能超过200~',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        _this.loading = true; //开启oading
        _this.popupVisible = false; //弹框消失
        //创建类和实例
        var Comment = Bmob.Object.extend("Comment");
        var comment = new Comment();
        var receiveAccid = "";
        var receivename = "";
        var receiveGender = "";
        var receivePortrait = "";
        if (_this.duilouzhu == "0") {
          receiveAccid = _this.shuoData.accid;
          receivename = _this.shuoData.name;
          receiveGender = _this.shuoData.userGender;
          receivePortrait = _this.shuoData.portrait;
        } else if (_this.duilouzhu == "1") {
          receiveAccid = _this.sirenReceiveAccid;
          receivename = _this.sirenReceivename;
          receiveGender = _this.sirenReceiveGender;
          receivePortrait = _this.sirenReceivePortrait;
        };
        // 添加数据，第一个入口参数是Json数据
        comment.save({
          commentfont: _this.commentfont,
          sponsorAccid: localStorage.CDECY_ACCID, //发起人accid
          sponsorName: localStorage.CDECY_NICKNAME, //发起人名字
          sponsorGender: localStorage.CDECY_USERGENDER, //发起人性别
          sponsorPortrait: localStorage.CDECY_PORTRAIT, //发起人头像
          receiveAccid: receiveAccid, //接收方accid
          receivename: receivename, //接收方名字
          receiveGender: receiveGender, //接收方性别
          receivePortrait: receivePortrait, //接收方头像
          shuoId: _this.id, //对应的说说id
          weidu: "0", //未读0 表示未读，1已读
          louzhuId: _this.shuoData.accid, //楼主的accid
        }, {
          success: function(comment) {
            // 添加成功
            var Shuoshuo = Bmob.Object.extend("ShuoShuo");
            //创建查询对象，入口参数是对象类的实例
            var query = new Bmob.Query(Shuoshuo);
            if (_this.duilouzhu == "0") {
              receiveAccid = _this.shuoData.accid;
              receivename = _this.shuoData.name;
              receiveGender = _this.shuoData.userGender;
              receivePortrait = _this.shuoData.portrait;
            } else if (_this.duilouzhu == "1") {
              receiveAccid = _this.sirenReceiveAccid;
              receivename = _this.sirenReceivename;
              receiveGender = _this.sirenReceiveGender;
              receivePortrait = _this.sirenReceivePortrait;
            };
            //查询单条数据，第一个参数是这条数据的objectId值
            query.get(_this.id, {
              success: function(shuo) {
                _this.loading = false; //关闭oading
                // 查询成功，调用get方法获取对应属性的值
                var commentNum = shuo.get("commentNum") + 1;
                //再修改他的评论数量
                shuo.set('commentNum', commentNum);
                shuo.save();
                if (_this.commentArr.length < 20) {
                  //页面上展示
                  var data = {
                    commentfont: _this.commentfont,
                    sponsorAccid: localStorage.CDECY_ACCID, //发起人accid
                    sponsorGender: localStorage.CDECY_USERGENDER, //发起人性别
                    sponsorName: localStorage.CDECY_NICKNAME, //发起人名字
                    sponsorGender: localStorage.CDECY_USERGENDER, //发起人性别
                    sponsorPortrait: localStorage.CDECY_PORTRAIT, //发起人头像
                    receiveAccid: receiveAccid, //接收方accid
                    receivename: receivename, //接收方名字
                    receiveGender: receiveGender, //接收方性别
                    date: "刚才",
                    shuoId: _this.id, //对应的说说id
                    weidu: "0" //未读0 表示未读，1已读
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

                  _this.commentArr.push(data);
                  _this.commentfont = ""; //清空评论内容
                }
              },
              error: function(object, error) {
                // 查询失败
              }
            });
            //==========向提醒表表中未读添加1

            var Remind = Bmob.Object.extend("Remind");
            var query = new Bmob.Query(Remind);
            query.equalTo("accid", receiveAccid);
            // 查询所有数据
            query.find({
              success: function(remind) {
                console.log(remind)
                //这是评论楼主
                if (_this.duilouzhu == "0") {
                  var commentUnread = remind[0].get("commentUnread") + 1;
                  //再修改他的评论未读数量
                  remind[0].set('commentUnread', commentUnread);
                  remind[0].save();
                } else if (_this.duilouzhu == "1") { //这是私回层主
                  var aiteUnread = remind[0].get("aiteUnread") + 1;
                  //再修改他的评论未读数量
                  remind[0].set('aiteUnread', aiteUnread);
                  remind[0].save();
                }
              },
            });
          },
          error: function(comment, error) {
            // 添加失败
            console.log(error)
          }
        });
      },
      //查找本说说的评论数据
      getCommentData() {
        let _this = this;
        var CommentData = Bmob.Object.extend("Comment");
        var query = new Bmob.Query(CommentData);
        query.limit(_this.dataNumber);
        query.skip(_this.skip);
        query.equalTo("shuoId", _this.id);
        // 查询所有数据
        query.find({
          success: function(results) {
            _this.skip += _this.dataNumber;
            _this.httpNum++;
            _this.moreLoading = true; //底下loding图标开关
            if (results.length == 0 && _this.commentArr.length != 0) {
              Toast(
              {
                message: '已无更多评论',
                position: 'center',
                duration: 2000
              });
              _this.skip = _this.commentArr.length;
            }
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var data = {
                commentfont: results[i].get("commentfont"), //说说文字内容
                sponsorAccid: results[i].get("sponsorAccid"), //发起人accid
                sponsorName: results[i].get("sponsorName"), //发起人名字
                sponsorGender: results[i].get("sponsorGender"), //发起人性别
                sponsorPortrait: results[i].get("sponsorPortrait"), //发起人头像
                receiveAccid: results[i].get("receiveAccid"), //接收方accid
                receivename: results[i].get("receivename"), //接收方名字
                receiveGender: results[i].get("receiveGender"), //接收方性别
                shuoId: results[i].get("shuoId"), //对应的说说id
                weidu: results[i].get("weidu"), //未读0 表示未读，1已读
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

              _this.commentArr.push(data);
            }
          },
          error: function(error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
      },
      //加载更多
      loadMore() {
        this.moreLoading = false; //出现进度条
        this.getCommentData();
      },
      //滑动事件
      huadong() {
        let _this = this;
        var scrollTop;
        if (_this.scrollArr.length >= 100) {
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

        if (scrollTop > 80 && _this.bottomOff == false) { //高度大于header判断上滑还是下滑
          var le = _this.scrollArr.length;
          if (_this.scrollArr[le - 1] >= _this.scrollArr[le - 2]) {
            _this.animateClass = "header animated fadeOutUp"; //向下滑header消失
            _this.animatedShuruClass = "shuru animated fadeOutDown"; //向下滑输入框消失
          };
          if (_this.scrollArr[le - 1] < _this.scrollArr[le - 2]) {
            _this.animateClass = "header animated fadeInDown"; //向上滑出现
            _this.animatedShuruClass = "shuru animated fadeInUp"; //向上滑出现

          };
        } else if (scrollTop < 80 && _this.animateClass == "header animated fadeOutUp") { //高度小于header直接让header向下fadein出现
          _this.animateClass = "header animated fadeInDown"; //向上滑出现
          _this.animatedShuruClass = "shuru animated fadeInUp"; //向上滑出现
        } else if (_this.bottomOff == true) {
          console.log("到底")
          _this.animateClass = "header animated fadeInDown"; //向上滑出现
          _this.animatedShuruClass = "shuru animated fadeInUp"; //向上滑出现
        }
      },
      //计算文档总高度
      getDocumentHeight() {
        let _this = this;

        function getScrollTop() {
          var scrollTop = 0,
            bodyScrollTop = 0,
            documentScrollTop = 0;
          if (document.body) {
            bodyScrollTop = document.body.scrollTop;
          }
          if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
          }
          scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
          return scrollTop;
        }
        //文档的总高度
        function getScrollHeight() {
          var scrollHeight = 0,
            bodyScrollHeight = 0,
            documentScrollHeight = 0;
          if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
          }
          if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
          }
          scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
          return scrollHeight;
        }
        //浏览器视口的高度
        function getWindowHeight() {
          var windowHeight = 0;
          if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
          } else {
            windowHeight = document.body.clientHeight;
          }
          return windowHeight;
        }

        window.onscroll = function() {
          if (getScrollTop() + getWindowHeight() + 80 >= getScrollHeight()) {
            _this.bottomOff = true;
          } else {
            _this.bottomOff = false;
          };

        };
      },
    }
  }
</script>

<style lang="less" scoped>
  .header {
    animation-duration: 0.4s;
  }

  @B: 1/12rem;

  .cheader {
    height: 50*@B;
    padding: 58px 0 10*@B;
    background: #fff;
    width: 100%;

    .center {
      padding-left: 10*@B;
      width: 200*@B;

      .c_left {
        width: 50*@B;
        height: 50*@B;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .c_right {
        padding-left: 5*@B;
        padding-top: 7*@B;

        .name {
          height: 20*@B;
          line-height: 20*@B;
          font-size: 14*@B;
        }

        .tip {
          height: 12*@B;
          width: 60*@B;
          padding-top: 3*@B;
          font-size: 12*@B;

          img {
            width: 12*@B;
          }
        }
      }
    }

    .right {
      padding-top: 4*@B;
      padding-left: 8*@B;

      p {
        font-size: 13*@B;
        width: 50*@B;
        height: 23*@B;
        line-height: 23*@B;
        color: #1296db;
        text-align: center;
        border: 1px solid #1296db;
        border-radius: 10*@B;
      }

      .meizi {
        color: #fe70a2;
        border: 1px solid #fe70a2;
      }
    }
  }

  .content_s {
    padding-bottom: 48*@B;

    .author_content {
      padding-top: 5*@B;
      border-bottom: 6*@B solid #f0f0f0;

      p {
        padding: 5*@B 10*@B 0;
        font-size: 14*@B;
        line-height: 20*@B;
      }

      .pic_list {
        padding-top: 8*@B;

        .pic {
          padding-bottom: 5*@B;

          img {
            display: block;
            max-width: 100%;
          }
        }
      }

      .date {
        text-align: right;
        font-size: 12*@B;
        padding-right: 10*@B;
        padding-bottom: 5*@B;
      }
    }
  }

  .comment_top {
    border-bottom: 1px solid #f0f0f0;
    padding-left: 30*@B;
    height: 30*@B;
    line-height: 30*@B;
    background: url("../../assets/pinglun.jpg") no-repeat 10*@B 0;
    background-size: 14*@B;
  }

  .comment_C {
    .item {
      padding: 0 10*@B;
      border-bottom: 1px solid #f0f0f0;
      padding-top: 5*@B;
      position: relative;

      .user {
        height: 40*@B;

        .icon {
          width: 40*@B;
          height: 40*@B;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        .nick {
          padding-left: 8*@B;
          padding-top: 3*@B;
          font-size: 14*@B;

          .nick_name {
            height: 16*@B;
            line-height: 16*@B;
            color: #333;
          }

          .say_date {
            padding-top: 6*@B;
            height: 10*@B;
            line-height: 10*@B;
            color: #BEBEBE;
          }
        }

        .louzhu {
          width: 14*@B;
          margin-left: 7*@B;

          img {
            width: 100%;
            margin-top: 0*@B;
          }
        }
      }

      .say_what {
        padding-left: 48*@B;
        line-height: 18*@B;
        font-size: 12*@B;
        padding-top: 5*@B;
        padding-bottom: 5*@B;

        span {
          color: #7fb8fb;
          padding-right: 5*@B;
        }
      }

      .huifu {
        position: absolute;
        right: 10*@B;
        top: 7*@B;
        width: 20*@B;

        img {
          width: 100%;
        }
      }
    }
  }

  .shuru {
    border-top: 1px solid #f0f0f0;
    padding: 9*@B 10*@B;
    height: 30*@B;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 300*@B;
    background: #fff;
    animation-duration: 0.4s;

    p {
      background: #f0f0f0;
      height: 30*@B;
      border-radius: 6*@B;
      text-indent: 1em;
      line-height: 30*@B;
      color: #ccc;
      font-size: 12*@B;
    }
  }

  #tValue {
    border: none;
    width: 100%;
    background: #f0f0f0;
    font-size: 14*@B;
    line-height: 20*@B;
    height: 20*@B;
    padding: 5*@B 0;
  }

  .popUp {
    width: 320*@B;
    background: #f0f0f0;
    padding-top: 8*@B;
    padding-bottom: 20*@B;

    .title {
      justify-content: space-between;
      padding-right: 10*@B;
      padding-bottom: 10*@B;
    }

    .close {
      width: 14*@B;
      padding-left: 16*@B;

      img {
        width: 14*@B;
        padding-top: 6*@B;
      }
    }

    .seed {
      font-size: 12*@B;
      color: #fff;
      background: #fe70a2;
      height: 26*@B;
      width: 50*@B;
      text-align: center;
      line-height: 25*@B;
      border-radius: 13*@B;
    }

    #tValue {
      background: #fff;
      width: 292*@B;
      margin-left: 10*@B;
      padding: 4*@B;
      line-height: 20*@B;
      font-size: 12*@B;
      height: 80*@B;
      out-line: none;
      resize: none;
    }
  }

  input,
  button,
  select,
  textarea {
    outline: none;
  }

  .more_loading {
    height: 30*@B;
    background: #F5F5F5;

    .icon {
      height: 30*@B;
      text-align: center;
      line-height: 30*@B;
    }

    .font {
      text-align: center;
      font-size: 12*@B;
      line-height: 30*@B;
      height: 30*@B;
    }
  }
</style>