<template>
  <div class="sport-hot-item">
    <div class="item-main">
      <van-row type="flex" justify="space-between" align="center" class="sport-item-vs">
        <div class="sport-team-a">
          <span class="sport-team">
            <img src="../../assets/首页/新建文件夹/安全盾牌@2x.png"/>
            <div>{{record.teama_name}}</div>
          </span>
          <span class="score-span">{{record.teama_score}}</span>
        </div>
        <div class="sport-vs">VS</div>
        <div class="sport-team-b">
          <span class="score-span">{{record.teamb_score}}</span>
          <span class="sport-team">
            <img src="../../assets/首页/新建文件夹/安全盾牌 拷贝@2x.png"/>
            <div>{{record.teamb_name}}</div>
          </span>
        </div>
      </van-row>
      <div class="sport-item-toolbar">
        <div class="to-live-ctrl">{{$t("视频直播")}}</div>
        <div class="to-anchor-ctrl">{{$t("主播直播")}}</div>
      </div>
    </div>
    <div class="to-bet">{{$t("前往投注")}}</div>
    <div class="simple-bet">
      <div>{{record.betName}}</div>
      <div class="simple-bet-list">
        <span class="bet-item">主胜@4.05</span>
        <span class="bet-item">主胜@4.05</span>
        <span class="bet-item">主胜@4.05</span>
        <span class="bet-more">
          {{$t("看更多")}}
          <i class="fa fa-angle-down"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){return{}},
    props:["record"],
    methods:{}
  }
</script>
<style lang="scss" scoped>
  .sport-hot-item{
    margin: 8px;
    background: white;
    border-radius: 8px;
    position: relative;
    .sport-item-vs{
      height:120px;
    }
    .simple-bet{
      padding:25px 10px 15px 10px;
      .simple-bet-list{
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .bet-item{
          border: 1px solid #d60202;
          padding: 3px 3px;
          color: #d60202;
          border-radius: 3px;
        }
      }
    }
    .to-bet{
      position: absolute;
      top: 180px;
      width: 50%;
      background: red;
      height: 35px;
      left: 25%;
      color: white;
      border-radius: 4px;
      text-align: center;
      line-height: 35px;
    }
    .item-main{
      position: relative;
      background: url("../../assets/首页/bet/generalBet/bg.png") no-repeat;
      border-radius: 15px;
      height: 190px;
      color: white;
      padding-top: 10px;
      span{
        text-align: center;
      }
      .sport-team div{
        margin-top: 8px;
      }
      .sport-item-toolbar{
        width: 62%;
        display: flex;
        margin: 0px auto;
        background: #403c3c6a;
        border-radius: 18px;
        justify-content: center;
        padding: 10px 0px;
        font-size: 13px;
      }
      .to-live-ctrl{
        background-image: url("../../assets/首页/新建文件夹/组 26 拷贝@2x.png");
        background-repeat: no-repeat;
        background-size: contain;
        padding-left: 30px;
        border-right: 1px solid #a5a4a4;
        padding-right: 10px;
        margin-right: 10px;
      }
      .to-anchor-ctrl{
        background-image: url("../../assets/首页/新建文件夹/组 47@2x(1).png");
        background-repeat: no-repeat;
        background-size: contain;
        padding-left: 30px;
      }
    }
    .score-span{
      color: white;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 1px;
      margin: 0px 20px;
    }
    .sport-team-b{
      width: calc(50% - 15px);
      display: flex;
      align-items: center;
    }
    .sport-team-a{
      width: calc(50% - 15px);
      justify-content: flex-end;
      display: flex;
      align-items: center;
    }
    .sport-vs{
      color: white;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 1px;
      width: 30px;
    }
  }
</style>
