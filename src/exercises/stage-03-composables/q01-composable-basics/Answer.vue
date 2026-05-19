<script setup lang="ts">
/** Q01 — Composable 函式設計原則（解答）
 *
 *  Composable 三大核心原則：
 *  1. 函式名稱以 use 開頭（慣例，方便辨識）
 *  2. 所有狀態在函式內部建立（用 ref / reactive，不依賴外部全域變數）
 *  3. 回傳響應式物件——解構後各 ref 仍保持響應性
 *
 *  Composable 優點：
 *  - 邏輯複用（多個元件共享同一套邏輯）
 *  - 關注點分離（UI 與業務邏輯分開）
 *  - 可組合（composable 可呼叫其他 composable）
 */
import { ref } from 'vue'

// ── useCounter：符合所有 composable 原則 ────────────────────
function useCounter(initialValue = 0) {
  // 狀態定義在函式內部（每次呼叫 useCounter 都得到獨立的狀態）
  const count = ref(initialValue)

  // 操作函式只修改響應式狀態，不直接碰 DOM
  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset()     { count.value = initialValue }

  // 回傳響應式狀態 + 操作函式
  // 呼叫方可解構：const { count, increment } = useCounter()
  return { count, increment, decrement, reset }
}

// 在元件中使用——解構後 count 仍是響應式 ref
const { count, increment, decrement, reset } = useCounter(0)
</script>

<template>
  <div class="composable-demo">
    <h3>🧱 Q01 — Composable 設計原則（解答）</h3>

    <!-- Part A -->
    <section class="demo-section">
      <h4>Part A — useCounter 完整實作</h4>
      <div class="counter-display">
        <span class="count-value">{{ count }}</span>
      </div>
      <div class="counter-btns">
        <button class="btn btn-outline" @click="decrement">－ 減少</button>
        <button class="btn btn-outline" @click="reset">重置</button>
        <button class="btn btn-primary" @click="increment">＋ 增加</button>
      </div>

      <div class="answer-block card">
        <h5>✅ 正確的 Composable 寫法</h5>
        <pre class="code-block">function useCounter(initialValue = 0) {
  const count = ref(initialValue)        // ✅ 狀態在函式內建立

  function increment() { count.value++ } // ✅ 只操作響應式狀態
  function decrement() { count.value-- }
  function reset()     { count.value = initialValue }

  return { count, increment, decrement, reset } // ✅ 回傳響應式
}

// 使用：解構後 count 仍是 ref（響應性保留）
const { count, increment } = useCounter(10)</pre>
      </div>
    </section>

    <!-- Part B -->
    <section class="demo-section bug-section">
      <h4>🐛 Part B — 3 個問題解析</h4>

      <div class="bug-explanation">
        <p><strong>問題 1 — 全域可變狀態：</strong></p>
        <pre class="code-block">// ❌ let globalCount = 0
// 問題：所有呼叫此函式的元件共享同一個 globalCount
// 且 globalCount 是普通變數，Vue 無法追蹤變化（非響應式）

// ✅ 改為：在函式內宣告 const count = ref(0)</pre>
      </div>

      <div class="bug-explanation">
        <p><strong>問題 2 — 函式名稱不符慣例：</strong></p>
        <pre class="code-block">// ❌ function counter() { ... }
// 問題：Vue 生態系約定 composable 以 use 開頭
// 方便辨識（知道回傳值是響應式狀態），也是 lint 規則（eslint-plugin-vue）

// ✅ 改為：function useCounter() { ... }</pre>
      </div>

      <div class="bug-explanation">
        <p><strong>問題 3 — 直接操作 DOM：</strong></p>
        <pre class="code-block">// ❌ document.getElementById('count').textContent = globalCount
// 問題：
// - 繞過 Vue 的響應式系統，Vue 不知道 DOM 已被修改
// - 與 Vue 的虛擬 DOM diff 衝突，可能導致畫面不一致
// - 無法在 SSR（伺服器端渲染）環境中運作

// ✅ 改為：修改 ref 的值，讓 Vue 自動更新 DOM
// count.value++  // Vue 響應式系統自動處理 DOM 更新</pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.composable-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4, h5 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.counter-display { text-align: center; padding: var(--space-md); }
.count-value { font-size: 3rem; font-weight: 700; color: var(--color-primary); font-family: var(--font-mono); }
.counter-btns { display: flex; gap: var(--space-sm); justify-content: center; }
.bug-section { border-color: #fca5a5; }
.answer-block { margin-top: var(--space-xs); }
.bug-explanation { display: flex; flex-direction: column; gap: 6px; padding: var(--space-sm); background: rgba(239,68,68,0.05); border-left: 3px solid #ef4444; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
