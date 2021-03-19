<template>
  <div class="chat">
    <div class="chat_top">
      <van-row type="flex" class="chat_top_box" v-for="(k,i) in liwuList" :key="i">
        <img class="face" :src="require(`@/assets/live/faceID${k.userId}.png`)"/>
        <div class="chat_top_box_text">
          <div class="chat_top_box_text_n">{{ k.username }}</div>
          <div class="chat_top_box_text_l">送出 {{ k.name }}</div>
        </div>
        <img class="min_liwu" :src="k.img"/>
        <div class="chat_top_box_num">
          <i>X {{ k.num }}</i>
        </div>
      </van-row>
    </div>
    <div class="chat_bottom">
      <div class="chat_bottom_box" v-for="(k,i) in textList" :key="i">
        <div style="float: left">
          <div class="icon icon0" v-if="k.type==0">{{ k.title }}</div>
          <div class="icon icon1" v-else-if="k.type==1">{{ k.title }}</div>
          <div class="icon icon2" v-else-if="k.type==2">{{ k.title }}</div>
          <div class="icon icon3" v-else-if="k.type==3">{{ k.title }}</div>
        </div>
        <div class="chat_bottom_box_text">
          <span class="zj" v-if="k.type==3">恭喜</span>
          <img v-if="k.vip" src="../../assets/live/V1.png"/>
          <span class="name">{{ k.username }}<span v-if="k.type==1">：</span></span>
          <span :class="{zj:k.type==3}">{{ k.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        textList:[
          {text:'来了',type:0,title:'公告',username:'熊猫',vip:1},
          {text:'来了',type:0,title:'公告',username:'大白兔'},
          {text:'在独赢下注了100元',type:2,title:'系统',username:'美女'},
          {text:'赢得了1000元',type:3,title:'中奖',username:'大白兔'},
          {text:'哈哈哈哈哈..',type:1,title:'消息',username:'大白兔'},
          {text:'已退出直播间',type:0,title:'公告',username:'美女'},
        ],
        userData:{
          username:'熊猫',
          userId:100,
          vip:1,
        },
        liwuList:[
          {type:0,name:'金币',img:require('@/assets/live/liwu/mini1.png'),username:'大白兔',userId:120,num:1},
          {type:0,name:'玫瑰花',img:require('@/assets/live/liwu/jinbi.png'),username:'美女',userId:110,num:1},
        ],
      }
    },
    mounted() {
      this.onAnimation()
      this.onRoll('.chat_bottom')
    },
    methods: {
      //送礼物
      sendGifts(data){
        let arr = data.data.filter(k=>{ return k.id==data.liwuId})
        let sendout = this.liwuList.filter(k=>{ return this.userData.userId==k.userId})
        if(sendout[0]){
          this.liwuList.map(k=>{
            if(this.userData.userId==k.userId){
              this.onAnimation()
              k.num++
            }
          })
        }else {
          let obj={
            type:arr[0].id,
            name:arr[0].name,
            img:require('@/assets/live/liwu/mini'+arr[0].id+'.png'),
            username:this.userData.username,
            userId:this.userData.userId,
            num:1,
          }
          this.liwuList.push(obj)
          this.onRoll('.chat_top')
          setTimeout(()=>{
            this.onAnimation()
          },100)
        }
      },
      //发送消息
      addText(e){
        let obj={
          text:e,
          type:1,title:'消息',
          username:this.userData.username,
          vip:1,
        }
        this.textList.push(obj)
        this.onRoll('.chat_bottom')
      },
      //投注信息
      betText(data){
        console.log('投注成功----',data)
        let obj={
          text:'在'+data.betData.typeName+'下注了'+data.num+'元',
          type:2,
          title:'系统',
          username:this.userData.username,
          vip:1,
        }
        this.textList.push(obj)
        this.onRoll('.chat_bottom')
      },
      onAnimation(){
        let $i = $($('i')[this.liwuList.length-1])
        $i.animate({fontSize:'0.2rem'},100);
        $i.animate({fontSize:'0.5rem'},100);
      },
      onRoll(obj){
        setTimeout(()=>{
          let $div = $(obj)[0]
          let i=$($div).scrollTop()
          let $height = $div.scrollHeight-$($div).height()
          if($height>0){
            let time = setInterval(()=>{
              i+=1
              $($div).scrollTop(i)
              if(i>=$height){
                clearInterval(time)
              }
            },0.5)
          }
        },100)
      },
    }
  }
</script>

<style lang="scss">
  .chat ::-webkit-scrollbar {display: none;}
  .chat{
    position: relative;
    left: -8%;
    top: 0vw;
    transform: scale(0.8);
    height: 100%;
    padding: 0 10px;
    width: 70%;
    .face{
      height: 40px;
    }
    .chat_top{
      position: relative;
      left: -6%;
      transform: scale(0.85);
      overflow-y: auto;
      height: 92px;
      margin-bottom: 5px;
      .chat_top_box{
        width: 65%;
        border-radius: 50px;
        background-color: rgba(0, 0, 0, 0.47);
        margin: 8px 0;
        .chat_top_box_text{
          margin: 0 5px;
          padding: 2px 0;
          .chat_top_box_text_n{
            color: #fff;
            font-size: 15px;
          }
          .chat_top_box_text_l{
            color: #FFC731;
            font-size: 11px;
          }
        }
        .min_liwu{
          height: 26px;
          margin: 7px 0;
        }
        .chat_top_box_num{
          position: relative;
          i{
            width: 80px;
            position: absolute;
            left: 5px;
            display: inline-block;
            line-height: 35px;
            font-weight: bold;
            color: red;
            font-size: 0.5rem;
          }
        }
      }
      .chat_top_box:last-child{
        margin-bottom: 0px;
      }
    }
    .chat_bottom{
      overflow-y: auto;
      height: calc(100% - 50px);
      line-height: 13px;
      .chat_bottom_box{
        display: inline-block;
        padding: 3px;
        max-height: 40px;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.47);
        margin-bottom: 3px;
        .chat_bottom_box_text{
          word-break:break-all;
          min-width: 200px;
          max-width: 100%;
          color: #fff;
          font-size: 11px;
          .name{
            color: #93E9FF;
          }
          img{
            height: 10px;
            margin-top: 3px;
          }
          .zj{
            color: #FFC731;
          }
        }
        .icon{
          margin-right: 3px;
          text-align: center;
          color: white;
          font-size: 11px;
          width: 35px;
          line-height: 18px;
          background-size: 100% 100% !important;
        }
        .icon0{
          background: url("../../assets/live/xx.png");
        }
        .icon1{
          background: url("../../assets/live/gg.png");
        }
        .icon2{
          background: url("../../assets/live/xt.png");
        }
        .icon3{
          background: url("../../assets/live/zj.png");
        }
      }
    }
  }
</style>
