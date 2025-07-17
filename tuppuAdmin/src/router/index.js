import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import WithdrawPage from '../pages/withdraw/index.vue'
import TagPage from '../pages/tag/index.vue'
import UserPage from '../pages/user/index.vue'
import RecordsPage from '../pages/records/index.vue'
import NodePage from '../pages/node/index.vue'
import NodeActivePage from '../pages/nodeActive/index.vue'
import Layout from '../components/Layout.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    name: '',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/withdraw',
        name: 'Withdraw ',
        component: WithdrawPage
      },
      {
        path: '/user',
        name: 'User',
        component: UserPage
      },
      {
        path: '/records',
        name: 'Records',
        component: RecordsPage
      },
      {
        path: '/tag',
        name: 'Tag',
        component: TagPage
      },
      {
        path: '/node',
        name: 'NodePage',
        component: NodePage
      },
      {
        path: '/nodeActive',
        name: 'NodeActivePage',
        component: NodeActivePage
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 检查token是否有效
const isTokenValid = () => {
  const token = localStorage.getItem('accessToken')
  const expiresIn = localStorage.getItem('expiresIn')
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  if (!token || !isLoggedIn) {
    return false
  }
  
  // 这里可以添加token过期时间检查
  // 暂时返回true，因为我们有refreshToken可以刷新
  return true
}

// 路由守卫
router.beforeEach((to, from, next) => {
  const hasValidToken = isTokenValid()
  
  if (to.meta.requiresAuth && !hasValidToken) {
    // 清除无效的登录信息
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('currentUser')
    next('/login')
  } else if (to.path === '/login' && hasValidToken) {
    next('/user')
  } else {
    next()
  }
})

export default router 