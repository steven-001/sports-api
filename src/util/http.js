import axios from "axios"
import store from '@/store'
import router from '../router/index.js'
import { Toast } from 'vant';
//---- 导入国际化资源文件
import Vue from 'vue';
import VueI18n from 'vue-i18n'
import base64 from "./base64";


Vue.use(VueI18n)
var locale='2'
const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || locale, // 语言标识
  messages: {
    '2': require('../lang/zh'),//简体中文
    '4': require('../lang/malai'),//马来语
    '1': require('../lang/en'),//英文
    '3': require('../lang/th'),//泰文
    '5': require('../lang/yindi'),//印地语
    '6': require('../lang/yinni'),//印尼语
    '7': require('../lang/xibanya'),//西班牙语
  }
})


/**
 * 封装axios
 */
//设置请求头与返回参数
axios.defaults.headers = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json;charset=UTF-8"
}
axios.defaults.timeout = 20000;

/**
 * 环境切换
 */
let apiUrl = ''
let HOST = process.env.HOST;

if(HOST === 'test'){                      //npm run build -- test 内网测试
  axios.defaults.baseURL = 'http://10.14.2.217:9000/api'
  store.commit("setURL",'http://103.249.87.33/service')
  store.state.VI='123'
  store.state.Secret='abc'
}
let str=''
let list=[]
function setUrl() {
  if(HOST.indexOf('prod')>-1){                     //npm run build -- prod 正式环境
    if(sessionStorage.getItem('urlList')){
      str=sessionStorage.getItem('urlList')
      list=JSON.parse(base64.utf16to8(base64.base64decode(str)))
      axios.defaults.baseURL =list[0]+'/api'
    }else {
      setTimeout(()=>{
        setUrl()
      },100)
    }
    store.commit("setURL",'https://sgrweblb6.e6dz.com:9968/service')
    store.state.VI='1669'
    store.state.Secret='xr686b4nVkTUWqGK'
  }
  if(HOST === 'prerelease'){                //npm run build -- prerelease 外网测试
    console.log(sessionStorage.getItem('urlList'))
    if(sessionStorage.getItem('urlList')){
      str=sessionStorage.getItem('urlList')
      list=JSON.parse(base64.utf16to8(base64.base64decode(str)))
      console.log('api',list[0]+'/api')
      axios.defaults.baseURL =list[0]+'/api'
    }else {
      setTimeout(()=>{
        setUrl()
      },100)
    }
    store.commit("setURL",'http://103.249.87.33/service')
    store.state.VI='123'
    store.state.Secret='abc'
  }
}
setUrl()

if(HOST === 'dev'){
  axios.defaults.baseURL = 'https://wapp01k4yen.hnqzy168.com/api'
  store.commit("setURL",'http://103.249.87.33/service')
  store.state.VI='123'
  store.state.Secret='abc'
}
console.log('当前环境：'+HOST)
// axios.defaults.baseURL = apiUrl;//请求地址的域名
//返回数据设置
axios.defaults.responseType = "json";





// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    　　    　　// 在发送请求之前做些什么
  let sessionId = localStorage.getItem('sessionId')
    if (sessionId!==null&&sessionId!=='') {
        //  让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['Authorization'] = sessionId;
      }
    　　return config
    }, function (error) {
    　　// 对请求错误做些什么
    return Promise.reject(error)
    });

    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
    　　// 对响应数据做点什么
      if (response.data && response.data.code!=="200") {
        if(response.data.code==="502"){
          router.push({path:'/401'})
        }else if(response.data.code==="402"){
          Toast(i18n.tc('prompt[\'登录过期，请重新登录\']'));
          setTimeout(()=>{
            localStorage.removeItem('sessionId')
            localStorage.removeItem('userData')
            // window.location.reload()
          },300)
        }else if(response.data.code==="403"){
          Toast(i18n.tc('prompt[\'您的账号已在其他地方登陆,请重新登录!\']'));
          setTimeout(()=>{
            localStorage.removeItem('sessionId')
            localStorage.removeItem('userData')
            if(window.plus){
              onPlus()
            }else{
              document.addEventListener('plusready',onPlus(),false);
            }
            function onPlus() {
              var wvs=plus.webview.all();
              for(var i=0;i<wvs.length;i++){
                if(i>0){
                  console.log('webview'+': '+wvs[i].getURL());
                  wvs[i].close();
                }
              }
            }
            window.location.reload()
          },300)
        }else if(response.config.url.indexOf('/geetest/register')>-1||response.config.url.indexOf('/geetest/validate')>-1){
          return response.data
        }else{
          return Promise.reject(i18n.tc('prompt[\''+response.data.msg+'\']'))
        }
      }
    　return response.data
    }, function (error) {
      // 对响应错误做点什么
    　return Promise.reject(i18n.tc('new2[\'连接失败，请检查您的网络\']'))
    });
