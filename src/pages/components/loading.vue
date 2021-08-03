<template>
  <div class="loading_item" v-show="loadingOff">
    <div class="box">
      <mt-spinner type="snake" :size="18" color="#25ccde"></mt-spinner>
    </div>
  </div>
</template>

<script>
  import { Spinner } from 'mint-ui';
  import Vue from 'vue';
  Vue.component(Spinner.name, Spinner);


  export default {
    name: 'loadingItem',
    props: ['loadingOff'],
    data() {
      return {

      }
    },
    //载入组件
    components: {


    },
    //computed计算，数据
    computed: {

    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {
  
    },
    //方法 数据
    methods: {
      // sedMsgToParent(){
      //   this.$emit("lisetenToChildEvent","false")
      // }
    }
  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;

  .loading_item {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 100000;
  }

  .box {
    padding-left: 8px;
    padding-top: 8px;
    width: 34px;
    height: 34px;
    margin: 150*@B auto 0;
    border-radius: 50%;
    background: #fff;
    box-shadow: 1px 3px 5px 0px rgba(0, 0, 0, 0.3)
  }
</style>