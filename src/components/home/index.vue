<template>
  <div class="home_bet">
    <van-row type="flex" justify="space-between" align="center" class="home_bet_top">
      <div class="return">
        <img src="../../assets/首页/return.png"/>
      </div>
      <img src="../../assets/首页/logo.png" class="logo"/>
      <div class="home_bet_top_right">
        <div>塞西亚猫</div>
        <div @click="onRefreshLoad">
          <span>￥89963.58</span>
          <img src="../../assets/首页/sx.png" class="sx" :class="{turn:refreshLoad}"/>
        </div>
      </div>
    </van-row>
    <!--tab今日 早盘 滚球 串关-->
    <van-tabs v-model="betType"
              @change="changeBetType"
              line-width="35px"
              line-height="2px"
              background="#F5F6FA"
              title-active-color="#4F82F4"
              title-inactive-color="#404656"
              class="home_bet_tabs">
      <van-tab v-for="(k,i) in betList"
               :title="$t('home[\''+k.text+'\']')"
               :key="i" :name="k.value">
      </van-tab>
    </van-tabs>
    <!--早盘 日期查询-->
    <van-tabs v-model="dateType"
              v-if="betType==1"
              @change=""
              line-width="30px"
              line-height="1px"
              title-active-color="#404656"
              title-inactive-color="#A4A9B4"
              class="home_bet_dateTabs">
      <van-tab v-for="(k,i) in dateList"
               :title="k.text"
               :key="i" :name="k.value">
      </van-tab>
    </van-tabs>
    <!--tab体育项目-->
    <van-tabs v-model="sportCode"
              @change="changeSpotsType"
              line-width="0"
              :ellipsis="false"
              title-active-color="#404656"
              title-inactive-color="#A4A9B4"
              class="home_bet_sportTabs">
      <van-tab v-for="(k,i) in sportsTabs" :key="i" :name="k.gameCode" v-if="k[onCount]>0">
        <div slot="title">
          <div class="icon">
            <img :src="require(`../../assets/首页/bet/ico/${k.gameCode==sportCode?k.gameCode:k.gameCode+'1'}.png`)"/>
            <div>({{ k[onCount] }})</div>
          </div>
          <div class="text">
            {{ k.gameName }}
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <!--一键投注、赛事选择-->
    <van-row type="flex" justify="space-between" align="center" class="home_bet_set">
      <div class="yijian">
        <img :src="require(`../../assets/首页/bet/pk_xz1.png`)"/>
        <span>{{ $t('bet[\'一键投注\']') }}</span>
      </div>
      <div class="xuanzhe">{{ $t('bet[\'赛事选择\']') }}</div>
    </van-row>
    <!--进行中、未开赛-->
    <sportDetails/>
    <!--单式投注-->
    <submitBet ref="submitBet"/>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import sportDetails from "./sportDetails";
  import submitBet from "../live/submitBet";
  import YSB from '@/util/YSB' //YSB数据
  export default {
    components:{sportDetails,submitBet},
    data() {
      return {
        refreshLoad:false,
        betList:[
          { text: '今日', value: 0 ,type:'todayCount'},
          { text: '早盘', value: 1 ,type:'fgqCount'},
          { text: '滚球', value: 2 ,type:'gqCount'},
          { text: '串关', value: 3 ,type:'totalCount'},
        ],
        betType:null,
        sportsType:[],
        sportCode:null,
        dateList:[
          { text: '全部', value: 0 },
          { text: '3/05', value: 1 },
          { text: '3/06', value: 2 },
          { text: '3/07', value: 3 },
          { text: '3/08', value: 4 },
          { text: '3/09', value: 5 },
          { text: '3/10', value: 6 },
          { text: '3/11', value: 7 },
          { text: '七日后', value: 8 },
        ],
        dateType:null,
      };
    },
    computed : {
      ...mapState(["uData","menuBoj"]),
      userData(){
        return this.uData
      },
      sportsTabs(){
        this.sportsType.map(k=>{
          k.todayCount=0
          k.totalCount=0
          k.gqCount=0
          k.fgqCount=0
          this.menuBoj.filter(item=>{
            if(item.sportType==k.gameCode.toLowerCase()){
              if(item.isLive){
                k.gqId=item.sportId;
                k.gqCount=item.totalCount||0
              }else {
                k.fgqId=item.sportId
                k.fgqCount=item.totalCount||0
              }
              k.totalCount+=item.totalCount||0
              k.todayCount+=item.todayCount||0
            }
            return item.sportType==k.gameCode.toLowerCase()
          })
        })
        return this.sportsType.filter(k=>{ return k.gqId||k.fgqId})
      },
      onCount(){
        return this.betList.filter(k=>{ return k.value==this.betType})[0].type
      },
    },
    created(){
      //获取体育菜单
      YSB.onMenu(this.$i18n.locale)
    },
    activated(){
      this.onRefreshLoad()
      this.getSportTypeConfig()
    },
    mounted(){
      let time = setInterval(()=>{
        if(this.sportsTabs.length>0){
          clearInterval(time)
          this.changeBetType()
        }
      },100)
    },
    methods:{
      ...mapActions(["onShow"]),
      onRefreshLoad(){//刷新金币
        this.refreshLoad=true
        setTimeout(()=>{
          this.refreshLoad=false
        },1000)
      },
      changeBetType(){// tab今日 早盘 滚球 串关
        if(this.betType==0){
          let arr=this.sportsTabs.filter(k=>{ return k.todayCount>0})[0]
          this.sportCode=arr.gameCode
          this.changeSpotsType()
        }else if(this.betType==1){
          let arr=this.sportsTabs.filter(k=>{ return k.fgqCount>0})[0]
          this.sportCode=arr.gameCode
          this.changeSpotsType()
        }else if(this.betType==2){
          let arr=this.sportsTabs.filter(k=>{ return k.gqCount>0})[0]
          this.sportCode=arr.gameCode
          this.changeSpotsType()
        } else if(this.betType==3){
          // this.gqID==''?'':YSB.onLive(this.gqID,this.$i18n.locale)
          // this.fgqID==''?'':YSB.onOnLive(this.fgqID+'-',this.$i18n.locale)
        }
      },
      changeSpotsType(){
        this.$store.commit("getgq", [])
        this.$store.commit("getfgq", [])
        let data = this.sportsTabs.filter(k=>{ return k.gameCode==this.sportCode})[0]
        if(this.betType==0){
          YSB.onNoLive(data.fgqId+'-0',this.$i18n.locale)
        }else if(this.betType==1){
          YSB.onNoLive(data.fgqId+'-',this.$i18n.locale)//只能获取所有非滚球
        }else if(this.betType==2){
          YSB.onLive(data.gqId,this.$i18n.locale)
        } else if(this.betType==3){
        }
      },
      getSportTypeConfig(){//获取体育赛事Type
        this.$ajax.get('/game/getSportTypeConfig?agentId='+this.$store.state.agentId
        ).then(res => {
          if(res.data){
            this.sportsType=res.data
          }
        })
      },
      showSubmit(data){
        this.$refs.submitBet.onInitialize(data)
      },
    },
  };
