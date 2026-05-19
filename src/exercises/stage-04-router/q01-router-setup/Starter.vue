<script setup lang="ts">
/** Q01 — createRouter / createWebHistory 基礎設定（填空）
 *
 *  Vue Router 安裝流程：
 *  1. npm install vue-router
 *  2. 建立 router/index.js，用 createRouter() 定義路由
 *  3. 在 main.js 中 app.use(router) 安裝
 *  4. 在根元件加入 <RouterView /> 顯示對應頁面
 *
 *  注意：本元件在 App 內部執行，可用 useRoute() 讀取當前路由資訊做示範。
 */
import { useRoute } from 'vue-router'

// 讀取當前路由資訊（本 App 的 router 實例提供）
const route = useRoute()
</script>

<template>
  <div class="router-setup-demo">
    <h3>🗺️ Q01 — createRouter / createWebHistory 基礎設定（填空）</h3>

    <!-- ── Part A：填空題 ─────────────────────────────────── -->
    <section class="demo-section">
      <h4>Part A — 填入正確的 router 設定</h4>
      <p class="hint">找出下面程式碼中所有 /* TODO */ 並填入正確的值</p>

      <pre v-pre class="code-block">// src/router/index.js
import { createRouter, /* TODO A1: History 模式函式 */ } from 'vue-router'

const router = createRouter({
  // TODO A2: 選擇 HTML5 History 模式（URL 不含 #）
  history: /* ??? */,

  routes: [
    {
      path: /* TODO A3: 首頁路徑 */,
      name: /* TODO A4: 路由名稱（字串） */,
      // TODO A5: 懶載入元件（不要用靜態 import）
      component: /* ??? */,
    },
    {
      path: '/about',
      name: 'about',
      // TODO A6: 懶載入 AboutView（與上面相同寫法）
      component: /* ??? */,
    },
  ],

  // TODO A7: 換頁後捲動到頂部
  scrollBehavior() {
    return /* ??? */
  },
})

export default router</pre>
    </section>

    <!-- ── Part B：History 模式對比 ──────────────────────── -->
    <section class="demo-section">
      <h4>Part B — History 模式選擇</h4>
      <div class="compare-table">
        <div class="compare-row header-row">
          <span>模式</span><span>URL 樣式</span><span>需要伺服器設定</span><span>適用場景</span>
        </div>
        <div class="compare-row">
          <code>createWebHistory()</code>
          <span class="url-example">/about</span>
          <span class="need-server">✅ 需要</span>
          <span>生產環境（Nginx / Node）</span>
        </div>
        <div class="compare-row">
          <code>createWebHashHistory()</code>
          <span class="url-example">/#/about</span>
          <span class="no-server">❌ 不需要</span>
          <span>純靜態部署（GitHub Pages）</span>
        </div>
      </div>
    </section>

    <!-- ── Part C：useRoute 即時展示（填空完成後可觀察） ── -->
    <section class="demo-section">
      <h4>Part C — useRoute() 當前路由資訊</h4>
      <p class="hint">以下資料來自本 App 實際的 router，填空完成後概念相同</p>

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
      </div>
    </section>

    <!-- ── Part D：main.js 安裝方式 ────────────────────── -->
    <section class="demo-section">
      <h4>Part D — main.js 中安裝 router</h4>
      <pre v-pre class="code-block">// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // ← 從 router/index.js 匯入

const app = createApp(App)
app.use(router)  // ← 安裝 router，讓所有元件可以用 useRoute / useRouter
app.mount('#app')

// App.vue 根元件需加入 RouterView 顯示當前路由對應的頁面：
// &lt;RouterView /&gt;</pre>
    </section>
  </div>
</template>

<style scoped>
.router-setup-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
.route-info { display: flex; flex-direction: column; gap: 6px; }
.info-row { display: flex; gap: var(--space-sm); align-items: flex-start; font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 140px; }
.info-value { font-family: var(--font-mono); color: var(--color-primary); word-break: break-all; }
.compare-table { display: flex; flex-direction: column; gap: 6px; }
.compare-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; padding: 8px var(--space-sm); background: var(--color-bg); border-radius: var(--radius-sm); font-size: var(--font-size-sm); align-items: center; }
.header-row { font-weight: 600; color: var(--color-secondary); background: transparent; border-bottom: 1px solid var(--color-border); border-radius: 0; }
.url-example { font-family: var(--font-mono); color: var(--color-primary); }
.need-server { color: #f59e0b; }
.no-server { color: #10b981; }
</style>
