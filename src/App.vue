<template>
  <div id="app">
      <keep-alive>
        <router-view/>
      </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {

      }
    },
    created(){

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
