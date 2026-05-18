<script setup>
/** Q02 — Setup Store（Composition API 寫法）（解答）
 *
 *  Setup Store 核心規則：
 *  - ref()       → state（需 .value 存取）
 *  - computed()  → getter（自動追蹤依賴）
 *  - function    → action
 *  - return {}   → 必須明確公開要暴露的內容
 *
 *  優點：可以使用任何 Composition API 工具（watch、provide 等）
 *  缺點：需要手動 return；某些插件功能（如 $reset）需要額外處理
 */
import { ref, computed }  from 'vue'
import { defineStore }    from 'pinia'

// ── 【參考】Options Store ────────────────────────────────────────
const useOptionsCounterStore = defineStore('options-counter-q02-ans', {
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

// ── 【解答】重構為 Setup Store ────────────────────────────────────
const useSetupCounterStore = defineStore('setup-counter-q02-ans', () => {
  // ① state → ref()
  const count = ref(0)
  const name  = ref('Setup Store')

  // ② getter → computed()（直接用 count.value，不需要 state 參數）
  const doubleCount = computed(() => count.value * 2)
  const label       = computed(() => `${name.value}：${count.value}`)

  // ③ action → 一般函式（直接操作 ref.value）
  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset()     { count.value = 0 }

  // ④ 必須 return 所有要對外公開的屬性與方法
  return { count, name, doubleCount, label, increment, decrement, reset }
})

// ── 在元件中使用 ─────────────────────────────────────────────────
const optionsStore = useOptionsCounterStore()
const setupStore   = useSetupCounterStore()
</script>

<template>
  <div class="setup-store-demo">
    <h3>🍍 Q02 — Setup Store（Composition API 寫法）（解答）</h3>

    <!-- ── 並排比較 ── -->
    <div class="compare-layout">

      <!-- Options Store（左側） -->
      <section class="demo-section">
        <h4>Options Store</h4>
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

      <!-- Setup Store（右側） -->
      <section class="demo-section answer-side">
        <h4>Setup Store（等效重構）</h4>
        <div class="counter-row">
          <button class="btn btn-outline btn-sm" @click="setupStore.decrement">－</button>
          <span class="count-display">{{ setupStore.count }}</span>
          <button class="btn btn-sm" @click="setupStore.increment">＋</button>
        </div>
        <div class="info-row">
          <span class="info-label">doubleCount</span>
          <span class="info-value">{{ setupStore.doubleCount }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">label</span>
          <span class="info-value">{{ setupStore.label }}</span>
        </div>
        <button class="btn btn-danger btn-sm" @click="setupStore.reset">重置</button>
      </section>

    </div>

    <!-- ── 對應關係說明 ── -->
    <section class="demo-section">
      <h4>✅ Options → Setup 對應關係</h4>
      <pre v-pre class="code-block">// ─── Options 寫法 ────────────────────────────────────────
defineStore('id', {
  state:   () => ({ count: 0, name: 'x' }),
  getters: { doubleCount: s => s.count * 2 },
  actions: { increment() { this.count++ } },
})

// ─── 等效 Setup 寫法 ──────────────────────────────────────
defineStore('id', () => {
  // state → ref()
  const count = ref(0)
  const name  = ref('x')

  // getter → computed()
  const doubleCount = computed(() => count.value * 2)

  // action → 一般函式
  function increment() { count.value++ }

  // ⚠️ 必須 return（Options Store 不需要）
  return { count, name, doubleCount, increment }
})</pre>
    </section>
  </div>
</template>

<style scoped>
.setup-store-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.compare-layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
.answer-side { border-color: var(--color-primary); }
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
