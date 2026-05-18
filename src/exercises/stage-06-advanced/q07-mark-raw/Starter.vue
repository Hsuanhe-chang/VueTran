<script setup>
/** Q07 — markRaw / readonly / toRaw（填空）
 *
 *  這三個 API 管理響應式系統的邊界：
 *
 *  | API        | 用途                                               |
 *  |------------|----------------------------------------------------|
 *  | markRaw()  | 標記物件永遠不被響應式追蹤（即使放入 reactive/ref）|
 *  | readonly() | 創建響應式物件的唯讀代理（嘗試修改會 console 警告）|
 *  | toRaw()    | 從響應式代理取回原始物件（效能優化、傳給第三方 lib）|
 *
 *  本題有 4 個 TODO 填空，請根據說明填入正確的 API 呼叫。
 */
import { reactive, ref, isReactive, isReadonly, isProxy } from 'vue'
// TODO：補上需要的 import（markRaw / readonly / toRaw）
// import { reactive, ref, markRaw, readonly, toRaw, isReactive, isReadonly, isProxy } from 'vue'

// ── 模擬第三方 Chart 類別 ────────────────────────────────
// 第三方 class 實例通常有大量內部狀態，不應被 Vue 響應式代理
class MockChart {
  constructor(options) {
    this.options = options
    this.canvas = null         // 模擬 Canvas 元素引用
    this._internalState = {}   // 內部狀態（不應被追蹤）
  }

  render() { return `Chart(${this.options.width}×${this.options.height})` }
  destroy() { this.canvas = null }
}

// ═══════════════════════════════════════════════════════
// TODO 1：用 markRaw 標記 Chart 實例（避免被響應式代理）
// ═══════════════════════════════════════════════════════
// 問題：將 MockChart 放入 reactive 時，Vue 會嘗試深層追蹤所有屬性
//       這對第三方 class 可能造成問題（Property getter/setter 衝突）
// 解法：先用 markRaw() 標記，再放入 reactive

const chartInstance = /* TODO 1：markRaw(new MockChart({ width: 600, height: 400 })) */
  new MockChart({ width: 600, height: 400 })

const state = reactive({
  // 因為 chartInstance 已被 markRaw，放入 reactive 後不會被代理
  chart: chartInstance,
  dataPoints: [10, 25, 40, 15, 30]
})

// ═══════════════════════════════════════════════════════
// TODO 2：用 readonly 建立全域設定的唯讀版本
// ═══════════════════════════════════════════════════════
// 問題：全域設定應只讀，防止意外修改
// 解法：readonly() 建立唯讀代理，嘗試修改時 Vue 會在 console 發出警告

const _rawConfig = reactive({
  apiUrl: 'https://api.example.com',
  version: '2.1.0',
  maxRetries: 3
})

// TODO 2：用 readonly 包住 _rawConfig
const config = /* TODO 2：readonly(_rawConfig) */
  _rawConfig

// ═══════════════════════════════════════════════════════
// TODO 3：用 toRaw 取回原始物件
// ═══════════════════════════════════════════════════════
// 問題：傳 Proxy（響應式代理）給第三方 lib 可能引發問題
// 解法：toRaw() 從代理取回原始物件

const reactiveItems = reactive([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' }
])

// TODO 3：用 toRaw 取回 reactiveItems 的原始陣列
const rawItems = /* TODO 3：toRaw(reactiveItems) */
  reactiveItems

// ═══════════════════════════════════════════════════════
// TODO 4：填寫 isReactive / isReadonly / isProxy 的預期結果
// ═══════════════════════════════════════════════════════
// 請依照下面的測試案例，在 template 中確認你的答案是否正確

// 測試 1：markRaw 的物件放入 reactive 後，其自身是否是 reactive？
// state.chart 是 MockChart 實例（已 markRaw），不是 Proxy
// isReactive(state.chart) 預期回傳：??? (true / false)

// 測試 2：readonly() 包住的物件
// isReadonly(config) 預期回傳：??? (true / false)

// 測試 3：toRaw() 取回的物件
// isProxy(rawItems) 預期回傳：??? (true / false)

// ── 操作函式 ────────────────────────────────────────────
const tryModifyResult = ref('')

// 嘗試修改 readonly config（應該出現 console 警告）
function tryModifyConfig() {
  try {
    config.version = '9.9.9'
    tryModifyResult.value = '意外成功（不應該發生）'
  } catch (e) {
    tryModifyResult.value = `❌ 修改失敗：${e.message}`
  }
  // Vue 的 readonly 不拋出例外，而是在 console 發出警告
  // 所以 tryModifyResult 會顯示「意外成功」，但實際上值沒有變
  if (config.version === '2.1.0') {
    tryModifyResult.value = '✅ 修改被阻擋（readonly 生效）：version 仍為 ' + config.version
  }
}
</script>

