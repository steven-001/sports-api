<template>
  <div class="service">
    <!--消息弹出层-->
    <van-nav-bar :title="$t('service[\'客服\']')" :fixed="false">
      <van-icon :name="require('../../assets/首页/info/back.png')" slot="left" @click="quit"/>
    </van-nav-bar>
    <van-tabs v-model="active" animated swipeable>
      <van-tab :title="$t('service[\'在线客服\']')" v-if="zxService.contactTheWay!=''" name="0">
        <div v-if="active==0">
          <div class="scroll-wrapper">
            <iframe id="mainiframe" :src="zxService.contactTheWay" frameborder="0" scrolling="auto"></iframe>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('service[\'微信客服\']')" v-if="wxService.length>0" name="1">
        <div style="padding: 0.5rem 0 1rem" v-if="active==1">
          <van-grid :gutter="30" :column-num="2">
            <van-grid-item
              v-for="(k,i) in wxService"
              :key="i">
              <van-image :src="k.imgUrl" />
              <div class="name" >{{ k.name }}</div>
              <div class="name" >{{ k.contactTheWay }}</div>
              <van-button round block @click="handleCopy(k.contactTheWay,$event)">{{ $t('service[\'点击复制\']') }}</van-button>
            </van-grid-item>
          </van-grid>
        </div>
      </van-tab>
      <van-tab :title="$t('service[\'QQ客服\']')" v-if="qqService.length>0" name="2">
        <div style="padding: 0.5rem 0 1rem" v-if="active==2">
          <van-grid :gutter="30" :column-num="2">
            <van-grid-item
              v-for="(k,i) in qqService"
              :key="i">
              <van-image :src="k.imgUrl" />
              <div class="name" >{{ k.name }}</div>
              <div class="name" >{{ k.contactTheWay }}</div>
              <van-button round block @click="handleCopy(k.contactTheWay,$event)">{{ $t('service[\'点击复制\']') }}</van-button>
            </van-grid-item>
          </van-grid>
        </div>
      </van-tab>
      <van-tab title="Telegram" v-if="tgService.length>0" name="3">
        <div style="padding: 0.5rem 0 1rem" v-if="active==3">
          <van-grid :gutter="30" :column-num="2">
            <van-grid-item
              v-for="(k,i) in tgService"
              :key="i">
              <van-image :src="k.imgUrl" />
              <div class="name" >{{ k.name }}</div>
              <div class="name" >{{ k.contactTheWay }}</div>
              <van-button round block @click="handleCopy(k.contactTheWay,$event)">{{ $t('service[\'点击复制\']') }}</van-button>
            </van-grid-item>
          </van-grid>
        </div>
      </van-tab>
      <van-tab title="Facebook" v-if="fbService.length>0" name="4">
        <div style="padding: 0.5rem 0 1rem" v-if="active==4">
          <van-grid :gutter="30" :column-num="2">
            <van-grid-item
              v-for="(k,i) in fbService"
              :key="i">
              <van-image :src="k.imgUrl" />
              <div class="name" >{{ k.name }}</div>
              <div class="name" >{{ k.contactTheWay }}</div>
              <van-button round block @click="handleCopy(k.contactTheWay,$event)">{{ $t('service[\'点击复制\']') }}</van-button>
            </van-grid-item>
          </van-grid>
        </div>
      </van-tab>
      <van-tab :title="$t('service[\'常见问题\']')" name="5">
        <div style="padding-bottom: 1rem" v-if="active==5">
          <div v-for="(k,i) in problemConfigVOList" :key="i">
            <div class="issue">{{ $t('service[\'问题\']') }}{{ i+1 }}：{{ k.question }}</div>
            <div class="answer">{{ $t('service[\'答\']') }}：{{ k.answer }}</div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import clip from '../../util/clipboard.js' // use clipboard directly
  export default {
    data() {
      return {
        active:'0',
        zxService:{contactTheWay:''},
        wxService:[],
        qqService:[],
        fbService:[],
        tgService:[],
        problemConfigVOList:[],
      };
    },
    activated(){
       if(window.plus){
        plus.navigator.setStatusBarStyle("light");
        //强制竖屏
        plus.screen.lockOrientation('portrait');
        plus.navigator.setFullscreen(false);//显示状态栏
      }else{
        document.addEventListener('plusready',()=>{
          plus.navigator.setStatusBarStyle("light");
          //强制竖屏
          plus.screen.lockOrientation('portrait');
          plus.navigator.setFullscreen(false);//显示状态栏
        },false);
      }
    },
    mounted() {
      this.getServiceInfo()
    },
    methods: {
      handleCopy(text, event){//复制
        this.$toast(this.$t('service[\'复制成功\']')+'！');
        clip(text, event)
      },
      //获取客服信息
      getServiceInfo(){
        this.show=true
        this.$ajax.get('/agent/getCustomerServiceInfo?agentId='+this.$store.state.agentId
        ).then(res => {
          if(res.data){
            console.log(res.data)
            this.zxService={contactTheWay:''}
            this.wxService=[]
            this.qqService=[]
            this.fbService=[]
            this.tgService=[]
            if(res.data.serviceConfigVOList){
              for (let k of res.data.serviceConfigVOList){
                if(k.serviceType==1){
                  this.zxService.contactTheWay=k.contactTheWay
                }else if(k.serviceType==2){
                  this.wxService.push(k)
                }else if(k.serviceType==3){
                  this.qqService.push(k)
                }else if(k.serviceType==5){
                  this.fbService.push(k)
                }else if(k.serviceType==4){
                  this.tgService.push(k)
                }
              }
            }
            if(res.data.problemConfigVOList){
              this.problemConfigVOList=res.data.problemConfigVOList
            }
            if(this.zxService.contactTheWay!=''){
              this.active='0'
            }else if(this.wxService.length>0){
              this.active='1'
            }else if(this.qqService.length>0){
              this.active='2'
            }else if(this.fbService.length>0){
              this.active='3'
            }else if(this.tgService.length>0){
              this.active='4'
            }else {
              this.active='5'
            }
          }
        }).catch(error => {
          this.$toast.fail(error);
        })
      },
      //返回上一页
      quit(){
        if(this.$route.query.redirect){
          this.$router.push({path: this.$route.query.redirect})
        }else {
          this.$router.push({path: '/'})
        }
      },
    }
  };
