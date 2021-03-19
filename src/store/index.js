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
  //所有体育投注类型
  AllType:[//show:1让球&大小,2波胆,3角球,4红黄牌,5特殊投注,6半/全场,7节,0未分类
    {id:1 ,type:"Match Bet" ,name:"独赢",show:1},
    {id:2 ,type:"Handicap" ,name:"让分盘",show:1},
    {id:3 ,type:"Asian Handicap" ,name:"亚洲让分盘",show:1},
    {id:4 ,type:"Total Score Over/Under" ,name:"总分以上或以下",show:1},
    {id:5 ,type:"First Goal scorer" ,name:"首名入球球员",show:5},
    {id:6 ,type:"First Team To Kick Off" ,name:"首支开球球队",show:5},
    {id:7 ,type:"First Team To Score" ,name:"首支入球球队",show:5},
    {id:8 ,type:"First Yellow Card" ,name:"首张黄卡",show:4},
    {id:9 ,type:"Double Result" ,name:"半全场",show:6},
    {id:10 ,type:"Correct Score" ,name:"正确比分",show:2},
    {id:12 ,type:"Buying Points" ,name:"购买点数",show:0},
    {id:13 ,type:"Fixed Odds" ,name:"固定赔率",show:0},
    {id:14 ,type:"SP" ,name:"彩池",show:0},
    {id:15 ,type:"Forecast" ,name:"位置连赢",show:1},
    {id:16 ,type:"Reverse Forecast" ,name:"调头位置连赢",show:0},
    {id:17 ,type:"Quinella" ,name:"连赢",show:0},
    {id:18 ,type:"Tricast" ,name:"三重彩",show:0},
    {id:19 ,type:"Main Draw" ,name:"搅珠",show:0},
    {id:20 ,type:"total over" ,name:"总数上盘",show:0},
    {id:21 ,type:"total under" ,name:"总数下盘",show:0},
    {id:22 ,type:"total odd" ,name:"总数单数",show:0},
    {id:23 ,type:"total even" ,name:"总数双数",show:0},
    {id:24 ,type:"total range" ,name:"总数范围",show:0},
    {id:25 ,type:"total over(with bonus ball(s))" ,name:"总数上盘(包括特别号码)",show:0},
    {id:26 ,type:"total under(with bonus ball(s))" ,name:"总数下盘(包括特别号码)",show:0},
    {id:27 ,type:"total odd(with bonus ball(s))" ,name:"总数单数(包括特别号码)",show:0},
    {id:28 ,type:"total even(with bonus ball(s))" ,name:"总数双数(包括特别号码)",show:0},
    {id:29 ,type:"total range(with bonus ball(s))" ,name:"总数范围(包括特别号码)",show:0},
    {id:30 ,type:"single color" ,name:"单号颜色",show:0},
    {id:31 ,type:"single odd" ,name:"单数",show:0},
    {id:32 ,type:"single even" ,name:"双数",show:0},
    {id:33 ,type:"single over" ,name:"上盘",show:0},
    {id:34 ,type:"single under" ,name:"下盘",show:0},
    {id:35 ,type:"single range" ,name:"单号范围",show:0},
    {id:36 ,type:"single exact" ,name:"单号号码",show:0},
    {id:37 ,type:"bonus exact" ,name:"特别号码",show:0},
    {id:38 ,type:"bonus over" ,name:"特别号码上盘",show:0},
    {id:39 ,type:"bonus under" ,name:"特别号码下盘",show:0},
    {id:40 ,type:"bonus odd" ,name:"特别号码单数",show:0},
    {id:41 ,type:"bonus even" ,name:"特别号码双数",show:0},
    {id:42 ,type:"bonus range" ,name:"特别号码范围",show:0},
    {id:43 ,type:"bonus color" ,name:"特别号码颜色",show:0},
    {id:44 ,type:"total bonus over" ,name:"特别号码总数上盘",show:0},
    {id:45 ,type:"total bonus under" ,name:"特别号码总数下盘",show:0},
    {id:46 ,type:"total bonus odd" ,name:"特别号码总数单数",show:0},
    {id:47 ,type:"total bonus even" ,name:"特别号码总数双数",show:0},
    {id:48 ,type:"total bonus range" ,name:"特别号码总数范围",show:0},
    {id:49 ,type:"Straight Forecast" ,name:"定位连赢",show:0},
    {id:50 ,type:"Team to Qualify For Next Round" ,name:"晋级队伍",show:0},
    {id:51 ,type:"Dual Forecast" ,name:"连赢",show:0},
    {id:52 ,type:"Set Betting" ,name:"每局投注",show:0},
    {id:53 ,type:"Round Betting" ,name:"每回合投注",show:0},
    {id:54 ,type:"zodiac" ,name:"生肖",show:0},
    {id:55 ,type:"millenary" ,name:"三组後位数",show:0},
    {id:56 ,type:"myriad " ,name:" 颜色",show:0},
    {id:58 ,type:"single zodiac" ,name:"单生肖",show:0},
    {id:59 ,type:"winning margin soccer" ,name:"足球净赢比分数",show:5},
    {id:60 ,type:"Team Totals" ,name:"单队得分总数大小盘",show:1},
    {id:61 ,type:"odd/even" ,name:"单数/双数",show:1},
    {id:62 ,type:"5 elements" ,name:"-",show:1},
    {id:62 ,type:"over/under" ,name:"大/小",show:1},
    {id:64 ,type:"highest quarter" ,name:"最高节",show:7},
    {id:65 ,type:"winning margin basketball" ,name:"蓝球净赢比分数",show:5},
    {id:66 ,type:"double result basketball" ,name:"蓝球半全场",show:6},
    {id:67 ,type:"corners match bet" ,name:"角球独赢",show:3},
    {id:68 ,type:"corners handicap" ,name:"角球让分盘",show:3},
    {id:69 ,type:"corners over/under" ,name:"角球总分",show:3},
    {id:70 ,type:"corners odd/even" ,name:"角球单或双",show:3},
    {id:71 ,type:"bookings match bet" ,name:"罚牌独赢",show:4},
    {id:72 ,type:"bookings handicap" ,name:"罚牌让分盘",show:4},
    {id:73 ,type:"bookings over/under" ,name:"罚牌总分",show:4},
    {id:74 ,type:"bookings odd/even" ,name:"罚牌单或双",show:4},
    {id:75 ,type:"yellow card match bet" ,name:"黄卡独赢",show:4},
    {id:76 ,type:"yellow card handicap" ,name:"黄卡让分盘",show:4},
    {id:77 ,type:"yellow card over/under" ,name:"黄卡总分",show:4},
    {id:78 ,type:"yellow card odd/even" ,name:"黄卡单或双",show:4},
    {id:79 ,type:"Double chance" ,name:"双重机会",show:5},
    {id:80 ,type:"Last score" ,name:"最后得分的队伍",show:5},
    {id:81 ,type:"Next score" ,name:"下一支得分队伍",show:5},
    {id:82 ,type:"Both team score" ,name:"两队都进球",show:5},
    {id:83 ,type:"Score both half" ,name:"双半场均有进球的队伍",show:5},
    {id:84 ,type:"Team to score" ,name:"进球的队伍",show:5},
    {id:85 ,type:"highest half" ,name:"半场最高总分",show:6},
    {id:86 ,type:"highest quarter team" ,name:"单节最高总分",show:7},
    {id:87 ,type:"winning margin 3way" ,name:"三项输赢比数",show:5},
    {id:88 ,type:"race to" ,name:"首先获得",show:5},
    {id:89 ,type:"overtime" ,name:"加时",show:5},
    {id:90 ,type:"winning margin 7way" ,name:"七项输赢比数",show:5},
    {id:91 ,type:"winning margin 12way" ,name:"十二项输赢比数",show:5},
    {id:92 ,type:"team oe" ,name:"单队得分单/双",show:5},
    {id:93 ,type:"6min handicap" ,name:"首 6 让分盘",show:5},
    {id:94 ,type:"6min over/under" ,name:"首 6 大小盘",show:5},
    {id:95 ,type:"5min handicap" ,name:"首 5 让分盘",show:5},
  ],
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



