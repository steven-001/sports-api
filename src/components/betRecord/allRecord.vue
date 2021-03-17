<template>
  <div class="betRecord" style="height: 78vh;overflow: auto">
    <div class="body">
      <van-row type="flex" justify="space-around" class="formatDate" align="center">
        <div>投注时间：</div>
        <van-row  type="flex">
          <van-row  class="inputDate" type="flex" justify="space-between" align="center">
            <van-icon name="notes-o" />
            <input type="text"  v-model="startTime" @click="showDate = true" readonly="readonly">
          </van-row >
          <div style="width: 0.5rem;text-align: center">~</div>
          <van-row  class="inputDate" type="flex" justify="space-between" align="center">
            <van-icon name="notes-o" />
            <input type="text"  v-model="endTime" @click="showDate2 = true" readonly="readonly">
          </van-row >
        </van-row>
        <div class="formatDate_button" @click="changeLoad();getBettingRecordTotal()">搜索</div>
      </van-row>
      <van-calendar v-model="showDate" @confirm="onConfirm" :min-date="getDate()" color="#E4B574"/>
      <van-calendar v-model="showDate2" @confirm="onConfirm2" :min-date="getDate()"  color="#E4B574"/>
      <van-row type="flex" justify="space-between" class="title" align="center">
        <div>{{ $t('ttfy[\'游戏类型\']') }}</div>
        <div>{{ $t('ttfy[\'游戏时间\']') }}</div>
        <div>{{ $t('bet[\'投注金额\']') }}</div>
        <div>{{ $t('bottomLine[\'输赢金额\']') }}</div>
        <div>{{ $t('topUp[\'状态\']') }}</div>
      </van-row>
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="'-'+$t('betRecord[\'已加载全部内容\']')+'-'"
        @load="onLoad1"
      >
        <div>
          <van-row type="flex" class="box" v-for="(k,i) in BetList" :key="i" align="center">
            <div>
              {{ $t('new[\''+k.kindName+'\']') }}<br/>
              {{ k.gameName }}
            </div>
            <div>{{ k.betTime }}</div>
            <div>￥{{ k.betAmount }}</div>
            <div style="color: #62BE5E" v-if="k.score>0">￥{{ k.score }}</div>
            <div style="color: #DB6473" v-else>￥{{ k.score }}</div>
            <div style="color: #62BE5E">{{ $t('new2[\'已结算\']') }}</div>
          </van-row>
        </div>
      </van-list>
    </div>
    <van-row type="flex" class="totalNum" justify="space-around">
      <div style="width: 15%">合计：</div>
      <div style="width: 40%">
        <div>投注总额：￥{{ totalNum.betAmount }}</div>
        <div>派彩奖金：￥{{ totalNum.payoutAmount }}</div>
      </div>
      <div style="width: 40%">
        <div>有效投注：￥{{ totalNum.validAmount }}</div>
        <div>投注注数：{{ totalNum.betCount }}</div>
      </div>
    </van-row>
  </div>
</template>

<script>
  export default {
    props: [
      'typeId',
    ],
    data(){
      return{
        endTime:'',
        startTime:'',
        showDate:false,
        showDate2:false,
        finished:false,
        loading:false,
        BetList:[],
        pageIndex:0,
        pageSize:10,
        total:0,
        type:0,
        userData:JSON.parse(localStorage.getItem('userData')),
        totalNum:{},
      }
    },
    created(){
      let date = new Date()
      this.startTime=`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      this.endTime=`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()+1}`
      this.getBettingRecordTotal()
    },
    mounted(){
      console.log(this.typeId)
    },
    methods:{
      getDate(){
        return new Date(2020,1,1)
      },
      onformatDate(date) {
        console.log(date.getFullYear())
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      },
      onConfirm(date) {
        console.log(date)
        this.showDate = false;
        this.startTime = this.onformatDate(date);
      },
      onConfirm2(date) {
        this.showDate2 = false;
        this.endTime = this.onformatDate(date);
      },
      getBettingRecordTotal(){
        this.$ajax.post('/game/getBettingRecordTotal',{
          "type": this.type,
          'endTime':this.endTime+' 23:59:59',
          'startTime':this.startTime+' 00:00:00',
        }).then(res => {
          if(res.data){
            this.totalNum=res.data
          }
        }).catch(error => {
          this.$toast.fail(error);
        })
      },
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
        this.$ajax.post('/game/getOtherBettingRecord',{
          "type": this.type,
          "pageIndex": this.pageIndex,
          "pageSize": this.pageSize,
          'endTime':this.endTime+' 23:59:59',
          'startTime':this.startTime+' 00:00:00',
        }).then(res => {
          if(res.data){
            this.total=res.data.total
            for (let k of res.data.data) {
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

  .betRecord{
    .status_bar{
      height: 20px;
    }
    .queryCondition{
      height: 50px;
    }
    .body{
      width: 100%;
      margin: 0px auto 28px;
      .formatDate{
        padding: 15px;
        font-size: 13px;
        .inputDate{
          width:100px;
          height: 25px;
          border-radius: 5px;
          border: 1px solid #383838;
          text-align: right;
          i{
            font-size: 15px;
          }
          input{
            outline: none;
            border: none;
            height: 24px;
            width:75px;
            background-color: rgba(36, 36, 36, 0);
          }
        }
        .formatDate_button{
          background-color: #1367BC;
          padding: 5px 10px;
          border-radius: 5px;
          color: #fff;
        }
      }
      .title{
        text-align: center;
        font-size: 12px;
        div{
          width: 16%;
          padding: 2%;
        }
      }
      .box{
        font-size: 10px;
        text-align: center;
        border-bottom: 1px solid #383838;
        div{
          width: 16%;
          padding: 2%;
        }
      }
    }
    .totalNum{
      width: 90%;
      font-size: 13px;
      padding: 10px 5%;
      position: fixed;
      bottom: 53px;
    }
  }
</style>
<style lang="scss">
  .van-cell:not(:last-child)::after {
    border: none !important;
  }
  .box{
    .van-collapse-item__content{
      background-color: #f0f0f0;
    }
  }
</style>
