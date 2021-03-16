<template>
  <div class="player">
    <div class="player-box" v-if="device==1">
      <div id="wasmPlayer"></div>
    </div>
    <div v-if="device==2" class="video_box">
      <video id="play-video"
             loop="loop"
             muted
             webkit-playsinline='true'
             playsinline='true'
             src="https://jinlong-prd.oss-accelerate.aliyuncs.com/rmb/jinlong/mp4_cs2.mp4">
      </video>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        input: 'https://jinlong-prd.oss-accelerate.aliyuncs.com/rmb/jinlong/live_cs.flv',      //地址栏
        player: '',      //播放器对象
        device:null,//1 安卓 2 ios
      }
    },
    created(){
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //如果输出结果是true就判定是android终端或者uc浏览器
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //根据输出结果true或者false来判断ios终端
      //!!双叹号一般用来将后面的表达式转换为布尔型的数据（boolean）
      if(isAndroid){
        this.device=2
      }else if(isiOS){
        this.device=2
      }
    },
    mounted() {
      if(this.device==1){
        this.isAnzhuo()
      }else if(this.device==2){
        this.playVideo()
      }
    },
    methods: {
      //安卓
      isAnzhuo(){
        //实例化播放器
        this.player = new WasmPlayer(null, 'wasmPlayer', this.callbackfun,{
          Height:true,
        });
        if(!this.input){
          console.log('请输入接口地址！');
        }else{
          this.player.play(this.input,1);
          setInterval(()=>{
            // this.player.play(this.input,1);
          },5000)
        }
      },
      //ios
      playVideo(){
        var vdo = document.getElementById("play-video");
        vdo.play();
      },
      openAideo(){
        this.player.openAudio()
      },
      onshow(){
        var player = new SVGA.Player("#demoCanvas");
        var parser = new SVGA.Parser("#demoCanvas");
        parser.load("https://jinlong-prd.oss-accelerate.aliyuncs.com/rmb/jinlong/donghua-2_0.svga", function(videoItem) {
          player.loops = 2;
          player.setVideoItem(videoItem);
          player.startAnimation();
        });
      },
      //回调函数
      callbackfun(e) {
        console.log(e);
      },
    }
  }
</script>

<style lang="scss">
  .player{
    overflow-y: hidden;
    width: 100vw;
    height: 100vh;
  }
  .video_box{
    width: 100vw;
    height: 100vh;
    background-color: black;
    position: relative;
    #play-video{
      width: 100%;
      height: 100%;
      z-index: -999;
    }
  }
  .player-box{
    position: absolute;
    z-index: -1;
    height: 100vh;
    width: 100vw;
  }
</style>
