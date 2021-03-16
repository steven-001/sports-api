// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import './router/permission.js'
import store from './store';
import Router from 'vue-router';
import axios from 'axios';
import './util/http';
import Vant from 'vant';
import 'amfe-flexible';//自适应插件
import 'vant/lib/index.css';
import { Lazyload } from 'vant';
import base64 from "./util/base64";


//TIM SDK
import TIM from 'tim-js-sdk';
// 发送图片、文件等消息需要的 COS SDK
import COS from "cos-js-sdk-v5";

let options = {
  SDKAppID: 1400490978 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示

// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

// 注册 COS SDK 插件
tim.registerPlugin({'cos-js-sdk': COS});

Vue.prototype.$tim = tim


setLine()

function setLine(){
  let urlList=[]
  let list=[]
  let str=''
  let game_shield=''
//判断环境
  let HOST = process.env.HOST;
  let gitUrlList=[]
  let agentUrl=''
  if(HOST === 'prerelease'){//外侧
    gitUrlList=[
      'https://raw.githubusercontent.com/everyday-poker/cp-pre/main/loginConfig.json',
      'https://lzapp-git01.mu622.com/root/github/raw/master/cp-pre/loginConfig.json',
    ]
    agentUrl='https://wapp02k4yen.'
  }
  if(HOST === 'test'||HOST === 'dev'||HOST.indexOf('prod')>-1){//正式
    gitUrlList=[
      'https://lzapp-git01.mu622.com/root/github/raw/master/cp-prd/loginConfig.json',
      'https://jinlong-prd.oss-accelerate.aliyuncs.com/rmb/login.json',
    ]
    agentUrl='https://wapp01k4yen.'
  }
//获取接口域名
  function getUrl(url,type) {
    let _this=this
    $.ajax({
      type: "GET",
      url: url,
      success: function (data) {
        list=JSON.parse(base64.utf16to8(base64.base64decode(jQuery.parseJSON(data).url_game)))
        game_shield=base64.utf16to8(base64.base64decode(jQuery.parseJSON(data).game_shield))
          let n = 0
          for (let i in list) {
            $.ajax({
              type: "GET",
              url: list[i],
              success: function (data) {
                n++
                urlList.push(list[i])
                // if(n==list.length){
                passUrl()
                // }
              }, error: function (jqXHR) {
                n++
                // console.log('失败')
                if(n==list.length){
                  passUrl()
                }
              }
            });
          }
      }, error: function (jqXHR) {
        if(type=='url2'){
          alert('获取线路失败！')
        }else {
          getUrl(gitUrlList[1],'url2')
        }
      }
    });
  }

  function passUrl() {
    if(urlList.length>0){
      str=base64.base64encode(base64.utf16to8(JSON.stringify(urlList)))
      sessionStorage.setItem('urlList', str)
    }else {
      alert('获取线路失败！')
    }
  }
  if(!sessionStorage.getItem('urlList')){
    if(localStorage.getItem('device')=='h5'){
      sessionStorage.setItem('load', true);
      let strUrl = window.location.host
      let i = strUrl.indexOf(".")
      urlList.push(agentUrl+strUrl.substring(i+1,strUrl.length))
      str=base64.base64encode(base64.utf16to8(JSON.stringify(urlList)))
      sessionStorage.setItem('urlList', str)
    }else {
      getUrl(gitUrlList[0],'url1')
    }
  }
}

import FastClick from 'fastclick'

//复制插件
import clipboard from 'clipboard';
//注册到vue原型上
Vue.prototype.clipboard = clipboard;

//解决ios点击事件延时和输入框无法聚焦
FastClick.attach(document.body);
FastClick.prototype.focus = function(targetElement) {
  var length;
// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.

  if (deviceIsIOS&& targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};


//---- 导入国际化资源文件
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
var locale='2'

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || locale, // 语言标识
  messages: {
    '2': require('./lang/zh'),//简体中文
    '4': require('./lang/malai'),//马来语
    '1': require('./lang/en'),//英文
    '3': require('./lang/th'),//泰文
    '5': require('./lang/yindi'),//印地语
    '6': require('./lang/yinni'),//印尼语
    '7': require('./lang/xibanya'),//西班牙语
  }
})
//vantUI组件国际化
import { Locale } from 'vant';
import enUS from 'vant/lib/locale/lang/en-US';//英语
import zhCN from 'vant/lib/locale/lang/zh-CN';//中文
import esES from 'vant/lib/locale/lang/es-ES';//西班牙语


if (i18n.locale== '2') {
  Locale.use(this.locale, zhCN)
} else if (i18n.locale== '7') {
  Locale.use(this.locale, esES)
}else {
  Locale.use(this.locale, enUS)
}

Vue.use(Vant);
Vue.use(Router);
Vue.use(Lazyload);
Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;

new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: { App },
  template: '<App/>'
})

