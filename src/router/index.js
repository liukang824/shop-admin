import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/login/login'
import Home from '@/home/home'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:Login
   },
    {
      path: '/login',
      component: Login
    },
  
  ]
})
