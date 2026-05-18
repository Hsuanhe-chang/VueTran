<script setup>
/** Q05 — 自訂指令（Custom Directives）（從零撰寫）
 *
 *  重點：在 <script setup> 中，名稱以 v 開頭的變數會被自動視為自訂指令，
 *        可直接在 template 中以 v-focus、v-highlight 使用，
 *        不需要呼叫 app.directive() 進行全域註冊。
 *
 *  自訂指令物件格式：
 *  {
 *    mounted(el, binding) { ... },   // 元素掛載到 DOM 後執行（el 是真實 DOM 元素）
 *    updated(el, binding) { ... },   // 元件重新渲染後執行（binding.value 可能已改變）
 *  }
 */
import { ref } from 'vue'

// ── TODO 1：實作 vFocus ────────────────────────────────────────
// 功能：元素掛載後自動呼叫 el.focus()，讓輸入框自動獲得焦點
// 使用：<input v-focus />
const vFocus = {
  // 請實作 mounted hook
}

// ── TODO 2：實作 vHighlight ────────────────────────────────────
// 功能：將元素背景色設為 binding.value（傳入的顏色字串）
//       binding.value = v-highlight="..." 中引號內的值
// 使用：<p v-highlight="'#fef9c3'"> 或 <p v-highlight="selectedColor">
const vHighlight = {
  // 請實作 mounted 和 updated 兩個 hook
}

// ── 示範資料：動態顏色選擇 ────────────────────────────────────
const highlightColor = ref('#fef9c3')  // 預設淡黃色

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
    <h3>🎯 Q05 — 自訂指令（Custom Directives）（練習）</h3>

    <!-- v-focus 示範 -->
    <section class="demo-section">
      <h4>v-focus — 自動聚焦</h4>
      <p class="hint">頁面載入後，下方輸入框應自動獲得焦點（出現文字游標）</p>

      <input
        v-focus
        type="text"
        class="demo-input"
        placeholder="這個輸入框應自動獲得焦點…"
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

      <!-- binding.value = highlightColor（動態顏色 ref） -->
      <div v-highlight="highlightColor" class="highlight-box">
        <p>這個方塊的背景色由 <code>v-highlight</code> 指令控制</p>
        <p class="hint">當前值：{{ highlightColor }}</p>
      </div>
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
</style>
