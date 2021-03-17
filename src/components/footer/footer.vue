<template>
  <div class="homeFooter">
    <van-tabbar v-model="active" :fixed="true"
                safe-area-inset-bottom
                route
                active-color="#4F82F4"
                inactive-color="#B7B7B7">
      <van-tabbar-item to="/">
        <span>{{ $t("new2['大厅']") }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? require('../../assets/首页/footer/home_1.png') : require('../../assets/首页/footer/home.png')"
        >
      </van-tabbar-item>
      <van-tabbar-item to="/events">
        <span>{{ $t("new2['赛事']") }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? require('../../assets/首页/footer/Events_1.png') : require('../../assets/首页/footer/Events.png')"
        >
      </van-tabbar-item>
      <van-tabbar-item to="/betRecord">
        <span>{{ $t("myCenter['投注记录']") }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? require('../../assets/首页/footer/betRecord_1.png') : require('../../assets/首页/footer/betRecord.png')"
        >
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <span>{{ $t("home['我的']") }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? require('../../assets/首页/footer/my_1.png') : require('../../assets/首页/footer/my.png')"
        >
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style lang="scss">
  .homeFooter{
    .van-tabbar{
      height: 53px;
      border-radius: 15px 15px 0px 0px;
      box-shadow: 0px 0px 9px 1px rgba(204, 204, 204, 0.8);
     }
    .van-tabbar-item__icon img{
      height: 22px;
    }
  }
</style>
<style lang="scss">
  .homeFooter{
    .van-tabbar-item__icon{
      font-size: 22px;
    }
    .van-tabbar-item__text{
      text-align: center;
      font-family:pf-Medium;
    }
    .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
      border: none;
    }
  }
</style>

