// 路由設定：定義所有頁面路由，並套用懶載入以優化初始載入速度
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // 使用 HTML5 History 模式（URL 無 # 號）
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      // 課程首頁：顯示所有 Stage 總覽
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      // Stage 題目列表頁：顯示該 Stage 的所有考題
      path: '/stage/:stageId',
      name: 'exercise-list',
      component: () => import('@/views/ExerciseListView.vue'),
    },
    {
      // 考題作答頁：顯示單道題目的 Starter + Answer
      path: '/stage/:stageId/:questionId',
      name: 'exercise',
      component: () => import('@/views/ExerciseView.vue'),
    },
  ],

  // 切換路由時，頁面捲動回頂部
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
