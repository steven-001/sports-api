<template>
  <van-popup v-model="submitBetShow"
             class="submitBet" closeable
             overlay-class="TabControl_overlay"
             :style="'height: 100vw ;width:70%'" >
    <div class="submitBet_body">
      <div class="submitBet_body_title">
        <span>//</span>
        <b>葡萄牙超级联赛</b>
        <span>//</span>
      </div>
      <div class="submitBet_body_name">
        <span>{{ betData.home }}</span>
        <b>VS</b>
        <span>{{ betData.guest }}</span>
      </div>
      <div class="submitBet_body_content">
        <div>{{ betData.name }}{{ betData.Fraction }}@<b>{{ betData.odds }}</b></div>
        <div>{{ betData.typeName }}</div>
      </div>
      <div class="submitBet_body_input">
        <van-row type="flex" justify="space-between" align="center" class="submitBet_body_input_top">
          <div>余额：<b>{{ $store.state.money }}</b></div>
          <div>下注限额：<b>{{ quota }}</b></div>
        </van-row>
        <van-field v-model="num" :placeholder="`下注最低限额：${quota}元`" type="number">
          <template #button>元</template>
        </van-field>
        <div class="submitBet_body_input_num">
          <div v-for="(k,i) in numList" :key="i" class="numBox" @click="num=k">{{ k }}</div>
          <div class="numBox" @click="num=$store.state.money">最大</div>
        </div>
        <div>
          可赢金额：<b>￥{{ (betData.odds*num).toFixed(2) }}元</b>
        </div>
      </div>
      <div class="submitBet_body_bottom">
        <van-slider v-model="drag" @change="onChange" @drag-end="onDrag"
                    inactive-color="#DCCAB8"
                    active-color="#DCCAB8"
                    bar-height="1.25rem">
          <template #button>
            <img class="slider_img" src="../../assets/live/sdfds.png"/>
          </template>
        </van-slider>
        <div class="submitBet_body_bottom_text">向右滑动投注</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
  export default {
    data() {
      return {
        drag:20,
        submitBetShow:false,
        betData:{},
        num:null,
        quota:100,
        numList:[100,500,1000,2000,5000],
      }
    },
    mounted() {

    },
    methods: {
      onChange(val){
        if(val>80){
          setTimeout(()=>{
            this.drag=20
          },300)
        }else {
          this.drag=20
        }
      },
      onDrag(){
        if(this.drag>=80){
          if(!this.num||this.num<=0){
            this.$toast('请输入正确的金额！');
            return
          }else {
            this.$toast.success('投注成功！');
            setTimeout(()=>{
              this.submitBetShow=false
              this.$parent.submitSucceed({betData:this.betData,num:this.num});
            },300)
          }
        }
      },
      onInitialize(data){
        this.num=null
        this.drag=20
        this.betData=data
        this.submitBetShow=true
      },
    }
  }
</script>

<style lang="scss">
  .submitBet{
    background-color: rgba(255, 255, 255, 0.71) !important;
    border-radius: 10px;
    overflow: hidden;
    .van-popup__close-icon{
      color: black;
      font-weight: bold;
      top:5px;
      right: 5px;
    }
    .submitBet_body{
      color: #414554;
      text-align: center;
      .submitBet_body_title{
        padding-top: 20px;
        height: 20px;
        font-size: 13px;
        span{
          color: #FFAA00;
        }
      }
      .submitBet_body_name{
        line-height: 35px;
        font-size: 12px;
        b{
          display: inline-block;
          width: 50px;
        }
      }
      .submitBet_body_content{
        font-size: 13.5px;
        margin: 0 10px;
        height: 60px;
        padding: 8px;
        background-color: rgba(255, 255, 255, 0.62);
        border-radius: 5px;
      }
      .submitBet_body_input{
        padding: 0 10px;
        font-size: 12px;
        .submitBet_body_input_top{
          height: 30px;
          div:first-child b{
            color: #FFAA00;
          }
          div:last-child b{
            color: #FF4232;
          }
        }
        .van-cell{
          border-radius: 5px;
          padding: 0px 10px;
          background-color: white !important;
          .van-field__control{
            color: #959DB2 !important;
          }
        }
        .submitBet_body_input_num{
          .numBox{
            margin-right: 2%;
            width: 32%;
            float: left;
            background-color: white;
            line-height: 35px;
            border-radius: 5px;
            margin-top: 5px;
          }
          .numBox:active{
            background-color: #7c7c7c;
          }
          .numBox:nth-child(3n+0){
            margin-right:0;
          }
        }
        b:last-child{
          color: #FF4232;
        }
        div:last-child{
          line-height: 35px;
        }
      }
      .submitBet_body_bottom{
        position: relative;
        .van-slider{
          border-radius: 0;
        }
        .slider_img{
          height: 1.25rem;
        }
        .van-slider__button-wrapper{
          height: 1.25rem;
        }
        .submitBet_body_bottom_text{
          position: absolute;
          top: 0px;
          left: calc(50% - 40px);
          width: 80px;
          font-size: 13px;
          line-height: 1.25rem;
          color: #FFFFFF;
        }
      }
    }
  }
</style>
