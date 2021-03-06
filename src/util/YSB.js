import store from '@/store'
export default {
  menu_Time:null,
  menu:null,
  newBetData_Time:null,
  newBetData:null,
  locale:['1','2','3','16'],//体育第三方语言
  onMenu(locale){//菜单
    //默认英语
    let yy=this.locale.indexOf(locale)>-1?locale:1
    let _this=this
    _this.menu = new YSB.YSBSignalR(store.state.YsbUrl,store.state.VI,store.state.Secret, "", 0, yy);
    _this.menu.startConnection().then(function () {
      _this.menu.getData().then(function (data) {
        console.log(data, "菜单数据!");
        store.commit("onMenu", data)
      });

      _this.menu_Time=setInterval(()=> {
        _this.menu.getData().then(function (data) {
          if(data.normal.length&&data.normal.length>0){
            console.log(data.normal,'刷新菜单！')
            store.commit("onMenu", data)
          }
        });
      }, 30000);
    });
  },
  onNewBetData(ids){//赔率
    this.menu.getOddsBySelectionId(ids).then(function (data) {
      console.log(data, "刷新赔率");
      store.commit("onNewBetData", data)
    });
  },
  newBetDataOut(){
    clearInterval(this.newBetData_Time)
    console.log('停止刷新赔率！')
  },
  menu_getDataOut(){
    clearInterval(this.menu_Time)
    console.log('停止刷新菜单！')
  },
  onLive(id,locale){//滚球
    //默认英语
    let yy=this.locale.indexOf(locale)>-1?locale:1
    live?live.disconnect():'';
    console.log('断开滚球')
    store.commit("getgq", [])
    store.commit("getfgq", [])
    store.state.gqId=id
    var live = new YSB.YSBSignalR(store.state.YsbUrl, store.state.VI,store.state.Secret, id, 1, yy);
    live.startConnection().then(function () {
      live.getData("2").then(function (data) {
        console.log(data, '滚球sport_id：'+id);
        store.commit("getgq", data)
      });
    });
    live.on("NewData", function (data, type) {
      console.log(data, type, "新滚球数据");
      store.commit("getgq", data)
    });
  },
  onNoLive(id,locale){//非滚球
    //默认英语
    let yy=this.locale.indexOf(locale)>-1?locale:1
    noLive?noLive.disconnect():'';
    console.log('断开非滚球')
    store.commit("getgq", [])
    store.commit("getfgq", [])
    store.state.fgqId=id
    var noLive = new YSB.YSBSignalR(store.state.YsbUrl, store.state.VI,store.state.Secret, id, 2, yy);
    noLive.startConnection().then(function () {
      noLive.getData("2").then(function (data) {
        console.log(data, '非滚球sport_id：'+id);
        store.commit("getfgq", data)
      });
    });
    noLive.on("NewData", function (data, type) {
      console.log(data, type, "新非滚球数据");
      store.commit("getfgq", data)
    });
  },
}
