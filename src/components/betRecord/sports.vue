<template>
  <div class="sports">
    <div class="queryCondition">
      <van-dropdown-menu>
        <van-dropdown-item v-model="typeType" :options="typeIdList" @change="changeLoad1()"/>
        <van-dropdown-item v-model="date" :options="dateList"  @change="changeLoad1()"/>
      </van-dropdown-menu>
    </div>
    <van-row type="flex" justify="space-between" style="font-size: 0.35rem;text-align: center;padding: 0.5rem 0;color: #c2c2c2;">
      <div style="width: 33%">{{ $t('betRecord[\'笔数\']') }}：{{ total }}</div>
      <div style="width: 33%">{{ $t('betRecord[\'流水\']') }}：{{ totalDetail }}</div>
      <div style="width: 33%">{{ $t('betRecord[\'输赢\']') }}：{{ totalWinOrLose }}</div>

    </van-row>
    <div class="body">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="'-'+$t('betRecord[\'已加载全部内容\']')+'-'"
        @load="onLoad1"
      >
        <div class="box" v-for="(k,i) in BetList" :key="i">
          <van-row type="flex" justify="space-between" style="font-size:0.35rem;height: 1rem;border-bottom: 1px solid #383838;color: white">
            <div style="margin: 0 0.3rem;height: 1rem;line-height: 1rem">
              <span v-if="k.submitType==1">{{ $t('betRecord[\'单式\']') }}</span>
              <span v-else>{{ k.submitType }}{{ $t('bet[\'串1\']') }}</span>
              -{{ $t('new[\'金龙体育\']') }}
            </div>
            <div style="height: 0.6rem;margin: 0.2rem 0;position: relative;right: 0.2rem">
              <span v-show="k.betStatus==1" style="color: #e17d02">{{ $t('new[\'待确认\']') }}</span>
              <span v-show="k.betStatus==2" style="color: red">{{ $t('new[\'提交失败\']') }}</span>
              <span v-show="k.betStatus==3" style="color: #07c160">{{ $t('new[\'投注成功\']') }}</span>
              <span v-show="k.betStatus==4" style="color: red">{{ $t('new[\'投注失败\']') }}</span>
              <span v-show="k.betStatus==5" style="color: #07c160">{{ $t('new[\'赢\']') }}</span>
              <span v-show="k.betStatus==6" style="color: red">{{ $t('new[\'输\']') }}</span>
              <span v-show="k.betStatus==7" style="color: #6b6b6b">{{ $t('new[\'赛事取消\']') }}</span>
              <span v-show="k.betStatus==8" style="color: #6b6b6b">复原</span>
              <span v-show="k.betStatus==9" style="color: #07c160">{{ $t('new[\'赢半\']') }}</span>
              <span v-show="k.betStatus==10" style="color: red">{{ $t('new[\'输半\']') }}</span>
              <span v-show="k.betStatus==11" style="color: red">{{ $t('new[\'提前结算取消\']') }}</span>
            </div>
          </van-row>
          <van-collapse v-model="activeNames" accordion>
            <van-collapse-item :name="m.selectionId+i" v-for="(m,j) in k.betInfo" :key="j">
              <template #title>
                <van-cell class="box_title" :title="m.sportName+'/'+m.betTypeId" :icon="require('../../assets/首页/bet/zq_jxz.png')"/>
              </template>
              <div style="border-left: 2px solid #C5AD96;text-indent: 5px;height: 0.5rem;line-height: 0.5rem;margin: 0.2rem 0">
                {{ m.eventName }}
              </div>
              <van-row type="flex" justify="space-between" style="height: 0.8rem;line-height: 0.8rem">
                <div>{{ m.selectionName }} <span style="color:#7be097;">{{ m.selectionValue }}</span><span style="color:#7CA4E0;"> @ {{ m.decimalPrice }}</span></div>
                <div>{{ m.score }}</div>
              </van-row>
            </van-collapse-item>
          </van-collapse>
          <div style="padding:0.1rem 0.2rem;font-size: 0.3rem;color: white">
            <van-row type="flex" justify="space-between" style="height: 0.7rem;line-height: 0.7rem;">
              <div>{{ $t('bet[\'投注\']') }}：{{ k.stake }}</div>
              <div>{{ $t('new[\'输\']') }}/{{ $t('new[\'赢\']') }}：{{ k.winOrloseAmount }}</div>
            </van-row>
            <van-row type="flex" justify="space-between" style="height: 1rem;line-height: 1rem">
              <div style="color: #c1c1c1">{{ $t('betRecord[\'投注时间\']') }}：{{ k.betTime }}</div>
            </van-row>
            <van-row type="flex" justify="space-between" style="height: 0.7rem;line-height: 0.7rem;color: #c1c1c1">
              <div>{{ $t('topUp[\'订单号\']') }}：{{k.localBetNo }}</div>
            </van-row>
          </div>
        </div>
      </van-list>
    </div>
    <!--加载动画-->
    <van-overlay :show="loadingShow" @click="loadingShow = false" class="loadingShow">
      <div class="wrapper" @click.stop>
        <div class="block">
          <van-loading size="24px" vertical>{{ $t("new['加载中']") }}...</van-loading>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
  export default {
    props: [
      'typeId',
    ],
    data(){
      return{
        userData:JSON.parse(localStorage.getItem('userData')),
        activeNames:'',
        BetList:[],
        pageIndex:0,
        pageSize:10,
        total:0,
        totalDetail:0,
        totalWinOrLose:0,

        finished: false,
        loading:false,
        list: [],

        loadingShow:false,
        date : 2,
        typeType : 'Pending' ,
        dateList: [],
        typeIdList: [],
        AllType:[
          {id:1 ,type:"Match Bet" ,name:"独赢"},
          {id:2 ,type:"Handicap" ,name:"让分盘"},
          {id:3 ,type:"Asian Handicap" ,name:"亚洲让分盘"},
          {id:4 ,type:"Total Score Over/Under" ,name:"总分以上或以下"},
          {id:5 ,type:"First Goal scorer" ,name:"首名入球球员"},
          {id:6 ,type:"First Team To Kick Off" ,name:"首支开球球队"},
          {id:7 ,type:"First Team To Score" ,name:"首支入球球队"},
          {id:8 ,type:"First Yellow Card" ,name:"首张黄卡"},
          {id:9 ,type:"Double Result" ,name:"半全场"},
          {id:10 ,type:"Correct Score" ,name:"正确比分"},
          {id:12 ,type:"Buying Points" ,name:"购买点数"},
          {id:13 ,type:"Fixed Odds" ,name:"固定赔率"},
          {id:14 ,type:"SP" ,name:"彩池"},
          {id:15 ,type:"Forecast" ,name:"位置连赢"},
          {id:16 ,type:"Reverse Forecast" ,name:"调头位置连赢"},
          {id:17 ,type:"Quinella" ,name:"连赢"},
          {id:18 ,type:"Tricast" ,name:"三重彩"},
          {id:19 ,type:"Main Draw" ,name:"搅珠"},
          {id:20 ,type:"total over" ,name:"总数上盘"},
          {id:21 ,type:"total under" ,name:"总数下盘"},
          {id:22 ,type:"total odd" ,name:"总数单数"},
          {id:23 ,type:"total even" ,name:"总数双数"},
          {id:24 ,type:"total range" ,name:"总数范围"},
          {id:25 ,type:"total over(with bonus ball(s))" ,name:"总数上盘(包括特别号码)"},
          {id:26 ,type:"total under(with bonus ball(s))" ,name:"总数下盘(包括特别号码)"},
          {id:27 ,type:"total odd(with bonus ball(s))" ,name:"总数单数(包括特别号码)"},
          {id:28 ,type:"total even(with bonus ball(s))" ,name:"总数双数(包括特别号码)"},
          {id:29 ,type:"total range(with bonus ball(s))" ,name:"总数范围(包括特别号码)"},
          {id:30 ,type:"single color" ,name:"单号颜色"},
          {id:31 ,type:"single odd" ,name:"单数"},
          {id:32 ,type:"single even" ,name:"双数"},
          {id:33 ,type:"single over" ,name:"上盘"},
          {id:34 ,type:"single under" ,name:"下盘"},
          {id:35 ,type:"single range" ,name:"单号范围"},
          {id:36 ,type:"single exact" ,name:"单号号码"},
          {id:37 ,type:"bonus exact" ,name:"特别号码"},
          {id:38 ,type:"bonus over" ,name:"特别号码上盘"},
          {id:39 ,type:"bonus under" ,name:"特别号码下盘"},
          {id:40 ,type:"bonus odd" ,name:"特别号码单数"},
          {id:41 ,type:"bonus even" ,name:"特别号码双数"},
          {id:42 ,type:"bonus range" ,name:"特别号码范围"},
          {id:43 ,type:"bonus color" ,name:"特别号码颜色"},
          {id:44 ,type:"total bonus over" ,name:"特别号码总数上盘"},
          {id:45 ,type:"total bonus under" ,name:"特别号码总数下盘"},
          {id:46 ,type:"total bonus odd" ,name:"特别号码总数单数"},
          {id:47 ,type:"total bonus even" ,name:"特别号码总数双数"},
          {id:48 ,type:"total bonus range" ,name:"特别号码总数范围"},
          {id:49 ,type:"Straight Forecast" ,name:"定位连赢"},
          {id:50 ,type:"Team to Qualify For Next Round" ,name:"晋级队伍"},
          {id:51 ,type:"Dual Forecast" ,name:"连赢"},
          {id:52 ,type:"Set Betting" ,name:"每局投注"},
          {id:53 ,type:"Round Betting" ,name:"每回合投注"},
          {id:54 ,type:"zodiac" ,name:"生肖"},
          {id:55 ,type:"millenary" ,name:"三组後位数"},
          {id:56 ,type:"myriad " ,name:" 颜色"},
          {id:58 ,type:"single zodiac" ,name:"单生肖"},
          {id:59 ,type:"winning margin soccer" ,name:"足球净赢比分数"},
          {id:60 ,type:"Team Totals" ,name:"单队得分总数大小盘"},
          {id:61 ,type:"odd/even" ,name:"单数/双数"},
          {id:62 ,type:"5 elements" ,name:"-"},
          {id:62 ,type:"over/under" ,name:"大/小"},
          {id:64 ,type:"highest quarter" ,name:"最高节"},
          {id:65 ,type:"winning margin basketball" ,name:"蓝球净赢比分数"},
          {id:66 ,type:"double result basketball" ,name:"蓝球半全场"},
          {id:67 ,type:"corners match bet" ,name:"角球独赢"},
          {id:68 ,type:"corners handicap" ,name:"角球让分盘"},
          {id:69 ,type:"corners over/under" ,name:"角球总分"},
          {id:70 ,type:"corners odd/even" ,name:"角球单或双"},
          {id:71 ,type:"bookings match bet" ,name:"罚牌独赢"},
          {id:72 ,type:"bookings handicap" ,name:"罚牌让分盘"},
          {id:73 ,type:"bookings over/under" ,name:"罚牌总分"},
          {id:74 ,type:"bookings odd/even" ,name:"罚牌单或双"},
          {id:75 ,type:"yellow card match bet" ,name:"黄卡独赢"},
          {id:76 ,type:"yellow card handicap" ,name:"黄卡让分盘"},
          {id:77 ,type:"yellow card over/under" ,name:"黄卡总分"},
          {id:78 ,type:"yellow card odd/even" ,name:"黄卡单或双"},
          {id:79 ,type:"Double chance" ,name:"双重机会"},
          {id:80 ,type:"Last score" ,name:"最后得分的队伍"},
          {id:81 ,type:"Next score" ,name:"下一支得分队伍"},
          {id:82 ,type:"Both team score" ,name:"两队都进球"},
          {id:83 ,type:"Score both half" ,name:"双半场均有进球的队伍"},
          {id:84 ,type:"Team to score" ,name:"进球的队伍"},
          {id:85 ,type:"highest half" ,name:"半场最高总分"},
          {id:86 ,type:"highest quarter team" ,name:"单节最高总分"},
          {id:87 ,type:"winning margin 3way" ,name:"三项输赢比数"},
          {id:88 ,type:"race to" ,name:"首先获得"},
          {id:89 ,type:"overtime" ,name:"加时"},
          {id:90 ,type:"winning margin 7way" ,name:"七项输赢比数"},
          {id:91 ,type:"winning margin 12way" ,name:"十二项输赢比数"},
          {id:92 ,type:"team oe" ,name:"单队得分单/双"},
          {id:93 ,type:"6min handicap" ,name:"首 6 让分盘"},
          {id:94 ,type:"6min over/under" ,name:"首 6 大小盘"},
          {id:95 ,type:"5min handicap" ,name:"首 5 让分盘"},
        ],//所有体育投注类型
      }
    },
    created(){
      //初始化
      this.dateList=[
        { text: this.$t("yu_eBao['今天']"), value: 0 },
        { text: this.$t("yu_eBao['昨天']"), value: 1 },
        { text: this.$t("yu_eBao['近7天']"),value: 2 },
        { text: this.$t("yu_eBao['一个月']"), value: 3 },
        { text: this.$t("yu_eBao['三个月']"), value: 4 },
      ]
      this.typeIdList=[
        { text: this.$t("bet['未结注单']"), value: 'Pending' },
        { text: this.$t("bet['已结注单']"), value: 'Proces' },
      ]
    },
    activated(){
      if(this.$route.query.i==7&&this.$route.query.typeId){
        this.typeType=this.$route.query.typeId
      }
      if(this.pageIndex!=0){
        this.changeLoad()
      }
    },
    mounted(){

    },
    watch: {
      typeId(n,o){
        if(n==7){
          this.changeLoad()
        }
      },
    },
    methods:{
      changeLoad(){
        this.BetList=[];
        this.pageIndex=0;
        this.finished=false
        this.loading=true
        this.onLoad1()
      },
      onLoad1() {
        this.pageIndex++
        // 异步更新数据
          this.$ajax.post('/game/getBetList',{
            "date": this.date,
            "gameCode": "YSB",
            "status": this.typeType,
            "type": "FO",
            "pageIndex": this.pageIndex,
            "pageSize": this.pageSize,
            "userId": this.userData.userId,
          }).then(res => {
            if(res.data){
              this.total=res.data.list.total
              this.totalDetail=res.data.totalDetail
              this.totalWinOrLose=res.data.totalWinOrLose
              for (let k of res.data.list.data) {
                k.betInfo=JSON.parse(k.betInfo);
                this.BetList.push(k);
              }

            }
          }).catch(error => {
            this.$toast.fail(error);
          }).finally(()=>{
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            if (this.BetList.length >= this.total) {
              this.finished = true;
            }
          })
      },
      //betType
      betTypeListF(betType){
        for (let k of this.AllType){
          if(k.id==betType){
            return k.name
          }
        }
      },
      changeLoad1(){
        this.BetList=[];
        this.pageIndex=0;
        this.finished=false
        this.loading=true
        this.onLoad1()
      },
      //返回上一页
      quit(){
        if(this.$route.query.redirect){
          this.$router.push({
            path: this.$route.query.redirect,
            query: this.$route.query
          })
        }else {
          this.$router.push({path: '/'})
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  /*遮罩提示语*/
  .loadingShow{
    z-index: 100000;
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .block {
      width: 120px;
      height: 120px;
    }
  }

  .sports{
    background-color: #000000;
    .van-dropdown-item{
      top: 100px !important;
    }
    .status_bar{
      height: 20px;
    }
    .body{
      width: 92%;
      height: 66.5vh;
      overflow: auto;
      margin: 0px auto 28px;
      .box{
        border-radius: 8px;
        background-color: #242424;
        width: 100%;
        margin-bottom: 10px;
        .box_title{
          padding: 0;
          .van-cell__left-icon{
            margin: 0!important;
          }
          .van-icon__image{
            width: 10px;
            height: 10px;
            margin: 0.1rem 0!important;
          }
          .van-cell__value{
            color: #DF7884;
            font-size: 10px;
          }
          .van-cell__title{
            font-size: 10px;
            color: #999999;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .van-cell:not(:last-child)::after {
    border: none !important;
  }
  .box{
    .van-collapse-item__content{
      background-color: #000000 !important;
    }
  }
  .sports {
    .van-dropdown-item {
      top: 60px !important;
    }
    .van-dropdown-item__content{
      top: 115px;
    }
  }
  @media screen and (max-aspect-ratio: 8/16) {
    // 如果宽高比大于9:16的话，显示这个内容
    //iphone X
    .sports{
      .body {
        width: 92%;
        height: 72vh !important;
        overflow: auto;
      }
    }
  }
</style>
