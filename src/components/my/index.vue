<template>
  <div class="my-screen normal-screen">
    <sp_title :title="title" :hasFullScreen="hasFullScreen" @freshData="freshData"/>
    <!-- 会员信息 -->
    <van-row type="flex" justify="space-between" align="center" class="my-infovr">
      <img :src="require('@/assets/MyCenter/faceID'+(info.photo||0)+'.png')" />
      <div class="photo-right">
        <div>
          <span>{{info.login_id}}</span><span class="vip-span">{{info.vip}}</span>
        </div>
        <div class="assets-info">{{info.uid}}</div>
      </div>
      <i class="fa fa-angle-right"></i>
    </van-row>
    <template v-for="(item,key) in rows">
      <van-row type="flex" justify="space-between" align="center" :class="'row-tr-'+key" class="form-row">
        <img :src="require('@/assets/首页/新建文件夹/'+item.icon+'')" class="left-icon" />
        <div class="row-name">{{item.name}}</div>
        <div class="row-value">{{item.value}}</div>
        <i class="fa" :class="{'fa-angle-right':item.canClick}"></i>
      </van-row>
    </template>
  </div>
</template>
<script>
  import sp_title from "../public/sp_title.vue";
  export default {
    data() {
      return {
        title:this.$i18n.t("我的"),
        hasFullScreen:true,
        info:{photo:"",name:"测试",login_id:"aabbccc",uid:"234234",vip:0},
        rows:{
          sex:{name:this.$i18n.t("性别"),value:"女",canClick:true,icon:"性别区分@2x.png"},
          birth:{name:this.$i18n.t("生日"),value:"03/15",canClick:true,icon:"生日@2x.png"},
          umoney:{name:this.$i18n.t("可用资金"),value:"22.11",canClick:true,icon:"资金@2x.png"},
          ltmoney:{name:this.$i18n.t("暂未可用资金"),value:"11.11",icon:"无快照@2x.png"},
          rule:{name:this.$i18n.t("投注规则"),value:"",icon:"图层 6@2x.png"}
        }
      };
    },
    components:{sp_title},
    methods:{
      freshData(){

      }
    },
  };
</script>
<style lang="scss" scoped>
  .my-screen{
    .row-tr-birth,.row-tr-ltmoney{
      margin-bottom: 12px;
      border-bottom: 1px solid #efecec;
    }
  }
  .my-infovr{
    padding:0px 10px;
    background: white;
    margin-bottom: 12px;
    border-bottom: 1px solid #efecec;
    img{
      width: 70px;
      height: 70px;
      margin: 8px 10px;
    }
    .photo-right{
      width: calc(100% - 100px);
      span{
        font-size: 18px;
        &.vip-span{
          background: url("../../assets/首页/新建文件夹/图层 8@2x.png") no-repeat;
          padding-left:34px;
          padding-right:7px;
          color:white;
          font-size:14px;
          background-size: contain;
          margin-left: 5px;
        }
      }
    }
  }
</style>
