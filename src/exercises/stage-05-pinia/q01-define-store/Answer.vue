<script setup>
/** Q01 — defineStore 基礎（Options 寫法）（解答）
 *
 *  重點：
 *  1. state 必須是函式（() => ({...})），不能是物件字面量
 *     原因：讓每個元件/實例取得獨立的 state 副本
 *  2. getters 以 state 為第一參數，純粹計算，不產生副作用
 *  3. actions 用 this 存取 state、其他 actions 或其他 getters
 */
import { defineStore } from 'pinia'

// ── 完整的 Options Store ─────────────────────────────────────────
const useCounterStore = defineStore('counter-q01-answer', {

  // state：初始化資料（必須是函式！）
  state: () => ({
    count:   0,    // 計數器當前值
    history: [],   // 每次操作的文字記錄
  }),

  // getters：純計算，不修改 state
  getters: {
    // 以 state 為參數，回傳衍生值
    doubleCount: (state) => state.count * 2,
  },

  // actions：可以同步或非同步；用 this 存取 state
  actions: {
    // 遞增：count+1 並記錄
    increment() {
      this.count++
      this.history.push(`+1 遞增（now: ${this.count}）`)
    },

    // 遞減：count-1 並記錄
    decrement() {
      this.count--
      this.history.push(`-1 遞減（now: ${this.count}）`)
    },

    // 重置：歸零並清空歷史
    reset() {
      this.count   = 0
      this.history = []
    },
  },
})

// ── 在元件中使用 ─────────────────────────────────────────────────
const store = useCounterStore()
</script>

<template>
  <div class="options-store-demo">
    <h3>🍍 Q01 — defineStore 基礎（Options 寫法）（解答）</h3>

    <!-- ── 計數器操作 ── -->
    <section class="demo-section">
      <h4>計數器（Options Store）</h4>
      <div class="counter-row">
        <button class="btn btn-outline" @click="store.decrement">－ 1</button>
        <span class="count-display">{{ store.count }}</span>
        <button class="btn" @click="store.increment">＋ 1</button>
      </div>
      <div class="info-row">
        <span class="info-label">doubleCount</span>
        <span class="info-value">{{ store.doubleCount }}</span>
      </div>
      <button class="btn btn-danger btn-sm" @click="store.reset">重置</button>
    </section>

    <!-- ── 歷史記錄 ── -->
    <section class="demo-section">
      <h4>操作歷史（history state）</h4>
      <div v-if="store.history.length" class="history-list">
        <div
          v-for="(entry, i) in store.history"
          :key="i"
          class="history-item"
          :class="entry.startsWith('+') ? 'positive' : 'negative'"
        >
          {{ entry }}
        </div>
      </div>
      <p v-else class="hint">尚無操作記錄</p>
    </section>

    <!-- ── Options 寫法說明 ── -->
    <section class="demo-section">
      <h4>✅ Options Store 完整結構</h4>
      <pre v-pre class="code-block">const useCounterStore = defineStore('counter', {
  // ① state 必須是函式
  state: () => ({
    count: 0,
    history: [],
  }),

  // ② getters：接收 state，回傳衍生值
  getters: {
    doubleCount: (state) => state.count * 2,
  },

  // ③ actions：this 指向 store 實例
  actions: {
    increment() {
      this.count++                       // 修改 state
      this.history.push('+1 遞增')       // 存取其他 state
    },
    reset() {
      this.count   = 0
      this.history = []
    },
  },
})</pre>
    </section>
  </div>
</template>

<style scoped>
.options-store-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.counter-row { display: flex; align-items: center; gap: var(--space-md); }
.count-display { font-size: 2rem; font-weight: 700; color: var(--color-primary); min-width: 60px; text-align: center; font-family: var(--font-mono); }
.info-row { display: flex; gap: var(--space-sm); align-items: center; font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 120px; }
.info-value { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; }
.history-list { display: flex; flex-direction: column; gap: 4px; max-height: 160px; overflow-y: auto; }
.history-item { font-size: var(--font-size-sm); font-family: var(--font-mono); padding: 3px 10px; background: var(--color-bg); border-radius: var(--radius-sm); border-left: 3px solid var(--color-border); }
.history-item.positive { border-left-color: #4ade80; }
.history-item.negative { border-left-color: #f87171; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; align-self: flex-start; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
