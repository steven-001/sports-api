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
                          <span class="odds" :class="{span2:m.displayValue!=''}">{{ m.selectionPrice }}</span>
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
        tabControlData:{
          home:'多特蒙德',
          guest:'沙赫坤度若',
          data:[
            {
              text:'让球&大小',data:[
                {
                  typeName:'让球',type:'2',betPptions:[
                    {name:'多特蒙德',Fraction:[
                        {Fraction:'+0.5/1', odds:1.97,},
                        {Fraction:'+1', odds:1.71,},
                        {Fraction:'+1', odds:1.73,},
                      ],
                    },
                    {name:'沙赫坤度若',Fraction:[
                        {Fraction:'+1', odds:1.97,},
                        {Fraction:'+0.5/1', odds:1.71,},
                        {Fraction:'+1', odds:1.73,},
                      ],
                    },
                  ]
                },
              ],
            },
            {
              text:'半/全场',data:[

              ],
            },
            {
              text:'独赢',data:[
                {
                  typeName:'独赢',type:'1',betPptions:[
                    {name:'多特蒙德', odds:3.80},
                    {name:'和', odds:4.30},
                    {name:'沙赫坤度若', odds:1.65}
                  ]
                },
                {
                  typeName:'独赢-上半场',type:'1',betPptions:[
                    {name:'多特蒙德', odds:3.20},
                    {name:'和', odds:4.10},
                    {name:'沙赫坤度若', odds:2.10}
                  ]
                },
              ],
            },
            {
              text:'波胆',data:[

              ],
            },
          ],
        },
      }
    },
    computed:{
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
    mounted() {

    },
    methods: {
      showSubmit(obj){
        let data={
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
          padding: 5px 10px;
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
