<template>
  <div class="sport-item-div">
    <van-row type="flex" justify="space-between" align="center" class="sport-item-title">
      <div class="sport-type" :class="'sport-type-'+record.type">足球</div>
      <div class="sport-time">{{record.time}}</div>
      <div class="sport-name">{{record.name}}</div>
    </van-row>
    <van-row type="flex" justify="space-between" align="center" class="sport-item-con">
      <div class="sport-team-a">
        <span>
          <img src="../../assets/首页/新建文件夹/安全盾牌@2x.png"/>
          <div>{{record.teama_name}}</div>
        </span>
        <span class="score-span">{{record.teama_score}}</span>
      </div>
      <div class="vs-div">VS</div>
      <div class="sport-team-b">
        <span class="score-span">{{record.teamb_score}}</span>
        <span>
          <img src="../../assets/首页/新建文件夹/安全盾牌 拷贝@2x.png"/>
          <div>{{record.teamb_name}}</div>
        </span>
        <span class="sport-live-div">
          <img src="../../assets/首页/新建文件夹/组 26 拷贝@2x.png" v-if="record.hasLive" />
          <img src="../../assets/首页/新建文件夹/组 47@2x(1).png" v-if="record.hasAnchor"/>
        </span>
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
<style lang="scss" scoped>
  .list-sport_on .vs-div{
    color: #5a81de;
    font-weight: bold;
    font-size: 20px;
    letter-spacing: 1px;
    width:30px;
    text-align: center;
  }
  .list-sport_plan{
    .vs-div {
      font-weight: bold;
      font-size: 20px;
      letter-spacing: 1px;
      width: 30px;
      text-align: center;
    }
    .score-span{
      color:black !important;
    }
  }
  .sport-item-div{
    border: 1px solid #e4e4e4;
    border-radius: 8px;
    background: white;
    margin: 5px;
    font-size: 13px;
    .sport-item-title{
      border-bottom: 1px solid #eae4e4;
      .sport-name{
        color: #969292;
        padding-right:5px;
      }
    }
    .sport-item-con{
      padding: 8px 0px;
      img{
        width: 22px;
      }
      .sport-team-a{
        width: calc(50% - 15px);
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .sport-team-b{
        width: calc(50% - 15px);
        display: flex;
        align-items: center;
        .score-span{
          padding-left: 5px;
          padding-right: 8px;
        }
      }
      span{
        text-align: center;
      }
      .score-span{
        font-size: 22px;
        color: #5a81de;
        font-weight: bold;
        padding-left: 8px;
        padding-right: 5px;
      }
    }
    .sport-type{
      background: #65bf65;
      padding: 3px 10px;
      border-radius: 3px;
      color: white;
    }
  }
</style>
