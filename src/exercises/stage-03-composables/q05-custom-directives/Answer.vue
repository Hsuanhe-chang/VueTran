<script setup lang="ts">
/** Q05 — 自訂指令（Custom Directives）（解答）
 *
 *  核心概念：
 *  1. <script setup> 內 v 開頭的變數自動成為局部自訂指令（無需全域 app.directive()）
 *  2. mounted：元素第一次加入 DOM 後觸發（el 是真實 DOM 元素）
 *  3. updated：元件重新渲染後觸發（binding.value 可能已改變）
 *  4. binding.value：是 v-highlight="xxx" 中 xxx 的當前值
 */
import { ref, type DirectiveBinding } from 'vue'

// ── vFocus：自動聽焦指令 ─────────────────────────────────
// 使用：<input v-focus />
const vFocus = {
  // mounted hook：元素被加入 DOM 後自動執行一次
  mounted(el: HTMLElement) {
    // el 是套用指令的真實 DOM 元素（InputElement）
    el.focus()  // 讓輸入框自動獲得焦點，出現文字游標
  }
}

// ── vHighlight：動態背景色指令 ────────────────────────────────
// 使用：<div v-highlight="'#fef9c3'"> 或 <div v-highlight="colorRef">
const vHighlight = {
  // mounted：元素初次掛載時設定背景色
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // binding.value = 傳入指令的值（顏色字串）
    el.style.backgroundColor = binding.value
  },

  // updated：元件重新渲染後執行（例如 highlightColor.value 被改變）
  // 若只有 mounted 而沒有 updated，動態顏色切換不會更新背景色
  updated(el: HTMLElement, binding: DirectiveBinding) {
    el.style.backgroundColor = binding.value
  }
}

// ── 示範資料 ─────────────────────────────────────────────────
const highlightColor = ref('#fef9c3')

const colorOptions = [
  { label: '淡黃', value: '#fef9c3' },
  { label: '淡綠', value: '#dcfce7' },
  { label: '淡藍', value: '#dbeafe' },
  { label: '淡紫', value: '#ede9fe' },
  { label: '淡紅', value: '#fee2e2' },
]
</script>

<template>
  <div class="directives-demo">
    <h3>🎯 Q05 — 自訂指令（Custom Directives）（解答）</h3>

    <!-- v-focus 示範 -->
    <section class="demo-section">
      <h4>v-focus — 自動聚焦</h4>
      <p class="hint">頁面載入後，下方輸入框自動獲得焦點（出現文字游標）</p>

      <input
        v-focus
        type="text"
        class="demo-input"
        placeholder="這個輸入框自動獲得焦點"
      />
    </section>

    <!-- v-highlight 示範 -->
    <section class="demo-section">
      <h4>v-highlight — 動態背景色</h4>

      <div class="color-picker">
        <span>選擇顏色：</span>
        <div class="color-options">
          <button
            v-for="opt in colorOptions"
            :key="opt.value"
            class="color-btn"
            :style="{ background: opt.value }"
            :class="{ active: highlightColor === opt.value }"
            @click="highlightColor = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div v-highlight="highlightColor" class="highlight-box">
        <p>這個方塊的背景色由 <code>v-highlight</code> 指令控制</p>
        <p class="hint">當前值：{{ highlightColor }}</p>
      </div>
    </section>

    <!-- 解答說明 -->
    <section class="demo-section answer-section">
      <h4>✅ 自訂指令完整實作</h4>
      <pre class="code-block">// 在 &lt;script setup&gt; 中，v 開頭的變數自動成為局部指令
const vFocus = {
  mounted(el) {
    el.focus()  // 掛載後自動聚焦
  }
}

const vHighlight = {
  mounted(el, binding) {
    // binding.value = v-highlight="..." 中傳入的值
    el.style.backgroundColor = binding.value
  },
  updated(el, binding) {
    // 元件更新時同步更新背景色（讓動態值生效）
    el.style.backgroundColor = binding.value
  }
}

// template 使用：
// &lt;input v-focus /&gt;
// &lt;div v-highlight="selectedColor"&gt;</pre>
    </section>
  </div>
</template>

<style scoped>
.directives-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.demo-input { width: 100%; padding: 10px 14px; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem; background: var(--color-bg); color: var(--color-text); outline: none; box-sizing: border-box; }
.demo-input:focus { border-color: var(--color-primary); }
.color-picker { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; }
.color-options { display: flex; gap: 8px; flex-wrap: wrap; }
.color-btn { padding: 6px 14px; border: 2px solid transparent; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 500; transition: border-color 0.2s; }
.color-btn.active { border-color: var(--color-primary); }
.highlight-box { padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--color-border); transition: background-color 0.3s; }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
