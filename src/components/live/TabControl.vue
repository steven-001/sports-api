<template>
    <van-popup v-model="betTabShow" position="bottom"
               class="TabControl"
               overlay-class="TabControl_overlay"
               :style="'height: calc(100% - 1.33rem);width:100%'" >
      <div class="TabControl_body">
        <div class="TabControl_body_top">
          <img src="@/assets/live/showBet.png" @click="betTabShow=false"/>
        </div>
        <TabControl_tab ref="TabControl_tab" @showSubmit="showSubmit"/>
      </div>
    </van-popup>
</template>

<script>
  import TabControl_tab from "../home/TabControl_tab";
  export default {
    components:{TabControl_tab},
    data() {
      return {
        betTabShow:false,
      }
    },
    mounted() {

    },
    methods: {
      showSubmit(data){
        this.$parent.showSubmit(data);
      },
    }
  }
</script>

<style lang="scss">
  .TabControl_overlay{
    background-color: rgba(0, 0, 0, 0.33) !important;
  }
  .TabControl{
    background-color: rgba(255, 255, 255, 0) !important;
    padding: 5px;
    .TabControl_body{
      height: 100%;
      .TabControl_body_top{
        text-align: center;
        height: 50px;
        img{
          height: 35px;
          margin: 7.5px 0;
        }
      }
    }
  }
</style>
