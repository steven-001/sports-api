<template>
  <div class="bet home_bet">
    <div>
    <!--头部Logo-->
      <van-row type="flex" align="center" justify="space-between" class="home_bet_logo">
        <div class="home_bet_logo_left">三</div>
        <div class="logo">
          <img src="../../assets/首页/logo.png"/>
        </div>
        <div class="home_bet_logo_right">
          <!--<span @click="toLogin">登录</span>-->
          <!--<span @click="toZhuCe">注册</span>-->
        </div>
      </van-row>
      <!--tab今日 早盘 滚球 串关-->
      <van-tabs v-model="betType"
                @change="isbetSelector"
                background="#c2c2c2"
                class="home_bet_tabs">
        <van-tab v-for="(k,i) in betList" :title="k.text" :key="i" :name="k.value">

        </van-tab>
      </van-tabs>
      <!--滑动按钮-->
      <div class="betSwipe" id="test_div">
        <div v-for="(k,i) in sportsType" :key="i" @click="k.bool?'':showBoxF(k)" class="showBox" v-if="k.num!=0">
          <div>
            <div><van-icon :name="require('@/assets/首页/bet/ico/'+k.gameCode+(k.bool?'':'1')+'.png')" /></div>
            <div>{{ k.gameName }}({{ k.num }})</div>
          </div>
        </div>
      </div>

      <!--一键投注-->
      <van-row type="flex" justify="space-around" class="betTab" align="center">
        <van-row class="betTab_col" type="flex"  align="center" @click="onBetkaiguanShow">
          <van-icon :name="require('@/assets/首页/bet/zq_'+(betkaiguan?'k':'g')+'.png')" />
          <div>{{ $t("bet['一键投注']") }}</div>
        </van-row>
        <van-col class="betTab_col" @click="CompetitionShowF()">{{ $t("bet['赛事选择']") }}</van-col>
      </van-row>

      <!--进行中/未开赛-->
      <div style="height: 80vh;overflow: auto">
        <van-collapse v-model="activeNames" :border="false" class="bet_collapse">
          <van-collapse-item class="box1" :title="$t('bet[\'进行中\']')" name="1" :icon="require('@/assets/首页/bet/zq_jxz.png')" :is-link="false" :border="false">
            <!--<div style="height: 0.9rem;line-height: 0.9rem">{{ pitch_on }}({{ gqList.length }})</div>-->
            <div class="box1_body">
              <van-collapse v-model="activeID">
                <van-collapse-item v-for="(k,i) in gqList" :key="i" :title="k.leagueName" :name="k.leagueId"
                                   v-show="onBetListSave(k.leagueName)">
                  <div class="box1_body_min" v-for="(n,j) in k.events" :key="j">
                    <van-cell :title="(n.eventDate)" is-link style="border:none;"
                              :value="n.morebetCount+'+'"
                              :border="false" icon="star-o"/>
                    <van-row type="flex" justify="space-between" style="background-color: #383838;">
                      <div class="box1_body_min_left" @click="openBetDetails(n,k.leagueName)"
                           style="width: 45%;line-height: 1.8rem;color: #fff;font-weight: bold;font-size: 0.38rem;padding: 0 0.2rem;">
                        <van-row  type="flex" justify="space-between" style="padding-top: 0.5rem">
                          <div class="ofHidden">{{ n.homeName }}</div>
                          <div>{{ n.score=='-'?'0':n.score.split('-')[0]  }}</div>
                        </van-row>
                        <van-row  type="flex" justify="space-between">
                          <div class="ofHidden">{{ n.awayName }}</div>
                          <div>{{ n.score=='-'?'0':n.score.split('-')[1]  }}</div>
                        </van-row>
                        <van-row type="flex" style="padding: 0.5rem 0 0.5rem">
                          <!--<img :src="require('@/assets/首页/bet/zq_cartoon.png')"  style="width: 0.5rem"/>-->
                          <!--<img :src="require('@/assets/首页/bet/zq_liveshow.png')" style="margin: 0 0.3rem;width: 0.5rem"/>-->
                        </van-row>
                      </div>
                      <div class="box1_body_min_right" style="width: 55%">
                        <van-swipe class="my-swipe" :autoplay="0" indicator-color="white" :loop="false">
                          <!--赔率-->
                          <van-swipe-item v-if="m" v-for="(m, i) in n.sessions" :key="i">
                            <van-row type="flex" justify="space-between">
                              <div style="width: 32.5%;line-height: 0.5rem">{{ iF(i) }} <br/>{{ $t('bet[\'独赢\']') }}</div>
                              <div style="width: 32.5%;line-height: 0.5rem">{{ iF(i) }} <br/>{{ $t('bet[\'让球\']') }}</div>
                              <div style="width: 32.5%;line-height: 0.5rem">{{ iF(i) }} <br/>{{ $t('bet[\'大/小\']') }}</div>
                            </van-row>
                            <van-row type="flex" justify="space-between">
                              <div style="width: 32%;height: 3.5rem;">
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem"
                                     :class="setBj(m.smbh)"
                                     @click="bottomPour(n,m.smbh,iF(i)+'-'+$t('bet[\'独赢\']'),k.leagueName)"
                                     v-if="onLock(m.smbh)">
                                  <div>{{ $t('bet[\'主胜\']') }}</div>
                                  <div :class="m.smbh.type==1?'up':m.smbh.type==2?'drop':'heise'">
                                    <img v-if="m.smbh.type"
                                         :src="require('@/assets/首页/bet/'+(m.smbh.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.smbh.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.2rem 0"/>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem"
                                     :class="setBj(m.smba)"
                                     @click="bottomPour(n,m.smba,iF(i)+'-'+$t('bet[\'独赢\']'),k.leagueName)"
                                     v-if="onLock(m.smba)">
                                  <div>{{ $t('bet[\'客胜\']') }}</div>
                                  <div :class="m.smba.type==1?'up':m.smba.type==2?'drop':'heise'">
                                    <img v-if="m.smba.type"
                                         :src="require('@/assets/首页/bet/'+(m.smba.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.smba.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.2rem 0"/>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem"
                                     :class="setBj(m.smbd)"
                                     @click="bottomPour(n,m.smbd,iF(i)+'-'+$t('bet[\'独赢\']'),k.leagueName)"
                                     v-if="onLock(m.smbd)">
                                  <div>{{ $t('bet[\'和局\']') }}</div>
                                  <div :class="m.smbd.type==1?'up':m.smbd.type==2?'drop':'heise'">
                                    <img v-if="m.smbd.type"
                                         :src="require('@/assets/首页/bet/'+(m.smbd.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.smbd.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.2rem 0"/>
                                </div>
                              </div>
                              <div style="width: 32%;height: 3.5rem;line-height: 0.7rem">
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.15rem"
                                     :class="setBj(m.shdh)"
                                     @click="bottomPour(n,m.shdh,iF(i)+'-'+$t('bet[\'让球\']'),k.leagueName)"
                                     v-if="onLock(m.shdh)">
                                  <div>{{ m.shdh.selectionValue }}</div>
                                  <div :class="m.shdh.type==1?'up':m.shdh.type==2?'drop':'heise'">
                                    <img v-if="m.shdh.type"
                                         :src="require('@/assets/首页/bet/'+(m.shdh.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.shdh.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.15rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.55rem 0"/>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.15rem"
                                     :class="setBj(m.shda)"
                                     @click="bottomPour(n,m.shda,iF(i)+'-'+$t('bet[\'让球\']'),k.leagueName)"
                                     v-if="onLock(m.shda)">
                                  <div>{{ m.shda.selectionValue }}</div>
                                  <div :class="m.shda.type==1?'up':m.shda.type==2?'drop':'heise'">
                                    <img v-if="m.shda.type"
                                         :src="require('@/assets/首页/bet/'+(m.shda.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.shda.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.15rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.55rem 0"/>
                                </div>
                              </div>
                              <div style="width: 32%;height: 3.5rem;line-height: 0.7rem;margin-right: 0.08rem">
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.15rem"
                                     :class="setBj(m.souh)"
                                     @click="bottomPour(n,m.souh,iF(i)+'-'+$t('bet[\'大/小\']'),k.leagueName)"
                                     v-if="onLock(m.souh)">
                                  <div>大{{ m.souh.selectionValue }}</div>
                                  <div :class="m.souh.type==1?'up':m.souh.type==2?'drop':'heise'">
                                    <img v-if="m.souh.type"
                                         :src="require('@/assets/首页/bet/'+(m.souh.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.souh.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.15rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.55rem 0"/>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.15rem"
                                     :class="setBj(m.soua)"
                                     @click="bottomPour(n,m.soua,iF(i)+'-'+$t('bet[\'大/小\']'),k.leagueName)"
                                     v-if="onLock(m.soua)">
                                  <div>小{{ m.soua.selectionValue }}</div>
                                  <div :class="m.soua.type==1?'up':m.soua.type==2?'drop':'heise'">
                                    <img v-if="m.soua.type"
                                         :src="require('@/assets/首页/bet/'+(m.soua.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.soua.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.15rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.55rem 0"/>
                                </div>
                              </div>
                            </van-row>
                          </van-swipe-item>
                        </van-swipe>
                      </div>
                    </van-row>
                  </div>
                </van-collapse-item>
              </van-collapse>
            </div>
          </van-collapse-item>
          <van-collapse-item class="box1 box2" :title="$t('new[\'未开赛\']')" name="2"
                             :icon="require('@/assets/首页/bet/zq_wks.png')"
                             :is-link="false" :border="false">
            <!--<div style="height: 0.9rem;line-height: 0.9rem">{{ pitch_on }}({{ fgqList.length }})</div>-->
            <div class="box1_body">
              <van-collapse v-model="active2ID">
                <van-collapse-item v-for="(k,i) in fgqList" :key="i" :title="k.leagueName" :name="k.leagueId"
                                   v-show="onBetListSave(k.leagueName)">
                  <div class="box1_body_min" v-for="(n,j) in k.events" :key="j">
                    <van-cell :title="'全场 '+(n.eventDate)" is-link style="border:none;"
                              :value="n.morebetCount+'+'"
                              :border="false" icon="star-o"/>
                    <van-row type="flex" justify="space-between" style="background-color: #c2c2c2;">
                      <div class="box1_body_min_left" style="width: 45%;line-height: 1.8rem;color: #000;font-weight: bold;font-size: 0.38rem;padding: 0 0.2rem;" @click="openBetDetails(n,k.leagueName)">
                        <van-row  type="flex" justify="space-between" style="padding-top: 0.5rem">
                          <div class="ofHidden">{{ n.homeName }}</div>
                          <div>-</div>
                        </van-row>
                        <van-row  type="flex" justify="space-between">
                          <div class="ofHidden">{{ n.awayName }}</div>
                          <div>-</div>
                        </van-row>
                        <!--<van-row type="flex" style="padding: 0.5rem 0 0.5rem">
                          <img :src="require('@/assets/首页/bet/zq_cartoon.png')"  style="width: 0.5rem"/>
                          <img :src="require('@/assets/首页/bet/zq_liveshow.png')" style="margin: 0 0.3rem;width: 0.5rem"/>
                        </van-row>-->
                      </div>
                      <div class="box1_body_min_right" style="width: 55%">
                        <van-swipe class="my-swipe" :autoplay="0" indicator-color="white" :loop="false">
                          <!--赔率-->
                          <van-swipe-item v-if="m" v-for="(m, i) in n.sessions" :key="i">
                            <van-row type="flex" justify="space-between">
                              <div style="width: 32.5%;line-height: 0.5rem">{{ iF(i) }}<br/>{{ $t('bet[\'独赢\']') }}</div>
                              <div style="width: 32.5%;line-height: 0.5rem">{{ iF(i) }}<br/>{{ $t('bet[\'让球\']') }}</div>
                              <div style="width: 32.5%;line-height: 0.5rem">{{ iF(i) }}<br/>{{ $t('bet[\'大/小\']') }}</div>
                            </van-row>
                            <van-row type="flex" justify="space-between">
                              <div style="width: 32%;height: 3.5rem;">
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem"
                                     :class="setBj(m.smbh)"
                                     @click="bottomPour(n,m.smbh,iF(i)+'-'+$t('bet[\'独赢\']'),k.leagueName)"
                                     v-if="onLock(m.smbh)">
                                  <div>{{ $t('bet[\'主胜\']') }}</div>
                                  <div :class="m.smbh.type==1?'up':m.smbh.type==2?'drop':'heise'">
                                    <img v-if="m.smbh.type"
                                         :src="require('@/assets/首页/bet/'+(m.smbh.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.smbh.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.2rem 0"/>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem"
                                     :class="setBj(m.smba)"
                                     @click="bottomPour(n,m.smba,iF(i)+'-'+$t('bet[\'独赢\']'),k.leagueName)"
                                     v-if="onLock(m.smba)">
                                  <div>{{ $t('bet[\'客胜\']') }}</div>
                                  <div :class="m.smba.type==1?'up':m.smba.type==2?'drop':'heise'">
                                    <img v-if="m.smba.type"
                                         :src="require('@/assets/首页/bet/'+(m.smba.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.smba.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.2rem 0"/>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem"
                                     :class="setBj(m.smbd)"
                                     @click="bottomPour(n,m.smbd,iF(i)+'-'+$t('bet[\'独赢\']'),k.leagueName)"
                                     v-if="onLock(m.smbd)">
                                  <div>{{ $t('bet[\'和局\']') }}</div>
                                  <div :class="m.smbd.type==1?'up':m.smbd.type==2?'drop':'heise'">
                                    <img v-if="m.smbd.type"
                                         :src="require('@/assets/首页/bet/'+(m.smbd.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.smbd.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 33%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.2rem 0"/>
                                </div>
                              </div>
                              <div style="width: 32%;height: 3.5rem;line-height: 0.7rem">
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.1rem"
                                     :class="setBj(m.shdh)"
                                     @click="bottomPour(n,m.shdh,iF(i)+'-'+$t('bet[\'让球\']'),k.leagueName)"
                                     v-if="onLock(m.shdh)">
                                  <div>{{ m.shdh.selectionValue }}</div>
                                  <div :class="m.shdh.type==1?'up':m.shdh.type==2?'drop':'heise'">
                                    <img v-if="m.shdh.type"
                                         :src="require('@/assets/首页/bet/'+(m.shdh.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.shdh.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.55rem 0"/>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.05rem"
                                     :class="setBj(m.shda)"
                                     @click="bottomPour(n,m.shda,iF(i)+'-'+$t('bet[\'让球\']'),k.leagueName)"
                                     v-if="onLock(m.shda)">
                                  <div>{{ m.shda.selectionValue }}</div>
                                  <div :class="m.shda.type==1?'up':m.shda.type==2?'drop':'heise'">
                                    <img v-if="m.shda.type"
                                         :src="require('@/assets/首页/bet/'+(m.shda.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.shda.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.55rem 0"/>
                                </div>
                              </div>
                              <div style="width: 32%;height: 3.5rem;line-height: 0.7rem;margin-right: 0.08rem">
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.1rem"
                                     :class="setBj(m.souh)"
                                     @click="bottomPour(n,m.souh,iF(i)+'-大/小',k.leagueName)"
                                     v-if="onLock(m.souh)">
                                  <div>大{{ m.souh.selectionValue }}</div>
                                  <div :class="m.souh.type==1?'up':m.souh.type==2?'drop':'heise'">
                                    <img v-if="m.souh.type"
                                         :src="require('@/assets/首页/bet/'+(m.souh.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.souh.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.55rem 0"/>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.05rem"
                                     :class="setBj(m.soua)"
                                     @click="bottomPour(n,m.soua,iF(i)+'-大/小',k.leagueName)"
                                     v-if="onLock(m.soua)">
                                  <div>小{{ m.soua.selectionValue }}</div>
                                  <div :class="m.soua.type==1?'up':m.soua.type==2?'drop':'heise'">
                                    <img v-if="m.soua.type"
                                         :src="require('@/assets/首页/bet/'+(m.soua.type==1?'up':'drop')+'.png')"
                                         style="width: 0.3rem;margin-right: 0.05rem"/>
                                    {{ m.soua.selectionPrice }}
                                  </div>
                                </div>
                                <div style="height: 49%;background-color: #fff;margin-bottom: 0.05rem" v-else>
                                  <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.6rem;margin: 0.55rem 0"/>
                                </div>
                              </div>
                            </van-row>
                          </van-swipe-item>
                        </van-swipe>
                      </div>
                    </van-row>
                  </div>
                </van-collapse-item>
              </van-collapse>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>



    <!--串关投注遮罩-->
    <div v-if="actives.length>0" style="width: 100vw;height: 100vh;background-color: rgba(3,3,3,0.66);position: fixed;top: 0;z-index: 2025"></div>

    <!--串关投注-->
    <van-collapse v-model="actives"
                  v-if="!betSelectorShow"
                  @change="betRegulation()"
                  :class="actives.length==0&!betDetailShow?'shang bottomPour':'xia bottomPour'" v-show="betType==3">
      <van-collapse-item name="1" :is-link="false" :disabled="betSelectionList.length<2">
        <template #title>
          <van-row type="flex" justify="space-between" v-if="lookOverShoe">
            <van-row style="color: #fff" type="flex" justify="end">
              <div style="width: 0.6rem;height: 0.6rem;border-radius: 50%;background-color: white;text-align: center;color: #c1c9da;margin-right: 0.1rem">
                {{ betSelectionList.length }}
              </div>
              <div v-if="betSelectionList.length<2">{{ $t('new[\'至少选择\']') }}<span style="font-size: 0.45rem;color: white"> 2 </span>{{ $t('new[\'场比赛\']') }}</div>
              <div v-else-if="betSelectionList.length>=10">{{ $t('new[\'最多选择\']') }}<span style="font-size: 0.45rem;color: white"> 10 </span>{{ $t('new[\'场比赛\']') }} {{ actives.length==0?'':refreshTime+'s' }}</div>
              <div v-else>{{ $t('bet[\'串关投注\']') }} {{ actives.length==0?'':refreshTime+'s' }}</div>
            </van-row>
            <van-row type="flex" justify="end" >
              <div style="margin-right: 0.2rem">{{ $t('bet[\'余额\']') }}<span style="font-size: 0.45rem;color: #fff">￥{{ BetNumList.score.toFixed(2) }}</span></div>
              <img style="width: 0.3rem;height: 0.3rem;margin-top: 0.15rem;" :src="require('@/assets/首页/bet/'+(actives.length==0?'shang':'xia')+'-min.png')" />
            </van-row>
          </van-row>
        </template>
        <div class="betSelectionBox" style="color:white;"  v-if="actives.length>0">
          <div class="betSelectionBox_1" style="max-height: 7.2rem;overflow: auto;background-color: #242424">
            <van-row type="flex" justify="space-between" v-for="(k,i) in betSelectionList" :key="i" style="border-bottom: 1px solid #383838;padding: 0.3rem">
              <van-row type="flex" justify="end">
                <img :src="require('@/assets/首页/bet/cq.png')"
                     style="width: 0.3rem;height: 0.3rem;margin: 0.75rem 0.2rem 0.75rem 0;"
                     @click="delBottomPour(k)" v-if="lookOverShoe"/>
                <div style="height: 1.8rem;line-height: 0.6rem;font-size: 0.35rem">
                  <div style="font-size: 0.4rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    <img :src="require('@/assets/首页/bet/cghg.png')" style="height: 0.35rem;" />
                    {{ k.selectionName }}
                  </div>
                  <div style="margin-left: 0.1rem">{{ k.betN }}<span style="color: red">({{ k.score==''?'0-0':k.score }})</span>{{ ' '+k.selectionValue }}</div>
                  <div style="color: #8c919e;width: 5rem;margin-left: 0.1rem" class="ofHidden">{{ k.eventName }}</div>
                </div>
              </van-row>
              <div style="height:1.8rem;line-height: 1.8rem;font-size: 0.6rem;width: 3rem;text-align: right">
                <img v-if="k.type"
                     :src="require('@/assets/首页/bet/'+(k.type==1?'up':'drop')+'.png')"
                     style="width: 0.3rem;margin-right: 0.05rem"/>
                <span style="font-size: 0.35rem;">@ </span>
                {{ k.selectionPrice }}
              </div>
            </van-row>
          </div>
          <div class="betSelectionBox_2" style="background-color: #242424;max-height: 6.45rem;overflow: auto" v-if="betSelectionList.length>=2">
            <!--更多串关-->
            <div v-show="selectionListShow" >
              <van-row type="flex" justify="space-between"
                       style="border-bottom: 1px solid #d6d6d6;padding: 0.3rem"
                       v-for="(itme,i) in selectionList['sel'+betSelectionList.length]" :key="i"
                       v-if="itme.name!=selectionList['sel'+betSelectionList.length][betSelectionList.length-2].name ">
                <van-row type="flex" justify="end">
                  <div style="height: 1.2rem;line-height: 0.6rem;font-size: 0.35rem;margin-left: 0.5rem">
                    <div style="font-size: 0.4rem">
                      <img :src="require('@/assets/首页/bet/cghg.png')" style="height: 0.35rem;" />
                      {{ itme.name }}
                    </div>
                    <div style="margin-left: 0.1rem">{{ $t('bet[\'预计可赢\']') }}:<span style="color: red">{{ predictNumF(itme) }}</span></div>
                  </div>
                </van-row>
                <div style="height:1.2rem;line-height: 1rem;color: #8c919e;text-align: right">
                  <van-row type="flex" justify="end">
                    <van-field v-model="itme.num"
                               :placeholder="$t('bet[\'请输入投注金额\']')"
                               :disabled="!lookOverShoe"
                               type="number" style="width: 3.5rem;height: 0.8rem;padding: 0.05rem 0.2rem;border: 1px solid #c7c7c7"/>
                    <div style="font-size: 0.45rem;margin-left: 0.15rem">
                      <span style="font-size: 0.35rem;">X </span>{{ itme.coefficient }}
                    </div>
                  </van-row>
                  <div style="font-size: 0.35rem;line-height: 0rem">
                    {{ $t('bet[\'小计\']')  }}:{{ parseInt( ((itme.num*itme.coefficient) * 100 ) / 100 ).toFixed(2) }}
                  </div>
                </div>
              </van-row>
            </div>
            <!--默认串关-->
            <van-row type="flex" justify="space-between" style="padding: 0.3rem">
              <van-row type="flex" justify="end">
                <div style="height: 1.8rem;line-height: 0.6rem;font-size: 0.35rem;margin-left: 0.5rem">
                  <div style="font-size: 0.4rem">
                    <img :src="require('@/assets/首页/bet/cghg.png')" style="height: 0.35rem;" />
                    {{ selectionList['sel'+betSelectionList.length][betSelectionList.length-2].name }}
                  </div>
                  <div style="margin-left: 0.1rem">
                    {{ $t('bet[\'预计可赢\']') }}:
                    <span style="color: red">
                        {{ predictNumF(selectionList['sel'+betSelectionList.length][betSelectionList.length-2])}}
                      </span>
                  </div>
                  <div style="color: #8c919e;margin-left: 0.1rem;margin-top: 0.2rem" class="ofHidden"
                       @click="selectionListShow=!selectionListShow"
                       v-if="betSelectionList.length>2">{{ selectionListShow?$t('new[\'关闭\']'):$t('bet[\'更多串关类型\']') }}</div>
                </div>
              </van-row>
              <div style="height:1.8rem;line-height: 1rem;color: #8c919e;text-align: right">
                <van-row type="flex" justify="end">
                  <van-field v-model="selectionList['sel'+betSelectionList.length][betSelectionList.length-2].num"
                             :disabled="!lookOverShoe" type="number"
                             :placeholder="$t('bet[\'请输入投注金额\']')"
                             style="width: 3.5rem;height: 0.8rem;padding: 0.05rem 0.2rem;border: 1px solid #c7c7c7"/>
                  <div style="font-size: 0.45rem;margin-left: 0.15rem">
                    <span style="font-size: 0.35rem;">X </span>
                    {{ selectionList['sel'+betSelectionList.length][betSelectionList.length-2].coefficient }}
                  </div>
                </van-row>
                <div style="font-size: 0.35rem;line-height: 0rem">
                  {{ $t('bet[\'小计\']') }}:{{ parseInt( ((selectionList['sel'+betSelectionList.length][betSelectionList.length-2].num*selectionList['sel'+betSelectionList.length][betSelectionList.length-2].coefficient) * 100 ) / 100 ).toFixed(2) }}
                </div>
              </div>
            </van-row>
          </div>
          <!--投注按钮-->
          <div class="betSelectionBox_3" style="position: relative">
            <van-row type="flex" justify="space-between" v-if="lookOverShoe">
              <van-row type="flex" justify="end" class="betSelectionBox_3_left">
                <div style="border-right: 1.5px solid #B5B2CA;padding-left: 0" @click="delBottomPour2()">
                  <img :src="require('@/assets/首页/bet/ljt.png')"/>
                  <p>{{ $t('new[\'清除选择\']') }}</p>
                </div>
                <div style="padding-right: 0" @click="actives=[];betRegulation()">
                  <img :src="require('@/assets/首页/bet/tjbs.png')"/>
                  <p>{{ $t('bet[\'添加比赛\']') }}</p>
                </div>
              </van-row>
              <div class="betSelectionBox_3_right">
                <van-row type="flex" justify="space-between" style="transform: scale(0.8);min-width:210px;font-size: 0.3rem;margin: 0.1rem 0;">
                  <van-checkbox v-model="selectionList.checkedOdds" shape="square" checked-color="#D0B091">{{ $t('bet[\'接受任何赔率\']') }}</van-checkbox>
                  <van-checkbox v-model="selectionList.checkedDish" shape="square" checked-color="#D0B091">{{ $t('bet[\'接受任何盘口\']') }}</van-checkbox>
                </van-row >
                <div class="betSelectionBox_3_right_button" @click="loading?'':betSubmitBouble()">
                  <van-button :loading="loading"
                              :disabled="refreshTime<=0"
                              loading-text="下注中...">
                    {{ refreshTime<=0?$t('new[\'刷新赔率\']')+'...':$t('home[\'投注\']') }}
                  </van-button>
                  <div>{{ $t('bet[\'合计\']')
                    }}:￥{{ totalNumF(selectionList['sel'+betSelectionList.length]) }}</div>
                </div>
              </div>
            </van-row>
            <div v-else class="lookOver" @click="lookOverShoeF()">
              {{ $t('myCenter[\'注单已确认\']') }}
            </div>
            <div style="position:absolute;top: 0.1rem;right: 1rem" v-if="!lookOverShoe">
              {{ $t('bet[\'合计\']') }}:￥{{ totalNumF(selectionList['sel'+betSelectionList.length]) }}
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>

    <!--底部导航栏-->
    <!--<van-tabbar :fixed="true" route-->
                <!--:safe-area-inset-bottom="false"-->
                <!--v-if="!betSelectorShow"-->
                <!--v-show="actives.length==0&&!betDetailShow"-->
                <!--style="z-index: 2043;text-align: center;background-color: #171717"-->
                <!--active-color="#D9BB9B"-->
                <!--inactive-color="#B3BBD1">-->
      <!--<van-tabbar-item :icon="require('@/assets/首页/bet/zq_tab_list_truta.png')" @click="courseShow=true">{{ $t("bet['盘口教程']") }}</van-tabbar-item>-->
      <!--&lt;!&ndash;<van-tabbar-item :icon="require('@/assets/首页/bet/zq_tab_list_normal.png')" @click="setupMenuShow=!setupMenuShow">{{ $t("bet['设置菜单']") }}</van-tabbar-item>&ndash;&gt;-->
      <!--<van-tabbar-item :icon="require('@/assets/首页/bet/zq_tab_nosettle_normal.png')" @click="toBetRecord('Pending')">{{ $t("bet['未结注单']") }}</van-tabbar-item>-->
      <!--<van-tabbar-item :icon="require('@/assets/首页/bet/zq_tab_settle_normal.png')" @click="toBetRecord('Proces')">{{ $t("bet['已结注单']") }}</van-tabbar-item>-->
      <!--<van-tabbar-item :icon="require('@/assets/首页/bet/tz_tab_refresh_normal.png')" @click="Refresh">{{ $t("bet['刷新']") }}</van-tabbar-item>-->
    <!--</van-tabbar>-->

    <!--一键投注-->
    <van-popup class="betkaiguanShow" v-model="betkaiguanShow"
               overlay-class="betkaiguanShowOverlay"
               :zIndex="3000"
               closeable
               lock-scroll
               :close-on-click-overlay="false"
               :close-icon="require('@/assets/首页/bet/yjtz_an_gb.png')">
      <div class="title">{{ $t("bet['一键投注']") }}</div>
      <div class="betkaiguanShow_body">
        <van-field v-model="betkaiguanNum"
                   type="number"
                   :label="$t('bet[\'投注金额\']')"
                   :placeholder="$t('bet[\'请输入投注金额\']')"/>
        <div class="body_checkbox">
          <van-checkbox v-model="k.checked" v-for="(k,i) in betkaiguanChecked" :key="i">
            {{ k.name }}
            <img
              slot="icon"
              slot-scope="props"
              :src="k.checked ? require('@/assets/首页/bet/yjtz_xz.png') : require('@/assets/首页/bet/yjtz_wxz.png')"
            >
          </van-checkbox>
        </div>
      </div>
      <div class="bottom">
        <van-row type="flex" justify="space-between">
          <div class="button1" @click="cancelYJbet()">{{ $t('bet[\'取消\']') }}</div>
          <div class="button2" @click="onYJbet()">{{ $t('bet[\'开启\']') }}</div>
        </van-row>
      </div>
    </van-popup>

    <!--教程弹框-->
    <van-popup
      lock-scroll
      :overlay="false"
      class="Competition"
      v-model="courseShow"
      :zIndex="3000"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
    >
      <div class="title">{{ $t('bet[\'盘口教程\']') }}</div>
      <div class="courseShowBody">
        <van-tabs v-model="courseName">
          <van-tab :title="$t('bet[\'让球\']')" name="a">
            <div class="rqImg" ref="contentLeft">
              <div :class="scroll<0.09?'around':''" @click="scrollTopF(0)">0</div>
              <div :class="scroll>=0.09&scroll<0.18?'around':''" @click="scrollTopF(0.1)">0/0.5</div>
              <div :class="scroll>=0.18&scroll<0.3?'around':''" @click="scrollTopF(0.2)">0.5</div>
              <div :class="scroll>=0.3&scroll<0.43?'around':''" @click="scrollTopF(0.31)">0.5/1</div>
              <div :class="scroll>=0.43&scroll<0.56?'around':''" @click="scrollTopF(0.44)">1</div>
              <div :class="scroll>=0.56&scroll<0.7?'around':''" @click="scrollTopF(0.57)">1/1.5</div>
              <div :class="scroll>=0.7&scroll<0.82?'around':''" @click="scrollTopF(0.71)">1.5</div>
              <div :class="scroll>=0.82?'around':''" @click="scrollTopF(0.84)">1.5/2</div>
            </div>
            <div style="max-height: 75vh;overflow: auto" @scroll="handleScroll " ref="content">
              <img :src="require('@/assets/首页/bet/rqjc.png')" width="100%"  ref="contentImg"/>
            </div>
          </van-tab>
          <van-tab :title="$t('bet[\'大/小\']')" name="b">
            <img :src="require('@/assets/首页/bet/dxqjc.png')" width="100%" style="margin-top: 0.28rem"/>
          </van-tab>
        </van-tabs>
      </div>
    </van-popup>

    <!--赛事选择-->
    <van-popup
      lock-scroll
      :overlay="false"
      class="Competition"
      v-model="CompetitionShow"
      :zIndex="3000"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
    >
      <div class="title" style="background-color: #171717">{{ $t('new[\'选择联赛\']') }}</div>
      <form action="/">
        <van-search
          v-model="value"
          :clearable="false"
          show-action
          action-text="清除"
          clear-trigger="always"
          :placeholder="$t('new[\'请输入搜索关键词\']')"
          @cancel="value=''"
          @input="onSearch"
        />
      </form>
      <van-index-bar :index-list="selectList3" style="height: 70vh;overflow: auto;background-color: #000000">
        <van-row type="flex" justify="space-between" style="background-color: #242424">
          <div style="font-size: 18px;line-height: 1rem;height: 1rem;margin: 0 0.5rem">
            <span v-if="selectBetData.show">{{ $t('new[\'未搜索到相关内容\']') }}</span>
          </div>
          <van-cell v-if="selectList1.length>0" :title="$t('new[\'全选\']')" @click="selectBetShowF()" style="width: 3rem">
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #right-icon>
              <van-icon :name="selectBetData.bool?'passed':'circle'" class="selectBetShow"/>
            </template>
          </van-cell>
        </van-row>
        <div v-for="(k,i) in selectList1" :key="i" v-show="selectListShow(k)">
          <van-index-anchor :index="k.letter" style="background-color: #383838"/>
          <van-cell :title="n.name"  v-for="(n,j) in k.list" :key="j" v-show="n.show" @click="selectBetShowF(n)">
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #right-icon>
              <van-icon :name="n.bool?'passed':'circle'" class="selectBetShow"/>
            </template>
          </van-cell>
        </div>
      </van-index-bar>
      <div style="text-align: center">
        <van-button style="width: 5rem;border-radius: 0.2rem;margin-top: 0.7rem;background: linear-gradient(90deg, #E3B473, #F5D89B);border: none" @click="submitSearch()">{{ $t('bet[\'确定\']') }}</van-button>
      </div>
    </van-popup>

    <!--设置菜单-->
    <van-action-sheet v-model="setupMenuShow" :round="false"
                      :cancel-text="$t('bet[\'取消\']')"
                      class="setupMenuShow"
                      @cancel="setupMenuShow=false">
      <div class="content">
        <div class="box">
          <van-row>
            <van-col span="12" class="box_van-col1" style="font-size: 0.4rem">{{ $t('bet[\'排列顺序\']') }}</van-col>
            <van-col span="12" class="box_van-col2">
              <div @click="isSortButton()" class="box_van-col2_isSortButton">
                <span class="span1">{{ $t('home[\'热门\']') }}</span>
                <span class="span2">{{ $t('bet[\'时间\']') }}</span>
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="box">
          <van-row>
            <van-col span="12" class="box_van-col1" style="font-size: 0.4rem">{{ $t('bet[\'盘口设置\']') }}</van-col>
            <van-col span="12" class="box_van-col2">
              <div @click="isPkButton()" class="box_van-col2_isPkButton">
                <span class="span1">{{ $t('bet[\'欧洲盘\']') }}</span>
                <span class="span2">{{ $t('bet[\'香港盘\']') }}</span>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
    </van-action-sheet>

    <!--投注页面 -->
    <van-popup class="bet betDetailShow"
               v-model="betDetailShow"
               :closeable="betShow?false:true"
               lock-scroll
               :overlay="false"
               :zIndex="3000"
               position="bottom"
               duration="0.2"
               :style="{ height: '100%',width:'100%'}">
      <div style="margin-bottom: 3.2rem">
        <div class="betDetailBGimage ">
          <div class="betDetailTitleImg zhudui">
            <img :src="require('@/assets/首页/bet/zq_dmdt.png')" />
            <div style="font-size: 0.3rem" class="ofHidden">{{ betDetailCopyList.homeName }}</div>
          </div>
          <div class="betDetailTitleImg shijian">
            <div style="font-size: 0.3rem">{{ betDetailCopyList.eventDate }}</div>
            <div style="font-size: 0.5rem;margin: 0.5rem 0;">
              <span>{{ betDetailCopyList.score }}</span>
            </div>
          </div>
          <div class="betDetailTitleImg kedui">
            <img :src="require('@/assets/首页/bet/zq_blsiem.png')" />
            <div style="font-size: 0.3rem" class="ofHidden">{{ betDetailCopyList.awayName }}</div>
          </div>
        </div>
        <van-tabs v-model="betDetailActive" @click="" swipeable animated class="qmfyBody">
          <van-tab :title="$t('bet[\'所有盘口\']')">
            <div v-for="(k,i) in betDetailCopyList.sessions" :key="i">
              <div v-for="(n,j) in k.list" :key="j">
                <div class="Box_title">{{ n.name }}</div>
                <div v-for="(m,x) in n.list" :key="x" class="Box_title_top">
                  <div>{{ m.selectionName }}</div>
                  <div class="row_span"
                       v-for="(h,o) in m.list" :key="o">
                    <div :class="setBj(h)">
                      <div v-if="onLock(h)" @click="betShowF(n,h)">
                        <span>{{ h.selectionValue }}</span>
                        <span style="margin:0 0.4rem">{{ h.selectionPrice }}</span>
                      </div>
                      <div v-else style="height: 0.8rem;">
                        <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.5rem;margin: 0.1rem 0"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="$t('bet[\'让球\']')+'&'+$t('bet[\'大/小\']')" v-if="onShow(1)">
            <div v-for="(k,i) in betDetailCopyList.sessions" :key="i">
              <div v-for="(n,j) in k.list" :key="j" v-if="n.show==1">
                <div class="Box_title">{{ n.name }}</div>
                <div v-for="(m,x) in n.list" :key="x" class="Box_title_top">
                  <div>{{ m.selectionName }}</div>
                  <div class="row_span"
                       v-for="(h,o) in m.list" :key="o">
                    <div :class="setBj(h)">
                      <div v-if="onLock(h)" @click="betShowF(n,h)">
                        <span>{{ h.selectionValue }}</span>
                        <span style="margin:0 0.4rem">{{ h.selectionPrice }}</span>
                      </div>
                      <div v-else style="height: 0.8rem;">
                        <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.5rem;margin: 0.1rem 0"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="$t('bet[\'波胆\']')" v-if="onShow(2)">
            <div v-for="(k,i) in betDetailCopyList.sessions" :key="i">
              <div v-for="(n,j) in k.list" :key="j" v-if="n.show==2">
                <div class="Box_title">{{ n.name }}</div>
                <div v-for="(m,x) in n.list" :key="x" class="Box_title_top">
                  <div>{{ m.selectionName }}</div>
                  <div class="row_span"
                       v-for="(h,o) in m.list" :key="o">
                    <div :class="setBj(h)">
                      <div v-if="onLock(h)" @click="betShowF(n,h)">
                        <span>{{ h.selectionValue }}</span>
                        <span style="margin:0 0.4rem">{{ h.selectionPrice }}</span>
                      </div>
                      <div v-else style="height: 0.8rem;">
                        <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.5rem;margin: 0.1rem 0"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="$t('bet[\'角球\']')" v-if="onShow(3)">
            <div v-for="(k,i) in betDetailCopyList.sessions" :key="i">
              <div v-for="(n,j) in k.list" :key="j" v-if="n.show==3">
                <div class="Box_title">{{ n.name }}</div>
                <div v-for="(m,x) in n.list" :key="x" class="Box_title_top">
                  <div>{{ m.selectionName }}</div>
                  <div class="row_span"
                       v-for="(h,o) in m.list" :key="o">
                    <div :class="setBj(h)">
                      <div v-if="onLock(h)" @click="betShowF(n,h)">
                        <span>{{ h.selectionValue }}</span>
                        <span style="margin:0 0.4rem">{{ h.selectionPrice }}</span>
                      </div>
                      <div v-else style="height: 0.8rem;">
                        <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.5rem;margin: 0.1rem 0"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="$t('new2[\'黄红牌\']')" v-if="onShow(4)">
            <div v-for="(k,i) in betDetailCopyList.sessions" :key="i">
              <div v-for="(n,j) in k.list" :key="j" v-if="n.show==4">
                <div class="Box_title">{{ n.name }}</div>
                <div v-for="(m,x) in n.list" :key="x" class="Box_title_top">
                  <div>{{ m.selectionName }}</div>
                  <div class="row_span"
                       v-for="(h,o) in m.list" :key="o">
                    <div :class="setBj(h)">
                      <div v-if="onLock(h)" @click="betShowF(n,h)">
                        <span>{{ h.selectionValue }}</span>
                        <span style="margin:0 0.4rem">{{ h.selectionPrice }}</span>
                      </div>
                      <div v-else style="height: 0.8rem;">
                        <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.5rem;margin: 0.1rem 0"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="$t('bet[\'特殊投注\']')" v-if="onShow(5)">
            <div v-for="(k,i) in betDetailCopyList.sessions" :key="i">
              <div v-for="(n,j) in k.list" :key="j" v-if="n.show==5">
                <div class="Box_title">{{ n.name }}</div>
                <div v-for="(m,x) in n.list" :key="x" class="Box_title_top">
                  <div>{{ m.selectionName }}</div>
                  <div class="row_span"
                       v-for="(h,o) in m.list" :key="o">
                    <div :class="setBj(h)">
                      <div v-if="onLock(h)" @click="betShowF(n,h)">
                        <span>{{ h.selectionValue }}</span>
                        <span style="margin:0 0.4rem">{{ h.selectionPrice }}</span>
                      </div>
                      <div v-else style="height: 0.8rem;">
                        <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.5rem;margin: 0.1rem 0"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="$t('bet[\'半场\']')+'/'+$t('bet[\'全场\']')" v-if="onShow(6)">
            <div v-for="(k,i) in betDetailCopyList.sessions" :key="i">
              <div v-for="(n,j) in k.list" :key="j" v-if="n.show==6">
                <div class="Box_title">{{ n.name }}</div>
                <div v-for="(m,x) in n.list" :key="x" class="Box_title_top">
                  <div>{{ m.selectionName }}</div>
                  <div class="row_span"
                       v-for="(h,o) in m.list" :key="o">
                    <div :class="setBj(h)">
                      <div v-if="onLock(h)" @click="betShowF(n,h)">
                        <span>{{ h.selectionValue }}</span>
                        <span style="margin:0 0.4rem">{{ h.selectionPrice }}</span>
                      </div>
                      <div v-else style="height: 0.8rem;">
                        <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.5rem;margin: 0.1rem 0"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="节" v-if="onShow(7)">
            <div v-for="(k,i) in betDetailCopyList.sessions" :key="i">
              <div v-for="(n,j) in k.list" :key="j" v-if="n.show==7">
                <div class="Box_title">{{ n.name }}</div>
                <div v-for="(m,x) in n.list" :key="x" class="Box_title_top">
                  <div>{{ m.selectionName }}</div>
                  <div class="row_span"
                       v-for="(h,o) in m.list" :key="o">
                    <div :class="setBj(h)">
                      <div v-if="onLock(h)" @click="betShowF(n,h)">
                        <span>{{ h.selectionValue }}</span>
                        <span style="margin:0 0.4rem">{{ h.selectionPrice }}</span>
                      </div>
                      <div v-else style="height: 0.8rem;">
                        <img :src="require('@/assets/首页/bet/zq_sz.png')" style="height: 0.5rem;margin: 0.1rem 0"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </van-popup>

    <!--公用弹出层-->
    <van-popup class="bet"
               v-model="show"
               position="right"
               duration="0.2"
               :style="{ height: '100%',width:'100%'}">
    </van-popup>

    <!--加载动画-->
    <van-overlay :show="loadingShow" class="loadingShow">
      <div class="wrapper" @click.stop>
        <div class="block">
          <van-loading size="24px" vertical>{{ $t('new[\'加载中\']') }}...</van-loading>
        </div>
      </div>
    </van-overlay>

    <!--单式投注界面-->
    <van-popup class="betShow"
               lock-scroll
               :close-on-click-overlay="false"
               overlay-class="betShowZZ"
               closeable
               @close="closeF()"
               v-model="betShow">
      <div class="betShow_body">
        <div class="title"><i style="color: #c8401a">//</i>{{ betJson.leagueName }}<i style="color: #c8401a">//</i></div>
        <div class="vs">{{ betJson.eventName }}</div>
        <div class="betShow_body_box">
          <van-row type="flex" justify="center">
            <span class="ofHidden" style="display: inline-block;max-width: 3rem">{{ betObj.selectionName+'：'+betObj.selectionValue }}</span>
            <span>{{ '@'+betObj.selectionPrice+' ' }}</span>
            <img v-if="betObj.type" :src="require('@/assets/首页/bet/'+(betObj.type==1?'up':'drop')+'.png')" style="height: 0.3rem;width: 0.4rem;margin: 0.4rem 0.1rem"/>
          </van-row>
          <span>{{ betJson.name }}</span>
          <div style="text-align: right"><span class="refreshTime">{{ refreshTime }}</span></div>
        </div>
        <van-row type="flex" justify="space-between" style="font-size: 0.32rem">
          <div>{{ $t('bet[\'余额\']') }}：<span style="color: #ac9b87">{{ BetNumList.score }}￥</span></div>
          <div>{{ $t('bet[\'下注限额\']') }}：<span style="color: #ac9b87">{{ BetNumList.quota }}￥</span></div>
        </van-row>
        <van-cell-group style="border: 1px solid #f0f0f0;margin: 0.2rem 0">
          <van-field
            :placeholder="$t('bet[\'下注限额\']') +'：'+BetNumList.quota+'￥'"
            clickable
            type="number"
            v-model="betNum"/>
        </van-cell-group>
        <van-row class="numBox" type="flex" justify="space-between">
          <div @click="quotaBetNum(100)">100</div>
          <div @click="quotaBetNum(500)">500</div>
          <div @click="quotaBetNum(1000)">1000</div>
        </van-row>
        <van-row class="numBox" type="flex" justify="space-between">
          <div @click="quotaBetNum(2000)">2000</div>
          <div @click="quotaBetNum(5000)">5000</div>
          <div @click="quotaBetNum(BetNumList.score)">{{ $t('bet[\'最大\']') }}</div>
        </van-row>
        <div style="font-size: 0.35rem;color: #979db0;text-align: center">{{ $t('bet[\'可赢金额\']') }}：<span style="color: red">￥ {{ ( parseInt( (betObj.selectionPrice*betNum) * 100 ) / 100 ).toFixed(2) }}</span></div>
        <div style="height: 1.6rem;font-size: 0.38rem;width: 45%;margin:0.1rem auto 0;">
          <van-checkbox-group v-model="result">
            <van-checkbox name="2" shape="square" v-model="result" style="height: 0.8rem;width: 5rem" checked-color="#07c160" icon-size="0.38rem">{{ $t('bet[\'接受任何赔率\']') }}</van-checkbox>
            <van-checkbox name="1" shape="square" v-model="result" style="height: 0.8rem;width: 5rem" checked-color="#07c160" icon-size="0.38rem">{{ $t('bet[\'接受任何盘口\']') }}</van-checkbox>
          </van-checkbox-group>
        </div>
        <div style="text-align: center">
          <van-button
            @click="betSubmit()"
            :loading="loading" :loading-text="$t('bet[\'确认下注\']')+'...'"
            :disabled="refreshTime<=0"
            color="linear-gradient(to right, #DCCAB8, #D3B699)"
            style="width: 4rem;margin: 0.3rem;border-radius: 0.2rem">{{ refreshTime<=0?$t('new[\'刷新赔率\']')+'...':$t('bet[\'确认下注\']') }}</van-button>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
  import $ from 'jquery'
  import YSB from '@/util/YSB' //YSB数据
  export default {
    data() {
      return {
        lookOverShoe:true,
        loading:false,
        result:[],
        betNum:'',
        betShow:false,
        show:false,
        betSelectorShow:false,
        sortButton:true,
        pkButton:false,
        setupMenuShow:false,//设置弹框
        courseShow:false,//教程弹框
        courseName:'a',
        CompetitionShow:false,
        value:'',
        CompetitionTab:['1','2'],
        keyword:'',
        activeNames:['1','2'],
        // pitch_on:'',
        actives:[],
        activeID:[],
        active2ID:[],
        betkaiguan:localStorage.getItem('betkaiguan')=='true'?true:false,
        betkaiguanShow:false,
        betkaiguanNum:localStorage.getItem('betkaiguanNum')||null,
        betkaiguanChecked:[
          { name:this.$t('bet[\'接受任何赔率\']'), checked:localStorage.getItem('checked1')=='true'?true:false },
          { name:this.$t('bet[\'接受任何盘口\']'), checked:localStorage.getItem('checked2')=='true'?true:false },
        ],
        betType:parseInt(sessionStorage.getItem('type'))||2,
        gameCode:'',
        betList:[
          { text: this.$t("home['今日']"), value: 0 },
          { text: this.$t("home['滚球']"), value: 1 },
          { text: this.$t("home['早盘']"), value: 2 },
          { text: this.$t("home['串关']"), value: 3 },
        ],
        loadingShow:true,
        // 投注页面
        betDetailShow:false,
        betDetailActive:0,
        betDetailCopyList:{sessions:[]},
        AllType:[//show:1让球&大小,2波胆,3角球,4红黄牌,5特殊投注,6半/全场,7节,0未分类
          {id:1 ,type:"Match Bet" ,name:"独赢",show:1},
          {id:2 ,type:"Handicap" ,name:"让分盘",show:1},
          {id:3 ,type:"Asian Handicap" ,name:"亚洲让分盘",show:1},
          {id:4 ,type:"Total Score Over/Under" ,name:"总分以上或以下",show:1},
          {id:5 ,type:"First Goal scorer" ,name:"首名入球球员",show:5},
          {id:6 ,type:"First Team To Kick Off" ,name:"首支开球球队",show:5},
          {id:7 ,type:"First Team To Score" ,name:"首支入球球队",show:5},
          {id:8 ,type:"First Yellow Card" ,name:"首张黄卡",show:4},
          {id:9 ,type:"Double Result" ,name:"半全场",show:6},
          {id:10 ,type:"Correct Score" ,name:"正确比分",show:2},
          {id:12 ,type:"Buying Points" ,name:"购买点数",show:0},
          {id:13 ,type:"Fixed Odds" ,name:"固定赔率",show:0},
          {id:14 ,type:"SP" ,name:"彩池",show:0},
          {id:15 ,type:"Forecast" ,name:"位置连赢",show:1},
          {id:16 ,type:"Reverse Forecast" ,name:"调头位置连赢",show:0},
          {id:17 ,type:"Quinella" ,name:"连赢",show:0},
          {id:18 ,type:"Tricast" ,name:"三重彩",show:0},
          {id:19 ,type:"Main Draw" ,name:"搅珠",show:0},
          {id:20 ,type:"total over" ,name:"总数上盘",show:0},
          {id:21 ,type:"total under" ,name:"总数下盘",show:0},
          {id:22 ,type:"total odd" ,name:"总数单数",show:0},
          {id:23 ,type:"total even" ,name:"总数双数",show:0},
          {id:24 ,type:"total range" ,name:"总数范围",show:0},
          {id:25 ,type:"total over(with bonus ball(s))" ,name:"总数上盘(包括特别号码)",show:0},
          {id:26 ,type:"total under(with bonus ball(s))" ,name:"总数下盘(包括特别号码)",show:0},
          {id:27 ,type:"total odd(with bonus ball(s))" ,name:"总数单数(包括特别号码)",show:0},
          {id:28 ,type:"total even(with bonus ball(s))" ,name:"总数双数(包括特别号码)",show:0},
          {id:29 ,type:"total range(with bonus ball(s))" ,name:"总数范围(包括特别号码)",show:0},
          {id:30 ,type:"single color" ,name:"单号颜色",show:0},
          {id:31 ,type:"single odd" ,name:"单数",show:0},
          {id:32 ,type:"single even" ,name:"双数",show:0},
          {id:33 ,type:"single over" ,name:"上盘",show:0},
          {id:34 ,type:"single under" ,name:"下盘",show:0},
          {id:35 ,type:"single range" ,name:"单号范围",show:0},
          {id:36 ,type:"single exact" ,name:"单号号码",show:0},
          {id:37 ,type:"bonus exact" ,name:"特别号码",show:0},
          {id:38 ,type:"bonus over" ,name:"特别号码上盘",show:0},
          {id:39 ,type:"bonus under" ,name:"特别号码下盘",show:0},
          {id:40 ,type:"bonus odd" ,name:"特别号码单数",show:0},
          {id:41 ,type:"bonus even" ,name:"特别号码双数",show:0},
          {id:42 ,type:"bonus range" ,name:"特别号码范围",show:0},
          {id:43 ,type:"bonus color" ,name:"特别号码颜色",show:0},
          {id:44 ,type:"total bonus over" ,name:"特别号码总数上盘",show:0},
          {id:45 ,type:"total bonus under" ,name:"特别号码总数下盘",show:0},
          {id:46 ,type:"total bonus odd" ,name:"特别号码总数单数",show:0},
          {id:47 ,type:"total bonus even" ,name:"特别号码总数双数",show:0},
          {id:48 ,type:"total bonus range" ,name:"特别号码总数范围",show:0},
          {id:49 ,type:"Straight Forecast" ,name:"定位连赢",show:0},
          {id:50 ,type:"Team to Qualify For Next Round" ,name:"晋级队伍",show:0},
          {id:51 ,type:"Dual Forecast" ,name:"连赢",show:0},
          {id:52 ,type:"Set Betting" ,name:"每局投注",show:0},
          {id:53 ,type:"Round Betting" ,name:"每回合投注",show:0},
          {id:54 ,type:"zodiac" ,name:"生肖",show:0},
          {id:55 ,type:"millenary" ,name:"三组後位数",show:0},
          {id:56 ,type:"myriad " ,name:" 颜色",show:0},
          {id:58 ,type:"single zodiac" ,name:"单生肖",show:0},
          {id:59 ,type:"winning margin soccer" ,name:"足球净赢比分数",show:5},
          {id:60 ,type:"Team Totals" ,name:"单队得分总数大小盘",show:1},
          {id:61 ,type:"odd/even" ,name:"单数/双数",show:1},
          {id:62 ,type:"5 elements" ,name:"-",show:1},
          {id:62 ,type:"over/under" ,name:"大/小",show:1},
          {id:64 ,type:"highest quarter" ,name:"最高节",show:7},
          {id:65 ,type:"winning margin basketball" ,name:"蓝球净赢比分数",show:5},
          {id:66 ,type:"double result basketball" ,name:"蓝球半全场",show:6},
          {id:67 ,type:"corners match bet" ,name:"角球独赢",show:3},
          {id:68 ,type:"corners handicap" ,name:"角球让分盘",show:3},
          {id:69 ,type:"corners over/under" ,name:"角球总分",show:3},
          {id:70 ,type:"corners odd/even" ,name:"角球单或双",show:3},
          {id:71 ,type:"bookings match bet" ,name:"罚牌独赢",show:4},
          {id:72 ,type:"bookings handicap" ,name:"罚牌让分盘",show:4},
          {id:73 ,type:"bookings over/under" ,name:"罚牌总分",show:4},
          {id:74 ,type:"bookings odd/even" ,name:"罚牌单或双",show:4},
          {id:75 ,type:"yellow card match bet" ,name:"黄卡独赢",show:4},
          {id:76 ,type:"yellow card handicap" ,name:"黄卡让分盘",show:4},
          {id:77 ,type:"yellow card over/under" ,name:"黄卡总分",show:4},
          {id:78 ,type:"yellow card odd/even" ,name:"黄卡单或双",show:4},
          {id:79 ,type:"Double chance" ,name:"双重机会",show:5},
          {id:80 ,type:"Last score" ,name:"最后得分的队伍",show:5},
          {id:81 ,type:"Next score" ,name:"下一支得分队伍",show:5},
          {id:82 ,type:"Both team score" ,name:"两队都进球",show:5},
          {id:83 ,type:"Score both half" ,name:"双半场均有进球的队伍",show:5},
          {id:84 ,type:"Team to score" ,name:"进球的队伍",show:5},
          {id:85 ,type:"highest half" ,name:"半场最高总分",show:6},
          {id:86 ,type:"highest quarter team" ,name:"单节最高总分",show:7},
          {id:87 ,type:"winning margin 3way" ,name:"三项输赢比数",show:5},
          {id:88 ,type:"race to" ,name:"首先获得",show:5},
          {id:89 ,type:"overtime" ,name:"加时",show:5},
          {id:90 ,type:"winning margin 7way" ,name:"七项输赢比数",show:5},
          {id:91 ,type:"winning margin 12way" ,name:"十二项输赢比数",show:5},
          {id:92 ,type:"team oe" ,name:"单队得分单/双",show:5},
          {id:93 ,type:"6min handicap" ,name:"首 6 让分盘",show:5},
          {id:94 ,type:"6min over/under" ,name:"首 6 大小盘",show:5},
          {id:95 ,type:"5min handicap" ,name:"首 5 让分盘",show:5},
        ],//所有体育投注类型
        betJson:[],
        betObj:{},
        BetNumList:{
          score:this.$store.state.score,//余额
          quota:0,//限额
        },
        deviceType:localStorage.getItem('deviceType'),//1安卓，2苹果，0H5
        projectName:'',
        refreshTime:5,
        refreshTimeObj:null,
        userData:JSON.parse(localStorage.getItem('userData')),

        CompetitionData:[],//非热门
        HotSportData:[],//热门
        gqID:'',//滚球ID
        fgqID:'',//非滚球ID
        gqList:[],
        fgqList:[],
        betListSave:{
          bool:false,
          list:[],
        },//临时保存

        selectionListShow:false,
        betSelectionList:[],//串关投注list
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
        scroll:0,
        bool:true,
        //选择赛事
        selectList1:[],
        selectList2:[],
        selectList3:[],
        selectBetData:{
          bool:false,
          show:false,
        },
        sportsType:[],//赛项数组
        selectionIds:[],//串关投注项ID（用于批量刷新赔率）
        predict:0,
        DataNum:{
          jrNum:this.$store.state.DataNum.jrNum,
          gqNum:this.$store.state.DataNum.gqNum,
          zpNum:this.$store.state.DataNum.zpNum,
          cgNum:this.$store.state.DataNum.cgNum,
        },
      };
    },
    created(){
      //检查是否为已注册（第三方）
      // this.checkUserRegister()
    },
    destroyed () {

    },
    activated(){
      if(this.$store.state.refresh){
        console.log('刷新')
        window.location.reload()
      }
      this.show=false
      this.getSportTypeConfig()
    },
    watch: {
      "$store.state.score": function() {
        this.BetNumList.score = this.$store.state.score;
      },
      //今日、滚球、早盘、串关
      "$store.state.DataNum":{
        deep:true, //深度监听设置为 true
        handler:function(n,o) {
          this.DataNum = n;
          this.sportsNum()
        }
      },
      //监听滚球对象
      "$store.state.gqData":{
        deep:true, //深度监听设置为 true
        handler:function(n,o){
          for (let k of n) {
            if(this.activeID.length==0){
              this.activeID.push(k.leagueId)
            }
            for (let newY of k.events) {
              for (let a of o){
                for (let oldY of a.events) {
                  if(newY.parentId==oldY.parentId){
                    for (let i in newY.sessions){
                      for (let j in newY.sessions[i]) {
                        if(Object.prototype.toString.call(newY.sessions[i][j])=='[object Object]'){
                          if(newY.sessions[i][j].selectionPrice>oldY.sessions[i][j].selectionPrice){
                            newY.sessions[i][j].type==1
                          }else if(newY.sessions[i][j].selectionPrice<oldY.sessions[i][j].selectionPrice){
                            newY.sessions[i][j].type==2
                          }else {
                            newY.sessions[i][j].type==2
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          this.gqList=n
        }
      },
      //监听非滚球对象
      "$store.state.fgqData":{
        deep:true, //深度监听设置为 true
        handler:function(n,o){
          for (let k of n) {
            if(this.active2ID.length==0){
              this.active2ID.push(k.leagueId)
            }
          }
          this.fgqList=n
        }
      },
      //监听刷新赔率
      "$store.state.newBetData":{
        deep:true, //深度监听设置为 true
        handler:function(n,o){
          if(this.actives.length==0){
            let obj=n[this.betObj.selectionId]
            if(this.betObj.selectionPrice>obj.odd){
              this.betObj.type=2
            }else if(this.betObj.selectionPrice<obj.odd){
              this.betObj.type=1
            }else {
              this.betObj.type=null
            }
            this.betObj.selectionStatus=obj.status;
            this.betObj.selectionValue=obj.selectionValue;
            this.betObj.selectionPrice=obj.odd;
          }else {
            for (let k of this.betSelectionList){
              let obj=n[k.selectionId]
              if(k.selectionPrice>obj.odd){
                k.type=2
              }else if(k.selectionPrice<obj.odd){
                k.type=1
              }else {
                k.type=null
              }
              k.selectionPrice=obj.odd
              k.selectionValue=obj.selectionValue
              k.selectionStatus=obj.status
            }
            this.betRegulation()
          }
        }
      },
      "actives":{ //监听串关投注卡
        deep:true, //深度监听设置为 true
        handler:function(n,o){
          if(n.length==0){
            this.closeF()
            $('body').css('overflow','visible');//滚动
            return
          }
          let obj = this.selectionList
          obj.checkedOdds=localStorage.getItem('checked1')=='true'?true:false
          obj.checkedDish=localStorage.getItem('checked2')=='true'?true:false
          for (let i in obj) {
            if(Object.prototype.toString.call(obj[i]) == '[object Array]'){
              for (let k of obj[i]) {
                k.num=localStorage.getItem('betkaiguanNum')||null
              }
            }
          }
          this.onNewBetData(this.selectionIds.join(','))
          $('body').css('overflow','hidden');//禁止滚动
        }
      },
    },
    methods: {
      //检查是否为已注册（第三方）
      checkUserRegister(){
        this.$ajax.get('/game/checkUserRegister?userId='+this.userData.userId
        ).then(res => {
          if(res.data){

          }else {
            this.clientRegister()
          }
        }).catch(error => {
          this.$toast.fail(error);
        })
      },
      //注册
      clientRegister(){
        this.$ajax.post('/game/clientRegister',{
          "agentId": this.$store.state.agentId,
          "gameCode": "YSB",
          "userId": this.userData.userId,
        }).then(res => {
          if(res.data){

          }
        }).catch(error => {
          this.$toast.fail(error);
        })
      },
      onShow(i){
        let bool = false
        for (let k of this.betDetailCopyList.sessions) {
          for (let n of k.list) {
            if(n.show==i){
              bool=true
            }
          }
        }
        return bool
      },
      //计算没个赛事的数量
      sportsNum(bool){
        let i=0
        let obj={}
        let zpNum=0
        for (let n of this.sportsType) {
          n.num=0
          for (let k of this.$store.state.menuBoj) {
            if(k.sportType==n.gameCode.toLowerCase()){
              n.gameName=k.sportName
              if(k.isLive){//滚球(进心中)
                n.gqId=k.sportId
                if(this.betType==1){//滚球
                  n.num+=k.totalCount
                }else if(this.betType==3&&k.totalCount){//串关
                  n.num+=k.totalCount
                }
              }else {//非滚球(未开赛)
                zpNum+=k.totalCount
                n.fgqId=k.sportId
                if(this.betType==0&&k.todayCount){//今日
                  n.num+=k.todayCount
                }else if(this.betType==2&&k.totalCount){//早盘(只能统计所有非滚球)
                  n.num+=k.totalCount
                }else if(this.betType==3&&k.totalCount){//串关
                  n.num+=k.totalCount
                }
              }
            }
          }
          if(n.num>0&&i==0){
            obj=n
            i++
          }
        }
        this.DataNum.zpNum=zpNum
        if(bool){
          this.showBoxF(obj)
        }
      },
      //获取体育赛事Type
      getSportTypeConfig(){
        this.$ajax.get('/game/getSportTypeConfig?agentId='+this.$store.state.agentId
        ).then(res => {
          if(res.data){
            this.sportsType=[]
            for (let k of res.data){
              k.num=0
              k.gqId=''
              k.fgqId=''
              k.bool=false
              this.sportsType.push(k)
            }
            this.entrance()
          }
        }).catch(error => {
          // this.$toast.fail(error);
        })
      },
      //取消一键投注
      cancelYJbet(){
        localStorage.removeItem('betkaiguanNum')
        localStorage.removeItem('checked1')
        localStorage.removeItem('checked2')
        this.betkaiguanNum=null
        this.betkaiguanChecked[0].checked=false
        this.betkaiguanChecked[1].checked=false
        this.betkaiguanShow=false
        this.$toast.success(this.$t('bet[\'取消\']')+'！');
        this.betkaiguan=false
        localStorage.setItem('betkaiguan',this.betkaiguan)
      },
      //一键投注
      onYJbet(){
        let num = parseFloat(this.betkaiguanNum)
        if(num>0){
          let a = /^(\d+|\d+\.\d{1,2})$/;
          if(!a.test(num)){
            this.$toast.fail(this.$t('new2[\'最多两位小数\']')+'！');
            return
          }
          localStorage.setItem('betkaiguanNum',this.betkaiguanNum)
          localStorage.setItem('checked1',this.betkaiguanChecked[0].checked)
          localStorage.setItem('checked2',this.betkaiguanChecked[1].checked)
          this.$toast.success(this.$t('withdrawl[\'提交成功\']')+'！');
          setTimeout(()=>{
            this.betkaiguan=true
            this.betkaiguanShow=false
            localStorage.setItem('betkaiguan',this.betkaiguan)
          },1000)
        }else {
          this.$toast.fail(this.$t('new[\'请输入正确的投注金额\']')+'！');
          return
        }

      },
      //选择赛事，筛选数据
      pySegSort(arr,empty) {
        if(!String.prototype.localeCompare)
          return null;

        var letters = "*abcdefghjklmnopqrstwxyz".split('');
        var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
        var segs = [];
        var curr;
        $.each(letters, function(i,value){
          curr = {letter: this, data:[]};
          $.each(arr, function() {
            if((!zh[i-1] || zh[i-1].localeCompare(this,"zh") <= 0) && (zh[i] && this.localeCompare(zh[i],"zh") == -1)) {
              curr.data.push(this);
            }else if((/^[A-z]*$/).test(this[0]) && value == this[0].toLowerCase()){
              curr.data.push(this);
            }
          });
          if(empty || curr.data.length) {
            segs.push(curr);
            curr.data.sort(function(a,b){
              return a.localeCompare(b,"zh");
            });
          }
        });
        return segs;
      },
      //弹出一键投注
      onBetkaiguanShow(){
        this.betkaiguanNum=localStorage.getItem('betkaiguanNum')||null
        this.betkaiguanChecked[0].checked=localStorage.getItem('checked1')=='true'?true:false
        this.betkaiguanChecked[1].checked=localStorage.getItem('checked2')=='true'?true:false
        this.betkaiguanShow=true
      },
      //弹出选择赛事
      CompetitionShowF(){
        this.value=''
        this.CompetitionShow=true;
        this.selectBetData={
          bool:false,
          show:false,
        }
        let arrName=[];
        for (let k of this.gqList) {
          arrName.push(k.leagueName)
        }
        for (let k of this.fgqList) {
          arrName.push(k.leagueName)
        }
        let obj =[]
        let arr = JSON.parse(JSON.stringify(this.pySegSort(arrName)))
        this.selectList3 = [];
        for (let k of arr){
          let name=''
          k.list=[]
          k.data=Array.from(new Set(k.data))
          for (let j in k.data) {
            name=k.data[j]
            k.show=true
            k.list.push({name:name,bool:false,show:true})
          }
          this.selectList3.push(k.letter.toUpperCase());
        }
        this.selectList1=JSON.parse(JSON.stringify(arr))
      },
      //判断搜索
      selectListShow(obj){
        for (let k of obj.list) {
          if(k.show){
            return true
          }
        }
        return false
      },
      //确认搜索
      submitSearch(){
        let arr = this.selectList1
        this.betListSave={
          bool:false,
          list:[],
        }
        let list=[]
        for (let k of arr){
          for(let n of k.list){
            if(n.bool){
              list.push(n.name)
              // this.gqListSave=gqList.concat(this.gqList.filter(val=>val.leagueName.indexOf(n.name)!==-1))
              // this.fgqListSave=fgqList.concat(this.fgqList.filter(val=>val.leagueName.indexOf(n.name)!==-1))
            }
          }
        }
        if(list.length==0){
          this.$toast.fail(this.$t('new[\'最少选择一场赛事\']'));
          return
        }
        this.betListSave={
          bool:true,
          list:list,
        }
        this.CompetitionShow=false;
      },
      //勾选赛事
      selectBetShowF(obj){
        let arr = this.selectList1
        if(obj){
          obj.bool=!obj.bool
        }else {
          this.selectBetData.bool=!this.selectBetData.bool
          for(let k of arr){
            for(let n of k.list){
              if(n.show){
                n.bool=this.selectBetData.bool
              }
            }
          }
        }
      },
      //选择赛事输入框
      onSearch(val) {
        let obj = this.selectList1
        let show=true
        for (let j=0;j<obj.length;j++) {
          let bool=true
          for (let i=0;i<obj[j].list.length;i++) {
            if(obj[j].list[i].name.indexOf(val)==-1){
              obj[j].list[i].show=false
            }else {
              obj[j].list[i].show=true
              bool=false
            }
          }
          if(bool){
            obj[j].show=false
          }else {
            obj[j].show=true
            show=false
          }
        }
        if(show){
          this.selectBetData.show=true
        }else {
          this.selectBetData.show=false
        }
      },
      onBetListSave(name){
        if(this.betListSave.bool){
          return this.betListSave.list.indexOf(name)!=-1
        }else {
          return true
        }
      },
      //盘口教程-让球
      scrollTopF(i){
        this.$refs.content.scrollTop=this.$refs.contentImg.offsetHeight*i
      },
      handleScroll(el){
        let scrollTop = this.$refs.content.scrollTop
        let offsetHeight = this.$refs.contentImg.offsetHeight
        this.scroll=scrollTop/offsetHeight


        if(scrollTop>=1740&scrollTop<2330){
          this.$refs.contentLeft.scrollLeft=40
        }else if(scrollTop>=2330&scrollTop<2880){
          this.$refs.contentLeft.scrollLeft=120
        }else if(scrollTop>=2880){
          this.$refs.contentLeft.scrollLeft=400
        }else {
          this.$refs.contentLeft.scrollLeft=0
        }
      },
      //注单已确认
      lookOverShoeF(){
        this.$store.commit("delBetObj");
        this.betSelectionList = []
        this.actives=[]
        this.lookOverShoe=true
      },
      //清空全部下注
      delBottomPour2(){
        this.$dialog.confirm({
          className:'qcxzDialog',
          overlay:false,
          title: this.$t('topUp[\'清除\']'),
          message: this.$t('new[\'是否要清除所有选项\']'),
        }).then(() => {
          this.$store.commit("delBetObj");
          this.betSelectionList = []
          this.actives=[]
        })
      },
      //删除单条下注
      delBottomPour(k){
        let betObj = this.$store.state.betObj
        for (let i = 0;i < betObj.length; i++) {
          if (k.parentId==betObj[i].parentId) {
            betObj.splice(i,1);
          }
        }
        if(betObj.length<=2){
          this.selectionListShow=false
          if(betObj.length<=1){
            this.actives=[]
          }
        }
        this.betRegulation()
      },
      //选中背景
      setBj(obj){
        if(this.betType!=3){
          return
        }
        let betObj = this.$store.state.betObj
        for(let k of betObj){
          if(k.selectionId==obj.selectionId){
            return 'bj'
          }
        }
      },
      iF(i){
        return i==0?this.$t('bet[\'全场\']'):i==1?this.$t('bet[\'上半场\']'):i==2?this.$t('bet[\'下半场\']'):i==3?this.$t('new[\'第一节\']'):i==4?this.$t('new[\'第二节\']'):i==5?this.$t('new[\'第三节\']'):i==6?this.$t('new[\'第四节\']'):this.$t('new[\'其他\']')
      },
      //投注卡上锁
      onLock(obj){
        if(obj&&obj.selectionPrice>1&&obj.selectionStatus =='a'){
          if(this.betType==3&&obj.comboType==0){
            return false
          }else {
            return true
          }
        }else {
          return false
        }
      },
      //串关投注
      bottomPour(obj,list,betN,leagueName){
        this.closeF()
        if(this.betType!=3){
          obj.name=betN
          obj.leagueName=leagueName
          this.betShowF(obj,list)
          return
        }
        let betObj = this.$store.state.betObj
        for (let i = 0;i < betObj.length; i++){
          if(list.selectionId==betObj[i].selectionId){
            betObj.splice(i,1)
            return
          }
          if(betObj[i].parentId==obj.parentId){
            this.$toast.fail(this.$t('new2[\'本场比赛您已选择投注项，若想选择其他项请先取消已选项\']'));
            return
          }
        }
        if(betObj.length==10){
          this.$toast.fail(this.$t('new[\'最多选择\']')+'10'+this.$t('new[\'场比赛\']')+'！');
          return
        }
        let betSelectionList = {
          "eventName":obj.eventName,//队名 vs 队名
          "parentId":obj.parentId,//投注项ID
          "selectionName":list.selectionName,
          "betN":betN,
          "selectionPrice": list.selectionPrice,//赔率
          "score": obj.score,//比分
          "selectionId": list.selectionId,//投注项id
          "selectionValue": list.selectionValue,//值
          "parentSportName":obj.parentSportName,
        }
        this.$store.commit("changeBetObj", betSelectionList);
        this.betSelectionList = this.$store.state.betObj
      },
      //快选金额
      quotaBetNum(num){
        let obj= Object.assign({},this.BetNumList)
        let arr=[num,obj.score,obj.quota]
        this.betNum=(Math.min.apply(null,arr)+'')
      },
      //关闭投注
      closeF(){
        console.log('关闭')
        clearInterval(this.refreshTimeObj)
      },
      //单式下注
      betSubmit(){
        if(this.betNum==''){
          this.$toast.fail(this.$t('bet[\'请输入投注金额\']'));
          return
        }
        if(this.betNum<8){
          this.$toast.fail(this.$t('new2[\'最低下注金额\']')+'8￥');
          return
        }
        let a = /^(\d+|\d+\.\d{1,2})$/;
        if(!a.test(this.betNum)){
          this.$toast.fail(this.$t('new2[\'最多两位小数\']')+'！');
          return
        }
        if(this.betNum>parseFloat(this.BetNumList.score)){
          this.$toast.fail(this.$t('prompt[\'用户余额不足\']'));
          return
        }
        if(this.betNum>parseFloat(this.BetNumList.quota)){
          this.$toast.fail(this.$t('bet[\'下注限额\']')+this.BetNumList.quota+'￥');
          return
        }
        let oddModel=null
        if(this.result.length==0){
          this.$toast.fail(this.$t('new[\'请选择用户协议\']'));
          return
        }else {
          if(this.result.indexOf(1)!=-1&&this.result.indexOf(2)!=-1){
            oddModel=3
          }else {
            oddModel=this.result[0]
          }
        }
        this.loading=true
        this.$ajax.post('/game/betSubmitRefNo',{
          "sportType":'',
          "betModel": this.deviceType==0?1:this.deviceType==1?4:3,//第三方需要：1-H5,3-IOS,4-安卓
          "betStakeList": [
            {
              "stake": this.betNum,
              "submitType": 1,
              "betSelectionList": [
                {
                  "decimalPrice": this.betObj.selectionPrice,
                  "score": this.betJson.score==''?'-':this.betJson.score,
                  "selectionId": this.betObj.selectionId,
                  "selectionValue": this.betObj.selectionValue,
                  "betTypeId": this.betJson.name,
                  "eventName": this.betJson.eventName,
                  "selectionName": this.betObj.selectionName,
                  "sportName": this.betJson.parentSportName
                }
              ],
            }
          ],
          "gameCode": "YSB",
          "oddModel": oddModel,
          "oddType": this.pkButton?6:3,//3-欧洲，6-香港
          "userId": this.userData.userId,
        }).then(res => {
          this.closeF()//投注成功，关闭赔率刷新
          this.BetNumList.score=this.BetNumList.score-this.betNum
          this.$toast.success(res.data);
          this.betShow=false
        }).catch(error => {
          this.$toast.fail(error);
        }).finally(()=>{
          setTimeout(()=>{
            this.loading=false
          },1000)
        })
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
      //返回预计中奖金额
      predictNumF(obj){
        if(obj.num>0){
          return (obj.num*obj.predictNum-obj.num*obj.coefficient).toFixed(2)
        }else {
          return '0.00'
        }
      },
      //返回合计金额
      totalNumF(obj){
        let num=0
        for (let k of obj) {
          num+=k.coefficient*k.num
        }
        return num
      },
      //计算串关下注规则
      betRegulation(){
        let obj = this.selectionList
        let length = this.betSelectionList.length
        let arr= []
        this.selectionIds=[]
        for(let k of this.betSelectionList){
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
            for (let n of this.betSelectionList) {
              num3+=parseFloat(n.selectionPrice)
            }
            k.predictNum=num3
            k.coefficient=length3+length
          }
          i++
        }
      },
      //刷新串关限额和赔率
      getBatchMaxBetLimit(){
        this.$ajax.post('/game/getBatchMaxBetLimit',{
          "agentId": this.$store.state.agentId,
          "gameCode": "YSB",
          "userId": this.userData.userId,
          "selId": this.betJson.selId,
        }).then(res => {
          if(res.data){

          }
        }).catch(error => {
          this.$toast.fail(error);
        }).finally(()=>{

        })
      },
      //筛选数组
      filtrateArr(arr){
        for (var a = []; a.push([]) < arr.length;) ;
        var b = Math.pow(2, arr.length) - 1;
        for (var i = 1; i <= b; i++) {
          var c = [];
          for (var s = i, k = 0; s > 0; s >>= 1, k++)
            if (s & 1 == 1)
              c.push(arr[k]);
          a[c.length - 1].push(c);
        }
        return a;
      },
      //串关下注
      betSubmitBouble() {
        let length = this.betSelectionList.length
        let obj = this.selectionList
        let betSelectionList = []
        let betStakeList = []
        for (let k of this.betSelectionList) {
          betSelectionList.push({
            "betTypeId": k.betN,
            "decimalPrice": k.selectionPrice,
            "eventName": k.eventName,
            "score": k.score == '' ? '-' : k.score,
            "selectionId": k.selectionId,
            "selectionName": k.selectionName,
            "selectionValue": k.selectionValue,
            "sportName": k.parentSportName,
          })
        }
        //多串配置
        let data = {
          '11': [2,2,2,3],
          '12': [1,1,1,2,2,2,3],
          '13': [2,2,2,2,2,2,3,3,3,3,4],
          '14': [1,1,1,1,2,2,2,2,2,2,3,3,3,3,4],
          '15': [2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,5],
          '16': [1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,5],
          '17': [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,6],
          '18': [1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,6],
          '19': [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,6],
        }

        let score=0//合计金额
        for (let k of obj['sel'+length]){
          if(k.num>0){
            if(k.num<8){
              this.$toast.fail(this.$t('new2[\'最低下注金额\']')+' 8￥');
              return
            }
            score+=parseFloat(k.num*k.coefficient)
            if(k.type>10){
              let x=0
              for (let i in data[k.type]) {
                if(i>0&&data[k.type][i]>data[k.type][i-1]){
                  x=0
                }
                betStakeList.push({
                  "betSelectionList":this.filtrateArr(betSelectionList)[data[k.type][i]-1][x],
                  "stake": k.num,
                  "submitType": data[k.type][i],
                })
                x++
              }
            }else {
              for (let m of this.filtrateArr(betSelectionList)) {
                if(k.coefficient==m.length){
                  for (let h of m) {
                    if(k.type==h.length){
                      betStakeList.push({
                        "betSelectionList":h,
                        "stake": k.num,
                        "submitType": k.type,
                      })
                    }
                  }
                }
              }
            }
          }else if(isNaN(k.num)){
            this.$toast.fail(this.$t('new[\'请输入正确的投注金额\']'));
            return
          }
        }
        if(this.BetNumList.score<score){
          this.$toast.fail(this.$t('new2[\'您的余额不足，请修改串关玩法投注金额\']'));
          return
        }
        if(betStakeList.length==0){
          this.$toast.fail(this.$t('bet[\'请输入投注金额\']'));
          return
        }
        let oddModel=null
        if(!obj.checkedOdds&&!obj.checkedDish){
          this.$toast.fail(this.$t('new[\'请选择用户协议\']'));
          return
        }else {
          if(obj.checkedOdds&&obj.checkedDish){
            oddModel=3
          }else {
            if(obj.checkedOdds){
              oddModel=1
            }else {
              oddModel=2
            }
          }
        }
        this.loading=true
        this.$ajax.post('/game/betSubmitRefNo',{
          "sportType":'',
          "betModel": this.deviceType==0?1:this.deviceType==1?4:3,//第三方需要：1-H5,3-IOS,4-安卓
          "betStakeList": betStakeList,
          "gameCode": "YSB",
          "oddModel": oddModel,
          "oddType": this.pkButton?6:3,//3-欧洲，6-香港
          "userId": this.userData.userId,
        }).then(res => {
          this.closeF()//投注成功，关闭赔率刷新
          this.$toast.success(res.data);
          //this.betShow=false
          this.lookOverShoe=false
          this.BetNumList.score=this.BetNumList.score-score
        }).catch(error => {
          this.$toast.fail(error);
        }).finally(()=>{
          setTimeout(()=>{
            this.loading=false
          },1000)
        })
      },
      betShowF(obj,list){
        this.closeF()
        if(this.betType==3){
          this.bottomPour(obj,list,obj.name)
          return
        }
        this.betNum=''
        this.betJson=obj
        this.betObj=list
        this.result=[]
        if(localStorage.getItem('checked1')=='true'){
          this.result.push('2')
        }
        if(localStorage.getItem('checked2')=='true'){
          this.result.push('1')
        }
        this.betNum=localStorage.getItem('betkaiguanNum')
        this.getMaxBetLimit(list)
      },
      //刷新赔率
      onNewBetData(ids){
        let _this=this
        this.refreshTime=5
        this.refreshTimeObj=setInterval(()=>{
          _this.refreshTime--
          if(_this.refreshTime<=0){
            clearInterval(_this.refreshTimeObj)
            YSB.onNewBetData(ids)
            setTimeout(()=>{
              this.onNewBetData(ids)
            },1000)
          }
        },1000)
      },
      //获取限额
      getMaxBetLimit(obj){
        this.loadingShow=true
        this.$ajax.post('/game/getMaxBetLimit',{
          "decimalOdds": obj.selectionPrice,
          "gameCode": "YSB",
          "selectionId": obj.selectionId,
          "userId":  this.userData.userId,
        }).then(res => {
          if(res.data){
            this.onNewBetData(obj.selectionId)
            this.BetNumList.quota=res.data.maxLimit
            this.betShow=true
          }
        }).catch(error => {
          this.$toast.fail(error);
        }).finally(()=>{
          this.loadingShow=false
        })
      },
      //投注页面
      openBetDetails(obj,name){
        let j=0
        for (let k of obj.sessions) {
          k.list=[]
          for (let n of this.AllType){
            let list=null
            let list2=[]
            for (let i in k){
              if(Object.prototype.toString.call(k[i])=='[object Object]'){
                if(k[i].betType.toLowerCase()==n.type.toLowerCase()){
                  let list3=[]
                  list3.push({
                    selectionName:k[i].selectionName,
                    selectionPrice:k[i].selectionPrice,
                    selectionValue:k[i].selectionValue,
                    selectionStatus:k[i].selectionStatus,
                    selectionId:k[i].selectionId,
                    comboType:k[i].comboType,
                  })
                  list2.push({
                    selectionName:k[i].selectionName,
                    list:list3,
                  })
                }
              }
            }
            list={
              name:(this.$i18n.locale=='2'?n.name:n.type)+'-'+(j=='0'?this.$t('bet[\'全场\']'):j=='1'?this.$t('bet[\'上半场\']'):j=='2'?this.$t('bet[\'下半场\']'):j=='3'?this.$t('new[\'第一节\']'):j=='4'?this.$t('new[\'第二节\']'):j=='5'?this.$t('new[\'第三节\']'):this.$t('new[\'第四节\']')),
              eventName:obj.eventName,
              eventDate:obj.eventDate,
              parentId:obj.parentId,
              score:obj.score,
              leagueName:name,
              list:list2,
              show:n.show,
              parentSportName:obj.parentSportName,
            }
            if(list.list.length>0){
              k.list.push(list)
            }
          }
          for (let n of this.AllType){
            let list=null
            let list2=[]
            for (let i in k) {
              if (i[0] == 's' && Object.prototype.toString.call(k[i]) == '[object Array]') {
                for (let m of k[i]){
                  let list3=[]
                  if(m.betType.toLowerCase()==n.type.toLowerCase()){
                    list3.push({
                      selectionName:m.selectionName,
                      selectionPrice:m.selectionPrice,
                      selectionValue:m.selectionValue,
                      selectionStatus:m.selectionStatus,
                      selectionId:m.selectionId,
                      comboType:m.comboType,
                    })
                    list2.push({
                      selectionName:m.selectionName,
                      list:list3,
                    })
                  }
                }
              }
            }
            list={
              name:(this.$i18n.locale=='2'?n.name:n.betType)+'-'+(j=='0'?this.$t('bet[\'全场\']'):j=='1'?this.$t('bet[\'上半场\']'):j=='2'?this.$t('bet[\'下半场\']'):j=='3'?this.$t('new[\'第一节\']'):j=='4'?this.$t('new[\'第二节\']'):j=='5'?this.$t('new[\'第三节\']'):this.$t('new[\'第四节\']')),
              eventName:obj.eventName,
              eventDate:obj.eventDate,
              parentId:obj.parentId,
              score:obj.score,
              leagueName:name,
              list:list2,
              show:n.show,
              parentSportName:obj.parentSportName,
            }
            if(list.list.length>0){
              k.list.push(list)
            }
          }
          j++
        }
        this.betDetailActive=0
        this.betDetailCopyList=obj
        this.betDetailShow=true
        // this.loadingShow=true
      },
      //跳转到投注记录
      toBetRecord(type){
        this.show=true
        let query=this.$route.query
        query.typeId=type
        query.i=7
        query.redirect=this.$route.path
        setTimeout(() => {
          this.$router.push({
            path:'/betRecord',
            query: query
          })
        }, 200);
      },
      //点击刷新
      Refresh(){
        this.showBoxF()
      },
      //排序列表
      isSortButton(){
        let obj = document.getElementsByClassName('box_van-col2_isSortButton')[0]
        if (this.sortButton) {
          obj.classList.remove("div1")
          this.sortButton=false
        }else {
          obj.classList.add("div1")
          this.sortButton=true
        }
      },
      //盘口设置
      isPkButton(){
        let obj = document.getElementsByClassName('box_van-col2_isPkButton')[0]
        if (this.pkButton) {
          obj.classList.remove("div1")
          this.pkButton=false
        }else {
          obj.classList.add("div1")
          this.pkButton=true
        }
      },
      //返回按钮
      goBack(){
        if(this.betDetailShow){
          this.betDetailShow=false;
        }else{
          this.$store.state.redirect='bet'
          this.$router.push({
            path:'/',
            query: {
              redirect:this.$route.path
            }
          })
        }
      },
      //top下拉选择器
      isbetSelector(i){
        console.log(i)
        this.betType=i
        sessionStorage.setItem('type', i);

        this.sportsNum(true)

        this.betSelectorShow=false
        //初始化搜索联赛
        this.betListSave={
          bool:false,
          list:[],
        }
        //切换后，刷新页面，断开第三方长链接
        // window.location.reload()
      },
      listRefresh(){
        if(this.betType==0){
          console.log('今日')
          // this.gqID==''?'':YSB.onLive(this.gqID,this.$i18n.locale)
          this.fgqID==''?'':YSB.onOnLive(this.fgqID+'-0',this.$i18n.locale)
        }else if(this.betType==1){
          console.log('滚球')
          this.gqID==''?'':YSB.onLive(this.gqID,this.$i18n.locale)
        }else if(this.betType==2){
          console.log('早盘')
          this.fgqID==''?'':YSB.onOnLive(this.fgqID+'-',this.$i18n.locale)//只能获取所有非滚球
        } else if(this.betType==3){
          console.log('串关')
          this.gqID==''?'':YSB.onLive(this.gqID,this.$i18n.locale)
          this.fgqID==''?'':YSB.onOnLive(this.fgqID+'-',this.$i18n.locale)
        }
      },
      //滑动导航按钮
      showBoxF(obj){
        if(obj){
          // this.gqID=obj.gqId
          // this.fgqID=obj.fgqId
          // this.gameCode=obj.gameCode
          sessionStorage.setItem('gqId', obj.gqId);
          sessionStorage.setItem('fgqId', obj.fgqId);
          sessionStorage.setItem('gameCode', obj.gameCode);
          //切换后，刷新页面，断开第三方长链接
          window.location.reload()
          return
        }
        for (let k of this.sportsType){
          k.bool=false
          if(this.gameCode==k.gameCode){
            // this.pitch_on=k.gameName
            k.bool=true
          }
        }
        this.loadingShow=true
        this.$store.state.gqData=[]
        this.$store.state.fgqData=[]
        this.listRefresh()
        //初始化搜索联赛
        this.betListSave={
          bool:false,
          list:[],
        }
        setTimeout(()=>{
          this.loadingShow=false
        },100)
        //切换后，刷新页面，断开第三方长链接
      },
      //进入页面
      entrance() {
        this.gqID='';
        this.fgqID='';
        if(sessionStorage.getItem('gqId')){
          this.gqID=sessionStorage.getItem('gqId')
        }
        if(sessionStorage.getItem('fgqId')){
          this.fgqID=sessionStorage.getItem('fgqId')
        }
        if(sessionStorage.getItem('gameCode')){
          this.gameCode=sessionStorage.getItem('gameCode')
        }
        if(sessionStorage.getItem('l')){
          setTimeout(()=>{
            let test_div = document.getElementById("test_div");
            test_div.scrollLeft=35*sessionStorage.getItem('gameCode')
          },1000)
        }
        if(this.betType==3){//如果是串关就赋值，否则清空
          this.betSelectionList = this.$store.state.betObj
        }else {
          this.$store.commit("delBetObj");//清空vuex的串关数据
        }
        this.showBoxF()
        this.sportsNum()
      },
      //登录
      toLogin(){
        setTimeout(() => {
          this.$router.push({
            path:'/login',
            query: {
              redirect:this.$route.path,
            }})
        }, 200);
      },
      //跳转到注册
      toZhuCe(){
        setTimeout(() => {
          this.$router.push({
            path:'/login',
            query: {
              redirect:'/zhuce',
            }})
        }, 200);
      },
    }
  };
</script>
<style lang="scss">
  .home_bet{
    .home_bet_logo{
      font-size: 13px;
      background-color: #fff;
      height: 38px;
      color: #000;
      z-index: -1;
      .logo{
        img{
          width: 100px;
        }
      }
      .home_bet_logo_left{
        width: 30%;
      }
      .home_bet_logo_right{
        text-align: right;
        width: 30%;
        span{
          display: inline-block;
          padding: 5px;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  //投注
  .betShow{
    width: 320px;
    height: 520px;
    border-radius: 15px;
    box-shadow: 0px 0px 10px 2px #888888ab;
    .betShow_body{
      padding: 0px 10px;
      .title{
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
      .vs{
        text-align: center;
        font-size: 14px;
        span{
          display: inline-block;
          width: 80px;
        }
      }
      .betShow_body_box{
        font-size: 16px;
        color: white;
        margin: 10px 0px;
        width: 100%;
        height: 100px;
        background-color: #DBC9B8;
        border-radius: 10px;
        text-align: center;letter-spacing: 1px;
        .refreshTime{
          width: 25px;
          height: 25px;
          line-height: 25px;
          display: inline-block;
          text-align: center;
          border-radius: 50%;
          background-color: white;
          color: #393939;
          margin-right: 7.5px;
          font-size: 13px;
        }
        div{
          height: 40px;
          line-height: 40px;
        }
      }
      .numBox{
        margin-bottom: 5px;
        div{
          width: 30%;
          height: 35px;
          line-height: 35px;
          text-align: center;
          font-size: 15px;
          border: 1px solid #979db0;
          border-radius: 5px;
        }
      }
    }
  }
  .betDetailBGimage{
    width: 100vw;
    height: 240px;
    background: url("../../assets/首页/bet/bg_football.png") no-repeat;
    background-size: 100% 100%;
  }
  .betDetailTitleImg{
    position: absolute;
    display: inline-block;
    text-align: center;
    width: 80px;
    top:80px;
    color: #c2c2c2;
    background: none;
  }
  .zhudui{
    left: 50px;
  }
  .shijian{
    top:100px;
    left: 150px;
  }
  .kedui{
    right: 50px;
  }
  .Box_title{
    background-color: #454545;
    font-weight: bold;
    color: #c2c2c2;
    font-size: 13.5px;
    height: 25px;
    line-height: 25px;
    border-bottom: 2px solid #383838;
  }
  .Box_title_top{
    font-size: 14px;
    text-align: center;
    /*height: 25px;*/
    /*line-height: 25px;*/
    width: 32%;
    margin-left: 1%;
    display: inline-block;
  }
  .betDetailRow{
    margin:0px 15px;
  }
  .row_span{
    text-align: center;
    /*line-height: 30px;*/
    font-size: 12px;
    margin: 10px 0;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    div{
      background-color: #383838;
      padding: 3px 0;
    }
  }
  /*遮罩提示语*/
  .loadingShow{
    z-index: 100000;
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .block {
      width: 120px;
      height: 120px;
    }
  }
  .bet{
    background-color: #fff;
    min-height: 100vh;
    .ofHidden{
      overflow:hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .betSwipe{
      width: 100%;
      float: left;
      overflow-y: hidden;
      overflow-x: auto;
      white-space: nowrap;
      background-color: #fff;
      padding: 0px;
      text-align: center;
      margin:0px 0 2px 0px;
      font-size: 10px;
      .showBox{
        width: 85px;
        position: relative;
        display: inline-block;
        .van-icon{
          font-size: 40px;
        }
      }
    }
    .betTab{
      text-align: center;
      font-size: 10px;
      width: 100%;
      background-color: #c2c2c2;
      .betTab_col{
        .van-icon{
          height: 30px;
          .van-icon__image{
            vertical-align:middle;
            margin: 5px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .van-tabbar{
      height: 50px;
      border-top-left-radius:20px;
      border-top-right-radius:20px;
      box-shadow: 0 0 8px 0 rgba(153, 153, 153, 0.46);
    }
    .van-tabbar-item{
      font-size: 14px;
    }
    /*一键投注*/
    .betkaiguanShow{
      background: url("../../assets/MyCenter/box2bj.png") 0 0 no-repeat;
      background-size: 100% 100%;
      height: 390px;
      width:270px;
      .van-cell{
        padding: 15px;
      }
      .title{
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: white;
        font-size: 18px;
        background-color: #383838;
      }
      .betkaiguanShow_body{
        font-family: "Microsoft JhengHei UI";
        border-radius: 8px;
        height: 69%;
        width: 85%;
        margin: 0px auto;
        /*background-color: #242424;*/
        .van-cell{
          background: none !important;
        }
        .van-checkbox__label{
          background-color: white !important;
        }
        .body_checkbox{
          padding: 15px;
          .van-checkbox{
            height: 40px;
            line-height: 40px;
            font-size: 12.5px;
            .van-checkbox__icon{
              height: 40px;
              line-height: 40px;
              img{
                width: 28px;
                height: 28px;
                position: relative;
                bottom: 10px;
                left: 5px;
              }
            }
          }
        }
      }
      .bottom{
        border-radius: 5px;
        /*background-color: white;*/
        height: 42px;
        width: 85%;
        margin: 14px auto;
        .van-row{
          font-size: 13px;
          color: white;
          margin: 0px 12px;
          .button1{
            text-align: center;
            margin: 6px 0;
            border-radius: 5px;
            height: 30px;
            line-height: 30px;
            width: 90px;
            color: #454545;
            border: 1px solid #838383;
            background: linear-gradient(90deg, #838383, #ebebeb) !important;
          }
          .button2{
            text-align: center;
            margin: 6px 0;
            border-radius: 5px;
            height: 30px;
            line-height: 30px;
            width: 90px;
            color: #5C3301;
            border: 1px solid #E3B473;
            background: linear-gradient(90deg, #E3B473, #F5D89B) !important;
          }
        }
      }
    }
    /*赛事选择*/
    .Competition{
      z-index: 2050 !important;
      .title{
        text-align: center;
        height: 50px;
        line-height: 50px;
        font-size: 15px;
      }
      .van-search__action{
        color: #c2c2c2;
      }
    }
    /*设置菜单*/
    .van-action-sheet{
      .van-action-sheet__cancel{
        font-size: 17px;
      }
      .content{
        .box{
          font-size: 10px;
          height: 60px;
          line-height: 60px;
          border-bottom: 1px solid #e3e6e8;
          .van-row{
            margin: 0px 15px;
            .box_van-col2{
              height: 60px;
              .div1{
                background: url("../../assets/首页/bet/pk_xz1.png") !important;
                background-size: 100% 100% !important;
                .span1{
                  color: #cbcdcf !important;
                }
                .span2{
                  color: #646566 !important;
                }
              }
              div{
                color: #646566;
                float: right;
                margin: 15px 0px;
                height: 30px;
                line-height: 30px;
                width: 90px;
                padding:0 5px;
                background: url("../../assets/首页/bet/pk_xz.png");
                background-size: 100% 100% !important;
                span{
                  display: inline-block;
                  width: 48%;
                  text-align: center;
                }
                .span1{
                  color: #646566;
                }
                .span2{
                  color: #cbcdcf;
                }
              }
            }
          }
        }
      }
    }
    /*top选择器*/
    .betSelector{
      top: 40px;
      z-index: 2024 !important;
      .betSelector_box{
        margin-top: 25px;
        text-align: center;
        width: 22%;
        height: 30px;
        line-height: 30px;
        font-size: 11px;
        border-radius: 10px;
        background-color: #242424;
        border: 2px solid #383838;
      }
      .on{
        color: #5C3301;
        border: 1px solid #E3B473;
        background: linear-gradient(90deg, #E3B473, #F5D89B) !important;
      }
    }
  }
</style>
<style lang="scss">
  .betkaiguanShowOverlay{
    z-index: 2041 !important;
  }
  .bet{
    /*串关选中*/
    .bj{
      background-color: #818181 !important;
      div{
        background-color: #818181 !important;
      }
    }
    /*串关下注*/
    .bottomPour{
      z-index: 2042;
      position: fixed;
      bottom: 0px;
      width: 100%;
      .van-collapse-item{
        .van-collapse-item__title{
          background-color: #9AA4C2 !important;
          padding: 15px 20px 15px;
          color: white;
          border-top-right-radius: 15px;
          border-top-left-radius: 15px;
        }
      }
      .van-collapse-item__content{
        padding: 0px;
      }
      .betSelectionBox_3{
        height: 110px;
        background-color: #242424;
        border-top: 1px solid #d6d6d6;
        padding: 0px 0.4rem;
        .lookOver{
          width: 90%;
          margin: 25px auto;
          background-color: #9AA4C2;
          font-size: 20px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          color: white;
          border-radius: 8px;
        }
        .betSelectionBox_3_left {
          div{
            text-align: center;
            padding: 0px 12px;
            margin: 30px 0px;
            height: 32px;
            color: #BBC1CC;
            p{
              margin: 0;
              width: 60px;
            }
            img{
              height: 15px;
            }
          }
        }
        .betSelectionBox_3_right{
          text-align: center;
          width: 200px;
          .van-checkbox{
            .van-checkbox__label{
              color: #b1b1b4;
              letter-spacing: 1px;
            }
            .van-icon{
              width: 15px;
              height: 15px;
              font-size: .7em;
            }
          }
          .betSelectionBox_3_right_button{
            border-radius: 8px;
            color: white;
            float: right;
            width: 170px;
            background-color: #9AA3C2;
            padding: 8px;
            .van-button--default{
              height: 20px;
              line-height: 20px;
              background: none;
              border: none;
              color: white;
              font-size: 18px;
            }
          }
        }
      }
    }
    .shang{
      bottom: 0px !important;
      .van-collapse-item__title{
        padding-bottom: 15px !important;
      }
    }
    .xia{
      bottom: 0px !important;
      .van-collapse-item__title{
        padding-bottom: 15px !important;
      }
    }
    .body{
      .van-cell{
        background-color: #F6F8F7 !important;
      }
    }

    .van-tabbar-item__icon img{
      height: 15px;
    }
    .bet_collapse{
      .van-cell{
        font-size: 10px;
        padding: 2px 10px;
        border-bottom: 2px solid #d7d7d7;
      }
      .box1_body_min_right{
        .my-swipe .van-swipe-item {
          height: 180px;
          color: #c2c2c2;
          font-size: 10px;
          text-align: center;
        }
        .drop{
          color: #07c160;
        }
        .up{
          color: red;
        }
        .heise{
          color: #000;
        }
      }
      .box1_body{
        width: 100%;
        background-color: white;
        .van-cell{
          border: none !important;
          border-bottom: 1px solid #e2e2e2;
          .van-cell__title{
            font-size: 15px;
            font-weight: bold;
          }
        }
        .box1_body_min{
          .van-cell__title{
            font-size: 12px;
            font-weight: 100;
          }
          .van-icon{
            font-size: 12px;
          }
        }
        .van-collapse-item__content{
          padding: 0 !important;
        }
      }
      .box1{
        position: static !important;
        .van-collapse-item__content{
          background-color: #fff;
          padding: 0px 10px 15px;
        }
        .van-cell{
          border: none;
          border-top: 2px solid #383838;
        }
      }
      .box2{
        border-top: 2px solid #FCD8DC !important;
        margin-bottom: 50px;
        .van-collapse-item__content{
          background-color: #fff;
          padding: 0px 10px 100px;
        }
        .van-cell{
          border: none !important;
        }
      }
    }
    .Competition{
      .van-search{
        background-color: #383838;
        .van-search__content{
          background-color: #242424;
          .van-icon-search{
            color: white;
          }
        }
      }
      .selectBetShow{
        color: white;
        line-height: inherit;
        margin-right: 0.5rem;
        font-size: 0.5rem !important;
      }
      .van-field__control::placeholder{
        color: #c7cacc;
        text-align: center;
      }
      .courseShowBody{
        background-color: #000000;
        .van-tabs__line{
          width: 60px!important;
          height: 2px;
          background-color: #D2C2B3;
        }
        .rqImg{
          width: 100%;
          overflow-y: hidden;
          overflow-x: auto;
          white-space: nowrap;

          font-size: 15px;
          text-align: center;
          color: #D3B599;
          padding-bottom: 10px;
          background-color: #383838;
          .around{
            color: white !important;
            background-color: #D3B599 !important;
          }
          div{
            position: relative;
            display: inline-block;

            margin: 15px 0;
            border-radius: 60px;
            width: 60px;
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }
    /*一键投注*/
    .betkaiguanShow{
      .van-cell{
        .van-field__label{
          font-size: 13px;
          width: 65px;
          color: #777879;
        }
      }
      .van-checkbox__label{
        margin-left: 20px;
        color: #777879;
      }
      .van-field__control{
        background-color: #383838;
        border-radius: 5px;
        /*color: white;*/
      }
      .van-field__control::placeholder{
        color: white;
        font-size: 11.5px;
        padding: 0px 15px;
      }
    }
  }
  .bet{
    //投注遮罩
    .betShowZZ{
      z-index: 10 !important;
    }
    .van-popup{
      z-index: 2041!important;
    }
    .van-dialog{
      z-index: 2045!important;
    }
    .setupMenuShow{
      z-index: 2043 !important;
    }
  }
  .qcxzDialog{
    z-index: 2050 !important;
  }
  .van-toast{
    width: auto !important;
    z-index: 2051!important;
  }
  .betDetailShow{
    .van-popup__close-icon--top-right{
      top: 40px !important;
    }
  }
</style>
