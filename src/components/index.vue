<template>
    <div class="home">
      <div class="top"></div>
      <div class="homeMain">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
      <homeFooter></homeFooter>
    </div>
</template>
<script>
  import homeFooter from "./footer/footer"
export default {
  name: "index",
  components: { homeFooter },
  data() {
    return {

    };
  },
  created(){

  },
  mounted() {

  },
};
</script>

<style lang="scss" scoped>
  .home{
    height: 100vh;
  }

</style>
