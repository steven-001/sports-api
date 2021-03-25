<template>
    <div class="sport-anchor-item">
      <van-row type="flex" justify="space-between" align="center" class="sport-anchor">
        <div class="sport-left">
          <div class="sport-name">{{record.sportName}}</div>
          <div class="sport-team">
            <img src="../../assets/首页/新建文件夹/安全盾牌@2x.png"/>
            <span>{{record.teama_name}}</span>
          </div>
          <div class="sport-team">
            <img src="../../assets/首页/新建文件夹/安全盾牌 拷贝@2x.png"/>
            <span>{{record.teamb_name}}</span>
          </div>
          <div class="sport-bottom">
            <img src="../../assets/首页/新建文件夹/Icon - 直播中@2x.png"/>{{$t("直播中")}}
          </div>
        </div>
        <div class="anchor-info">
          <img src="../../assets/live/anchor/image1.png"/>
          <div class="anchor-name">{{$t(record.anchorName)}}</div>
        </div>
      </van-row>
    </div>
</template>
<script>
  export default{
    data(){return{}},
    props:["record"],
    methods:{}
  }
</script>
<style scoped lang="scss">
  .sport-anchor-item{
    margin:10px 5px;
    border:1px solid #ccc;
    border-radius: 8px;
    background: white;
    padding: 8px;
    .sport-left{
      position: relative;
      .sport-name{
        margin-bottom: 20px;
      }
    }
    .sport-bottom{
      margin-top: 20px;
      color: #847e7e;
      display: flex;
      align-items: center;
      img{
        width: 25px;
        margin-right: 10px;
      }
    }
    .sport-team{
      margin: 10px 0px 10px 0px;
      display: flex;
      align-items: center;
      img{
        width: 20px;
        margin-right: 10px;
      }
    }
    .anchor-info{
      position: relative;
      img{
        height: 140px;
        width: 100px;
      }
      .anchor-name{
        background: #0000008f;
        color: white;
        position: absolute;
        bottom: 0px;
        width: 100%;
        text-align: center;
        line-height: 30px;
        height: 30px;
      }
    }
  }
</style>
