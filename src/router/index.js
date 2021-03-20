import Vue from 'vue';
import Router from 'vue-router';

const index = r => require.ensure([], () => r(require('@/components/index')), 'index')
const home = r => require.ensure([], () => r(require('@/components/home/index')), 'home')
const generalBet = r => require.ensure([], () => r(require('@/components/home/generalBet')), 'generalBet')
const live = r => require.ensure([], () => r(require('@/components/live/index')), 'live')
const demo = r => require.ensure([], () => r(require('@/components/live/demo')), 'demo')
const betRecord = r => require.ensure([], () => r(require('@/components/betRecord/index')), 'betRecord')
const my = r => require.ensure([], () => r(require('@/components/my/index')), 'my')
const events = r => require.ensure([], () => r(require('@/components/events/index')), 'events')


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index,
      children :[
        { path:'/', name:'首页', component:home,},
        { path:'events', name:'赛事', component:events,},
        { path:'betRecord', name:'投注记录', component:betRecord,},
        { path:'my', name:'我的', component:my,}
      ]
    },
    { path: '/generalBet',name:'generalBet',component:generalBet,},//投注页
    { path: '/demo',demoname:'聊天',component:demo,},
    { path: '/live',name:'live',component:live,},
  ],
  // mode:"history"
})

