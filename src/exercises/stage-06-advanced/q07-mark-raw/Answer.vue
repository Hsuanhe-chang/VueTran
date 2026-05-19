<script setup lang="ts">
/** Q07 — markRaw / readonly / toRaw（解答）
 *
 *  TODO 1 解答：markRaw(new MockChart({ ... }))
 *  TODO 2 解答：readonly(_rawConfig)
 *  TODO 3 解答：toRaw(reactiveItems)
 *  TODO 4 解答：
 *    isReactive(state.chart) → false（markRaw 阻止追蹤）
 *    isReadonly(config)      → true（readonly 包住後）
 *    isProxy(rawItems)       → false（toRaw 回傳原始物件）
 */
import { reactive, ref, markRaw, readonly, toRaw, isReactive, isReadonly, isProxy } from 'vue'

// ── 模擬第三方 Chart 類別 ────────────────────────────────
class MockChart {
  // TypeScript 需要明確宣告 class 屬性，不能只靠 constructor 內賦値
  options: { width: number; height: number }
  canvas: HTMLCanvasElement | null
  _internalState: Record<string, unknown>

  // 明確標注 constructor 參數型別，避免 TS7006 隱式 any 錯誤
  constructor(options: { width: number; height: number }) {
    this.options = options
    this.canvas = null
    this._internalState = {}
  }

  render() { return `Chart(${this.options.width}×${this.options.height})` }
  destroy() { this.canvas = null }
}

// ═══════════════════════════════════════════════════════
// TODO 1 解答：markRaw — 標記第三方 class 實例不被追蹤
// ═══════════════════════════════════════════════════════
// markRaw() 在物件上設一個特殊旗標（__v_skip）
// 即使放入 reactive/ref，Vue 也不會對其做深層代理
const chartInstance = markRaw(new MockChart({ width: 600, height: 400 }))

const state = reactive({
  chart: chartInstance,           // chart 不會被代理（markRaw 生效）
  dataPoints: [10, 25, 40, 15, 30]
})

// ═══════════════════════════════════════════════════════
// TODO 2 解答：readonly — 全域設定唯讀保護
// ═══════════════════════════════════════════════════════
// readonly() 建立唯讀代理，嘗試修改時 Vue 在 console 發出警告（不拋例外）
const _rawConfig = reactive({
  apiUrl: 'https://api.example.com',
  version: '2.1.0',
  maxRetries: 3
})

const config = readonly(_rawConfig)   // ✅ config 是唯讀代理

// ═══════════════════════════════════════════════════════
// TODO 3 解答：toRaw — 取回原始物件
// ═══════════════════════════════════════════════════════
// toRaw() 從響應式代理取回原始物件（非 Proxy）
// 適用於需要傳入第三方 lib 時（避免 lib 收到 Proxy 造成問題）
const reactiveItems = reactive([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' }
])

const rawItems = toRaw(reactiveItems)   // ✅ 原始陣列，非 Proxy

// ── 操作函式 ────────────────────────────────────────────
const tryModifyResult = ref('')

function tryModifyConfig() {
  // readonly 不拋例外，而是在 console 輸出警告
  // 型別斷言到 any：讓 TypeScript 允許此行赋値（演示 readonly 趙擋的教學程式碼）
  ;(config as any).version = '9.9.9'
  // 因為 readonly 阻止修改，config.version 仍是原值
  tryModifyResult.value = config.version === '2.1.0'
    ? '✅ 修改被阻擋（readonly 生效）：version 仍為 ' + config.version
    : '意外成功（不應發生）'
}
</script>

