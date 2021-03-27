<template>
  <div class="sportDetails">
    <div class="sportDetails_body" v-for="i in 2" :class="{border_top:i==2}">
      <van-row type="flex" align="center" class="title">
        <img :src="require(`../../assets/首页/bet/title${i}.png`)"/>
        <div>{{ i==1?'进行中':'未开赛' }}</div>
      </van-row>
      <div class="league_box" v-for="(k,j) in (i==1?ongoing:notStart)" :key="j">
        <van-row type="flex" justify="space-between" align="center" class="league_box_title">
          <div>{{ k.leagueName }}</div>
          <img :src="require(`../../assets/首页/bet/zhankai.png`)"/>
        </van-row>
        <div class="league_box_content" v-for="(n,x) in k.events" :key="x">
          <van-row type="flex" justify="space-between" align="center" class="time">
            <div><van-icon name="star-o" />{{ n.eventDate }}</div>
            <div>
              <span>{{ n.morebetCount }}+</span>
              <img :src="require(`../../assets/首页/bet/asdas.png`)"/>
            </div>
          </van-row>
          <!--判断是否有直播-->
          <van-row type="flex" justify="space-between" align="center" class="score" v-if="n.liveStream">
            <span>{{ n.homeName }}</span>
            <span>{{ n.score }}</span>
            <span>{{ n.awayName }}</span>
          </van-row>
          <van-row type="flex" justify="space-between" class="league_box_content_mini">
            <div class="left box" @click="" @click="to_live((i==1?ongoing:notStart),k,n.parentId)" v-if="n.liveStream">
              <div style="height: 100%;text-align: center">
                <img :src="require('../../assets/live/anchor/image1.png')"/>
              </div>
            </div>
            <div class="left box" @click="to_generalBet((i==1?ongoing:notStart),k,n.parentId)" v-else>
              <div style="height: 100%">
                <van-row type="flex" justify="space-between" align="center" class="left_score">
                  <span>{{ n.homeName }}</span>
                  <span>{{ n.score.split('-')[0]  }}</span>
                </van-row>
                <van-row type="flex" justify="space-between" align="center" class="left_score">
                  <span>{{ n.awayName }}</span>
                  <span>{{ n.score.split('-')[1]   }}</span>
                </van-row>
                <van-row type="flex" align="center" class="left_score">
                  <img :src="require(`../../assets/首页/bet/animationLive.png`)"/>
                  <img :src="require(`../../assets/首页/bet/live.png`)"/>
                </van-row>
              </div>
            </div>
            <div class="right box">
              <van-swipe class="right-swipe" indicator-color="#BBC3E4" :stop-propagation="false">
                <van-swipe-item v-for="(m,o) in n.sessions" :key="o">
                  <van-row type="flex" justify="space-between" align="center" class="right_top">
                    <div>{{ jointList[m.session] }}{{ $t('bet[\'独赢\']') }}</div>
                    <div>{{ jointList[m.session] }}{{ $t('bet[\'让球\']') }}</div>
                    <div>{{ jointList[m.session] }}{{ $t('bet[\'大/小\']') }}</div>
                  </van-row>
                  <van-row type="flex" justify="space-between" class="right_bottom">
                    <div :class="{'right-swipe_box1':l==0,'right-swipe_box2':l!=0}" v-for="(itme,l) in rightData" :key="l">
                      <div v-for="(h,a) in itme" :key="a" class="grid" :class="{Continuous_grid:changeGrid(m[h])}">
                        <div v-if="onLock(m[h])" @click="showSubmit(m[h],n,k.leagueName)">
                          <span v-if="l==0">{{ a==0?'主胜':a==1?'客胜':'和局' }}</span>
                          <span v-else>{{ m[h].displayValue }}</span>
                          <!--{litre:true,drop:false}-->
                          <b><van-icon name="play" :class="setGqData(m[h],h)+' '+m[h].type"/>{{ m[h].selectionPrice }}</b>
                        </div>
                        <div v-else>
                          <img :src="require(`../../assets/首页/bet/zq_sz.png`)"/>
                        </div>
                      </div>
                    </div>
                  </van-row>
                </van-swipe-item>
              </van-swipe>
            </div>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  export default {
    data() {
      return {
        jointList:['全场','上','下','一节','二节','三节','四节'],
        rightData:[
          ['smbh','smba','smbd'],
          ['shdh','shda'],
          ['souh','soua'],
        ],
        oldGqData:[],
      }
    },
    computed:{
      ...mapState(["gqData","fgqData","ContinuousData"]),
      ongoing(){
        return this.gqData
      },
      notStart(){
        return this.fgqData
      },
    },
    watch:{
      //滚球赔率刷新
      "gqData":{
        deep:true, //深度监听设置为 true
        handler:function(n,o) {
          if(n.length>0){
            this.oldGqData=o
          }
        }
      },
    },
    methods: {
      //判断当前赔率 降/升
      setGqData(obj,kay){
        this.oldGqData.map(item=>{
          item.events.map(k=>{
            k.sessions.map(n=>{
              if(n[kay]&&obj.selectionId==n[kay].selectionId){
                if(obj.selectionPrice>n[kay].selectionPrice){
                  obj.type='litre'
                }else if(obj.selectionPrice<n[kay].selectionPrice){
                  obj.type='drop'
                }else {
                  obj.type='undefined'
                }
              }
            })
          })
        })
        return ''
      },
      //投注卡上锁
      onLock(obj){
        if(obj&&obj.selectionPrice>1&&obj.selectionStatus =='a'){
          if(this.betType==3&&obj.comboType==0){
            return false
          }else {
            return true
          }
        }else {
          return false
        }
      },
      //串关选中项
      changeGrid(obj){
        if(obj){
          let arr = this.ContinuousData.filter(k=>{ return obj.selectionId==k.selectionId})
          return arr.length>0
        }
      },
      showSubmit(obj,events,leagueName){
        let data={
          parentId:events.parentId,
          selectionId:obj.selectionId,
          leagueName:leagueName,
          home:events.homeName,
          guest:events.awayName,
          name:obj.selectionName,
          odds:obj.selectionPrice,
          Fraction:obj.displayValue,
          betType:obj.betType,
        }
        this.$parent.showSubmit(data);
      },
      to_generalBet(data,item,parentId){
        this.$store.state.allData=data
        this.$store.state.leagueId=item.leagueId
        this.$store.state.parentId=parentId
        this.$router.push({path: '/generalBet'})
      },
      to_live(item,parentId){
        this.$router.push({
          name:"live",
          params:{
            item:item,
            parentId:parentId,
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .sportDetails{
    height: calc(100vh - 0.8rem - 1.2rem - 0.26666rem - 1.17rem - 1.0666rem);
    overflow-y: auto;
    .sportDetails_body{
      border-top: 2px solid #DBEBFD;
      padding: 0 10px;
      .title{
        font-size: 13px;
        padding: 5px 0;
        color: #404656;
        img{
          height: 13px;
          margin-right: 5px;
        }
      }
      .league_box{
        .league_box_title{
          font-size: 13px;
          padding: 5px 0;
          font-weight: bold;
          color: #414655;
          border-bottom: 1px solid #EFEFEF;
          img{
            width: 10px;
            margin-right: 5px;
          }
        }
        .league_box_content{
          .time{
            color: #7E89A6;
            font-size: 11px;
            height: 20px;
            img{
              height: 10px;
            }
            span{
              display: inline-block;
              transform: scale(0.8);
            }
          }
          .score{
            font-size: 13px;
            text-align: center;
            height: 30px;
            background-color: #F7F8FC;
            margin-bottom: 3px;
            span{
              font-weight: bold;
              color: #4F82F4;
              display: inline-block;
            }
            span:first-child{
              color: #000;
              width: 45%;
            }
            span:last-child{
              color: #000;
              width: 45%;
            }
          }
          .league_box_content_mini{
            .box{
              width: 50%;
              min-height: 150px;
            }
            .left{
              .left_score{
                color: #3D3F47;
                font-size: 12px;
                height: 28%;
                font-weight: bold;
                span:last-child{
                  color: #4F82F4;
                  display: inline-block;
                  padding-right: 10px;
                }
                img{
                  display: inline-block;
                  height: 13px;
                  margin-right: 5px;
                }
              }
              .left_score:first-child{
                margin-top: 14%;
              }
            }
            .right{
              .undefined{
                display: none;
              }
              .litre{
                transform: rotate(-90deg);
                color: #69C969;
                position: relative;
                top: 4px;
              }
              .drop{
                transform: rotate(90deg);
                color: #DB6372;
                top: 4px;
              }
              .right-swipe{
                height: 100%;
                .right_top{
                  font-size: 11px;
                  height: 20%;
                  div{
                    width: 33%;
                    text-align: center;
                  }
                }
                .right_bottom{
                  height: 80%;
                  .right-swipe_box1{
                    height: 100%;
                    width: 32.5%;
                    font-size: 12px;
                    text-align: center;
                    .grid{
                      height: 31%;
                      margin-bottom: 5%;
                      background-color: #F5F6FA;
                      color: #404656;
                      img{
                        margin-top: 8px;
                        height: 20px;
                      }
                    }
                    span{
                      padding-top: 3px;
                      font-size: 11px;
                      display: block;
                      color: #7E89A6;
                    }
                  }
                  .right-swipe_box2{
                    height: 100%;
                    width: 32.5%;
                    font-size: 12px;
                    text-align: center;
                    .grid{
                      height: 48%;
                      margin-bottom: 5%;
                      background-color: #F5F6FA;
                      color: #404656;
                      img{
                        margin-top: 16px;
                        height: 20px;
                      }
                    }
                    span{
                      padding-top: 3px;
                      font-size: 11px;
                      display: block;
                      line-height: 25px;
                      color: #7E89A6;
                    }
                  }
                  .Continuous_grid{
                    background-color: #dde0ef !important;
                  }
                }
                .van-swipe__indicators{
                  bottom: 0px;
                  z-index: 1;
                  .van-swipe__indicator{
                    background-color: #c2c2c2;
                  }
                }
              }
            }
          }
        }
      }
    }
    .sportDetails_body:last-child{
      padding-bottom: 100px;
    }
    .border_top{
      border-top: 2px solid #FDDCE0;
    }
  }
</style>
