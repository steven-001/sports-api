<template>
      <div class="TabControl_body_tab">
        <van-tabs v-model="active" animated>
          <van-tab v-for="(item,o) in tabs" :key="o" :name="item.type" v-if="item.bool">
            <template #title>{{ item.text }}</template>
            <div class="overflow_body">
              <div class="TabControl_body_tab_content" v-for="(k,i) in sessionsData" :key="i">
                <div v-for="(n,j) in k.list" :key="j" v-if="active==0||n.show==active">
                  <div class="box_title">
                    {{ jointList[i] }} {{ locale==2?n.text:n.betType }}
                  </div>
                  <div style="width: 100%;overflow: auto">
                    <div :class="{betSwipe:n.showType==2}">
                      <div v-for="(m,x) in n.data" :key="x" class="TabControl_box" :class="setClass(n.betType)+(' betArr_'+n.data.length)">
                        <div class="title">
                          <span>{{ m.selectionName }}</span>
                        </div>
                        <div class="separate" @click="showSubmit(m)">
                          <span :class="{span1:m.displayValue!=''}">{{ m.displayValue }}</span>
                          <span class="odds" :class="{span2:m.displayValue!=''}">
                            <van-icon name="play" :class="setGqData(m,m.keyNmae)+' '+m.type"/>
                            {{ m.selectionPrice }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
</template>

<script>
  import { mapState, mapGetters } from "vuex";
  import YSB from '@/util/YSB' //YSB数据
  export default {
    data() {
      return {
        jointList:['','上半场','下半场','第一节','第二节','第三节','第四节'],
        locale:localStorage.getItem('locale'),
        active:0,
        tabsList:[
          {text:'所有盘口',type:0,bool:true},
          {text:'让球&大小',type:1,bool:false},
          {text:'波胆',type:2,bool:false},
          {text:'角球',type:3,bool:false},
          {text:'黄红牌',type:4,bool:false},
          {text:'特殊投注',type:5,bool:false},
          {text:'半/全场',type:6,bool:false},
          {text:'节',type:7,bool:false},
        ],
        oldGqData:[],
      }
    },
    computed:{
      ...mapState(["gqData","fgqData",'fgqId','gqId']),
      ...mapGetters(['sessionsData','checkedData','allItem']),
      tabs(){
        this.tabsList.map(item =>{
          if(item.type>0){
            this.sessionsData.map(k=>{
              let arr = k.list.filter(n=>{ return n.show==item.type })
              arr.length>0?item.bool=true:''
            })
          }
        })
        return this.tabsList || []
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
    activated(){
      // if(this.checkedData.isLive){
      //   YSB.onLive(this.gqId,this.$i18n.locale)
      // }else {
      //   YSB.onNoLive(this.fgqId,this.$i18n.locale)
      // }
    },
    methods: {
      //判断当前赔率 降/升
      setGqData(obj,kay){
        this.oldGqData.map(item=>{
          item.events.map(k=>{
            k.sessions.map(n=>{
              if(obj.selectionId==n[kay].selectionId){
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
      showSubmit(obj){
        let data={
          selectionId:obj.selectionId,
          leagueName:this.allItem.leagueName,
          home:this.checkedData.homeName,
          guest:this.checkedData.awayName,
          name:obj.selectionName,
          odds:obj.selectionPrice,
          Fraction:obj.displayValue,
          betType:obj.betType,
        }
        this.$emit('showSubmit',data)
      },
      setClass(str){
        let text = ''
        str.split(' ').map(k=>{
          if(k.split('/').length>1){
            let text2 =''
            k.split('/').map(n=>{
              text2+=n
            })
            k=text2
          }
          text+=k
        })
        return text
      },
    }
  }
</script>

<style lang="scss">
  .TabControl_body_tab{
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.3);
    width: calc(100% - 10px);
    height: calc(100% - 50px);
    .overflow_body {
      height: calc(100vh - 56vw - 50px);
      overflow-y: auto;
    }
    .van-tab{
      flex-basis:25% !important;
      color: #000 !important;
    }
    .van-tabs__wrap{
      border-top-right-radius: 15px;
      border-top-left-radius: 15px;
    }
    .van-tab--active{
      color: #fff !important;
      span{
        display: inline-block;
        padding: 5px;
        text-align: center;
        min-width: 50px;
        position: relative;
        background: linear-gradient(90deg, #FF2D36, #FF7857);
        border-radius: 27px;
        font-size: 11px;
      }
    }
    .van-tabs__line{
      background-color: rgba(228, 181, 116, 0) !important;
    }
    .TabControl_body_tab_content{
      text-align: center;
      .box_title{
        text-align: left;
        font-size: 14px;
        color: #fff;
        border-left: 3px solid red;
        margin: 0 5px;
        text-indent: 8px;
      }
      .odds{
        color: #FFAA00;
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
          transform: rotate(-90deg);
          color: #DB6372;
          top: 4px;
        }
      }
      .TabControl_box{
        border-radius: 5px;
        display: inline-block;
        font-size: 11px;
        margin: 0 2px 5px;
        text-align: center;
        min-width: 100px;
        .title{
          font-weight: bold;
          padding: 5px 0px;
        }
        .separate{
          line-height: 20px;
          border-radius: 5px;
          padding: 5px 0;
          font-size: 12px;
          span{
            display: inline-block;
          }
          .span1{
            color: #828282;
            padding-right: 10px;
          }
          .span2{
            padding-left: 10px;
          }
        }
      }
      .doubleresult{
        width: 60vw;
      }
      .betArr_3{
        width: 32%;
      }
      .betArr_2{
        width: 48%;
      }
      .betSwipe {
        width: 200%;
        /*float: left;*/
        /*overflow-y: hidden;*/
        /*overflow-x: auto;*/
        /*white-space: nowrap;*/
      }
    }
  }
</style>
