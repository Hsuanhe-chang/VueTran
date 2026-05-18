<script setup>
/** Q09 — defineAsyncComponent 非同步載入（解答）
 *
 *  核心概念：
 *  - defineAsyncComponent(() => import('./...')) 懶載入元件，不在初始 bundle 中
 *  - 完整選項：loader / loadingComponent / errorComponent / delay / timeout
 *  - delay（ms）：loading 元件顯示的延遲，避免快速載入時 spinner 一閃即逝
 *  - 搭配 <Suspense> 可宣告式管理 async setup() 的 loading 狀態
 */
import { defineAsyncComponent, h, ref } from 'vue'

// 已提供的 Loading 元件
const LoadingSpinner = {
  render: () => h('div', { class: 'loading-box' }, [
    h('div', { class: 'spinner' }),
    h('p', '⏳ 儀表板載入中...'),
  ]),
}

// 已提供的 Error 元件
const LoadError = {
  render: () => h('div', { class: 'error-box' }, [
    h('p', '❌ 載入失敗，請重新整理頁面'),
  ]),
}

// ── 解答：defineAsyncComponent 完整選項寫法 ──────────────────
const AsyncDashboard = defineAsyncComponent({
  // loader：動態 import，Vite 會將 _HeavyDashboard.vue 打包成獨立 chunk
  loader: () => import('./_HeavyDashboard.vue'),

  // loadingComponent：載入期間顯示（delay 毫秒後才出現）
  loadingComponent: LoadingSpinner,

  // errorComponent：網路錯誤或 import 失敗時顯示
  errorComponent: LoadError,

  // delay（預設 200ms）：避免載入很快時 spinner 一閃即逝
  delay: 200,
})

const showDashboard = ref(false)
</script>

<template>
  <div class="async-demo">
    <h3>⚡ Q09 — defineAsyncComponent 解答</h3>

    <!-- 觸發按鈕 -->
    <section class="demo-section">
      <h4>點擊按鈕觸發非同步載入</h4>
      <p class="hint">元件在點擊後才開始下載，載入期間顯示 Loading Spinner（約 1.2 秒）</p>
      <button class="btn btn-primary" @click="showDashboard = true" :disabled="showDashboard">
        {{ showDashboard ? '已載入' : '🚀 載入儀表板' }}
      </button>
    </section>

    <!-- 儀表板：用 Suspense 管理 async setup 的 loading 狀態 -->
    <section v-if="showDashboard" class="demo-section dashboard-section">
      <!--
        Suspense：
        - #default slot：非同步元件（async setup 完成後渲染）
        - #fallback slot：等待期間顯示的備援內容
      -->
      <Suspense>
        <template #default>
          <AsyncDashboard />
        </template>
        <template #fallback>
          <LoadingSpinner />
        </template>
      </Suspense>
    </section>

    <!-- 解答說明 -->
    <div class="answer-block card">
      <h5>✅ defineAsyncComponent 完整用法</h5>
      <pre class="code-block">const AsyncComp = defineAsyncComponent({
  loader:           () => import('./HeavyComp.vue'), // 懶載入
  loadingComponent: LoadingSpinner,                  // 載入中 UI
  errorComponent:   LoadError,                       // 失敗 UI
  delay:            200,  // 200ms 後才顯示 loading（避免 flash）
})

// 搭配 Suspense 使用
&lt;Suspense&gt;
  &lt;template #default&gt;&lt;AsyncComp /&gt;&lt;/template&gt;
  &lt;template #fallback&gt;&lt;LoadingSpinner /&gt;&lt;/template&gt;
&lt;/Suspense&gt;</pre>
    </div>
  </div>
</template>

<style scoped>
.async-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4, h5 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }
.dashboard-section { padding: 0; overflow: hidden; }
.answer-block { display: flex; flex-direction: column; gap: var(--space-sm); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
:deep(.loading-box) { display: flex; flex-direction: column; align-items: center; gap: var(--space-md); padding: var(--space-xl); color: var(--color-text-muted); }
:deep(.spinner) { width: 40px; height: 40px; border: 4px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
:deep(.error-box) { padding: var(--space-lg); text-align: center; color: #ef4444; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
