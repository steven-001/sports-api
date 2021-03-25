<template>
  <div class="Continuous">
    <!--未拉起-->
    <div>

    </div>
    <!--拉起-->
    <van-popup v-model="ContinuousShow" :overlay="false"
               class="ContinuousShow" position="bottom"
               :style="'width:100%'">
      <div class="ContinuousShow_body">
        <van-row type="flex" justify="space-between" align="center" class="top_box">
          <div class="top_box_left">
            <span>{{ ContinuousData.length }}</span>
            <span v-if="ContinuousData.length<2">
              至少选择<b>2</b>场比赛
            </span>
            <span v-else>
              串关投注
            </span>
          </div>
          <div class="top_box_right" @click="onContinuousOpen()">
            余额￥999.00
            <img src="../../assets/首页/bet/xia-min.png" v-if="open"/>
            <img src="../../assets/首页/bet/shang-min.png" v-else/>
          </div>
        </van-row>
        <div class="bottom_box">
          <div class="betting_project">
            <van-row type="flex" justify="space-between" align="center" class="project_box">
              <img src="../../assets/首页/bet/cq.png" class="box1_img"/>
              <div class="box2">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div class="box3">
                @<b>2.95</b>
              </div>
            </van-row>
          </div>
          <div class="Continuous_project">

          </div>
          <div class="bet_submit">

          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  export default {
    data() {
      return {
        ContinuousShow:true,
        open:false,
      }
    },
    computed:{
      ...mapState(["score","ContinuousData"]),
      money(){
        return this.score
      },
    },
    created() {
      this.$store.commit("onContinuousData", [])
    },
    methods: {
      onContinuousOpen(){
        this.open=!this.open
      },
      onInitialize(data){
        let arr = this.ContinuousData.filter(k=>{ return k.parentId==data.parentId })
        if(arr.length>0){
          if(arr[0].selectionId==data.selectionId){
            alert('取消')
          }else {
            this.$toast.fail(this.$t('new2[\'本场比赛您已选择投注项，若想选择其他项请先取消已选项\']'));
          }
          return
        }
        this.ContinuousData.push(data)
        console.log(this.ContinuousData)
      },
    }
  }
</script>

<style lang="scss">
  .Continuous{
    .ContinuousShow{
      .ContinuousShow_body{
        .top_box{
          padding: 0 10px;
          height: 14vw;
          background-color: #9AA4C2;
          border-top-right-radius: 15px;
          border-top-left-radius: 15px;
          color: #fff;
          font-size: 15px;
          .top_box_left{
            span{
              color: #D1D9ED;
            }
            span:first-child{
              display: inline-block;
              width: 20px;
              color: #B3BAD1;
              background-color: #fff;
              border-radius: 50%;
              text-align: center;
            }
            b{
              color: #fff;
              display: inline-block;
              padding: 0 5px;
            }
          }
          .top_box_right{
            img{
              height: 13px;
              display: inline-block;
              padding: 0 5px;
            }
          }
        }
        .bottom_box{
          .betting_project{
            .project_box{
              padding: 0 10px;
              height: 80px;
              .box1_img{
                height: 12px;
              }
              .box2{

              }
              .box3{
                font-size: 15px;
                b{
                  font-size: 18px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
