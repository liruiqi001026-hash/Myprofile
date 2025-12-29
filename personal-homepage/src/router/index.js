import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Works from '../views/Works.vue'
import Growthpage from '../views/Growthpage.vue'
import CaSet from '../views/CaSet.vue'
import WangXiaoRanChat from '../components/WangXiaoRanChat.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/works', name: 'Works', component: Works },
  { path: '/growth', name: 'growth', component: Growthpage },
  { path: '/CaSet', name: 'Caset', component: CaSet },
  { path: '/chat', name: 'Chat', component: WangXiaoRanChat },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router