</script>
<style lang="scss">
  .home_bet{
    .home_bet_top{
      position: relative;
      height: 40px;
      padding: 0 10px;
      .return{
        width: 30%;
        img{
          position: absolute;
          top:calc(50% - 8px);
          height: 16px;
        }
      }
      .logo{
        height: 35px;
      }
      .home_bet_top_right{
        text-align: right;
        width: 30%;
        font-size: 13px;
        font-weight: bold;
        div:first-child{

        }
        div:last-child{
          color: #4F82F4;
          .sx{
            width: 15px;
            margin: -1px 2px;
          }
          .turn{
            animation:turn 1s linear infinite;
          }
          @keyframes turn{
            0%{-webkit-transform:rotate(0deg);}
            25%{-webkit-transform:rotate(90deg);}
            50%{-webkit-transform:rotate(180deg);}
            75%{-webkit-transform:rotate(270deg);}
            100%{-webkit-transform:rotate(360deg);}
          }
        }
      }
    }
    .home_bet_tabs{
      .van-tabs__line{
        background-color: #4F82F4;
      }
    }
    .home_bet_dateTabs{
      .van-tabs__line{
        background-color: #404656;
      }
      .van-tabs__wrap{
        height: 25px;
        .van-tab__text{
          font-size: 11px;
        }
      }
    }
    .home_bet_sportTabs{
      .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
        border: none;
      }
      margin: 5px 0;
      .van-tab__text{
        width: 16vw;
        text-align: center;
        .icon{
          position: relative;
          img{
            height: 25px;
          }
          div{
            position: absolute;
            top: 0px;
            right: 0;
            font-size: 11px;
          }
        }
        .text{
          font-size: 11px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
    }
    .home_bet_set{
      border-top: 1px solid #f5f5f5;
      background: #F8F8F8;
      height: 30px;
      font-size: 11px;
      color: #414554;
      .yijian{
        text-align: center;
        width: 50%;
        img{
          position: relative;
          top: 3px;
          height: 15px;
        }
        span{
          display: inline-block;
          line-height: 30px;
        }
      }
      .xuanzhe{
        text-align: center;
        width: 50%;
      }
    }
  }
</style>
