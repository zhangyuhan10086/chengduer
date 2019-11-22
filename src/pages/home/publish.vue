<template>
  <div class="publish" v-pageTitle="{content:this.pageTitle}">
    <div class="header">
      <x-header><a slot="right" @click="popupVisible=true">发布</a></x-header>
    </div>
    <div class="headerIn"></div>
    <div class="content">
      <div class="text">
        <textarea v-model="content" placeholder="想发表什么呢n(*≧▽≦*)n"></textarea>
      </div>
      <div class="pic_list" flex>
        <div class="item" v-for="(pic,index) in addPics" :key="index">
          <img :src="pic.path">
        </div>
        <div class="add_pic" v-if="addPics.length<9">
          <label class="upPicLabel">
            <input type="file" accept="image/*" id="photoFileUpload" @change="uploadPic()" />
            <!-- <input type="file"  accept="image/gif,image/jpeg,image/jpg,image/png" id="photoFileUpload" @change="uploadPic()" /> -->
          </label>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="bottom" :closeOnClickModal="false">
      <div class="popUp">
        <div class="title" flex>
          <div class="close" @click="popupVisible=false"><img src="../../assets/close.svg" /></div>
          <p>选择发布到的标签</p>
        </div>
        <div class="tips" flex>
          <div :class="tip.checked? 'tiped' : 'tip'" v-for="(tip,index) in tipsDataJson" @click="tipCheck(index,tip.tipHot)">{{tip.tipName}}</div>
          <input :class="zydOff? 'tiped zdy' : 'tip zdy'" maxlength="6" type="text" placeholder="自  定  义" v-model="zydTipData" @click="zydTip()">
        </div>
        <div class="queding" @click="say()">确定</div>
      </div>
    </mt-popup>
    <loading-item :loadingOff="loading"></loading-item>
  </div>
</template>

