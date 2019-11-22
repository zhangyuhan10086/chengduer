<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="main">
      <div class="header">
        <x-header>系统消息</x-header>
      </div>
      <zanwu-item :zanwuOff="zanwuOff"></zanwu-item>
      <div class="content">
        <div class="card" v-for="item in sysData">
          <div class="time">{{item.date | formatDate}}</div>
          <div class="item" v-html="item.content"></div>
        </div>
      </div>
      <div class="more_loading" v-show="sysData.length>=20">
          <div class="font" v-show="moreLoading" @click="loadMore">点击加载更多···</div>
          <div class="icon" v-show="!moreLoading"><mt-spinner type="triple-bounce" color="#25ccde"></mt-spinner></div>
      </div>
    </div>
    <loading-item :loadingOff="zyhloading"></loading-item>
  </div>
</template>

<script>

import BScroll from 'better-scroll';
import loadingItem from '../components/loading.vue';      //loading模块
import zanwuItem from '../components/zanwu.vue';      //zanwu模块
import { Popup } from 'mint-ui';
import { Toast } from 'mint-ui';
import { XHeader } from 'vux';
import Vue from 'vue';

Vue.component(Popup.name, Popup);

export default {
  data(){
    return {
      pageTitle:'被评论',
      sysData:[],     //被评论的内容
      dataNumber:20,      //每页评论数量
      skip:0,
      zyhloading:true,    //自定义loading
      moreLoading:true,   //底下加载条
      zanwuOff:"",
    }
  },
  //载入组件
  components: {
    loadingItem,
    XHeader,
    zanwuItem
  },
  //computed计算，数据
  computed:{

  },

  //mounted 安装，类型function，默认执行 钩子，
  mounted(){
  
    if(document.documentElement&&document.documentElement.scrollTop)
      {
        document.documentElement.scrollTop=0;
      }
      else if(document.body)
      {
        document.body.scrollTop=0;
      };
    this.getSysData();    //获得被评论的数据
    this.clearRemind();
  },
  //方法 数据
  methods:{

    //获得被评论的消息
    getSysData(){
      let _this=this;
      var SysMess = Bmob.Object.extend("SysMess");
      var query = new Bmob.Query(SysMess);
      query.limit(_this.dataNumber);
      query.skip(_this.skip); 
      query.descending("createdAt");
      // 查询所有数据
      query.find({
        success: function(results) {
          _this.zyhloading=false;     //关闭loading
          _this.skip+=_this.dataNumber;
          _this.moreLoading=true;     //底下loding图标开关
          if(results.length==0 && _this.sysData.length!=0){
            Toast(
              {
                message: '已无更多消息',
                position: 'center',
                duration: 2000
              }
            );
            _this.skip=_this.commentJson.length;
          };
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            var data={
              content: results[i].get("content"),
              date:results[i].createdAt,      //日期
            };
            _this.sysData.push(data);
          };
          _this.zanwuOff= _this.sysData.length==0 ? true : false ;
        },
        error: function(error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    },
    //加载更多
    loadMore(){
      this.moreLoading=false;     //出现进度条
      this.getSysData();
    },
    //清空未读提醒
    clearRemind(){
      var Remind = Bmob.Object.extend("Remind");
      var query = new Bmob.Query(Remind);
      //查询单条数据，第一个参数是这条数据的objectId值
      query.get(localStorage.CDECY_REMINDID, {
        success: function(remind) {
          // 查询成功，调用get方法获取对应属性的值
          remind.fetchWhenSave(true);
          remind.set("sysUnread",0);
          remind.save();
        },
      });
    },
  }
}
</script>

<style lang="less" scoped>
@B:1/12rem;
.main{ padding-top:48px; padding-left:10*@B;padding-right:10*@B;}
.card{ padding:5px 10px 0; margin-top:10*@B; border-radius:4*@B;
  .time{ text-align:center; font-size:12*@B; line-height:20*@B; color:#ccc;}
  .item{  background:#F5F5F5; border-radius:5px; padding:10px;}
}
.more_loading{ height:46*@B; background:#F5F5F5; 
  .icon{  height:46*@B; text-align:center; line-height:46*@B;}
  .font{ text-align:center; font-size:12*@B; line-height:46*@B; height:46*@B;}
}
</style>