<script setup lang="ts">
/** Q05 — storeToRefs 保持響應性（找錯誤）
 *
 *  直接解構 store 的 state/getter 會失去響應性！
 *  因為 Pinia store 是 reactive 物件，解構後的值是當下快照，
 *  後續的修改不會反映到解構出來的變數上。
 *
 *  解法：用 storeToRefs() 將 state 和 getter 包成 ref 再解構
 */
import { defineStore, storeToRefs } from 'pinia'

// ── Counter Store（已完成）────────────────────────────────────────
const useCounterStore = defineStore('counter-q05', {
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

// ── ❌ Bug A：直接解構 state — count/name 失去響應性 ─────────────
// 這樣寫 count 是普通數值 0，後續 store.increment() 不會更新它
const { count, name } = store  // ← 這行有 bug，請修正

// ── ❌ Bug B：直接解構 getter — doubleCount 失去響應性 ───────────
// getter 也是 reactive，同樣不能直接解構
const { doubleCount } = store  // ← 這行有 bug，請修正

// ── ❌ Bug C：方法也用 storeToRefs — 不必要 ──────────────────────
// storeToRefs 只處理 state 和 getter，對方法（函式）無意義
// 方法應該直接從 store 取，不需要 storeToRefs
const { increment, decrement, reset } = storeToRefs(store)  // ← 這行有 bug，請修正
</script>

<template>
  <div class="store-to-refs-demo">
    <h3>🍍 Q05 — storeToRefs 保持響應性（找錯誤）</h3>

    <!-- ── 計數器（用解構出來的值，測試是否響應）── -->
    <section class="demo-section">
      <h4>計數器（用解構變數顯示）</h4>
      <div class="counter-row">
        <button class="btn btn-outline" @click="decrement">－ 1</button>
        <span class="count-display">{{ count }}</span>
        <button class="btn" @click="increment">＋ 1</button>
      </div>
      <p class="hint">
        若 count 不會隨按鈕更新，代表解構失去響應性（Bug A 未修正）
      </p>
    </section>

    <!-- ── Getter 顯示 ── -->
    <section class="demo-section">
      <h4>Getter 響應性測試</h4>
      <div class="info-row">
        <span class="info-label">name（解構）</span>
        <span class="info-value">{{ name }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">doubleCount（解構）</span>
        <span class="info-value">{{ doubleCount }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">store.count（直接）</span>
        <span class="info-value">{{ store.count }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">store.doubleCount（直接）</span>
        <span class="info-value">{{ store.doubleCount }}</span>
      </div>
      <p class="hint">修正後，解構值應與 store 直接存取完全同步</p>
    </section>

    <!-- ── 重置 ── -->
    <section class="demo-section">
      <button class="btn btn-danger btn-sm" @click="reset">重置 count</button>
    </section>

    <!-- ── Bug 說明 ── -->
    <section class="demo-section">
      <h4>找到 3 個 Bug</h4>
      <pre v-pre class="code-block">// ❌ Bug A：直接解構 state — 失去響應性
const { count, name } = store

// ❌ Bug B：直接解構 getter — 失去響應性
const { doubleCount } = store

// ❌ Bug C：對方法用 storeToRefs — 不必要
const { increment, reset } = storeToRefs(store)

// ✅ 正確寫法：
// state / getter → storeToRefs
const { count, name, doubleCount } = storeToRefs(store)
// 方法 → 直接從 store 解構
const { increment, decrement, reset } = store</pre>
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
.info-row { display: flex; gap: var(--space-sm); align-items: center; font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 180px; }
.info-value { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; align-self: flex-start; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
