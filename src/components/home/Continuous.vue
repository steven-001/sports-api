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
            余额￥{{ score }}
            <img src="../../assets/首页/bet/xia-min.png" v-if="open"/>
            <img src="../../assets/首页/bet/shang-min.png" v-else/>
          </div>
        </van-row>
        <div class="bottom_box" v-if="open">
          <div class="betting_project">
            <van-row type="flex" justify="space-between" align="center" class="project_box" v-for="(k,i) in ContinuousData" :key="i">
              <img src="../../assets/首页/bet/cq.png" class="box1_img"/>
              <div class="box2">
                <div>{{ k.name}}</div>
                <div>
                  {{ getTypeName(k.betType) }}
                  <span>{{ k.Fraction }}</span>
                </div>
                <div>{{ k.home }} VS {{ k.guest }}</div>
              </div>
              <div class="box3">
                @<b>{{ k.odds }}</b>
              </div>
            </van-row>
          </div>
          <div class="Continuous_project">
            <van-row type="flex" justify="space-between" align="center" class="Continuous_project_box"
                     v-for="(k,i) in selectionList['sel'+ContinuousData.length]" :key="i">
              <div class="box1">
                <div>{{ k.name }}</div>
                <div>预计可赢：
                  <span v-if="value">{{ (value*k.predictNum-value*k.coefficient).toFixed(2) }}</span>
                  <span v-else>0</span>
                </div>
              </div>
              <div class="box2">
                <van-row type="flex" justify="end" align="center" class="box2_top">
                  <van-field v-model="value" placeholder="请输入金额...">
                    <van-icon name="clear" slot="right-icon" @click="value=null"/>
                  </van-field>
                  <b>x<span>{{ k.coefficient }}</span></b>
                </van-row>
                <div class="xiaoji">小计：{{(value*k.coefficient* 100 ) / 100 }}</div>
              </div>
            </van-row>
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
        value:null,
        ContinuousShow:true,
        open:false,
        selectionIds:[],
        selectionList: {//串关list
          checkedOdds:false,
          checkedDish:false,
          sel2:[
            {name:'2串1',coefficient:1,num:0,type:2},
          ],
          sel3:[
            {name:'2串1',coefficient:3,num:0,type:2 },
            {name:'3串1',coefficient:1,num:0,type:3 },
            {name:'3串4',coefficient:4,num:0,type:11 },
            {name:'3串7',coefficient:7,num:0,type:12 },
          ],
          sel4:[
            {name:'2串1',coefficient:6,num:0,type:2 },
            {name:'3串1',coefficient:4,num:0,type:3 },
            {name:'4串1',coefficient:1,num:0,type:4 },
            {name:'4串11',coefficient:11,num:0,type:13 },
            {name:'4串15',coefficient:15,num:0,type:14 },
          ],
          sel5:[
            {name:'2串1',coefficient:10,num:0,type:2 },
            {name:'3串1',coefficient:10,num:0,type:3 },
            {name:'4串1',coefficient:5,num:0,type:4 },
            {name:'5串1',coefficient:1,num:0,type:5 },
            {name:'5串26',coefficient:26,num:0,type:15 },
            {name:'5串31',coefficient:31,num:0,type:16 },
          ],
          sel6:[
            {name:'2串1',coefficient:15,num:0,type:2 },
            {name:'3串1',coefficient:20,num:0,type:3 },
            {name:'4串1',coefficient:15,num:0,type:4 },
            {name:'5串1',coefficient:6,num:0,type:5 },
            {name:'6串1',coefficient:1,num:0,type:6 },
            {name:'6串57',coefficient:57,num:0,type:17 },
            {name:'6串63',coefficient:63,num:0,type:18 },
          ],
          sel7:[
            {name:'2串1',coefficient:21,num:0,type:2 },
            {name:'3串1',coefficient:35,num:0,type:3 },
            {name:'4串1',coefficient:35,num:0,type:4 },
            {name:'5串1',coefficient:21,num:0,type:5 },
            {name:'6串1',coefficient:7,num:0,type:6 },
            {name:'7串1',coefficient:1,num:0,type:7 },
            {name:'7串120',coefficient:120,num:0,type:19 },
          ],
          sel8:[
            {name:'2串1',coefficient:28,num:0,type:2 },
            {name:'3串1',coefficient:56,num:0,type:3 },
            {name:'4串1',coefficient:70,num:0,type:4 },
            {name:'5串1',coefficient:56,num:0,type:5 },
            {name:'6串1',coefficient:28,num:0,type:6 },
            {name:'7串1',coefficient:8,num:0,type:7 },
            {name:'8串1',coefficient:1,num:0,type:8 },
          ],
          sel9:[
            {name:'2串1',coefficient:36,num:0,type:2 },
            {name:'3串1',coefficient:84,num:0,type:3},
            {name:'4串1',coefficient:126,num:0,type:4 },
            {name:'5串1',coefficient:126,num:0,type:5 },
            {name:'6串1',coefficient:84,num:0,type:6 },
            {name:'7串1',coefficient:36,num:0,type:7 },
            {name:'8串1',coefficient:9,num:0,type:8 },
            {name:'9串1',coefficient:1,num:0,type:9 },
          ],
          sel10:[
            {name:'2串1',coefficient:45,num:0,type:2 },
            {name:'3串1',coefficient:120,num:0,type:3 },
            {name:'4串1',coefficient:210,num:0,type:4 },
            {name:'5串1',coefficient:252,num:0,type:5 },
            {name:'6串1',coefficient:210,num:0,type:6 },
            {name:'7串1',coefficient:120,num:0,type:7 },
            {name:'8串1',coefficient:45,num:0,type:8 },
            {name:'9串1',coefficient:10,num:0,type:9 },
            {name:'10串1',coefficient:1,num:0,type:10 },
          ],
        },
      }
    },
    computed:{
      ...mapState(["score","ContinuousData","AllType"]),
    },
    created() {
      this.$store.commit("onContinuousData", [])
    },
    methods: {
      onContinuousOpen(){
        if(this.ContinuousData.length>1){
          this.ContinuousShow=false
          setTimeout(()=>{
            this.ContinuousShow=true
            this.open=!this.open
          },200)
        }
        this.betRegulation()
      },
      onInitialize(data){
        let arr = this.ContinuousData.filter(k=>{ return k.parentId==data.parentId })
        if(arr.length>0){
          if(arr[0].selectionId==data.selectionId){
            this.$store.commit("onContinuousData", this.ContinuousData.filter(k=>{ return k.selectionId!=data.selectionId }))
          }else {
            this.$toast.fail(this.$t('new2[\'本场比赛您已选择投注项，若想选择其他项请先取消已选项\']'));
          }
          return
        }
        this.ContinuousData.push(data)
        console.log(this.ContinuousData)
      },
      getTypeName(name){
        if(name)
          return this.AllType.filter(k=>{ return k.type.toLowerCase()==name.toLowerCase()})[0].name
      },
      //计算串关下注规则
      betRegulation(){
        let obj = this.selectionList
        let length = this.ContinuousData.length
        let arr= []
        this.selectionIds=[]
        for(let k of this.ContinuousData){
          arr.push(k.selectionPrice)
          this.selectionIds.push(k.selectionId)
        }
        let i =0
        let num3=0
        let length3=0
        for (let k of obj['sel'+length]) {
          let list=[]
          if(i<=length-2){
            let names=k.name.split('串')
            if(names[1]==1){
              if(length==names[0]){
                let a = []
                for (let i=0;i<length;i++) {
                  a.push(1)
                }
                list.push(a)
              }else {
                list=this.getFlagArrs(length, names[0])
              }
            }
            for(let k of list){
              for (let i=0;i<10;i++) {
                if(k[i]==1){
                  k[i]=arr[i]
                }
              }
            }
            let num2=0
            for(let k of list){
              let num1=1
              for (let i=0;i<k.length;i++) {
                if(k[i]!=0){
                  num1=num1*k[i]
                }
              }
              num2+=num1
            }
            num3+=num2
            length3+=list.length
            k.predictNum=num2
            k.coefficient=list.length
          }else if(i==length-1){
            k.predictNum=num3
            k.coefficient=length3
          }else {
            for (let n of this.ContinuousData) {
              num3+=parseFloat(n.selectionPrice)
            }
            k.predictNum=num3
            k.coefficient=length3+length
          }
          i++
        }
      },
      //计算m选n个数组元素
      getFlagArrs(m, n) {
        if(!n || n < 1) {
          return [];
        }

        var resultArrs = [],
          flagArr = [],
          isEnd = false,
          i, j, leftCnt;

        for (i = 0; i < m; i++) {
          flagArr[i] = i < n ? 1 : 0;
        }

        resultArrs.push(flagArr.concat());

        while (!isEnd) {
          leftCnt = 0;
          for (i = 0; i < m - 1; i++) {
            if (flagArr[i] == 1 && flagArr[i+1] == 0) {
              for(j = 0; j < i; j++) {
                flagArr[j] = j < leftCnt ? 1 : 0;
              }
              flagArr[i] = 0;
              flagArr[i+1] = 1;
              var aTmp = flagArr.concat();
              resultArrs.push(aTmp);
              if(aTmp.slice(-n).join("").indexOf('0') == -1) {
                isEnd = true;
              }
              break;
            }
            flagArr[i] == 1 && leftCnt++;
          }
        }
        return resultArrs;
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
            max-height: 210px;
            overflow-y: auto;
            .project_box{
              border-bottom: 1px solid rgb(237, 237, 237);
              padding: 0 10px;
              height: 70px;
              .box1_img{
                height: 12px;
              }
              .box2{
                div{
                  padding-left: 8px;
                  font-size: 14px;
                }
                div:first-child{
                  border-left: 3px solid #CBB5A0;
                  font-weight: bold;
                  padding-left: 5px;
                }
                div:last-child{
                  color: #A2A9B8;
                  font-size: 11px;
                }
                width: 70%;
              }
              .box3{
                width: 20%;
                font-size: 15px;
                b{
                  font-size: 18px;
                }
              }
            }
          }
          .Continuous_project{
            .Continuous_project_box{
              height: 70px;
              background-color: #F5F6FA;
              border-bottom: 2px solid #DBDCE0;
              padding: 0 10px 0 40px;
              .box1{
                font-size: 11px;
                font-weight: bold;
                div:first-child{
                  padding-left: 5px;
                  font-size: 14px;
                  border-left: 2px solid #CBB5A0;
                }
                div:last-child{
                  padding-left: 8px;
                  margin: 5px 0;
                }
                span{
                  color: #DB6372;
                }
              }
              .box2{
                width: 50%;
                .box2_top{
                  .van-field{
                    width: 70%;
                    padding: 2px 5px;
                    margin-right: 5px;
                    border-radius: 5px;
                    .van-field__control::placeholder{
                      font-size: 11px;
                    }
                  }
                  b{
                    color: #ADADB5;
                    font-size: 16px;
                  }
                }
                .xiaoji{
                  height: 25px;
                  line-height: 25px;
                  text-align: right;
                  font-size: 11px;
                  color: #ADADB5;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
