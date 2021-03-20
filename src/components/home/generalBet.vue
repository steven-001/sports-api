<template>
  <div class="generalBet">
    <div class="topBox">
      <van-row type="flex" align="center" class="top">
        <div class="return" @click="back">
          <img src="../../assets/首页/return2.png"/>
        </div>
        <van-row type="flex" justify="center" align="center" class="title" @click="topShow=!topShow">
          <div>{{ allItem.leagueName }}</div>
          <img src="../../assets/live/xia.png"/>
        </van-row>
        <div class="return"></div>
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
        <van-tab v-for="(k,i) in allData" :key="i" >
          <template #title>{{ k.leagueName }}</template>
          <van-row type="flex" justify="space-between"
                   v-for="(n,j) in k.events" :key="j"
                   @click="parentId=n.parentId"
                   class="middle" :class="{middle_active:n.parentId==parentId}">
            <div class="imgBox">
              <img src="../../assets/首页/bet/zq_blsiem.png"/>
              <div>{{ n.homeName }}</div>
            </div>
            <div class="middleBox" v-if="isLive">
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

    <TabControl_tab/>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import TabControl_tab from "../home/TabControl_tab";
  export default {
    components:{TabControl_tab},
    name:"generalBet",
    data() {
      return {
        active:null,
        topShow:false,
      }
    },
    computed:{
      ...mapState(["gqData","fgqData"]),
      isLive(){
        return this.$route.query.isLive
      },
      allData(){
        console.log('allData--',this.isLive?this.gqData:this.fgqData)
        return this.isLive?this.gqData:this.fgqData
      },
      allItem(){
        let obj = this.allData.filter(k=>{ return k.leagueId==this.leagueId })[0]
        return obj || {events:[]}
      },
      checkedData(){
        let obj = this.allItem.events.filter(k=>{ return this.parentId==k.parentId })[0] || {eventDate:''}
        return obj
      },
      leagueId(){
        return this.$route.query.leagueId
      },
      parentId:{
        get() {
          return this.$route.query.parentId
        },
        set(val) {
          const query=JSON.parse(JSON.stringify(this.$route.query))
          query.parentId=val
          this.$router.push({ path: this.$route.path, query })
        }
      },
    },
    activated() {
      if(!this.$route.query.leagueId){
        this.$router.push({path: '/'})
        return
      }
      this.topShow=false
    },
    methods: {
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
      }
      .title{
        font-size: 16px;
        text-align: center;
        width: 80%;
        height: 50px;
        line-height: 50px;
        color: #fff;
        img{
          margin: 0 3px;
          height: 5px;
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
          background-color: #F5F6FA;
        }
      }
    }
  }
</style>
