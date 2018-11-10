import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/login/login'
import Home from '@/home/home'
import Users from '@/components/users'



Vue.use(Router)

const router=new Router({
  routes: [
    {
      path:'/',
      redirect:"/login"
   },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path:'/users',
          component:Users
        }
      ]

    },
  ]
})
router.beforeEach((to, from, next) => {
  // console.log(to);
  
    // 获取token 
    const token = localStorage.getItem('token');
    if(to.path=== '/login' || token){
      next()
    }else{
      next('/login')
    }
    
})

export default router
