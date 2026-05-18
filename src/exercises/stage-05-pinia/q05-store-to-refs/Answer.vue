<script setup>
/** Q05 — storeToRefs 保持響應性（解答）
 *
 *  修正的 3 個 Bug：
 *  Bug A：const { count, name } = store
 *         → const { count, name } = storeToRefs(store)
 *
 *  Bug B：const { doubleCount } = store
 *         → 合併進 storeToRefs 解構
 *
 *  Bug C：const { increment, ... } = storeToRefs(store)
 *         → const { increment, ... } = store  （方法直接解構）
 *
 *  核心規則：
 *  - 狀態（state）和計算屬性（getter）→ storeToRefs
 *  - 方法（action）→ 直接從 store 解構（不需要 storeToRefs）
 */
import { defineStore, storeToRefs } from 'pinia'

// ── Counter Store ─────────────────────────────────────────────────
const useCounterStore = defineStore('counter-q05-ans', {
  state: () => ({
    count: 0,
    name:  'storeToRefs 示範',
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    label:       (state) => `${state.name}: ${state.count}`,
  },
  actions: {
    increment() { this.count++ },
    decrement() { this.count-- },
    reset()     { this.count = 0 },
  },
})

const store = useCounterStore()

// ── ✅ 修正 Bug A + B：state 和 getter 都透過 storeToRefs 解構 ───
// storeToRefs 會把每個 state / getter 包成 ref，保持響應性
const { count, name, doubleCount, label } = storeToRefs(store)

// ── ✅ 修正 Bug C：方法（action）直接從 store 解構，不需要 ref 包裝
const { increment, decrement, reset } = store
</script>

<template>
  <div class="store-to-refs-demo">
    <h3>🍍 Q05 — storeToRefs 保持響應性（解答）</h3>

    <!-- ── 計數器（用解構出來的值，測試是否響應）── -->
    <section class="demo-section">
      <h4>計數器（用解構變數顯示）</h4>
      <div class="counter-row">
        <button class="btn btn-outline" @click="decrement">－ 1</button>
        <span class="count-display">{{ count }}</span>
        <button class="btn" @click="increment">＋ 1</button>
      </div>
      <p class="hint">count 和 store.count 完全同步 ✅</p>
    </section>

    <!-- ── Getter 顯示 ── -->
    <section class="demo-section">
      <h4>Getter 響應性（解構 vs 直接存取）</h4>
      <div class="compare-table">
        <div class="table-row header">
          <span>來源</span><span>name</span><span>doubleCount</span>
        </div>
        <div class="table-row">
          <span class="source-tag">解構（storeToRefs）</span>
          <span class="val">{{ name }}</span>
          <span class="val">{{ doubleCount }}</span>
        </div>
        <div class="table-row">
          <span class="source-tag">直接存取</span>
          <span class="val">{{ store.name }}</span>
          <span class="val">{{ store.doubleCount }}</span>
        </div>
      </div>
      <div class="info-row">
        <span class="info-label">label（getter）</span>
        <span class="info-value">{{ label }}</span>
      </div>
    </section>

    <section class="demo-section">
      <button class="btn btn-danger btn-sm" @click="reset">重置 count</button>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section">
      <h4>✅ 正確的解構方式</h4>
      <pre v-pre class="code-block">const store = useCounterStore()

// ✅ state 和 getter → storeToRefs（保持響應性）
const { count, name, doubleCount } = storeToRefs(store)

// ✅ action（方法）→ 直接解構（函式本身不需要響應性）
const { increment, decrement, reset } = store

// ──────────────────────────────────────────────────
// ❌ 錯誤示範：直接解構 state（失去響應性）
// const { count } = store  ← count 是普通數字，不再是 reactive

// ❌ 錯誤示範：對方法用 storeToRefs（無意義）
// const { increment } = storeToRefs(store)  ← 多餘且可能警告</pre>
    </section>
  </div>
</template>

<style scoped>
.store-to-refs-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.counter-row { display: flex; align-items: center; gap: var(--space-md); }
.count-display { font-size: 2rem; font-weight: 700; color: var(--color-primary); min-width: 60px; text-align: center; font-family: var(--font-mono); }
.compare-table { display: flex; flex-direction: column; gap: 4px; font-size: var(--font-size-sm); }
.table-row { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: var(--space-sm); padding: 6px 8px; background: var(--color-bg); border-radius: var(--radius-sm); }
.table-row.header { background: transparent; color: var(--color-text-muted); font-weight: 600; font-size: 0.75rem; }
.source-tag { font-family: var(--font-mono); color: var(--color-text-muted); }
.val { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; }
.info-row { display: flex; gap: var(--space-sm); align-items: center; font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 140px; }
.info-value { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; align-self: flex-start; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
