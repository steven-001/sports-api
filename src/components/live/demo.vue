<template>
  <div id="TimMessageTemplete">
      <div class="header_box">
        <img src="@/assets/live/faceID.png" alt="" class="header_img">
        <span class="header_name">小虎</span>
      </div>
    <div @click="addGroupMember()" class="btn_send">加入群聊</div>
    <div @click="loginMsg()" class="btn_send">登陆</div>
    <van-field v-model="userID" placeholder="请输入聊天内容"/>
      <div class="box">
        <div id="box_hua">
        </div>
        <div class="button">
          <van-field v-model="textarea" placeholder="请输入聊天内容"/>
          <div @click="sendMessage" class="btn_send">发送</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
  </span>
  </div>
</template>

<script>
  import TIM from 'tim-js-sdk';
  import Sig from '../../util/GenerateTestUserSig';
  export default {
    data() {
      return {
        textarea:'23432432',
        userID:'',
      }
    },
    mounted() {

    },
    methods: {
      //登录
      loginMsg(){
        let data=Sig.genTestUserSig(this.userID)
        let promise = this.$tim.login({userID: this.userID, userSig: data.userSig});
        promise.then(function(imResponse) {
          console.log('登录成功:::::::::::::::::',imResponse.data); // 登录成功
        }).catch(function(imError) {
          console.warn('login error:', imError); // 登录失败的相关信息
        });
        this.recivedMsg()
      },
      //加入群聊
      addGroupMember() {
        const groupID = '111111'
        console.log('groupID----------',groupID)
        this.$tim.joinGroup({
            groupID
          })
          .then((imResponse) => {
            console.log("===================加入群组成功============")
            switch (imResponse.data.status) {
              case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
                alert('等待管理员同意')
                break
              case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
                console.log('加入的群组资料',imResponse.data.group) // 加入的群组资料
                break
              case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
                alert('已经在群中')
                break
              default:
                break
            }
          })
          .catch(error => {
            console.log("===================加入群组失败============")
            console.warn('joinGroup error:', error) // 申请加群失败的相关信息
          })
      },
      //发送消息
      sendMessage(){
        if (this.textarea == ""){
          return;
        }
        let message =  this.$tim.createTextMessage({
          to:"aaa",
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            text: this.textarea
          },
          onProgress: function(event) { console.log('返回的消息', event) }
        });
        let promise =  this.$tim.sendMessage(message);
        promise.then(imResponse=>{
          if (imResponse.code === 0){
            this.writeMsg();
          }
        }).catch(imError=>{
          console.warn('sendMessage error:', imError);
        })
      },
      //渲染到页面上
      writeMsg(){
        var box_hua = document.getElementById('box_hua');
        var con = this.textarea;
        var new_L = document.createElement("li");
        new_L.setAttribute("id","li_lists");
        new_L.innerHTML = '<header></header>' + con;
        box_hua.appendChild(new_L);
        con = box_hua.innerHTML;
        this.textarea = "";
      },
      // 接收消息
      recivedMsg(){
        this.$tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
          if(event.data[0].from=='@TIM#SYSTEM'){

          }else{
            console.log('.....................',event)
            var box_hua = document.getElementById('box_hua');
            var con1 = event.data[0].from +'：'+ event.data[0].payload.text;
            var new_U = document.createElement("ul");
            new_U.setAttribute("id", "ul_lists");
            new_U.innerHTML = "<seciton></seciton>" + con1;
            box_hua.appendChild(new_U);
            con1 = box_hua.innerHTML;
            box_hua.innerHTML = con1;
          }
        });
      },
    }
  }
</script>

<style>
  #li_lists{
    list-style:none;
    float:left;
    clear:both;
    font-family:"arial,helvetica,sans-serif";
    font-size:12px;
    color:#F074A1;
    padding:8px 5px 8px 8px;
    margin:10px 20px 0px 35px;
    display:inline-block;
    max-width:150px;
    border:1px solid #F9B2D0;
    border-radius:5px;
    position:relative;
    top:0px;
    left:0px;
    word-wrap:break-word;
  }
  header{
    display:block;
    width:30px;
    height:30px;
    background:url(http://www.jq22.com/img/cs/500x500-1.png) no-repeat;
    background-size:30px 30px;
    position:absolute;
    left:-36px;
    top:0px;
    border-radius:50%;
    margin-left: 5px;
  }
  #ul_lists {
    font-family:"arial,helvetica,sans-serif";
    font-size:12px;
    color:#EC771D;
    padding:8px 5px 8px 8px;
    max-width:150px;
    margin:10px 5px 0px 0px;
    display:inline-block;
    float:right;
    clear:both;
    border:1px solid #69AB1F;
    border-radius:5px;
    position:relative;
    top:0px;
    left:0px;
    word-wrap:break-word;
  }
  seciton{
    display:block;
    width:30px;
    height:30px;
    background:url(http://www.jq22.com/img/cs/500x500-1.png) no-repeat;
    background-size:30px 30px;
    position:absolute;
    left:-36px;
    top:0px;
    border-radius:50%;
  }
</style>
<style scoped>
  .box {
    width: 100%;
    height: 430px;
  }

  #box_hua {
    width: 100%;
    height: 300px;
    border: 1px solid #C4C6CF;
    border-radius: 6px;
    position: relative;
    margin-bottom: 5px;
    overflow:auto;
  }
  .btn_send{
    text-align: center;
    font-size: 15px;
    color: #fff;
    width: 80px;
    background-color: #0570db;
    margin: 5px;
  }
  .header_box{
    width: 100%;
    height: 80px;
    margin-bottom: 10px;
    position: relative;
  }
  .header_img{
    width: 80px;
    height: 80px;
    background: rebeccapurple;
    border-radius: 50%;
    position: absolute;
    left: 10px;
    top: 0px;
  }
  .header_name{
    line-height: 80px;
    position: absolute;
    left: 100px;
    font-size: 22px;
    font-weight: 500;
  }
</style>
