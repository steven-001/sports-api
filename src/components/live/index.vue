<template>
  <div class="live">
    <!--SVGA动画-->
    <div id="demoCanvas" class="svga" ref="canvas" v-show="canvasShow"></div>
    <div class="top_body">
      <van-row type="flex" justify="space-between" align="center" class="live_top">
        <van-row type="flex" align="center" class="live_top_left">
          <img class="face" src="@/assets/live/anchor/mini1.png"/>
          <div class="live_top_left_title">
            <div class="live_top_left_title_name">菲菲</div>
            <div class="live_top_left_title_zan">5062</div>
          </div>
        </van-row>
        <van-row type="flex" justify="space-between" class="live_top_centre" align="center" @click="top_body_show=true">
          <div>多特蒙德 VS 亚特兰大联</div>
          <img src="@/assets/live/xia.png"  class="live_top_centre_img"/>
        </van-row>
        <div class="live_top_right" @click="onExit()">
          <img src="@/assets/live/exit.png"/>
        </div>
      </van-row>
      <div class="live_top_tab">
        <img src="@/assets/live/tab.png" @click="tabShow=true"/>
      </div>
    </div>
    <player_box/>
    <!--聊天窗口-->
    <div class="chat_body">
      <transition name="van-slide-left">
        <div class="chat_body_top" v-show="infoShow">
          <!--聊天窗口 上面部份-->
          <Chat ref="Chat"/>
        </div>
      </transition>
      <div class="chat_body_bottom">
        <van-row type="flex" class="chat_body_bottom_box1">
          <img src="@/assets/live/info.png" @click="infoShow=!infoShow"/>
          <img src="@/assets/live/wifi.png" @click="onLine"/>
          <img src="@/assets/live/volume.png" @click="onVolume"/>
        </van-row>
        <van-row type="flex" class="chat_body_bottom_box2" align="center">
          <img src="@/assets/live/shenying.png" class="shenying"/>
          <div class="chat_body_bottom_box2_input">
            <van-field v-model="text" maxlength="25"
                       @keyup.enter="submit" placeholder="聊点什么...">
              <template #button>
                <img src="@/assets/live/meme.png" @click="liwuShow=true;navId=2"/>
              </template>
            </van-field>
          </div>
          <div class="chat_body_bottom_box2_button">
            <img src="@/assets/live/liwu.png" @click="liwuShow=true;navId=1"/>
            <img src="@/assets/live/bet.png" @click="onShowBetTab"/>
          </div>
        </van-row>
      </div>
    </div>
    <!--切换直播弹出层-->
    <van-popup v-model="tabShow" position="right"
               class="tabShow"
               :style="{ height: '100%' ,width:'35%'}" >
      <div class="tabShow_body">
        <div class="tabShow_body_anchor" v-for="(k,i) in tabList" :key="i">
          <img :src="k.img" :class="{tabImg:tabId==k.id}"/>
        </div>
      </div>
    </van-popup>
    <!--送礼物弹出层-->
    <van-popup v-model="liwuShow" position="bottom"
               class="liwuShow" duration="0.1"
               :style="{ height: '90vw' ,width:'100%'}" >
      <div class="liwuShow_body">
        <van-row type="flex" class="liwuShow_body_nav"  align="center">
          <div :class="{nav:navId==1}" @click="navId=1">礼物</div>
          <div :class="{nav:navId==2}" @click="navId=2">表情</div>
        </van-row>
        <transition name="van-slide-left">
          <div class="liwuShow_body_liwu" v-if="navId==1">
            <div v-for="(k,i) in liwuList":key="i" class="liwuShow_body_liwu_box" :class="{at:k.id==liwuId}">
              <img :src="k.img" @click="liwuId=k.id"/>
              <div class="liwuShow_body_liwu_box_min">
                <div class="liwuShow_body_liwu_box_min_name">{{ k.name }}</div>
                <div class="liwuShow_body_liwu_box_min_num">{{ k.num }}金币</div>
              </div>
            </div>
          </div>
        </transition>
        <div class="liwuShow_body_liwu" v-if="navId==2">

        </div>
        <div class="liwuShow_body_bottom" v-if="navId==1">
          <van-row class="liwuShow_body_bottom_left" type="flex" align="center">
            <img class="jinbi" src="@/assets/live/liwu/jinbi.png" @click=""/>
            <div class="num">{{ $store.state.money }}</div>
            <!--<div class="chongzhi">-->
            <!--充值>-->
            <!--</div>-->
          </van-row>
          <div class="liwuShow_body_bottom_right">
            <div @click="onshow({data:liwuList,liwuId:liwuId})">赠送</div>
          </div>
        </div>
      </div>
    </van-popup>
    <!--投注选项卡-->
    <TabControl ref="TabControl" />
    <submitBet ref="submitBet"/>
  </div>
