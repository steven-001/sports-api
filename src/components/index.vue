<template>
    <div class="home">
      <div class="top"></div>
      <div class="homeMain">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
</template>
<script>
export default {
  name: "index",
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
    background-color: #0F0F0F;
    height: 100vh;
  }

</style>
