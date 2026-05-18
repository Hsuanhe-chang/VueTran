<script setup>
/** Q01 — createRouter / createWebHistory 基礎設定（解答）
 *
 *  核心概念：
 *  1. createRouter({ history, routes }) — 建立 router 實例
 *  2. createWebHistory() — HTML5 模式；createWebHashHistory() — Hash 模式
 *  3. routes 陣列：每條路由需要 path、name、component
 *  4. 懶載入：component: () => import('./views/XxxView.vue')
 *  5. scrollBehavior：控制換頁後的捲動行為
 */
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="router-setup-demo">
    <h3>🗺️ Q01 — createRouter / createWebHistory 基礎設定（解答）</h3>

    <!-- ── 完整解答 ───────────────────────────────────────── -->
    <section class="demo-section answer-section">
      <h4>✅ 完整的 router/index.js</h4>
      <pre v-pre class="code-block">import { createRouter, createWebHistory } from 'vue-router'
// ↑ A1: 匯入 createWebHistory（HTML5 模式）

const router = createRouter({
  // A2: createWebHistory() — URL 不含 #，需伺服器配合 fallback
  //     import.meta.env.BASE_URL 是 Vite 注入的基底路徑（vite.config.js 中的 base）
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',          // A3: 首頁路徑（根路徑）
      name: 'home',       // A4: 路由名稱（程式化導航時用 { name: 'home' }）
      // A5: 懶載入 — 只在使用者訪問此路由時才下載對應元件 chunk
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // A6: 與上面相同的懶載入寫法
      component: () => import('../views/AboutView.vue'),
    },
  ],

  // A7: 換頁後自動捲動到頂部
  //     savedPosition：使用瀏覽器前進/後退時，回到上次的捲動位置
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

export default router</pre>
    </section>

    <!-- ── 各欄位說明 ─────────────────────────────────────── -->
    <section class="demo-section">
      <h4>路由物件各欄位說明</h4>
      <div class="field-list">
        <div class="field-row">
          <code class="field-name">path</code>
          <p class="field-desc">URL 路徑。可用 <code>:param</code> 定義動態段（Q02 主題）</p>
        </div>
        <div class="field-row">
          <code class="field-name">name</code>
          <p class="field-desc">路由命名。程式化導航時可用 <code>{ name: 'home' }</code> 避免硬編碼路徑字串</p>
        </div>
        <div class="field-row">
          <code class="field-name">component</code>
          <p class="field-desc">對應元件。用 <code>() => import()</code> 懶載入，Vite 會自動分割成獨立 chunk</p>
        </div>
        <div class="field-row">
          <code class="field-name">children</code>
          <p class="field-desc">巢狀路由（Q03 主題）。子路由渲染在父元件的 <code>&lt;RouterView /&gt;</code> 中</p>
        </div>
        <div class="field-row">
          <code class="field-name">meta</code>
          <p class="field-desc">自訂元資料（Q05 主題）。常用於 <code>requiresAuth: true</code> 等權限旗標</p>
        </div>
        <div class="field-row">
          <code class="field-name">beforeEnter</code>
          <p class="field-desc">路由層級守衛（Q04 主題）。只在進入此路由時觸發</p>
        </div>
      </div>
    </section>

    <!-- ── 當前路由資訊 ───────────────────────────────────── -->
    <section class="demo-section">
      <h4>useRoute() — 當前路由資訊</h4>
      <div class="route-info">
        <div class="info-row">
          <span class="info-label">route.name</span>
          <span class="info-value">{{ route.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">route.path</span>
          <span class="info-value">{{ route.path }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">route.fullPath</span>
          <span class="info-value">{{ route.fullPath }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">route.params</span>
          <span class="info-value">{{ JSON.stringify(route.params) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">route.meta</span>
          <span class="info-value">{{ JSON.stringify(route.meta) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.router-setup-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
.route-info { display: flex; flex-direction: column; gap: 6px; }
.info-row { display: flex; gap: var(--space-sm); align-items: flex-start; font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 140px; }
.info-value { font-family: var(--font-mono); color: var(--color-primary); word-break: break-all; }
.field-list { display: flex; flex-direction: column; gap: 8px; }
.field-row { display: flex; gap: var(--space-sm); align-items: flex-start; padding: 8px; background: var(--color-bg); border-radius: var(--radius-sm); }
.field-name { font-family: var(--font-mono); color: var(--color-primary); min-width: 120px; font-size: var(--font-size-sm); }
.field-desc { font-size: var(--font-size-sm); color: var(--color-text); margin: 0; }
</style>
