import Vue from 'vue'
import Vuex from 'vuex'
//import getters from './getters.js'
Vue.use(Vuex);


// https://webpack.js.org/guides/dependency-management/#requirecontext


// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file

localStorage.setItem('device',process.env.HOST.indexOf('app')>-1?'app':'h5')

const state = {
  money:10000,
  agentUrl:'',
  agentId:229,
  allGameList:{},
  betObj:[],//串关下注list
  score:0,//钱包余额
  insureScore:0,//余额宝余额
  mailTotal:0,//邮件数量
  vipLevel:0,//VIP等级
  pcVipLevelImg:'',//vip大图标
  vipLevelIcon:'',//vip等级图标
  vipLevelName:'',//vip等级名称
  websocketURL:'',//长链接地址
  websocketType:true,//长链接状态
  statusList:[],//开关状态数组
  //体育首页菜单数据
  DataNum:{
    jrNum:0,
    gqNum:0,
    zpNum:0,
    cgNum:0,
  },
  menuBoj:{},
  gqData:[],
  fgqData:[],
  newBetData:{},
  //热更状态
  hotType:0,//0：检查更新，1：正在下载，2：正在安装，3：安装完成
  iphoneX:true,
  appBool:false,
  //体育菜单
  sportsType:[],
  refresh:null,
  redirect:'',
  YsbUrl:'',
  checkUrlType:sessionStorage.getItem('checkUrlType')||0,
  STWHstatus:false,
  imgUrl:'',
}

const store = new Vuex.Store({
  state,
  mutations:{
    //获取开关状态数组
    getStatusList(state,data){
      state.statusList=data
    },
    changeBetObj(state,betObj){
     state.betObj.push(betObj);
    },
    delBetObj(state){
      state.betObj=[];
    },
    setScore(state,data){
      state.pcVipLevelImg=data.pcVipLevelImg
      console.log(state.pcVipLevelImg)
      state.score=data.score
      state.insureScore=data.insureScore
      state.mailTotal=data.mailTotal
      state.vipLevel=data.vipLevel
      state.vipLevelIcon=data.h5VipLevelImg
      state.vipLevelName=data.vipLevelName
    },
    setInsureScore(state,num){
      state.insureScore=num
    },
    setWebsocketType(state,type){
      state.websocketType=type
    },
    setURL(state,url){
      state.YsbUrl=url;
    },
    getgq(state,data){
      state.gqData=data
    },
    getfgq(state,data){
      state.fgqData=data
    },
    onNewBetData(state,data){
      state.newBetData=data
    },
    onMenu(state,data){
      if(data.normal.length>0){
        state.menuBoj=data.normal
        let zpNum=0
        let jrNum=0
        let gqNum=0
        let cgNum=0
        for (let k of data.normal){
          if(k.sportType!='financial'&&k.sportType!="horseracing"&&k.sportType!="greyhounds"&&k.sportType!="lotto"&&k.sportType!="others"){
            if(k.earlyCount){
              // zpNum+=k.earlyCount//早盘
            }
            if(k.todayCount){
              jrNum+=k.todayCount//今日
            }
            if(k.totalCount){
              cgNum+=k.totalCount//串关
            }
            if(k.isLive){
              gqNum+=k.totalCount//滚球
            }
          }
        }
        state.DataNum.zpNum=zpNum
        state.DataNum.jrNum=jrNum
        state.DataNum.gqNum=gqNum
        state.DataNum.cgNum=cgNum
      }
    },
  },
 
})

export default store



