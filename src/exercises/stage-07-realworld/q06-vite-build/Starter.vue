<script setup lang="ts">
/** Q06 — Vite 建置優化（Code Splitting / 動態 import）（練習）
 *
 *  Code Splitting 讓首次載入只下載必要的 JS，其餘按需載入。
 *
 *  TODO 1：將靜態 import 的 HeavyDashboard 改為 defineAsyncComponent
 *  TODO 2：加入 loadingComponent（顯示骨架屏）
 *  TODO 3：加入 errorComponent 或 onError 回調（模擬載入失敗）
 */
import { ref, defineAsyncComponent, defineComponent } from 'vue'

// ── 模擬「重型元件」（真實場景可能是圖表庫、編輯器等）────
// 延遲 1.5 秒模擬動態 chunk 的網路載入時間
function createHeavyDashboardLoader(shouldFail = false) {
  return () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('Chunk 載入失敗（網路錯誤）'))
        } else {
          resolve({
            name: 'HeavyDashboard',
            setup() {
              return { stats: { users: 1284, revenue: 89200, orders: 342 } }
            },
            template: `
              <div class="heavy-dashboard">
                <h5>📊 重型 Dashboard 元件</h5>
                <div class="stats-row">
                  <div class="stat-card">
                    <p class="stat-label">使用者</p>
                    <p class="stat-value">{{ stats.users.toLocaleString() }}</p>
                  </div>
                  <div class="stat-card">
                    <p class="stat-label">收益</p>
                    <p class="stat-value">\${{ stats.revenue.toLocaleString() }}</p>
                  </div>
                  <div class="stat-card">
                    <p class="stat-label">訂單</p>
                    <p class="stat-value">{{ stats.orders }}</p>
                  </div>
                </div>
              </div>
            `
          })
        }
      }, 1500)
    })
}

// ── TODO 1：將下方靜態元件改為 defineAsyncComponent ────────
// 目前使用靜態 import 模擬（不分割）
// 請改為：
// const HeavyDashboard = defineAsyncComponent({
//   loader: createHeavyDashboardLoader(shouldFail.value),
//   ...
// })

// 骨架屏元件（TODO 2 要用到）
const SkeletonLoader = defineComponent({
  template: `
    <div class="skeleton-dashboard">
      <div class="skel-title"></div>
      <div class="skel-row">
        <div class="skel-card"></div>
        <div class="skel-card"></div>
        <div class="skel-card"></div>
      </div>
    </div>
  `
})

// 錯誤元件（TODO 3 要用到）
const ErrorDisplay = defineComponent({
  props: { error: Object },
  template: `
    <div class="load-error">
      ❌ 元件載入失敗：{{ error?.message }}
    </div>
  `
})

const shouldFail = ref(false)
const showDashboard = ref(false)
const loadKey = ref(0)

// 暫時用靜態元件佔位（完成 TODO 1 後請替換）
const HeavyDashboard = defineComponent({
  name: 'HeavyDashboard',
  setup() {
    return { stats: { users: 1284, revenue: 89200, orders: 342 } }
  },
  template: `
    <div class="heavy-dashboard">
      <h5>📊 重型 Dashboard 元件（靜態載入，未分割）</h5>
      <div class="stats-row">
        <div class="stat-card">
          <p class="stat-label">使用者</p>
          <p class="stat-value">{{ stats.users.toLocaleString() }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">收益</p>
          <p class="stat-value">\${{ stats.revenue.toLocaleString() }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">訂單</p>
          <p class="stat-value">{{ stats.orders }}</p>
        </div>
      </div>
    </div>
  `
})

function loadDashboard() {
  loadKey.value++
  showDashboard.value = true
}
</script>

<template>
  <div class="build-demo">
    <h3>🔧 Q06 — Vite 建置優化（練習）</h3>

    <!-- 控制列 -->
    <section class="demo-section">
      <h4>元件載入控制</h4>
      <div class="controls">
        <button class="btn btn-sm" @click="loadDashboard">📦 載入 Dashboard</button>
        <label class="toggle-label">
          <input type="checkbox" v-model="shouldFail" @change="showDashboard = false" />
          <span>模擬 Chunk 載入失敗</span>
        </label>
      </div>
      <p class="hint">
        目前：靜態載入（永遠在主 bundle 中）<br>
        TODO 1 完成後：動態載入（點擊時才下載，有 1.5s 延遲）
      </p>
    </section>

    <!-- Dashboard 顯示區 -->
    <section class="demo-section">
      <h4>Dashboard 區域</h4>

      <p v-if="!showDashboard" class="hint">點擊「載入 Dashboard」觸發載入</p>

      <!-- TODO 1：改為 defineAsyncComponent，加入 loadingComponent 和 errorComponent -->
      <HeavyDashboard v-if="showDashboard" :key="loadKey" />
    </section>

    <!-- 重構說明 -->
    <section class="demo-section">
      <h4>defineAsyncComponent 完整選項提示</h4>
      <pre v-pre class="code-block">// TODO 1：defineAsyncComponent 基本用法
const HeavyDashboard = defineAsyncComponent(
  () => import('./HeavyDashboard.vue')  // 動態 import → Vite 分割 chunk
)

// TODO 2 + 3：完整選項（含 loading/error 元件）
const HeavyDashboard = defineAsyncComponent({
  loader: () => import('./HeavyDashboard.vue'),
  loadingComponent: SkeletonLoader,   // 載入中顯示骨架屏
  errorComponent: ErrorDisplay,       // 載入失敗時顯示
  delay: 200,                         // 延遲多久才顯示 loading（ms）
  timeout: 10000,                     // 超時時間（ms）
})</pre>
    </section>

    <!-- vite.config.js 說明 -->
    <section class="demo-section">
      <h4>vite.config.js — manualChunks（手動 chunk 分組）</h4>
      <pre v-pre class="code-block">// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 將 Vue 生態系套件打包到同一個 vendor chunk
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          // 將圖表庫單獨分包
          'vendor-charts': ['chart.js', 'd3'],
        }
      }
    }
  }
})</pre>
    </section>
  </div>
</template>

<style scoped>
.build-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.controls { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.toggle-label { display: flex; align-items: center; gap: 6px; font-size: var(--font-size-sm); cursor: pointer; }
/* 子元件樣式 */
:deep(.heavy-dashboard) { padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
:deep(.heavy-dashboard h5) { font-weight: 700; margin: 0 0 var(--space-sm); color: var(--color-secondary); font-size: var(--font-size-sm); }
:deep(.stats-row) { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
:deep(.stat-card) { flex: 1; min-width: 80px; padding: var(--space-sm); background: var(--color-bg-card); border-radius: var(--radius-sm); border: 1px solid var(--color-border); text-align: center; }
:deep(.stat-label) { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }
:deep(.stat-value) { font-size: 1.1rem; font-weight: 700; margin: 4px 0 0; color: var(--color-primary); }
/* 骨架屏 */
:deep(.skeleton-dashboard) { padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm); }
:deep(.skel-title) { height: 16px; width: 40%; border-radius: 4px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
:deep(.skel-row) { display: flex; gap: var(--space-sm); }
:deep(.skel-card) { flex: 1; height: 60px; border-radius: var(--radius-sm); background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
:deep(.load-error) { padding: var(--space-sm) var(--space-md); background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); color: #dc2626; font-size: var(--font-size-sm); }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
