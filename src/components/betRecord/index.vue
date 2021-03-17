<template>
  <div class="record">
    <van-nav-bar :title="$t('myCenter[\'投注记录\']')" :fixed="false">
      <van-icon :name="require('../../assets/首页/info/back.png')" slot="left" @click="quit"/>
    </van-nav-bar>
    <div>
      <van-tabs v-model="typeId" swipeable @change="getTypeId">
        <van-tab v-for="(k,i) in tablist" :name="k.typeId" :title="$t('home[\''+k.name+'\']')" :key="i">
          <all :typeId="k.typeId"/>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
  import all from './allRecord';
  export default {
    name:'betRecord',
    components:{
      all
    },
    created(){

    },
    data(){
      return{
        stateId:'Pending',
        typeId:null,
        tablist:[
          {typeId: 0, name: "全部"},
          {typeId: 7, name: "足球"},
          {typeId: 2, name: "篮球"},
          {typeId: 3, name: "排球"},
          {typeId: 4, name: "网球"},
          {typeId: 5, name: "乒乓球"},
          {typeId: 6, name: "冰球"},
          {typeId: 8, name: "羽毛球"},
        ],
        userData:JSON.parse(localStorage.getItem('userData')),//用户信息
      }
    },
    //进入时触发
    activated(){

    },
    mounted(){
    },
    methods:{
      getTypeId(val){
        this.typeId=val
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
    .van-dropdown-menu__title{
      font-size: 11px !important;
    }
  }
</style>
