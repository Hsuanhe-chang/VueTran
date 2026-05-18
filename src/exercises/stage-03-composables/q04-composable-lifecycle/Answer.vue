<script setup>
/** Q04 — Composable 與 Lifecycle 整合（useEventListener / useWindowSize）（解答）
 *
 *  核心概念：
 *  1. Composable 內部可以呼叫 onMounted / onUnmounted 等 Lifecycle Hooks
 *  2. Vue 會根據呼叫時所在的元件實例，將 Hook 自動綁定到正確的元件
 *  3. useEventListener 封裝了「掛載時加、卸載時移除」的完整配對邏輯
 *  4. useWindowSize 只需呼叫 useEventListener，不需自行管理 lifecycle
 */
import { ref, onMounted, onUnmounted } from 'vue'

// ── useEventListener：通用事件監聽器管理 ─────────────────────
// 在 onMounted 時綁定，在 onUnmounted 時移除
// 這樣不論哪個元件使用此 Composable，清除邏輯都不會遺漏
function useEventListener(target, event, callback) {
  // 元件掛載後，向 target 添加事件監聽
  onMounted(() => {
    target.addEventListener(event, callback)
  })

  // 元件卸載時，從 target 移除事件監聽——避免記憶體洩漏
  // 注意：必須傳入「同一個函式參考」才能成功移除
  onUnmounted(() => {
    target.removeEventListener(event, callback)
  })
}

// ── useWindowSize：組合 useEventListener 追蹤視窗尺寸 ────────
function useWindowSize() {
  // 用當前視窗尺寸初始化（避免伺服器端渲染問題，可包在 typeof window !== 'undefined' 判斷內）
  const width  = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  // 直接呼叫 useEventListener，無需自行處理 onMounted / onUnmounted
  // resize 事件觸發時，更新兩個 ref
  useEventListener(window, 'resize', () => {
    width.value  = window.innerWidth
    height.value = window.innerHeight
  })

  return { width, height }
}

const { width, height } = useWindowSize()
</script>

<template>
  <div class="lifecycle-demo">
    <h3>🪟 Q04 — Composable 與 Lifecycle 整合（解答）</h3>

    <!-- 視窗尺寸顯示 -->
    <section class="demo-section">
      <h4>useWindowSize — 即時視窗尺寸</h4>

      <div class="size-display">
        <div class="size-card">
          <p class="size-label">寬度（width）</p>
          <p class="size-value">{{ width }} px</p>
        </div>
        <div class="size-divider">×</div>
        <div class="size-card">
          <p class="size-label">高度（height）</p>
          <p class="size-value">{{ height }} px</p>
        </div>
      </div>

      <p class="hint">👆 拖曳改變瀏覽器視窗大小，數值即時更新</p>
    </section>

    <!-- 解答說明 -->
    <section class="demo-section answer-section">
      <h4>✅ useEventListener + useWindowSize 完整實作</h4>
      <pre class="code-block">import { ref, onMounted, onUnmounted } from 'vue'

// 通用：任何事件都可以用這個 Composable 管理
function useEventListener(target, event, callback) {
  onMounted(()   => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

// 組合：只負責業務邏輯，lifecycle 委託給 useEventListener
function useWindowSize() {
  const width  = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  useEventListener(window, 'resize', () => {
    width.value  = window.innerWidth
    height.value = window.innerHeight
  })

  return { width, height }
}

// 元件中使用：
const { width, height } = useWindowSize()</pre>
    </section>
  </div>
</template>

<style scoped>
.lifecycle-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.size-display { display: flex; align-items: center; gap: var(--space-md); justify-content: center; padding: var(--space-md); }
.size-card { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); min-width: 120px; }
.size-label { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.size-value { font-size: 2rem; font-weight: 700; color: var(--color-primary); font-family: var(--font-mono); }
.size-divider { font-size: 1.5rem; color: var(--color-text-muted); font-weight: 300; }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