<template>
  <div class="markraw-demo">
    <h3>🛡️ Q07 — markRaw / readonly / toRaw（填空）</h3>

    <!-- ── TODO 1：markRaw ── -->
    <section class="demo-section">
      <h4>TODO 1 — markRaw：標記 Chart 實例不被追蹤</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">chartInstance.render()</span>
          <span class="value">{{ state.chart.render() }}</span>
        </div>
        <div class="info-item">
          <span class="label">isReactive(state.chart)</span>
          <!-- TODO 4：你預期這裡顯示 true 或 false？ -->
          <span class="value" :class="isReactive(state.chart) ? 'bad' : 'good'">
            {{ isReactive(state.chart) }}
            {{ isReactive(state.chart) ? '⚠️ 仍被追蹤（markRaw 未加）' : '✅ 不被追蹤（markRaw 已加）' }}
          </span>
        </div>
      </div>
      <p class="hint">markRaw 後放入 reactive，isReactive(state.chart) 應回傳 false</p>
    </section>

    <!-- ── TODO 2：readonly ── -->
    <section class="demo-section">
      <h4>TODO 2 — readonly：全域設定唯讀保護</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">config.apiUrl</span>
          <span class="value">{{ config.apiUrl }}</span>
        </div>
        <div class="info-item">
          <span class="label">isReadonly(config)</span>
          <span class="value" :class="isReadonly(config) ? 'good' : 'bad'">
            {{ isReadonly(config) }}
            {{ isReadonly(config) ? '✅ 唯讀保護生效' : '⚠️ 未加 readonly' }}
          </span>
        </div>
      </div>
      <div class="row">
        <button class="btn btn-sm btn-danger" @click="tryModifyConfig">嘗試修改 config.version</button>
        <span v-if="tryModifyResult" class="result-text">{{ tryModifyResult }}</span>
      </div>
    </section>

    <!-- ── TODO 3：toRaw ── -->
    <section class="demo-section">
      <h4>TODO 3 — toRaw：取回原始物件</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">isProxy(reactiveItems)</span>
          <span class="value good">{{ isProxy(reactiveItems) }} ✅ 是 Proxy</span>
        </div>
        <div class="info-item">
          <span class="label">isProxy(rawItems)</span>
          <!-- TODO 4：填 toRaw 後，這裡應顯示 false -->
          <span class="value" :class="isProxy(rawItems) ? 'bad' : 'good'">
            {{ isProxy(rawItems) }}
            {{ isProxy(rawItems) ? '⚠️ 仍是 Proxy（toRaw 未加）' : '✅ 原始物件（toRaw 已加）' }}
          </span>
        </div>
        <div class="info-item">
          <span class="label">rawItems === 原始陣列</span>
          <!-- toRaw 回傳的應該 === 原始物件（不是 Proxy）-->
          <span class="value">{{ rawItems === reactiveItems ? '❌ 仍是同一個 Proxy' : '✅ 是原始物件（非 Proxy）' }}</span>
        </div>
      </div>
    </section>

    <!-- 語法說明 -->
    <section class="demo-section">
      <h4>三個 API 語法提示</h4>
      <pre v-pre class="code-block">// markRaw：第三方 class 實例不應被響應式追蹤
const chart = markRaw(new SomeThirdPartyLib())
const state = reactive({ chart })      // chart 屬性不會被代理

// readonly：建立唯讀代理（嘗試修改 → console 警告，值不變）
const config = readonly(reactive({ apiUrl: '...' }))
config.apiUrl = 'x'                    // 警告！不會改變

// toRaw：從響應式代理取回原始物件
const rawData = toRaw(reactiveObj)     // rawData 是原始物件，非 Proxy
someLib.process(rawData)               // 避免把 Proxy 傳給第三方 lib</pre>
    </section>
  </div>
</template>

<style scoped>
.markraw-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.info-grid { display: flex; flex-direction: column; gap: 8px; }
.info-item { display: flex; align-items: center; gap: var(--space-md); font-size: var(--font-size-sm); flex-wrap: wrap; }
.label { font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-text-muted); min-width: 200px; }
.value { font-weight: 600; }
.value.good { color: #16a34a; }
.value.bad  { color: #dc2626; }
.row { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.result-text { font-size: var(--font-size-sm); font-weight: 500; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-danger { background: #ef4444; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
