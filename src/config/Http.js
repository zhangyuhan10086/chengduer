import Vue from 'vue'
import VueResource from 'vue-resource';
Vue.use(VueResource)


// const mhwcwYfB="http://120.55.188.215/mhwcw";
// const apiYfB="http://apiyfb.cddang.com";

// const mhwcw="http://mhwcw.cddang.com"; //美猴王正式环境
// const api="http://api.cddang.com";//api正式环境

// const apiTest="http://apitest.cddang.com";//api 测试
// const mhwcwTest="http://101.204.230.251:8081";//美猴王 测试

// const apidev="http://apidev.cddang.com";//开发
// const panpan="http://192.168.8.102:9090";//潘潘

export default function (type, url, data, succ) {

	let entrance = url.split("/")
	let path=url;

	// if(entrance[1]=="api"){
	// 	path = url;
	// 	//path = url;
	// }else if(entrance[1]=="mhwcw"){
	// 	path = url;
	// 	//path = url;
	// }
	
    if(type=='post'){
		Vue.http.post(path,data).then((response) => {
		    succ(response.body)
		})
		return false;
    }

    if(type=='postForm'){

    	let dataForm = '';
        for(let str in data) {
            dataForm = dataForm + str + '=' + data[str] + '&';
        }
        let _last = dataForm.lastIndexOf('&');
        dataForm = dataForm.substring(0, _last);
        
		Vue.http.post(path,dataForm,{
            headers: {
          		'Accept': '*/*',
          		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           }
         }).then((response) => {
		    succ(response.body)
		})
		return false;
    }
    if(type=='get'){
		Vue.http.get(path,{
			params: data
		}).then((response) => {
		    succ(response.body)
		})
		return false;
    }
}