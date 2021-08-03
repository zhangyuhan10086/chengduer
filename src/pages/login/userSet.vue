<template>
  <div v-pageTitle="{content:this.pageTitle}">
    <div class="main">
      <div class="userIcon">
        <p>选择头像</p>
        <ul v-for="(item,index) in touxiangArr" :key="index">
          <li v-for="(item2,index2) in item" :key="index2" :class='{active:selectTouIndex1==index && selectTouIndex2==index2}' @click="selectTouxiang(index,index2)">
            <img :src="item2">
          </li>
        </ul>
      </div>
      <div class="logoInput">
        <div class="input_item">
          <input class="name" type="text" v-model="userNick" maxlength="7" placeholder="请输入昵称" />
        </div>
        <div class="input_item" @click="pickerAgeShow()">
          <input class="age" type="text" v-model="userAge" placeholder="请选择年龄" disabled="disabled" />
        </div>
        <div class="input_item" @click="pickerGenderShow()">
          <input class="gender" type="text" v-model="userGender" placeholder="请选择性别" disabled="disabled" />
        </div>
      </div>
      <div class="goBtn" @click="submitData()" v-show="pickerAgeOff==false && pickerGenderOff==false">提交</div>
      <div class="select_age" v-show="pickerAgeOff">
        <div class="btns" flex @click="pickerAgeOff=false">
          <div class="off">取消</div>
          <div class="ok">确定</div>
        </div>
        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
      </div>
      <div class="select_gender" v-show="pickerGenderOff">
        <div class="btns" flex @click="pickerGenderOff=false">
          <div class="off">取消</div>
          <div class="ok">确定</div>
        </div>
        <mt-picker :slots="slots2" @change="onValuesChangeTwo"></mt-picker>
      </div>
    </div>
    <loading-item :loadingOff="loading"></loading-item>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import Http from '../../config/Http';
  import loadingItem from '../components/loading.vue' //自己写的loding组件
  import { Picker } from 'mint-ui';
  import Vue from 'vue';
  import store from '../../store';
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

  Vue.component(Picker.name, Picker);
  export default {
    data() {
      return {
        pageTitle: "用户设置",
        accid: localStorage.CDECY_ACCID,
        slots: [
        {
          flex: 1,
          values: ['请选择年龄', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
          className: 'slot1',
          textAlign: 'center'
        }, ],
        slots2: [
        {
          flex: 1,
          values: ['请选择性别', '男', '女'],
          className: 'slot1',
          textAlign: 'center'
        }, ],
        userNick: "", //用户昵称
        userAge: "", //用户年龄
        userGender: "", //用户性别
        pickerAgeOff: false, //agePicker开关
        pickerGenderOff: false, //GenderPicker开关
        portrait: "", //用户头像url
        loading: false, //loading组件开关
        touxiangArr: [
          [touxiang1, touxiang2, touxiang3, touxiang4],
          [touxiang5, touxiang6, touxiang7, touxiang8],
          [touxiang9, touxiang10, touxiang11, touxiang12]
        ],
        selectTouIndex1: '',
        selectTouIndex2: ''
      }
    },
    created() {},

    //mounted 安装，类型function，默认执行 钩子，
    mounted() {
      //重铸picker=====================
      var oPicker = document.getElementsByClassName("picker-slot-wrapper")[0];
      var oPickerTwo = document.getElementsByClassName("picker-slot-wrapper")[1];
      var aPickerItem = document.getElementsByClassName("picker-item");
      for (var i = 0; i < aPickerItem.length; i++) {
        aPickerItem[i].style.color = "#fff";
      }
      oPicker.style.fontSize = 14 + "px";
      oPickerTwo.style.fontSize = 14 + "px";
      //=================================


    },
    //载入组件
    components: {
      loadingItem,
    },
    //方法
    methods: {
      //选择年龄
      onValuesChange(picker, values) {
        this.userAge = values;
        console.log(this.userAge[0])
      },
      //选择性别
      onValuesChangeTwo(picker, values) {
        this.userGender = values[0];
        console.log(this.userGender)
      },
      //点击选择年龄出现picker
      pickerAgeShow() {
        this.pickerGenderOff = false;
        this.pickerAgeOff = !this.pickerAgeOff;
      },
      //点击选择性别picker
      pickerGenderShow() {
        this.pickerAgeOff = false;
        this.pickerGenderOff = !this.pickerGenderOff
      },
      selectTouxiang(index, index2) {
        this.selectTouIndex1 = index;
        this.selectTouIndex2 = index2;
        this.portrait = (index * 4 + index2 + 1).toString()
      },

      //========
      //提奖
      submitData() {
        let _this = this;
        if (!_this.userNick || _this.userNick.length > 7) {
          Toast(
          {
            message: '请填写昵称~',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        if (_this.userAge == "请选择年龄") {
          Toast(
          {
            message: '请选择年龄',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        if (_this.userGender == "请选择性别") {
          Toast(
          {
            message: '请选择性别',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        if (!_this.portrait) {
          Toast(
          {
            message: '请上传头像',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        _this.loading = true; //开启loding
        //var User = Bmob.Object.extend("_User");
        var query = Bmob.Query('_User');
        query.equalTo("nickName", '==', _this.userNick);
        query.find().then(results => {
          if (results.length != 0) {
            Toast(
            {
              message: '此昵称已存在！',
              position: 'center',
              duration: 2000
            });
            _this.loading = false;
          } else {
            //查找此用户修改昵称
            var twoQuery = Bmob.Query('_User');
            twoQuery.get(_this.accid).then(user => {
              _this.loading = false; //关闭loding
              // 回调中可以取得这个  对象的一个实例，然后就可以修改它了
              user.set('nickName', _this.userNick); //用户昵称
              user.set('portrait', _this.portrait); //头像
              user.set('userGender', _this.userGender); //性别
              user.set('userAge', _this.userAge); //性别
              user.save();
              // The object was retrieved successfully.
              console.log("提交成功")
              localStorage.CDECY_NICKNAME = _this.userNick; //存下昵称
              localStorage.CDECY_PORTRAIT = _this.portrait; //存下头像
              localStorage.CDECY_USERGENDER = _this.userGender; //存下性别
              localStorage.CDECY_USERAGE = _this.userAge; //存下年龄
              store.commit('uptabArr', { tabArr: 1 });
              _this.$router.push("/home")
            }).catch(error => {
              _this.loading = false; //关闭loding
              //添加失败
              Toast(
              {
                message: '哎呀，服务器君好像有小情绪~',
                position: 'center',
                duration: 2000
              });
            });
          }
        });
      },

    }
  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;

  .main {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: url("../../assets/city2.png");
    background-size: 320*@B;
    z-index: 100;

    .userPortrait {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    .input_grup {
      padding: 0 16*@B;
    }
  }

  .userIcon {
    margin: 10*@B 16*@B 0;

    p {
      text-align: center;
      color: #fff;
    }

    ul {
      display: flex;
      justify-content: space-between;
      margin: 10*@B 0;

      li {
        display: block;
        width: 50*@B;
        height: 50*@B;
        overflow: hidden;
        border-radius: 100%;
        border: 2px solid transparent;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .active {
        border-color: #fff;
      }
    }
  }

  .logoInput {
    padding-top: 20*@B;

    input {
      color: #FFF;
      padding-left: 60*@B;
      line-height: 35px;
      font-size: 14px;
      outline: none;
      border: none;
      width: 210*@B;
      height: 35px;
    }

    .input_item {
      border-bottom: 1px solid #BEBEBE;
      margin: 5*@B 16*@B 0;
    }

    .name {
      background: url(../../assets/user.svg) no-repeat 30*@B 8px;
      background-size: 20px;
    }

    .age {
      background: url(../../assets/age.svg) no-repeat 30*@B 8px;
      background-size: 20px;
    }

    .gender {
      background: url(../../assets/xingbei.svg) no-repeat 30*@B 8px;
      background-size: 20px;
    }
  }

  .btns {
    font-size: 14px;
    justify-content: space-between;
    text-align: right;
    padding: 0 16*@B;
    color: #fff;
    line-height: 34px;
  }

  ::-webkit-input-placeholder {
    color: #fff;
  }

  .goBtn {
    margin: 20px 16*@B 0;
    width: 288*@B;
    background: #25ccde;
    color: #fff;
    text-align: center;
    line-height: 35px;
    height: 35px;
    border-radius: 4px;
  }

  .upPicLabel {
    color: #fff;
    line-height: 20*@B;
    text-align: center;
    display: block;
    width: 80px;
    height: 100*@B;
    position: absolute;
    left: 0;
    bottom: -25*@B;
    z-index: 1000;

    input {
      opacity: 0;
      width: 80*@B;
      height: 80*@B;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>