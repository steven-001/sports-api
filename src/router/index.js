import Vue from 'vue';
import Router from 'vue-router';

const index = r => require.ensure([], () => r(require('@/components/index')), 'index')
const service = r => require.ensure([], () => r(require('@/components/home/service')), 'service')
const home = r => require.ensure([], () => r(require('@/components/home/index')), 'home')
const live = r => require.ensure([], () => r(require('@/components/live/index')), 'live')
const demo = r => require.ensure([], () => r(require('@/components/live/demo')), 'demo')
const betRecord = r => require.ensure([], () => r(require('@/components/betRecord/index')), 'betRecord')


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/service', //客服
      component: index,
      children :[{
        path:'',
        name:'客服',
        component:service,
      }]
    },
    {
      path: '/', //首页 投注
      component: index,
      children :[{
        path:'',
        name:'首页',
        component:home,
      }]
    },
    {
      path: '/demo',//聊天
      name:'demo',
      component:demo,
    },
    {
      path: '/live',//直播
      name:'live',
      component:live,
    },
    {
      path: '/betRecord', //投注记录
      name:'betRecord',
      meta:{isLogin:true},
      component:betRecord,
    },
  ],
  // mode:"history"
})

