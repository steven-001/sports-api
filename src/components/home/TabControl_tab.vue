<template>
      <div class="TabControl_body_tab">
        <van-tabs v-model="active" animated>
          <van-tab>
            <template #title>所有盘口</template>
            <div class="TabControl_body_tab_content" v-for="(k,i) in sessionsData" :key="i">
              <div v-for="(n,j) in k.list" :key="j">
                <div class="box_title">
                  {{ jointList[i] }} {{ locale==2?n.text:n.betType }}
                </div>
                <div style="width: 100%;overflow: auto">
                  <div :class="{betSwipe:n.showType==2}">
                    <div v-for="(m,x) in n.data" :key="x" class="TabControl_box">
                      <div class="title">
                        <span>{{ m.selectionName }}</span>
                      </div>
                      <div class="separate" @click="showSubmit(m,n.betType)">
                        <span :class="{span1:m.displayValue!=''}">{{ m.displayValue }}</span>
                        <span class="odds" :class="{span2:m.displayValue!=''}">{{ m.selectionPrice }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                  <!--多个-->
                <!--<div v-for="(m,x) in n.data" :key="x" class="box2">-->
                  <!--<div class="TabControl_box">-->
                    <!--<span>{{ m.selectionName }}</span>-->
                  <!--</div><div class="TabControl_box separate" @click="showSubmit(m,n.betType)">-->
                    <!--<span>{{ m.displayValue }}</span><span class="odds">{{ m.selectionPrice }}</span>-->
                  <!--</div>-->
                <!--</div>-->
                <!--&lt;!&ndash;三个&ndash;&gt;-->
                <!--<div class="TabControl_box" v-for="(m,x) in n.betPptions" :key="x" v-if="n.type==1" @click="showSubmit(m,m.name,n.typeName)">-->
                  <!--<span>{{ m.name }}</span>-->
                  <!--<span class="odds">{{ m.odds }}</span>-->
                <!--</div>-->
              </div>
            </div>
          </van-tab>
          <van-tab v-for="(k,i) in tabControlData.data" :key="i">
            <template #title>{{ k.text }}</template>
            <div class="TabControl_body_tab_content"></div>
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
          {text:'所有盘口',type:0,},
          {text:'让球',type:1,},
          {text:'波胆',type:2,},
          {text:'角球',type:3,},
          {text:'黄红牌',type:4,},
          {text:'特殊投注',type:5,},
          {text:'半场',type:6,},
          {text:'节',type:7,},
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
      ...mapGetters(['sessionsData']),
    },
    mounted() {

    },
    methods: {
      showSubmit(obj,typeName){
        let data={
          home:this.tabControlData.home,
          guest:this.tabControlData.guest,
          name:selectionName,
          odds:obj.selectionPrice,
          Fraction:obj.displayValue||'',
          typeName:betType,
        }
        this.$emit('showSubmit',data)
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
      .box_title{
        font-size: 14px;
        color: #fff;
        border-left: 3px solid red;
        margin: 5px;
        text-indent: 8px;
        margin-bottom: 0;
      }
      .odds{
        color: #FFAA00;
      }
      .TabControl_box{
        display: inline-block;
        font-size: 11px;
        margin: 0 5px;
        text-align: center;
        min-width: 100px;
        .title{
          padding: 5px 10px;
        }
        .separate{
          line-height: 20px;
          border-radius: 5px;
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
