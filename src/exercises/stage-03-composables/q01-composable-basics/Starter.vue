<script setup>
/** Q01 — Composable 函式設計原則（填空 + 重構）
 *
 *  Composable 三大核心原則：
 *  1. 函式名稱以 use 開頭
 *  2. 所有狀態在函式內用 ref / reactive 建立（不依賴外部變數）
 *  3. 回傳響應式物件，讓呼叫方解構後仍保持響應性
 */
import { ref } from 'vue'

// ════════════════════════════════════════════════════════════
//  Part A：填空 — 補全 useCounter composable
// ════════════════════════════════════════════════════════════
function useCounter(initialValue = 0) {
  // ✅ 狀態定義在函式內部（正確做法）
  const count = ref(initialValue)

  // TODO 1：實作 increment — count.value 加 1
  function increment() {
    // 請實作這裡
  }

  // TODO 2：實作 decrement — count.value 減 1
  function decrement() {
    // 請實作這裡
  }

  // TODO 3：實作 reset — 回到 initialValue
  function reset() {
    // 請實作這裡
  }

  // TODO 4：回傳 count、increment、decrement、reset
  // return { ... }
}

// ── 在元件中使用 composable（解構後 count 仍是響應式的）──
const { count, increment, decrement, reset } = useCounter(0)
</script>

<template>
  <div class="composable-demo">
    <h3>🧱 Q01 — Composable 設計原則</h3>

    <!-- ── Part A：useCounter 展示 ── -->
    <section class="demo-section">
      <h4>Part A — useCounter 計數器</h4>
      <p class="hint">完成 TODO 後，以下計數器應正常運作</p>

      <div class="counter-display">
        <span class="count-value">{{ count }}</span>
      </div>
      <div class="counter-btns">
        <button class="btn btn-outline" @click="decrement">－ 減少</button>
        <button class="btn btn-outline" @click="reset">重置</button>
        <button class="btn btn-primary" @click="increment">＋ 增加</button>
      </div>
    </section>

    <!-- ── Part B：找出問題 ── -->
    <section class="demo-section bug-section">
      <h4>🐛 Part B — 找出 3 個違反 Composable 原則的問題</h4>
      <pre class="code-block">// ❓ 以下這段 code 有 3 個問題，找出並說明原因：

let globalCount = 0  // (1)

function counter() {  // (2)
  function increment() {
    globalCount++
    document.getElementById('count').textContent = globalCount  // (3)
  }
  return { increment }
}</pre>
      <div class="hint-list">
        <p class="hint">問題 1：<code>let globalCount = 0</code> 有何問題？</p>
        <p class="hint">問題 2：函式名稱 <code>counter</code> 有何不符合慣例？</p>
        <p class="hint">問題 3：直接操作 DOM 有何問題？</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.composable-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }
.counter-display { text-align: center; padding: var(--space-md); }
.count-value { font-size: 3rem; font-weight: 700; color: var(--color-primary); font-family: var(--font-mono); }
.counter-btns { display: flex; gap: var(--space-sm); justify-content: center; }
.bug-section { border-color: #fca5a5; }
.hint-list { display: flex; flex-direction: column; gap: 4px; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
