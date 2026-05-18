<script setup>
/** Q04 — Composable 與 Lifecycle 整合（useEventListener / useWindowSize）（填空）
 *
 *  核心概念：
 *  Composable 可以呼叫 Lifecycle Hooks（onMounted、onUnmounted 等），
 *  讓事件綁定 / 取消綁定的邏輯自動跟著元件生命週期走，
 *  不需要在元件中手動管理。
 */
import { ref, onMounted, onUnmounted } from 'vue'

// ── useEventListener：封裝事件監聽器的綁定與清除 ────────────
// target：事件目標（通常是 window 或 document）
// event：事件名稱字串（如 'resize'、'keydown'）
// callback：事件觸發時執行的函式
function useEventListener(target, event, callback) {
  // TODO 1：在元件掛載後（onMounted）綁定事件監聽器
  //         target.addEventListener(event, callback)
  onMounted(/* TODO */)

  // TODO 2：在元件卸載時（onUnmounted）移除事件監聽器，避免記憶體洩漏
  //         target.removeEventListener(event, callback)
  onUnmounted(/* TODO */)
}

// ── useWindowSize：即時追蹤視窗寬高 ──────────────────────────
function useWindowSize() {
  // 用 window.innerWidth / window.innerHeight 初始化
  const width  = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  // TODO 3：呼叫 useEventListener，監聽 window 的 'resize' 事件
  //         在回調中更新 width.value 和 height.value
  useEventListener(window, 'resize', /* TODO：() => { ... } */)

  return { width, height }
}

// 在元件中使用
const { width, height } = useWindowSize()
</script>

<template>
  <div class="lifecycle-demo">
    <h3>🪟 Q04 — Composable 與 Lifecycle 整合（填空）</h3>

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

      <p class="hint">👆 拖曳改變瀏覽器視窗大小，數值應即時更新</p>
    </section>

    <!-- 填空提示 -->
    <section class="demo-section">
      <h4>填空位置說明</h4>
      <pre class="code-block">// onMounted 填空：
onMounted(() => target.addEventListener(event, callback))

// onUnmounted 填空：
onUnmounted(() => target.removeEventListener(event, callback))

// useEventListener 呼叫填空：
useEventListener(window, 'resize', () => {
  width.value  = window.innerWidth
  height.value = window.innerHeight
})</pre>
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
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