<script>
  import Http from '../../config/Http';
  import { Popup } from 'mint-ui';
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  Vue.component(Popup.name, Popup);
  import { Toast } from 'mint-ui';
  import loadingItem from '../components/loading.vue'; //loading模块
  import { XHeader } from 'vux'
  export default {
    data() {
      return {
        pageTitle: '发说说',
        addPics: [], //要上传的图片
        fileChange: "", //每次选择的图片
        name: localStorage.CDECY_NICKNAME, //用户昵称
        accid: localStorage.CDECY_ACCID, //用户accid
        portrait: localStorage.CDECY_PORTRAIT, //用户头像
        userGender: localStorage.CDECY_USERGENDER, //用户性别
        userAge: localStorage.CDECY_USERAGE, //用户年龄
        content: "", //说说文字
        popupVisible: false, //控制popuup显示和关闭
        dataNumber: 10, //标签每次显示的数量
        skip: "", //配合dataNumber
        tipsDataJson: [], //标签数据
        type: "", //标签类型
        zydTipData: "", //自定义标签
        zydOff: "", //自定义标签颜色控制
        loading: false, //全屏loading开关
        tipHot: "", //标签热度
        imgDomain: this.$imgDomain
      }
    },
    //mounted 安装，类型function，默认执行 钩子，
    mounted() {
      //回到顶部解决无限加载bug
      if (document.documentElement && document.documentElement.scrollTop) {
        document.documentElement.scrollTop = 0;
      }
      else if (document.body) {
        document.body.scrollTop = 0;
      };
      //=================

      this.getTipsData(); //获得标签
    },
    //载入组件
    components: {
      XHeader,
      loadingItem,
    },
    //路由进入时判断是否有账号密码
    beforeRouteEnter(to, from, next) {
      next(vm => {
        var currentUser = Bmob.User.current();
        if (currentUser && localStorage.CDECY_NICKNAME && localStorage.CDECY_USERNAME && localStorage.CDECY_PORTRAIT && localStorage.CDECY_USERGENDER && localStorage.CDECY_USERAGE) {

        } else { //没有登录过去登录页面
          alert("没有登录，请去登录");
          vm.$router.push("/login");
        }
      });
    },
    methods: {
      stopUpload() {
        Toast(
        {
          message: '暂未开放上传图片功能',
          position: 'center',
          duration: 1000
        });
      },
      /*
        三个参数
        file：一个是文件(类型是图片格式)，
        w：一个是文件压缩的后宽度，宽度越小，字节越小
        objDiv：一个是容器或者回调函数
        photoCompress()
         */
      photoCompress(file, w, objDiv) {
        var _this = this;
        var ready = new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);
        ready.onload = function() {
          var re = this.result;
          _this.canvasDataURL(re, w, objDiv)
        }
      },
      canvasDataURL(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function() {
          var that = this;
          // 默认按比例压缩
          var w = that.width,
            oW = that.width,
            h = that.height,
            scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          if (w > 1000) {
            w = oW / 2;
            h = (oW / 2) / scale
          }
          console.log("w", w)

          var quality = 0.7; // 默认图片质量为0.7
          //生成canvas
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          // 创建属性节点
          var anw = document.createAttribute("width");
          anw.nodeValue = w;
          var anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
          }
          // quality值越小，所绘制出的图像越模糊
          var base64 = canvas.toDataURL('image/jpeg', quality);
          // 回调函数返回base64的值
          callback(base64);
        }
      },
      /**
       * 将以base64的图片url数据转换为Blob
       * @param urlData
       *            用url方式表示的base64图片数据
       */
      convertBase64UrlToBlob(urlData) {
        var arr = urlData.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      },

      //上传图片
      upload(file) {
        var _this = this;
        if (file) {
          //压缩图片

          this.photoCompress(file, {
            quality: 0.5
          }, function(base64Codes) {
            //console.log("压缩后：" + base.length / 1024 + " " + base);
            var bl = _this.convertBase64UrlToBlob(base64Codes);
            // form.append("file", bl, "file_" + Date.parse(new Date()) + ".jpg"); // 文件对象

            var formData = new FormData();
            formData.append('file', bl, Date.parse(new Date()) + ".jpg");
            var xhr = new XMLHttpRequest();
            xhr.open('POST', `${_this.imgDomain}/api/file/upload`);
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                  var qnData = JSON.parse(xhr.response);
                  var postData = {
                    path: _this.imgDomain + qnData.url,
                    url: qnData.url
                  };
                  setTimeout(() => {
                    _this.addPics.push(postData);
                    console.log('图片已经上传完成...');
                  }, 400)

                } else {
                  console.log('服务器好像有问题哦...');
                }
              }
            }
            xhr.send(formData);

          });


          //   var formData = new FormData();
          //   formData.append('file', file);
          //   var xhr = new XMLHttpRequest();
          //   xhr.open('POST', `${this.imgDomain}/api/file/upload`);
          //   xhr.onreadystatechange = function() {
          //     console.log("xhr", xhr)
          //     alert(xhr.readyState)
          //     alert(JSON.stringify(xhr.response))
          //     _this.content = JSON.stringify(xhr.response)
          //     if (xhr.readyState == 4) {
          //       if (xhr.status == 200) {
          //         var qnData = JSON.parse(xhr.response);
          //         var postData = {
          //           path: _this.imgDomain + qnData.url,
          //           url: qnData.url
          //         };
          //         setTimeout(() => {
          //           _this.addPics.push(postData);
          //           alert('图片已经上传完成...');
          //         }, 400)


          //       } else {
          //         console.log('服务器好像有问题哦...');
          //       }
          //     }
          //   }
          //   xhr.send(formData);
        }
        // return defer.promise; //返回数据
      },
      //正式上传
      uploadPic() {

        if (this.addPics.length >= 9) {
          Toast(
          {
            message: '最多只能添加9张图片哟~',
            position: 'center',
            duration: 2000
          });
          return false;
        }
        var fileUploadControl = document.getElementById("photoFileUpload");
        if (fileUploadControl.files.length > 0) {
          var file = fileUploadControl.files[0];

          //上传到七牛
          this.upload(file)
        }
      },
      //编辑内容上传服务器
      say() {

        let _this = this;
        if (!_this.content) {
          console.log("不能为空")
          return false;
        };
        //判断标签
        if (_this.zydTipData) {
          _this.type = _this.zydTipData;
        };
        if (!_this.type) {
          Toast(
          {
            message: '必须选择标签哟~',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        if (_this.content.length > 200) {
          Toast(
          {
            message: '内容字数不能超过200~',
            position: 'center',
            duration: 2000
          });
          return false;
        };
        console.log(_this.type)
        _this.loading = true; //开启加载
        //============标签热度加1 先查找有无此标签

        var Tips = Bmob.Object.extend("Tips");
        var query = new Bmob.Query(Tips);
        query.equalTo("tipName", _this.type);
        // 查询所有数据
        query.find({
          success: function(results) {
            //没有，创建一个新的
            if (results.length == 0) {
              _this.tipHot = 1; //没有那么热度为1
              var tip = new Tips();
              tip.save({
                tipName: _this.type, //标签名
                tipHot: 1, //热度1
              }, {
                success: function(tip) {
                  console.log("创建新标签成功")
                },
                error: function(tip, error) {
                  console.log("创建新标签失败")
                }
              });
              _this.saveContent(); //进行保存
            } else {
              var hot = results[0].get("tipHot");
              var id = results[0].id;
              console.log(hot)
              console.log(id)
              hot++;
              _this.tipHot = hot;
              // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
              query.get(id, {
                success: function(tipItem) {
                  // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
                  tipItem.set('tipHot', hot);
                  tipItem.save();
                  // The object was retrieved successfully.
                },
                error: function(object, error) {
                  console.log("加热度失败")
                }
              });
              _this.saveContent(); //进行保存       
              console.log("标签热度加1")
            }
          },
          error: function(error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
      },
      //保存内容
      saveContent() {
        //保存发布的说说内容
        //创建类和实例（传服务器）
        let _this = this;
        var Shuoshuo = Bmob.Object.extend("ShuoShuo");
        var shuo = new Shuoshuo();
        let addPicsUrl = _this.addPics.map(item => {
          return item.url
        })
        shuo.save({
          name: _this.name,
          content: _this.content, //文字
          picList: addPicsUrl, //图片数组
          accid: _this.accid, //用户accid
          portrait: _this.portrait, //头像
          userGender: _this.userGender, //性别
          userAge: _this.userAge, //年龄
          type: _this.type, //    标签
          tipHot: _this.tipHot, //标签热度
          commentNum: 0, //评论数量
        }, {
          success: function(shuo) {
            //添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            console.log('添加数据成功，返回的objectId是：' + shuo.id);
            _this.loading = false; //关闭加载
            Toast(
            {
              message: '下拉刷新获取刚才发布的内容~',
              position: 'center',
              duration: 2000
            });
            _this.$router.push('/home')
          },
          error: function(shuo, error) {
            //添加失败
            Toast(
            {
              message: '哎呀，服务器君好像有小情绪~',
              position: 'center',
              duration: 2000
            });
            _this.loading = false; //关闭加载
            console.log('添加数据失败，返回错误信息：' + error.description);
          }
        });
      },

      //获得标签
      getTipsData() {
        let _this = this;
        var Tips = Bmob.Object.extend("Tips");
        var query = new Bmob.Query(Tips);

        query.limit(_this.dataNumber);
        query.skip(_this.skip);
        query.descending("tipHot");
        query.find({
          success: function(results) {
            _this.skip += _this.dataNumber;
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var data = {
                tipName: "", //标签名称
                tipHot: "", //标签热度
                checked: false, //默认没被选中
              }
              data.tipName = results[i].get("tipName");
              data.tipHot = results[i].get("tipHot");
              _this.tipsDataJson.push(data);
            };
          },
          error: function(error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        })
      },
      //==============选择标签
      tipCheck(index, tipHot) {
        let _this = this;
        _this.zydOff = false;
        _this.zydTipData = ""; //情况自定义标签
        _this.tipsDataJson.forEach(function(item) {
          item.checked = false
        });
        _this.tipsDataJson[index].checked = true;
        // _this.tipHot=tipHot;
        _this.type = _this.tipsDataJson[index].tipName;
      },
      //==========自定义
      zydTip() {
        let _this = this;
        _this.zydOff = true;
        _this.tipsDataJson.forEach(function(item) {
          item.checked = false
        });
        _this.type = "";
        console.log(_this.type)
      },
      //=========newbetterSCroll
      initScroll() {
        this.domScroll = new BScroll(this.$refs.domx, {
          startX: 0,
          startY: 0,
          scrollY: true,
          momentum: true,
          bounce: false,
          deceleration: 0.001
        })
      },

    }
  }
</script>

<style lang="less" scoped>
  @B: 1/12rem;

  .headerIn {
    height: 46px;
  }

  .content {
    padding: 10px 16px 53px;

    .text {
      textarea {
        color: #666;
        line-height: 20px;
        font-size: 14px;
        width: 100%;
        height: 150*@B;
        border: none;
        outline: none;
        resize: none;
      }
    }

    .pic_list {
      flex-wrap: wrap;
      justify-content: start;

      .item {
        width: 90*@B;
        height: 90*@B;
        overflow: hidden;
        margin-bottom: 9*@B;
        margin-right: 9*@B;
        border: 1px solid #e7e7e8;
        box-sizing: border-box;

        img {
          display: block;
          width: 100%;
        }
      }

      .item:nth-of-type(3n) {
        margin-right: 0;
      }

      .add_pic {
        width: 90*@B;
        height: 90*@B;
        overflow: hidden;
      }
    }
  }

  .upPicLabel {
    display: block;
    width: 90*@B;
    height: 90*@B;
    background: url("../../assets/fabu_03.png");
    background-size: 90*@B 90*@B;

    input {
      opacity: 0;
    }
  }

  .popUp {
    width: 320*@B;
    background: #fff;

    .title {
      text-align: center;
      line-height: 30px;
      height: 30px;
      font-size: 14px;
      padding: 10px 0;

      p {
        padding-left: 79*@B;
      }
    }

    .close {
      width: 15px;
      padding-left: 16*@B;

      img {
        width: 15px;
      }
    }

  }

  .tips {
    color: #6991ab;
    flex-wrap: wrap;
    padding-left: 16*@B;

    .tip {
      padding: 0 5px 0 20px;
      height: 24px;
      line-height: 24px;
      background: #f0f3fa url(../../assets/tip.svg) no-repeat 4px 7px;
      background-size: 12px;
      border-radius: 3px;
      margin-right: 5px;
      margin-top: 5px;
    }
  }

  .tiped {
    padding: 0 5px 0 20px;
    height: 24px;
    line-height: 24px;
    background: #f0f3fa url(../../assets/tiped.svg) no-repeat 4px 7px;
    background-size: 12px;
    border-radius: 3px;
    margin-right: 5px;
    margin-top: 5px;
  }

  .queding {
    margin: 16*@B 16*@B 30*@B;
    width: 288*@B;
    background: #25ccde;
    color: #fff;
    text-align: center;
    line-height: 35px;
    height: 35px;
    border-radius: 4px;
  }

  .zdy {
    outline: none;
    border: none;
    width: 90px;
    color: #6991ab;
  }
</style>