</script>
<style lang="scss">
  .service{
    background-color: #000000;
    .scroll-wrapper {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      top: 0;
      -webkit-overflow-scrolling: touch;
      /*overflow-y: scroll;*/
      /*height: 600px;*/
      /*width: 100%;*/
    }
    .scroll-wrapper iframe {
      width: 100%;
      height: calc(80vh - 1.5rem)
    }
    .van-tabs__content{
      height: 79vh;
      overflow-y:auto;
    }
    .status_bar{
      height: 20px;
    }
    .van-tabs__content{
      .van-grid-item__content{
        background-color: #242424;
        color: #7E7C7C;
      }
      .issue{
        margin: 10px 20px 0px;
        font-size: 15px;
      }
      .answer{
        color: #979db0;
        margin: 2px 20px;
        font-size: 13px;
      }
      .van-grid-item__content--center{
        border-radius: 10px;
        padding: 8px 20px;
        .van-image__img{
          width: 60px !important;
          height: 60px !important;
          border-radius: 50%;
        }
        .van-grid-item__icon{
          font-size: 60px;
        }
        .name{
          font-size: 13px;
          line-height: 20px;
          width: 100px;
          text-align: center;
        }
        .title{
          font-size: 14px;
          margin-bottom: 5px;
        }
        .van-button{
          width: 100px;
          margin: 8px 0 5px;
          height: 28px;
          line-height: 28px;
          color: #5C3301;
          font-size: 13.5px;
          background: none;
          border: none;
          background: linear-gradient(90deg, #E3B473, #F5D89B);
          background-size: 100% 100%;
        }
      }
    }
    .van-tabs__nav{
      background: none;
      .van-tab--active{
        color: #D4BBA1;
      }
      .van-tab{
        font-size: 14.5px;
      }
      .van-tabs__line{
        background-color: #D4BBA1;
        width: 70px !important;
        height: 2px !important;
      }
    }
  }
</style>
