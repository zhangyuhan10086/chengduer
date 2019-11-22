/**
 * 格式化时间
 * 
 * @param {String} str
 * @returns 格式化后返回年月日时分秒
 */

export const dateTimeFormat = (value) => {

    if (!value) {
        return ""
    } else {
        let date = new Date(value); //value为时间戳
        let Y = date.getFullYear() + '-'; //年
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'; //月
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); //日 + ' '; //日
        let h = date.getHours() + ':'; //时
        let m = date.getMinutes() + ':'; //分
        let s = date.getSeconds(); //秒
        return Y + M + D + " " + h + m + s; // 2016-12-7 16:0:12
    }

}

export const timeCdd = (value) => {

   if (!value) return ''
    let date = new Date(value);//历史
    let currentDate = new Date();//当前
    //let time = new Date().getTime() - date.getTime() //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
        
    let Y = date.getFullYear() + '/'; //年
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'; //月
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); //日


    let cY = currentDate.getFullYear() + '/'; //当前 年
    let cM = (currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1) + '/'; //当前 月
    let cD = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate(); + ' '; //当前 日


    let h = date.getHours() < 10 ? '0' + date.getHours()+ ':' : date.getHours() + ':'; //时
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); //分
    //let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); //秒



    let CYMD = cY+cM+cD;
    let YMD = Y+M+D;
    
   
    //判断是否是当天
    if (CYMD==YMD) {
        return h + m;
    }else if((date.getDate()+1) == currentDate.getDate()){

        return "昨天";
    
    }else if((date.getFullYear()+1) == currentDate.getFullYear()){
        //昨年
        return YMD;//年月日
    
    }else{
            return M + D; //月日
    }

}

/**
 * 格式化时间
 * 
 * @param {String} str
 * @returns 格式化后的时间
 */
export const formatDate = (value) => {
    if (!value) return '';
    value = value.replace(/-/g, '/');
    var date = new Date(value)
    var time = new Date().getTime() - date.getTime() //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return ''
    } else if ((time / 1000 < 30)) {

        return '刚刚'
    } else if (time / 1000 < 60) {
        return parseInt((time / 1000)) + '秒前'
    } else if ((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前'
    } else if ((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前'
    } else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前'
    } else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前'
    } else {
        return parseInt(time / 31536000000) + '年前'
    }
}

/**
 * 截取字符串
 * 用法 truncate(50,"...")
 */

export const truncate = (value, length, ellipses) => {
    if (!value) {
        return '' }

    length = length || 30;

    if (ellipses === undefined) {
        ellipses = '...';
    }

    value = value.toString();

    if (value.length < length) {
        return value;
    } else {
        return value.slice(0, length) + ellipses;
    }




}

/**
 * 数字米转化千米
 * 用法 conversion(1000,"km")
 */

export const conversion = (value, hex, Company) => {
    if (!value) {
        return '' }

    length = length || 1000;

    if (Company === undefined) {
        Company = 'm';
    }

    if (value<1000) {
        return value+"m";
    } else {
         value = (value/hex).toString();
        return value.slice(0, 4) + Company;
    }




}


export const fmoney = (value,n) => {
/**
 * 钱后面加两位小数 | fmoney(2),2代码位数
 * fmoney
 */
    if (!value) return '0.00';
    n = n > 0 && n <= 20 ? n : 2; 
    value = parseFloat((value + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = value.split(".")[0].split("").reverse(),
        r = value.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}


export const ifEmpty = (value,n) => {
   /**
     * 判断数据是否为空
     * n：代表提供显示内容
     */
    if (!value){
        if(n){
            return n;
        }else{
            return "数据为空";
        }
    }else{
        return value;
    }
    

}

