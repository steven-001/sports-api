<template>
  <div class="generalBet">
    <div class="topBox">
      <van-row type="flex" align="center" class="top">
        <div class="return" @click="back">
          <img src="../../assets/首页/return2.png"/>
        </div>
        <van-row type="flex" justify="center" align="center" class="title" @click="onTopShow()">
          <div>{{ allItem.leagueName }}</div>
        </van-row>
        <div class="return">
          <img src="../../assets/live/xia.png" class="zq_xxlh"/>
        </div>
      </van-row>
      <van-row type="flex" justify="space-between" class="middle">
        <div class="imgBox">
          <img src="../../assets/首页/bet/zq_blsiem.png"/>
          <div>{{ checkedData.homeName }}</div>
        </div>
        <div class="middleBox" v-if="checkedData.isLive">
          <div>{{ checkedData.eventDate.split(' ')[1] }}</div>
          <div>{{ checkedData.score.split('-')[0] }} - {{ checkedData.score.split('-')[1] }}</div>
        </div>
        <div class="middleBox" v-else>
          <div>{{ checkedData.eventDate.split(' ')[0] }}</div>
          <div>{{ checkedData.eventDate.split(' ')[1] }}</div>
        </div>
        <div class="imgBox">
          <img src="../../assets/首页/bet/zq_dmdt.png"/>
          <div>{{ checkedData.awayName }}</div>
        </div>
      </van-row>
      <div class="bottom">

      </div>
    </div>
    <van-popup v-model="topShow"
               class="topShow"
               position="top"
               overlay-class="topShow_overlay"
               :style="'height: 75vh ;width:100%'" >
      <van-row type="flex" align="center" class="top">
        <div class="return" @click="back">
          <img src="../../assets/首页/return.png"/>
        </div>
        <van-row type="flex" class="title" @click="topShow=!topShow">
          <div>{{ allItem.events[0].parentSportName }} - {{ allItem.leagueName }} - {{ allItem.events[0].eventName }}</div>
        </van-row>
        <div class="return">
          <img src="../../assets/首页/bet/zq_xxlh.png" class="zq_xxlh"/>
        </div>
      </van-row>
      <van-tabs v-model="active" animated
                title-active-color="#4F82F4"
                background="rgba(245, 246, 250, 0.9)"
                line-height="2px">
        <van-tab v-for="(k,i) in allData" :key="i" :name="k.leagueId">
          <template #title>{{ k.leagueName }}</template>
          <van-row type="flex" justify="space-between"
                   v-for="(n,j) in k.events" :key="j"
                   @click="changeParentId(k,n)"
                   class="middle" :class="{middle_active:n.parentId==typeId}">
            <div class="imgBox">
              <img src="../../assets/首页/bet/zq_blsiem.png"/>
              <div>{{ n.homeName }}</div>
            </div>
            <div class="middleBox" v-if="checkedData.isLive">
              <div>{{ n.eventDate.split(' ')[1] }}</div>
              <div>{{ n.score.split('-')[0] }} - {{ n.score.split('-')[1] }}</div>
            </div>
            <div class="middleBox" v-else>
              <div>{{ n.eventDate.split(' ')[0] }}</div>
              <div>{{ n.eventDate.split(' ')[1] }}</div>
            </div>
            <div class="imgBox">
              <img src="../../assets/首页/bet/zq_dmdt.png"/>
              <div>{{ n.awayName }}</div>
            </div>
          </van-row>
        </van-tab>
      </van-tabs>
    </van-popup>
    <TabControl_tab @showSubmit="showSubmit"/>
    <submitBet ref="submitBet"/>
  </div>
</template>

<script>
  import { mapState, mapGetters } from "vuex";
  import submitBet from "../public/submitBet";
  import TabControl_tab from "../public/TabControl_tab";
  export default {
    components:{TabControl_tab,submitBet},
    name:"generalBet",
    data() {
      return {
        active:this.$store.state.leagueId,
        topShow:false,
        typeId:this.$store.state.parentId,
      }
    },
    computed:{
      ...mapState(['leagueId','allData']),
      ...mapGetters(['allItem','checkedData']),
    },
    activated() {
      this.topShow=false
    },
    methods: {
      onTopShow(){
        this.active=this.$store.state.leagueId
        this.topShow=!this.topShow
      },
      changeParentId(k,n){
        this.$store.state.leagueId=k.leagueId
        this.$store.state.parentId=n.parentId
        this.typeId=n.parentId
        this.topShow=false
      },
      showSubmit(data){
        this.$refs.submitBet.onInitialize(data)
      },
      //返回首页
      back(){
        this.$router.push({path: '/'})
      },
    }
  }
</script>

<style lang="scss">
  @keyframes wordsLoop {
    0% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(calc(-70%));
    }
  }
  .generalBet{
    .top{
      position: relative;
      height: 50px;
      padding: 0 20px;
      .return{
        height: 50px;
        width: 20%;
        img{
          position: absolute;
          top:calc(50% - 7px);
          height: 14px;
        }
        .zq_xxlh{
          margin: 0 3px;
          height: 5px;
          position: absolute;
          top: calc(50% - 2px);
        }
      }
      .title{
        font-size: 16px;
        text-align: center;
        width: 60%;
        height: 50px;
        line-height: 50px;
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        div{
          animation: 10s wordsLoop linear infinite;
        }
      }
    }
    .middle{
      padding: 10px 30px;
      color: #fff;
      text-align: center;
      .imgBox{
        width: 30%;
        font-size: 13px;
        img{
          height: 50px;
        }
      }
      .middleBox{
        padding: 15px 0;
        div:first-child{
          font-size: 13px;
        }
        div:last-child{
          font-weight: bold;
          font-size: 25px;
        }
      }
    }
    .topBox{
      background: url("../../assets/首页/bet/generalBet/bg.png");
      background-size: 100% 100%;
      height: 56vw;
    }
    .topShow{
      background-color: rgba(245, 246, 250, 0.9);
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      .top{
        .return {
          position: relative;
          .zq_xxlh{
            margin: 0 3px;
            height: 5px;
            position: absolute;
            top: calc(50% - 2px);
          }
        }
        .title{
          text-align: left;
          width: 60%;
          color: #000;
          overflow: hidden;
          white-space: nowrap;
          div{
            animation: 10s wordsLoop linear infinite;
          }
        }
      }
      .middle {
        color: #404656;
        margin: 20px 20px 0 20px;
        border-radius: 10px;
        .imgBox{
          font-size: 11px;
          img{
            height: 40px;
          }
          div{
            line-height: 30px;
          }
        }
        .middleBox{
          div:last-child{
            font-size: 20px;
          }
        }
      }
      .middle_active{
        background-color: #fff;
      }
      .van-tabs{
        .van-tabs__line{
          background-color: #4F82F4;
        }
      }
    }
    .TabControl_body_tab{
      margin: 0 auto;
      .TabControl_body_tab_content{
        .box_title{
          color: #000 !important;
        }
        .TabControl_box{
          .separate{
            background-color: #F5F6FA;
          }
        }
      }
    }
  }
</style>
