<script setup lang="ts">
/** Q07 — 路由懶載入（動態 import）（解答）
 *
 *  核心概念：
 *  1. () => import('./View.vue') — 正確懶載入（省略大括號，自動 return Promise）
 *  2. () => { import('./View.vue') } — 錯誤（大括號內無 return，回傳 undefined）
 *  3. Vite 靜態分析限制：動態 import 路徑必須含靜態字面量（不能是純變數）
 *  4. 本 App 的 ExerciseView.vue 就使用了這個模式（defineAsyncComponent + import()）
 */
</script>

<template>
  <div class="lazy-loading-demo">
    <h3>⚡ Q07 — 路由懶載入（找錯誤 + 重構）（解答）</h3>

    <!-- ── Bug 解析 ── -->
    <section class="demo-section bug-section">
      <h4>Bug A：靜態 import 不懶載入</h4>
      <pre v-pre class="code-block">// ❌ 靜態 import：無論使用者訪問哪個頁面，所有元件都在啟動時載入
import HomeView from './views/HomeView.vue'
component: HomeView

// ✅ 正確懶載入：只在訪問路由時才下載元件 chunk
component: () => import('./views/HomeView.vue')</pre>
    </section>

    <section class="demo-section bug-section">
      <h4>Bug B：箭頭函式無 return</h4>
      <pre v-pre class="code-block">// ❌ 大括號函式體沒有 return → 回傳 undefined，不是 Promise
component: () => { import('./views/AboutView.vue') }

// ✅ 省略大括號，自動 return import() 的 Promise
component: () => import('./views/AboutView.vue')

// ✅ 或明確 return（效果相同）
component: () => { return import('./views/AboutView.vue') }</pre>
    </section>

    <section class="demo-section bug-section">
      <h4>Bug C：完全動態路徑 Vite 無法解析</h4>
      <pre v-pre class="code-block">// ❌ 完全動態路徑：Vite build time 無法知道要打包哪些檔案
component: () => import(`./views/${pageName}.vue`)  // 變數 pageName 在 build time 未知

// ✅ 解法 1：保留靜態前綴（Vite 會打包 ./views/ 下所有 .vue 檔）
component: () => import(`./views/${route}.vue`)  // 仍需 route 是有限枚舉

// ✅ 解法 2：直接列出每個路由（最安全，Vite 明確知道依賴）
{ path: '/user/:id', component: () => import('./views/UserView.vue') }

// ✅ 解法 3：用 import.meta.glob 批量導入
// const modules = import.meta.glob('./views/*.vue')
// component: modules['./views/UserView.vue']</pre>
    </section>

    <!-- ── 完整正確設定 ── -->
    <section class="demo-section answer-section">
      <h4>✅ 完整正確的懶載入路由設定</h4>
      <pre v-pre class="code-block">// router/index.js — 全部使用懶載入
const routes = [
  {
    path: '/',
    name: 'home',
    // 正確懶載入：省略大括號，返回 import() Promise
    component: () => import('./views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    // 修正 Bug B：省略大括號
    component: () => import('./views/AboutView.vue'),
  },
  {
    path: '/user/:id',
    name: 'user',
    // 修正 Bug C：靜態路徑（不依賴執行時變數）
    component: () => import('./views/UserView.vue'),
  },
]

// 進階：使用 import.meta.glob 批量導入（適合大量頁面）
const pageModules = import.meta.glob('./views/*.vue')
// 結果：{ './views/HomeView.vue': () => import('./views/HomeView.vue'), ... }
// 在路由中使用：component: pageModules['./views/HomeView.vue']</pre>
    </section>

    <!-- ── 效能對比 ── -->
    <section class="demo-section">
      <h4>懶載入效能影響</h4>
      <div class="compare-cards">
        <div class="compare-card bad">
          <p class="card-title">❌ 靜態 import（全部打包進一個 bundle）</p>
          <pre v-pre class="code-mini">// dist/assets/index.js（700kb+）
// 首次訪問 / 就要下載所有頁面的代碼</pre>
        </div>
        <div class="compare-card good">
          <p class="card-title">✅ 懶載入（按需下載獨立 chunk）</p>
          <pre v-pre class="code-mini">// dist/assets/index.js（100kb）— 主要執行框架
// dist/assets/HomeView.js（30kb）— 訪問 / 才下載
// dist/assets/AboutView.js（20kb）— 訪問 /about 才下載
// dist/assets/AdminView.js（80kb）— 訪問 /admin 才下載（大多數用戶不需要）</pre>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lazy-loading-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.bug-section { border-color: #fca5a5; }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
.compare-cards { display: flex; flex-direction: column; gap: var(--space-md); }
.compare-card { padding: var(--space-sm); border-radius: var(--radius-md); border: 1.5px solid var(--color-border); }
.compare-card.bad { border-color: #fca5a5; }
.compare-card.good { border-color: #4ade80; }
.card-title { font-weight: 600; margin-bottom: 6px; font-size: var(--font-size-sm); }
.code-mini { background: #1e293b; color: #e2e8f0; padding: var(--space-sm); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.75rem; white-space: pre-wrap; line-height: 1.5; margin: 0; }
</style>
