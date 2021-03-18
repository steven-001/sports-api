import Vue from 'vue'
import Vuex from 'vuex'
//import getters from './getters.js'
Vue.use(Vuex);


// https://webpack.js.org/guides/dependency-management/#requirecontext


// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file

const state = {
  score:10000,//当前金币数
  agentId:229,//业主ID
  betObj:[],//串关下注list
  //体育首页菜单数据
  DataNum:{
    jrNum:0,
    gqNum:0,
    zpNum:0,
    cgNum:0,
  },
  menuBoj:[],//解析前的体育数据
  gqData:[],//当前滚球数据
  fgqData:[],//当前非滚球数据
  newBetData:{},//最新推送体育数据
  sportsType:[],//体育菜单(已解析)
  YsbUrl:'',//体育SDK地址
  uData:JSON.parse(localStorage.getItem('userData'))||{},//用户信息
}

const store = new Vuex.Store({
  state,
  mutations:{
    changeBetObj(state,betObj){
     state.betObj.push(betObj);
    },
    delBetObj(state){
      state.betObj=[];
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
      //   let zpNum=0
      //   let jrNum=0
      //   let gqNum=0
      //   let cgNum=0
      //   for (let k of data.normal){
      //     if(k.sportType!='financial'&&k.sportType!="horseracing"&&k.sportType!="greyhounds"&&k.sportType!="lotto"&&k.sportType!="others"){
      //       if(k.earlyCount){
      //         // zpNum+=k.earlyCount//早盘
      //       }
      //       if(k.todayCount){
      //         jrNum+=k.todayCount//今日
      //       }
      //       if(k.totalCount){
      //         cgNum+=k.totalCount//串关
      //       }
      //       if(k.isLive){
      //         gqNum+=k.totalCount//滚球
      //       }
      //     }
      //   }
      //   state.DataNum.zpNum=zpNum
      //   state.DataNum.jrNum=jrNum
      //   state.DataNum.gqNum=gqNum
      //   state.DataNum.cgNum=cgNum
      }
    },
  },
  actions:{
    //刷新金币
    onShow({commit,state},params){

    },
  }
 
})

export default store