<template>
  <div class="markraw-demo">
    <h3>🛡️ Q07 — markRaw / readonly / toRaw（解答）</h3>

    <!-- ── TODO 1 解答：markRaw ── -->
    <section class="demo-section">
      <h4>TODO 1 — ✅ markRaw：Chart 實例不被響應式追蹤</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">chartInstance.render()</span>
          <span class="value">{{ state.chart.render() }}</span>
        </div>
        <div class="info-item">
          <span class="label">isReactive(state.chart)</span>
          <!-- markRaw 後，isReactive 回傳 false（不被追蹤）-->
          <span class="value good">{{ isReactive(state.chart) }} ✅ markRaw 生效，不被追蹤</span>
        </div>
      </div>
      <p class="fix-hint">✅ <code>markRaw(new MockChart(...))</code> — isReactive 回傳 false</p>
    </section>

    <!-- ── TODO 2 解答：readonly ── -->
    <section class="demo-section">
      <h4>TODO 2 — ✅ readonly：全域設定唯讀保護</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">config.apiUrl</span>
          <span class="value">{{ config.apiUrl }}</span>
        </div>
        <div class="info-item">
          <span class="label">isReadonly(config)</span>
          <span class="value good">{{ isReadonly(config) }} ✅ 唯讀保護生效</span>
        </div>
        <div class="info-item">
          <span class="label">isReactive(config)</span>
          <!-- readonly 包住的代理同時也是 reactive（底層是 _rawConfig）-->
          <span class="value">{{ isReactive(config) }} （底層仍是 reactive，但唯讀）</span>
        </div>
      </div>
      <div class="row">
        <button class="btn btn-sm btn-danger" @click="tryModifyConfig">嘗試修改 config.version</button>
        <span v-if="tryModifyResult" class="result-text">{{ tryModifyResult }}</span>
      </div>
      <p class="hint">嘗試修改會在 console 出現警告，但值不變</p>
    </section>

    <!-- ── TODO 3 解答：toRaw ── -->
    <section class="demo-section">
      <h4>TODO 3 — ✅ toRaw：取回原始物件</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">isProxy(reactiveItems)</span>
          <span class="value good">{{ isProxy(reactiveItems) }} ✅ 是 Proxy（響應式代理）</span>
        </div>
        <div class="info-item">
          <span class="label">isProxy(rawItems)</span>
          <span class="value good">{{ isProxy(rawItems) }} ✅ 不是 Proxy（原始物件）</span>
        </div>
        <div class="info-item">
          <span class="label">rawItems === 原始陣列</span>
          <!-- toRaw 回傳的物件 identity 與原始物件相同 -->
          <span class="value good">✅ 是原始物件（非 Proxy）</span>
        </div>
      </div>
      <p class="fix-hint">✅ <code>toRaw(reactiveItems)</code> — 回傳原始陣列，isProxy 為 false</p>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section">
      <h4>✅ 完整填空解答</h4>
      <pre v-pre class="code-block">// TODO 1：markRaw — 第三方 class 實例不應被代理
const chartInstance = markRaw(new MockChart({ width: 600, height: 400 }))
// isReactive(state.chart) → false ← 不被追蹤

// TODO 2：readonly — 唯讀代理
const config = readonly(_rawConfig)
// isReadonly(config) → true ← 唯讀保護生效
// 嘗試 config.version = 'x' → console 警告，值不變

// TODO 3：toRaw — 取回原始物件
const rawItems = toRaw(reactiveItems)
// isProxy(rawItems) → false ← 是原始物件，非 Proxy</pre>
    </section>
  </div>
</template>

<style scoped>
.markraw-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.fix-hint { font-size: var(--font-size-sm); color: #16a34a; background: rgba(22,163,74,0.08); padding: 6px 10px; border-radius: var(--radius-sm); border-left: 3px solid #16a34a; }
.info-grid { display: flex; flex-direction: column; gap: 8px; }
.info-item { display: flex; align-items: center; gap: var(--space-md); font-size: var(--font-size-sm); flex-wrap: wrap; }
.label { font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-text-muted); min-width: 220px; }
.value { font-weight: 600; }
.value.good { color: #16a34a; }
.value.bad  { color: #dc2626; }
.row { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.result-text { font-size: var(--font-size-sm); font-weight: 500; }
code { background: var(--color-border); padding: 1px 5px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-danger { background: #ef4444; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
