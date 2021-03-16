<template>
  <div class="record">
    <div style="height: 20px;background-color: #171717"></div>
    <van-nav-bar :title="$t('myCenter[\'投注记录\']')" :fixed="false">
      <van-icon :name="require('../../assets/首页/info/back.png')" slot="left" @click="quit"/>
    </van-nav-bar>
    <div>
      <van-tabs v-model="active" swipeable @change="getTypeId">
        <van-tab v-for="(k,i) in tablist" :title="$t('home[\''+k.name+'\']')" :key="i">
          <all v-if="k.typeId==0" :typeId="typeId"></all>
          <sports v-if="k.typeId==7" :typeId="typeId"></sports>
          <chess v-if="k.typeId==2" :typeId="typeId"></chess>
          <buyu v-if="k.typeId==3" :typeId="typeId"></buyu>
          <dianzi v-if="k.typeId==4" :typeId="typeId"></dianzi>
          <zhenren v-if="k.typeId==5" :typeId="typeId"></zhenren>
          <caipiao v-if="k.typeId==6" :typeId="typeId"></caipiao>
          <dianjing v-if="k.typeId==8" :typeId="typeId"></dianjing>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
  import all from './all';
  import caipiao from './caipiao';
  import zhenren from './zhenren';
  import dianzi from './dianzi';
  import chess from './chess';
  import buyu from './buyu';
  import sports from './sports2';
  import dianjing from './dianjing';
  export default {
    name:'betRecord',
    components:{
      sports,chess,buyu,dianzi,zhenren,caipiao,dianjing,all
    },
    created(){

    },
    data(){
      return{
        stateId:'Pending',
        typeId:null,
        active:null,
        tablist:[
          {typeId: 0, name: "全部"},
          {typeId: 7, name: "体育"},
          {typeId: 2, name: "棋牌"},
          {typeId: 3, name: "捕鱼"},
          {typeId: 4, name: "电子"},
          {typeId: 5, name: "真人"},
          {typeId: 6, name: "彩票"},
          {typeId: 8, name: "电竞"},
        ],
        userData:JSON.parse(localStorage.getItem('userData')),//用户信息
      }
    },
    //进入时触发
    activated(){
      for (let i in this.tablist){
        if(this.tablist[i].typeId==this.$route.query.i){
          this.active=parseInt(i)
        }
      }
    },
    mounted(){
    },
    methods:{
      getTypeId(val){
        console.log(val)
        this.typeId=this.tablist[val].typeId
      },
      //返回上一页
      quit(){
        if(this.$route.query.redirect){
          this.$router.push({
            path: this.$route.query.redirect,
            query: this.$route.query
          })
        }else {
          this.$router.push({path: '/'})
        }
      },
    }
  }
</script>
<style lang="scss">
  .record{
    height: 100vh;
    background-color: #000000;
    .van-dropdown-menu__title{
      font-size: 11px !important;
    }
  }
</style>
