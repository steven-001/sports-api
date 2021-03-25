<template>
    <van-row type="flex" justify="space-between" align="center" class="my-topvr title-bar">
      <div class="return" @click="routerBack">
        <img src="../../assets/首页/return.png"/>
      </div>
      <div class="title">{{title}}</div>
      <div class="right-action">
        <img src="../../assets/首页/sx.png" :class="{turn:refreshLoad}" @click="clickFresh" />
        <span class="full-screen" v-if="hasFullScreen" @click="fullScreen">{{$t("全屏")}}</span>
      </div>
    </van-row>
</template>
<script>
export default {
  name: "sp_title",
  data() {
    return {
      refreshLoad:false
    };
  },
  methods:{
    fullScreen(){

    },
    clickFresh(){
      this.$emit("freshData");
    },
    routerBack(){
      this.$router.go(-1);
    }
  },
  props: [
    "title","hasFullScreen"
  ]
};
</script>
