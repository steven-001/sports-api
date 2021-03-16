<template>
  <div id="app">
      <keep-alive>
        <router-view/>
      </keep-alive>
  </div>
</template>

<script>
  import YSB from './util/YSB' //YSB数据
  export default {
    name: 'App',
    data() {
      return {

      }
    },
    created(){
      //获取体育菜单
      YSB.onMenu(this.$i18n.locale)
      // YSB.onHot(this.$i18n.locale)
    },
    methods: {

    }
  }
</script>

<style lang="scss">
  img{
    image-rendering:-moz-crisp-edges;
    image-rendering:-o-crisp-edges;
    image-rendering:-webkit-optimize-contrast;
    image-rendering: crisp-edges;
    -ms-interpolation-mode:nearest-neighbor;
  }
#app {
  font-family: 'pf-Bold';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
