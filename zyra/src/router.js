import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './pages/Home/index.vue'
import MyView from './pages/my.vue'
import Deal from './pages/deal/index.vue'
import DealRecord from './pages/deal/record.vue'
import NodePage from './pages/node/index.vue'
import Mining from './pages/mining/index.vue'
import Invited from './pages/invited/index.vue'
import InvitedUpdate from './pages/invited/update.vue'
import Assets from './pages/assets/index.vue'
import AssetsRecord from './pages/assets/record.vue'
import AssetsWithdraw from './pages/assets/withdraw.vue'
import AssetsWithdrawRecord from './pages/assets/withdrawRecord.vue'
import MyPage from './pages/my.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/my', component: MyView },
  { path: '/deal', component: Deal },
  { path: '/deal/record', component: DealRecord },
  { path: '/node', component: NodePage },
  { path: '/mining', component: Mining },
  { path: '/invited', component: Invited },
  { path: '/invited/update', component: InvitedUpdate },
  { path: '/assets', component: Assets },
  { path: '/my', component: MyPage },
  { path: '/assets/record', component: AssetsRecord },
  { path: '/assets/withdraw', component: AssetsWithdraw },
  { path: '/assets/withdrawRecord', component: AssetsWithdrawRecord },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router