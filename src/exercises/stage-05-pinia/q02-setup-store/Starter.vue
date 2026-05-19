<script setup lang="ts">
/** Q02 — Setup Store（Composition API 寫法）（重構練習）
 *
 *  Options Store vs Setup Store 對應關係：
 *    state   → ref() / reactive()
 *    getter  → computed()
 *    action  → 一般函式
 *    （最後必須 return 所有要公開的屬性與方法）
 */
import { defineStore } from 'pinia'

// ── 【參考】已完成的 Options Store（不要修改）────────────────────
const useOptionsCounterStore = defineStore('options-counter-q02', {
  state: () => ({
    count: 0,
    name:  'Options Store',
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    label:       (state) => `${state.name}：${state.count}`,
  },
  actions: {
    increment() { this.count++ },
    decrement() { this.count-- },
    reset()     { this.count = 0 },
  },
})

// ── 【TODO】將上面的 Options Store 重構為 Setup Store ─────────────
// 提示：defineStore 的第二個參數改為函式（() => { ... return { ... } }）
const useSetupCounterStore = defineStore('setup-counter-q02', () => {
  // TODO 1：用 ref() 宣告 count（初始 0）與 name（'Setup Store'）

  // TODO 2：用 computed() 宣告 doubleCount 與 label

  // TODO 3：宣告 increment / decrement / reset 函式

  // TODO 4：return 所有需要公開的屬性與函式
  return {}
})

// ── 在元件中使用兩個 Store ───────────────────────────────────────
const optionsStore = useOptionsCounterStore()
const setupStore   = useSetupCounterStore()
</script>

<template>
  <div class="setup-store-demo">
    <h3>🍍 Q02 — Setup Store（Composition API 寫法）（練習）</h3>

    <!-- ── 並排比較 ── -->
    <div class="compare-layout">

      <!-- Options Store（左側，參考） -->
      <section class="demo-section reference-side">
        <h4>Options Store（已完成，參考）</h4>
        <div class="counter-row">
          <button class="btn btn-outline btn-sm" @click="optionsStore.decrement">－</button>
          <span class="count-display">{{ optionsStore.count }}</span>
          <button class="btn btn-sm" @click="optionsStore.increment">＋</button>
        </div>
        <div class="info-row">
          <span class="info-label">doubleCount</span>
          <span class="info-value">{{ optionsStore.doubleCount }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">label</span>
          <span class="info-value">{{ optionsStore.label }}</span>
        </div>
        <button class="btn btn-danger btn-sm" @click="optionsStore.reset">重置</button>
      </section>

      <!-- Setup Store（右側，TODO） -->
      <section class="demo-section todo-side">
        <h4>Setup Store（TODO 完成後同步）</h4>
        <div class="counter-row">
          <button class="btn btn-outline btn-sm" @click="setupStore.decrement">－</button>
          <span class="count-display">{{ setupStore.count ?? '?' }}</span>
          <button class="btn btn-sm" @click="setupStore.increment">＋</button>
        </div>
        <div class="info-row">
          <span class="info-label">doubleCount</span>
          <span class="info-value">{{ setupStore.doubleCount ?? '尚未實作' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">label</span>
          <span class="info-value">{{ setupStore.label ?? '尚未實作' }}</span>
        </div>
        <button class="btn btn-danger btn-sm" @click="setupStore.reset">重置</button>
      </section>

    </div>

    <!-- ── 重構提示 ── -->
    <section class="demo-section">
      <h4>對應關係提示</h4>
      <pre v-pre class="code-block">// Options Store
state: () => ({ count: 0 })
getters: { double: s => s.count * 2 }
actions: { increment() { this.count++ } }

// ↓ 重構為 Setup Store ↓

defineStore('id', () => {
  const count   = ref(0)                         // state
  const double  = computed(() => count.value * 2)  // getter
  function increment() { count.value++ }          // action

  return { count, double, increment }            // 必須 return！
})</pre>
    </section>
  </div>
</template>

<style scoped>
.setup-store-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.compare-layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
.reference-side { border-color: var(--color-border); }
.todo-side { border-color: var(--color-primary); border-style: dashed; }
h4 { color: var(--color-secondary); margin-bottom: 4px; font-size: 0.9rem; }
.counter-row { display: flex; align-items: center; gap: var(--space-sm); }
.count-display { font-size: 1.8rem; font-weight: 700; color: var(--color-primary); min-width: 50px; text-align: center; font-family: var(--font-mono); }
.info-row { display: flex; gap: var(--space-sm); align-items: center; font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 100px; }
.info-value { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; font-size: 0.8rem; word-break: break-all; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; align-self: flex-start; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