</template>

<script>
  import SVGA from "svgaplayerweb";
  import player_box from "./player_box";
  import Chat from "./chat";
  import TabControl from "./TabControl";
  import submitBet from "./submitBet";
  export default {
    components: { player_box,Chat,TabControl,submitBet },
    data() {
      return {
        teamData:[
          {homeName:'多特蒙德',awayName:'亚特兰大联',score:'0-2',time:'上半场 20:10'},
          {homeName:'多特蒙德',awayName:'亚特兰大联',score:'0-2',time:'上半场 02:07'},
          {homeName:'多特蒙德',awayName:'亚特兰大联',score:'0-2',time:'下半场 10:10'},
        ],
        navId:1,
        liwuId:1,
        liwuList:[
          {id:1,name:'玫瑰花',img:require('../../assets/live/liwu/1.png'),num:1},
          {id:2,name:'比心',img:require('../../assets/live/liwu/2.png'),num:10},
          {id:3,name:'棒棒糖',img:require('../../assets/live/liwu/3.png'),num:10},
          {id:4,name:'煎蛋',img:require('../../assets/live/liwu/4.png'),num:10},
          {id:5,name:'红包',img:require('../../assets/live/liwu/5.png'),num:99},
          {id:6,name:'美金',img:require('../../assets/live/liwu/6.png'),num:200},
          {id:7,name:'跑车',img:require('../../assets/live/liwu/7.png'),num:999},
          {id:8,name:'超级火箭',img:require('../../assets/live/liwu/8.png'),num:1680},
        ],
        text:'',
        canvasShow:false,
        infoShow:true,
        tabShow:false,
        liwuShow:false,
        tabId:0,
        tabList:[
          {id:0,name:'菲菲',img:require('../../assets/live/anchor/image1.png')},
          {id:1,name:'Anna',img:require('../../assets/live/anchor/image2.png')},
        ],
      }
    },
    mounted() {
      document.addEventListener('touchstart', function() {

      }, false);
    },
    methods: {
      onshow(data){
        this.liwuShow=false
        if(data.liwuId==1){
          this.$refs.Chat.sendGifts(data);
        }else {
          this.canvasShow=true
          var player = new SVGA.Player("#demoCanvas");
          var parser = new SVGA.Parser("#demoCanvas");
          parser.load("https://jinlong-prd.oss-accelerate.aliyuncs.com/rmb/jinlong/donghua-2_0.svga", function(videoItem) {
            player.loops = 2;
            player.setVideoItem(videoItem);
            player.startAnimation();
          });
          //动画播放结束后
          player.onFinished(()=>{
            this.canvasShow=false
          })
        }
      },
      //投注成功
      submitSucceed(data){
        this.$refs.Chat.betText(data)
      },
      showSubmit(data){
        this.$refs.TabControl.betTabShow=false;
        this.$refs.submitBet.onInitialize(data)
      },
      onShowBetTab(){
        this.$refs.TabControl.betTabShow=true;
      },
      submit(){
        this.$refs.Chat.addText(this.text);
        this.text=''
      },
      onVolume(){
        this.$toast('设置音量');
      },
      onLine(){
        this.$toast.success('已选择最优线路');
      },
      onExit(){
        this.$toast.success('退出');
      },
    }
  }
</script>

