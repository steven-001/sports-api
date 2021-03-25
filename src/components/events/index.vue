<template>
  <div class="my-screen normal-screen">
    <sp_title :title="title" :hasFullScreen="hasFullScreen" @freshData="freshData"/>
    <van-tabbar v-model="active" :fixed="false" class="events-vanbar" @change="changeTab">
      <van-tabbar-item name="sport_on" icon="game-on">
        <img slot="icon" slot-scope="props"
             :src="props.active ?require('../../assets/首页/新建文件夹/组 50@2x.png') :require('../../assets/首页/新建文件夹/矢量智能对象@2x(3).png')" />
        {{$t("进行中")}}
      </van-tabbar-item>
      <van-tabbar-item name="sport_hot" icon="game-hot">
        <img slot="icon" slot-scope="props"
             :src="props.active ?require('../../assets/首页/新建文件夹/组 46@2x.png') :require('../../assets/首页/新建文件夹/黑白 1@2x.png')" />
        {{$t("热门")}}
      </van-tabbar-item>
      <van-tabbar-item name="sport_anchor" icon="game-live">
        <img slot="icon" slot-scope="props"
             :src="props.active ?require('../../assets/首页/新建文件夹/组 44@2x.png') :require('../../assets/首页/新建文件夹/组 47@2x.png')" />
        {{$t("主播")}}
      </van-tabbar-item>
      <van-tabbar-item name="sport_plan" icon="game-plan">
        <img slot="icon" slot-scope="props"
             :src="props.active ?require('../../assets/首页/新建文件夹/组 45@2x.png') :require('../../assets/首页/新建文件夹/组 2@2x.png')" />
        {{$t("即将开赛")}}
      </van-tabbar-item>
    </van-tabbar>
    <van-list v-model="page.loading" :finished="page.finished" :class="'list-'+curListTemp"
              :finished-text="page.finishedText" @load="loadPage">
      <template v-for="record in data">
        <component :is="curListTemp" :record="record"></component>
      </template>
    </van-list>
  </div>
</template>
<script>
import sp_title from "../public/sp_title";
import sport_on from "./sport_on";
import sport_hot from "./sport_hot";
import sport_anchor from "./sport_anchor";
import sport_plan from "./sport_on";
export default {
  data() {
    return {
      title:"发现",
      active: "sport_on",
      curListTemp:"sport_on",
      hasFullScreen:true,
      data:[],
      page:{
        loading:false,finished:false,
        finishedText:"-"+this.$i18n.t("已加载全部数据")+"-",pageNum:1,pageSize:20
      }
    };
  },
  components:{sp_title,sport_on,sport_hot,sport_anchor,sport_plan},
  methods:{
    freshData() {

    },
    initPage(){
      this.page.pageNum=1;
      this.page.finished=false;
      this.page.loading=false;
    },
    loadPage(){
      this.page.loading=false;
      this.data=[{
        type:"zq",time:"03/12",name:"美洲冠军联赛",hasLive:true,hasAnchor:true,
        teama_name:"AC米兰",teama_score:1,sportName:"四大皆空联赛",anchorName:"米兰儿",
        teamb_name:"四道口附近",teamb_score:0,betName:"上半场独赢盘"
      }];
    },
    changeTab(name){
      this.curListTemp=name;
    }
  },
};
</script>
<style lang="scss" scoped>
  .my-screen{
    .events-vanbar{
      padding: 5px 0px;
      .van-tabbar-item__icon img{
        height:25px;
      }
      .van-tabbar-item{
        font-size: 14px;
        line-height: 14px;
      }
    }
  }
</style>
