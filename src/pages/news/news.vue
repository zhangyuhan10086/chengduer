<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div>
       <tab :line-width=2 active-color='#fc378c' v-model="index">
        <tab-item class="vux-center" :selected="xinfan === item" v-for="(item, index) in list2" @click="xinfan = item" :key="index">{{item}}</tab-item>
      </tab>
      <swiper v-model="index"  :show-dots="false">
        <swiper-item v-for="(item, index) in list2" :key="index">
          <div class="tab-swiper vux-center">{{item}} Container
{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container{{item}} Container
          </div>
        </swiper-item>
      </swiper>
    </div>
  </div>
</template>

<script>

import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
const list = () => ['新番', '网游', '手游', '主机', 'cosplay']
export default {
  data(){
    return {
      pageTitle:'资讯',
      list2: list(),
      xinfan: '新番',
      index: 0,
      getBarWidth: function (index) {
        return (index + 1) * 22 + 'px'
      }
    }
  },
  //载入组件
  components: {
    Tab,
    TabItem,
    Sticky,
    Divider,
    XButton,
    Swiper,
    SwiperItem

  },
  //computed计算，数据
  computed:{

  },
  //mounted 安装，类型function，默认执行 钩子，
  mounted(){
    
    
  },
  //方法
  methods:{
    onItemClick (index) {
      console.log('on item click:', index)
    },
    addTab () {
      if (this.list2.length < 5) {
        this.list2 = list().slice(0, this.list2.length + 1)
      }
    },
    removeTab () {
      if (this.list2.length > 1) {
        this.list2 = list().slice(0, this.list2.length - 1)
      }
    },
    next () {
      if (this.index === this.list2.length - 1) {
        this.index = 0
      } else {
        ++this.index
      }
    },
    prev () {
      if (this.index === 0) {
        this.index = this.list2.length - 1
      } else {
        --this.index
      }
    }

  }
}
</script>

<style lang="less" scoped>
.main{ padding:0 0.8rem;
  .card{ width:15rem; height:20rem; background:#000; margin-bottom:2rem;}
}

</style>