<style lang="scss">
  .live{
    .van-overlay{
      background-color: rgba(0, 0, 0, 0);
    }
    /*底部 刷礼物 弹出层*/
    .liwuShow{
      border-top-right-radius: 15px;
      border-top-left-radius: 15px;
      background-color: rgba(255, 255, 255, 0.9) !important;
      .liwuShow_body{
        font-size: 15px;
        .liwuShow_body_nav{
          color: #323332;
          height: 40px;
          padding: 0 10px;
          border-bottom: 2.5px solid #E7E7E7;
          div{
            font-weight: bold;
            padding: 0 15px;
          }
          .nav{
            color: #4F82F4;
          }
        }
        .liwuShow_body_liwu{
          width: 96%;
          margin: 0 auto;
          .liwuShow_body_liwu_box{
            position: relative;
            display: inline-block;
            width: 23%;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0);
            margin: 10px calc(1% - 1px);
            img{
              width: 100%;
            }
          }
          .at{
            border: 1px solid #4F82F4;
          }
          .liwuShow_body_liwu_box_min{
            width: 100%;
            font-size: 11px;
            text-align: center;
            position: absolute;
            bottom: 5px;
            .liwuShow_body_liwu_box_min_name{
              font-size: 13px;
              color: #323332;
            }
            .liwuShow_body_liwu_box_min_num{
              color: #b2b2b2;
            }
          }
        }
        .liwuShow_body_bottom{
          width: 100%;
          color: #323332;
          height: 50px;
          border-top: 2.5px solid #E7E7E7;
          display: flex;
          .liwuShow_body_bottom_left{
            height: 100%;
            width: 75%;
            padding: 0 10px;
            font-size: 13px;
            .jinbi{
              height: 25px;
            }
            .num{
              font-weight: bold;
              margin: 0 10px;
            }
            .chongzhi{
              color: #0570db;
              font-size: 14.5px;
            }
          }
          .liwuShow_body_bottom_right{
            width: 25%;
            height: 100%;
            div{
              width: 80px;
              text-align: center;
              background-color: #0570db;
              line-height: 36px;
              margin: 7px 0;
              color: white;
              border-radius: 30px;
            }
          }
        }
      }
    }
    /*右边Tab 切换主播 弹出层*/
    .tabShow{
      background-color: rgba(0, 0, 0, 0.3) !important;
      .tabShow_body{
        text-align: center;
        .tabShow_body_anchor{
          margin: 8px 0;
          img{
            border: 2px rgba(255, 255, 255, 0) solid;
            border-radius: 10px;
          }
          .tabImg{
            border: 2px goldenrod solid;
            border-radius: 10px;
          }
        }
      }
    }
    /*聊天 窗口*/
    .chat_body{
      position: absolute;
      bottom: 0px;
      height: 50vh;
      width: 100%;
      z-index: 2;
      .chat_body_top{
        height: 75%;
      }
      .chat_body_bottom{
        width: 100%;
        position: absolute;
        bottom: 0px;
        .chat_body_bottom_box1{
          padding: 5px;
          height: 25px;
          img{
            margin-right: 10px;
            height: 100%;
          }
        }
        .chat_body_bottom_box2{
          padding: 0 10px;
          .shenying{
            height: 25px;
            margin-right: 5px;
          }
          .chat_body_bottom_box2_input{
            width: 60%;
            #placeholder{
              font-size: 11px;
            }
            .van-cell{
              border-radius: 50px;
              padding: 0px 10px;
              background-color: rgba(255, 255, 255, 0.45) !important;
              .van-field__control::placeholder{
                color: #ECEBEE !important;
              }
              .van-field__control{
                color: white !important;
              }
              .van-field__button{
                img{
                  margin-top: 5px;
                  position: relative;
                  left: 5px;
                  height: 15px;
                }
              }
            }
          }
          .chat_body_bottom_box2_button{
            width: 40%;
            text-align: right;
            img{
              position: relative;
              top: 3px;
              height: 25px;
            }
          }
        }
      }
    }
    .top_body{
      position: absolute;
      z-index: 2;
      width: 100%;
      .live_top_tab{
        text-align: right;
        img{
          height: 32px;
          margin: 0 10px;
        }
      }
      .live_top{
        padding: 0 10px;
        height: 50px;
        font-size: 13px;
        /*background-color: rgba(0, 0, 0, 0.5);*/
        color: white;
        /*background-color: #0570db;*/
        .live_top_left{
          font-size: 11px;
          width: 26%;
          height: 40px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 50px;
          .face{
            height: 35px;
          }
          .live_top_left_title{
            padding: 3px;
            .live_top_left_title_name{

            }
            .live_top_left_title_zan{
              font-size: 11px;
              color: rgba(235, 235, 235, 0.7);
            }
          }
        }
        .live_top_centre{
          padding: 0 10px;
          width: 46%;
          height: 35px;
          border-radius: 50px;
          border:1px solid rgba(255, 255, 255, 0.51);
          .live_top_centre_img{
            height: 6px;
          }
        }
        .live_top_right{
          width: 20%;
          text-align: right;
          height: 32px;
          img{
            height: 32px;
          }
        }
      }
    }
    .svga {
      width: 100vw;
      height: 450px;
      position: absolute;
      top: 60px;
      z-index: 5;
      canvas{
        position: absolute;
        top: 0;
      }
    }
  }
</style>
