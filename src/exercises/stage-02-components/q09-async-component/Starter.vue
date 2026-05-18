<script setup>
/** Q09 — defineAsyncComponent 非同步載入（從零撰寫）
 *  _HeavyDashboard.vue 模擬載入耗時的元件。
 *  你需要用 defineAsyncComponent 非同步載入它，
 *  並設定 loading / error UI。
 */
import { defineAsyncComponent, h, ref } from 'vue'

// ── 已提供的 Loading 元件（顯示載入中的 UI）────────────────
const LoadingSpinner = {
  render: () => h('div', { class: 'loading-box' }, [
    h('div', { class: 'spinner' }),
    h('p', '⏳ 儀表板載入中...'),
  ]),
}

// ── 已提供的 Error 元件（載入失敗時顯示）──────────────────
const LoadError = {
  render: () => h('div', { class: 'error-box' }, [
    h('p', '❌ 載入失敗，請重新整理頁面'),
  ]),
}

// ── TODO：用 defineAsyncComponent 非同步載入 _HeavyDashboard.vue ──
//
// 最簡寫法（只有 loader）：
// const AsyncDashboard = defineAsyncComponent(
//   () => import('./_HeavyDashboard.vue')
// )
//
// 完整選項寫法（推薦）：
// const AsyncDashboard = defineAsyncComponent({
//   loader:           () => import('./_HeavyDashboard.vue'),
//   loadingComponent: LoadingSpinner,   // 載入中顯示
//   errorComponent:   LoadError,        // 失敗時顯示
//   delay:            200,              // 延遲 200ms 才顯示 loading（避免一閃即逝）
// })

// ★ 佔位（實作 defineAsyncComponent 後請刪除）
const AsyncDashboard = null

// 控制是否顯示儀表板（模擬用）
const showDashboard = ref(false)
</script>

<template>
  <div class="async-demo">
    <h3>⚡ Q09 — defineAsyncComponent 練習</h3>

    <!-- ── 觸發載入的按鈕 ── -->
    <section class="demo-section">
      <h4>按下按鈕，觸發非同步載入</h4>
      <p class="hint">
        完成 defineAsyncComponent 後，點擊按鈕會顯示 Loading 動畫（約 1.2 秒）再顯示儀表板。
      </p>
      <button class="btn btn-primary" @click="showDashboard = true" :disabled="showDashboard">
        {{ showDashboard ? '已載入' : '🚀 載入儀表板' }}
      </button>
    </section>

    <!-- ── 儀表板容器 ── -->
    <section v-if="showDashboard" class="demo-section dashboard-section">
      <!--
        TODO：把 <p> 替換為 <Suspense> + AsyncDashboard
        結構：
          <Suspense>
            <template #default>
              <AsyncDashboard />
            </template>
            <template #fallback>
              <LoadingSpinner />
            </template>
          </Suspense>

        注意：AsyncDashboard 必須先完成 defineAsyncComponent 定義
      -->
      <p class="hint">（實作 defineAsyncComponent 後，這裡會顯示儀表板）</p>
    </section>
  </div>
</template>

<style scoped>
.async-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }
.dashboard-section { padding: 0; overflow: hidden; }
:deep(.loading-box) { display: flex; flex-direction: column; align-items: center; gap: var(--space-md); padding: var(--space-xl); color: var(--color-text-muted); }
:deep(.spinner) { width: 40px; height: 40px; border: 4px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
:deep(.error-box) { padding: var(--space-lg); text-align: center; color: #ef4444; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
