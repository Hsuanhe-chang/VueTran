<script setup lang="ts">
/** Q01 — defineStore 基礎（Options 寫法）（填空）
 *
 *  Pinia Options Store 三個核心區塊：
 *    state   — 初始狀態（必須是回傳物件的函式）
 *    getters — 計算屬性（接收 state 參數）
 *    actions — 修改狀態的方法（用 this 存取 state）
 */
import { defineStore } from 'pinia'

// ── TODO：用 Options 寫法補完這個 Counter Store ──────────────────
const useCounterStore = defineStore('counter-q01', {

  // TODO 1：定義 state — 回傳含 count（初始 0）與 history（空陣列）的物件
  state: () => ({
    count:   /* TODO: 初始值 0   */ null,
    history: /* TODO: 空陣列 [] */ null as string[] | null, // 型別斷言：讓 TS 知道這是 string[] | null，而非 null
  }),

  // TODO 2：定義 getters — doubleCount 回傳 count × 2
  getters: {
    doubleCount: /* TODO: state => state.count * 2 */ null as any, // as any：避免 null 不符合 getter 函式型別導致 defineStore overload 錯誤
  },

  // TODO 3：定義 actions
  actions: {
    // increment：count + 1，並將 '+1 遞增' 推入 history
    increment() {
      /* TODO */
    },
    // decrement：count - 1，並將 '-1 遞減' 推入 history
    decrement() {
      /* TODO */
    },
    // reset：count 歸零，history 清空
    reset() {
      /* TODO */
    },
  },
})

// ── 使用 Store（Pinia 已在 main.js 安裝，此處可直接呼叫）──────
const store = useCounterStore()
</script>

<template>
  <div class="options-store-demo">
    <h3>🍍 Q01 — defineStore 基礎（Options 寫法）（練習）</h3>

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
      <h4>操作歷史</h4>
      <!-- store.history 可能為 null（TODO 填寫前），用 ?. 避免 TS18047 -->
      <div v-if="store.history?.length" class="history-list">
        <div
          v-for="(entry, i) in (store.history ?? [])"  
          :key="i"
          class="history-item"
        >
          {{ entry }}
        </div>
      </div>
      <p v-else class="hint">尚無操作記錄（TODO 2、3 完成後才會出現）</p>
    </section>

    <!-- ── Options 寫法說明 ── -->
    <section class="demo-section">
      <h4>Options Store 結構</h4>
      <pre v-pre class="code-block">const useCounterStore = defineStore('counter', {
  // state 必須是函式，才能在多元件間獨立
  state: () => ({
    count: 0,
    history: [],
  }),

  // getters：接收 state 參數（不用 this）
  getters: {
    doubleCount: (state) => state.count * 2,
  },

  // actions：用 this 存取 state 與其他 action
  actions: {
    increment() {
      this.count++
      this.history.push('+1 遞增')
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
.history-list { display: flex; flex-direction: column; gap: 4px; max-height: 140px; overflow-y: auto; }
.history-item { font-size: var(--font-size-sm); font-family: var(--font-mono); padding: 3px 8px; background: var(--color-bg); border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; align-self: flex-start; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
