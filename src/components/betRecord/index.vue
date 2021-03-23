<template>
  <div class="betRecord-screen normal-screen">
    <van-row type="flex" justify="space-between" align="center" class="my-topvr title-bar">
      <div class="return">
        <img src="../../assets/首页/return.png"/>
      </div>
      <div class="title">投注记录</div>
      <div class="right-action">
        <img src="../../assets/首页/新建文件夹/icon_msg_center@2x.png" class="msg-icon" />
      </div>
    </van-row>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker show-toolbar title="全部类型"
                  :columns="qryCond"
                  @cancel="showPicker = false"
                  @confirm="onChangeQry"/>
    </van-popup>
    <van-tabs v-model="curTab" sticky animated
              @change="changeTab"
              line-width="40px"
              line-height="2px"
              color="#e5c7a6"
              title-active-color="#be987f"
              title-inactive-color="#A4A9B4"
              class="normal-tab">
      <van-tab v-for="item in gameTypes"
               :title="item.gameName"
               :key="item.gameKey"
               :name="item.gameKey">
        <div class="normal-bet-list">
            <van-field class="bet-list-query"
              readonly clickable
              :value="curCond.name" @click="showPicker = true"
            />
            <div class="record-div" :class="'record-div-'+item.gameKey">
              <van-row type="flex" justify="space-between" align="center" class="record-count">
                <span>笔数:{{count.num}}</span>
                <span>流水:{{count.money}}</span>
                <span>输赢:{{count.win}}</span>
              </van-row>
              <van-list v-model="page.loading" :finished="page.finished"
                        :finished-text="page.finishedText" @load="loadPage">
                <template v-for="record in data">
                  <div class="record-item-div">
                    <van-row type="flex" justify="space-between" align="center" class="record-item-top">
                      <div class="record-item-day">{{record.betDay}}</div>
                      <div>
                        <span>笔数：{{record.num}}</span>
                        <span>流水：{{record.money}}</span>
                        <span>输赢：{{record.win}}</span>
                      </div>
                    </van-row>
                    <div class="record-item-swap">
                      <van-row type="flex" justify="space-between" align="center" class="record-item-title">
                        <span class="record-item-day">{{record.betType}}</span>
                        <span class="record-bet-state" :class="'bet-state-'+record.state">投注成功</span>
                      </van-row>
                      <van-row type="flex" justify="space-between" align="center" class="record-item-game">
                        <span class="record-item-game-name">{{record.gameName}}</span>
                        <span class="record-item-game-time">比赛时间：{{record.gameTime}}</span>
                      </van-row>
                      <div class="record-item-gamevs">{{record.gameVsInfo}}</div>
                      <van-row type="flex" justify="space-between" align="center" class="record-item-info">
                        <span class="item-game-cate">{{record.betName}}</span>
                        <span class="item-game-value">{{record.betValue}}</span>
                      </van-row>
                      <van-row type="flex" justify="space-between" align="center" class="record-item-info">
                        <span class="item-game-betcate">{{record.betCate}}</span>
                        <span class="item-game-value">{{record.betCateVal}}</span>
                      </van-row>
                      <van-row type="flex" justify="space-between" align="center" class="record-item-info">
                        <span class="item-game-bet">投注金额：{{record.money}}</span>
                        <span class="item-game-value">输/赢：{{record.win}}</span>
                      </van-row>
                      <van-row type="flex" justify="space-between" align="center" class="record-item-order">
                        <span class="item-game-bet">订单号：{{record.orderId}}</span>
                        <span class="item-game-value">投注时间：{{record.orderTime}}</span>
                      </van-row>
                    </div>
                  </div>
                </template>
              </van-list>
            </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return{
        curTab:"zq",
        data:[],
        showPicker:false,
        curCond:{name:"全部选择,今天",betState:0,betTime:0},
        page:{pageNum:1,pageSize:20,loading:false,finished:false,finishedText: "-已加载全部内容-"},
        count:{num:1,money:10.00,win:-10.00},
        qryCond:[
          {values:["全部选择","已结算","未结算"],defaultIndex:0},
          {values:["今天","昨天","近七天","三个月"],defaultIndex: 0}
        ],
        gameTypes:[
          {gameName:"足球",gameKey:"zq"},
          {gameName:"篮球",gameKey:"lq"},
          {gameName:"排球",gameKey:"pq"},
          {gameName:"网球",gameKey:"wq"},
          {gameName:"乒乓球",gameKey:"ppq"},
          {gameName:"冰球",gameKey:"bq"}
        ]
      }
    },
    mounted() {

    },
    methods:{
      changeTab(){
        this.initPage();
      },
      initPage:function(){
        this.page.pageNum=1;
        this.data=[];
        this.page.loading=false;
        this.page.finished=false;
      },
      loadPage:function(){
        //this.$ajax.get('').then(res => {});
        this.page.loading=false;
        this.page.finished=true;
        this.data=[
          {state:"1",num:"1",money:"12.12",win:"-12.12",betType:"单式-金龙体育",
            gameName:"波兰女士杯",gameTime:"2021-03-20 12:12:12",gameVsInfo:"sdfsdf vs  sdfdsf",
            betName:"滚球 独赢",betValue:"输",betCate:"四道口附近v",betCateVal:"全场1-1",
            orderId:234233453454,orderTime:"02/23 12:12",betDay:"03月12日"
          }
        ];
      },
      onChangeQry(picker, value){
        this.curCond.name=picker[0]+","+picker[1];
        this.curCond.betState=value[0];
        this.curCond.betTime=value[1];
        this.showPicker = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .title-bar .right-action img{
    position: initial;
  }
  .bet-list-query{
    background: white;
    padding: 12px 20px;
    border-top: 1px solid #f5f3f3;
  }
  .normal-bet-list{
    .record-count{
      border-top: 1px solid #eaeaea;
      padding: 8px;
      line-height: 30px;
    }
    .record-item-div{
      width: 95%;
      margin: 0px auto;
      .record-item-swap{
        background: white;
        border-radius: 8px;
        box-sizing: border-box;
        &>div{
          padding:5px 10px;
        }
      }
      .record-item-top{
        border-top: 1px solid #e0dfdf;
        padding: 8px 0px;
        div:last-child{
          color: #bdbdbd;
          font-size: 12px;
        }
      }
      .record-item-title{
        padding-bottom: 10px;
        border-bottom: 1px solid #f3f1f1;
        padding-top: 10px;
        font-weight: bold;
        color: #4e4c4c;
        line-height: 30px;
      }
      .record-item-order{
        color: #a29e9e;
        font-size:12px;
      }
      .record-item-game{
        color: #a29e9e;
        font-size:12px;
        .record-item-game-name{
          background-repeat: no-repeat;
          padding-left: 15px;
          background-size: 12px 11px;
          background-position-y: 3px;
          background-image: url("../../assets/首页/新建文件夹/icon_league@2x.png");
        }
      }
      .record-item-gamevs:before{
        content: "";
        width: 4px;
        height: 20px;
        background: rgb(229, 199, 166);
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
      }
    }
  }
</style>
