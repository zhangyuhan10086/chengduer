<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="main">
      <div class="header">
        <x-header>我的动态</x-header>
      </div>
      <zanwu-item :zanwuOff="zanwuOff"></zanwu-item>
      <div class="list_item" flex>
        <div class="list_left">
          <div @click="toComment(item.id)" class="item" v-for="(item,index) in shuoData" v-if="index%2==0">
            <div class="pic">
              <img v-if="item.picList && item.picList.length"  v-lazy="imgDomain+item.picList[0]" :src="imgDomain+item.picList[0]">
              <img v-else :src="item.portrait">
            </div>
            <div class="font">
              <p>{{item.content}}</p>
              <div class="tip"><span>标签:&nbsp</span>{{item.type}}</div>
            </div>
          </div>
        </div>
        <div class="list_right">
          <div @click="toComment(item.id)" class="item" v-for="(item,index) in shuoData" v-if="index%2==1">
            <div class="pic">
              <img v-if="item.picList && item.picList.length"  v-lazy="imgDomain+item.picList[0]" :src="imgDomain+item.picList[0]">
              <img v-else :src="item.portrait">
            </div>
            <div class="font">
              <p>{{item.content}}</p>
              <div class="tip"><span>标签:&nbsp</span>{{item.type}}</div>
            </div>
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
  import BScroll from 'better-scroll';
  import { MessageBox } from 'mint-ui';
  import loadingItem from '../components/loading.vue'; //loading模块
  import zanwuItem from '../components/zanwu.vue'; //zanwu模块
  import { XHeader } from 'vux';
  import { Toast } from 'mint-ui';
  import { Lazyload } from 'mint-ui';


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
        pageTitle: '个人动态',
        dataNumber: 15, //每页多少条
        skip: "", //跳过多少页
        loading: "",
        shuoData: [], //动态数据
        moreLoading: true, //加载更多loding
        zyhloading: true, //自定义loding
        zanwuOff: "",
        imgDomain: this.$imgDomain
      }
    },
    //载入组件
    components: {
      XHeader,
      loadingItem,
      zanwuItem
    },
    //computed计算，数据
    computed: {

    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {

      // if(document.documentElement&&document.documentElement.scrollTop)
      //   {
      //     document.documentElement.scrollTop=0;
      //   }
      //   else if(document.body)
      //   {
      //     document.body.scrollTop=0;
      //   };
      this.getShuoData();

    },
    //方法 数据
    methods: {
      //获得说说数据
      getShuoData() {
        let _this = this;
        var ShuoShuo = Bmob.Object.extend("ShuoShuo");
        var query = new Bmob.Query(ShuoShuo);
        query.equalTo("accid", localStorage.CDECY_ACCID); //按类型搜索
        query.limit(_this.dataNumber);
        query.skip(_this.skip);
        query.descending("createdAt");
        query.find({
          success: function(results) {
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
              var object = results[i];
              var data = {
                content: "", //文字内容
                name: "", //发言的用户名字
                picList: [], //发布的图片
                createAt: "", //发布的时间
                clname: "", //classname判断几张图样式不一样
                portrait: "", //头像
                id: "",
              }
              data.content = results[i].get("content"); //文字内容
              data.name = results[i].get("name"); //发言的用户名字
              data.picList = results[i].get("picList"); //发布的图片
              data.portrait = results[i].get("portrait"); //头像
              data.type = results[i].get("type"); //标签类型
              data.tipHot = results[i].get("tipHot"); //标签热度
              data.id = results[i].id; //id
              data.commentNum = results[i].get("commentNum") //评论数量
              if (data.picList && data.picList.length == 1) {
                data.clname = "picOne"
              } else if (data.picList && data.picList.length == 2) {
                data.clname = "picTwo"
              } else if (data.picList && data.picList.length >= 2) {
                data.clname = "picThree"
              };
              data.createAt = results[i].createdAt;
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
              }

              _this.shuoData.push(data);
            };
            _this.zanwuOff = _this.shuoData.length == 0 ? true : false;
          },
          error: function(error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        })
      },
      //====================
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
    padding-top: 55px;
  }

  .list_item {
    justify-content: space-between;
    flex-wrap: wrap;

  }

  .item {
    width: 155*@B;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.4);
    margin-bottom: 10*@B;
    color: #272727;

    .pic {
      img {
        width: 100%;
        display: block;
      }
    }

    .font {
      padding: 5*@B 16*@B;

      p {
        line-height: 20*@B;
        font-size: 12*@B;
        width: 135*@B;
        height: 20*@B;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .tip {
        line-height: 20*@B;
        font-size: 12*@B;

        span {
          color: #6c6c6c;
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