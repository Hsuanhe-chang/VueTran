<script setup lang="ts">
/** Q06 — Vite 建置優化（Code Splitting / 動態 import）（解答）
 *
 *  TODO 解答：
 *  1. defineAsyncComponent({ loader, loadingComponent, errorComponent })
 *  2. SkeletonLoader 作為 loadingComponent
 *  3. ErrorDisplay 作為 errorComponent
 *
 *  重點：
 *  - 動態 import() → Vite 自動分割成獨立 chunk 檔
 *  - loadingComponent：載入期間顯示（避免空白等待）
 *  - errorComponent：網路錯誤或 timeout 時顯示
 *  - delay：超過此時間才顯示 loading（避免閃爍）
 */
import { ref, defineAsyncComponent, defineComponent, type AsyncComponentLoader } from 'vue'

// ── 模擬「重型元件」的動態載入 ───────────────────────────
const shouldFail = ref(false)

function createHeavyDashboardLoader() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail.value) {
        reject(new Error('Chunk 載入失敗（網路錯誤）'))
      } else {
        resolve({
          name: 'HeavyDashboard',
          setup() {
            return { stats: { users: 1284, revenue: 89200, orders: 342 } }
          },
          template: `
            <div class="heavy-dashboard">
              <h5>📊 重型 Dashboard 元件（動態載入成功 ✅）</h5>
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

// ✅ TODO 2：骨架屏 loadingComponent
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

// ✅ TODO 3：錯誤 errorComponent
const ErrorDisplay = defineComponent({
  props: { error: Object },
  template: `
    <div class="load-error">
      ❌ 元件載入失敗：{{ error?.message }}
    </div>
  `
})

// ✅ TODO 1 解答：defineAsyncComponent 完整設定
// 真實場景中 loader 會是 () => import('./HeavyDashboard.vue')
// createHeavyDashboardLoader 回傳 Promise<unknown>，需斷言為 AsyncComponentLoader
const HeavyDashboard = defineAsyncComponent({
  // loader 是回傳 Promise<ComponentDefinition> 的函式
  loader: createHeavyDashboardLoader as AsyncComponentLoader,
  // 載入期間顯示骨架屏（避免使用者看到空白）
  loadingComponent: SkeletonLoader,
  // 載入失敗時顯示錯誤訊息
  errorComponent: ErrorDisplay,
  // 超過 200ms 才顯示 loadingComponent（避免快速網路下的閃爍）
  delay: 200,
})

const showDashboard = ref(false)
const loadKey = ref(0)

function loadDashboard() {
  loadKey.value++
  showDashboard.value = true
}
</script>

<template>
  <div class="build-demo">
    <h3>🔧 Q06 — Vite 建置優化（解答）</h3>

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
      <p class="hint">點擊後等 1.5s：成功顯示 Dashboard；勾選錯誤後顯示 ErrorDisplay</p>
    </section>

    <!-- Dashboard 顯示區 -->
    <section class="demo-section">
      <h4>Dashboard 區域（defineAsyncComponent）</h4>
      <p v-if="!showDashboard" class="hint">點擊「載入 Dashboard」觸發動態載入</p>

      <!-- ✅ 解答：HeavyDashboard 已換成 defineAsyncComponent 版本 -->
      <!-- :key="loadKey" → key 改變時重新載入（支援重試）-->
      <HeavyDashboard v-if="showDashboard" :key="loadKey" />
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section">
      <h4>✅ defineAsyncComponent 解答</h4>
      <pre v-pre class="code-block">// TODO 1 + 2 + 3 解答
const HeavyDashboard = defineAsyncComponent({
  loader: () => import('./HeavyDashboard.vue'),  // 動態 import → 分割 chunk
  loadingComponent: SkeletonLoader,              // 載入中顯示骨架屏
  errorComponent: ErrorDisplay,                  // 失敗時顯示錯誤
  delay: 200,                                    // 200ms 後才顯示 loading
  timeout: 10000,                                // 10s 超時
})

// 模板中使用（跟普通元件完全一樣）
&lt;HeavyDashboard :key="loadKey" /&gt;</pre>
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
          'vendor-vue': ['vue', 'vue-router', 'pinia'],  // Vue 生態系統合一個 chunk
          'vendor-charts': ['chart.js', 'd3'],            // 圖表庫獨立分包
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
:deep(.heavy-dashboard) { padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
:deep(.heavy-dashboard h5) { font-weight: 700; margin: 0 0 var(--space-sm); color: var(--color-secondary); font-size: var(--font-size-sm); }
:deep(.stats-row) { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
:deep(.stat-card) { flex: 1; min-width: 80px; padding: var(--space-sm); background: var(--color-bg-card); border-radius: var(--radius-sm); border: 1px solid var(--color-border); text-align: center; }
:deep(.stat-label) { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }
:deep(.stat-value) { font-size: 1.1rem; font-weight: 700; margin: 4px 0 0; color: var(--color-primary); }
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
