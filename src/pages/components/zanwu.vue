<template>
  <div class="zanwu_item" v-show="zanwuOff">
    <div class="box">
      <img src="../../assets/zanwu.svg">
      <p>暂无</p>
    </div>
  </div>
</template>

<script>



  export default {
    name:'zanwuItem',
    props: ['zanwuOff'],
    data(){
      return {

      }
    },
    //载入组件
    components: {


    },
    //computed计算，数据
    computed:{

    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted(){

    },
    //方法 数据
    methods:{
      // sedMsgToParent(){
      //   this.$emit("lisetenToChildEvent","false")
      // }
    }
  }
</script>

<style lang="less" scoped>
@B:1/12rem;
.zanwu_item{ 
  .box{ margin:100*@B auto 0; width:40*@B;
    img{ width:100%; display:block;}
    p{ line-height:20*@B;font-size:14*@B; text-align:center; padding-top:10px;}
  }
}

</style>
