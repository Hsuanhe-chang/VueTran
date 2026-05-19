<script setup lang="ts">
/** Q02 — 全域錯誤處理（app.config.errorHandler）（解答）
 *
 *  TODO 解答：
 *  1. onErrorCaptured → 捕捉錯誤並推入 errorLog，return false 阻止傳播
 *  2. errorLog = ref([]) 陣列，v-for 顯示每筆錯誤
 *  3. clearLog() 清空陣列
 *
 *  重點：
 *  - onErrorCaptured 回傳 false → 不再往 app.config.errorHandler 傳播
 *  - 回傳 true（或不回傳）→ 繼續往上傳播
 *  - 元件頁面不會因此崩潰（已被 onErrorCaptured 接住）
 */
import { ref, defineComponent, onErrorCaptured } from 'vue'

// ── 錯誤日誌的資料結構定義 ──────────────────────────────────
// 每筆日誌包含：message（錯誤訊息）、info（Vue 提供的位置說明）、time（發生時間）
interface ErrorLog {
  message: string
  info: string
  time: string
}

// ── 模擬會拋出錯誤的子元件 ──────────────────────────────
const BuggyWidget = defineComponent({
  name: 'BuggyWidget',
  setup() {
    const errorTypes = [
      { label: '型別錯誤',   fn: () => { (null as any).toString() } },
      { label: '自訂錯誤',   fn: () => { throw new Error('業務邏輯：資料格式不正確') } },
      { label: '非同步錯誤', fn: async () => { throw new Error('API 呼叫失敗：503 Service Unavailable') } },
    ]
    return { errorTypes }
  },
  template: `
    <div class="buggy-widget">
      <p class="widget-title">⚠️ BuggyWidget（故意壞掉的元件）</p>
      <div class="error-btns">
        <button
          v-for="et in errorTypes"
          :key="et.label"
          class="err-btn"
          @click="et.fn()"
        >觸發：{{ et.label }}</button>
      </div>
    </div>
  `
})

// ✅ TODO 2 解答：建立錯誤日誌陣列（加上 ErrorLog[] 泛型，避免 null value 錯誤）
const errorLog = ref<ErrorLog[]>([])

// ✅ TODO 1 解答：onErrorCaptured 捕捉子元件錯誤
onErrorCaptured((err, instance, info) => {
  // 將錯誤資訊推入日誌
  errorLog.value.push({
    message: err.message ?? String(err),
    info,     // Vue 提供的錯誤位置描述（'v-on handler', 'setup function' 等）
    time: new Date().toLocaleTimeString('zh-TW')
  })
  // return false → 告訴 Vue 此錯誤已處理，不再向上傳播
  return false
})

// ✅ TODO 3 解答：清除日誌
function clearLog() {
  errorLog.value = []
}
</script>

<template>
  <div class="error-demo">
    <h3>🛡️ Q02 — 全域錯誤處理（解答）</h3>

    <!-- 子元件 -->
    <section class="demo-section">
      <h4>子元件（BuggyWidget）</h4>
      <BuggyWidget />
      <p class="hint">點擊按鈕觸發錯誤，下方日誌會即時更新（頁面不崩潰）</p>
    </section>

    <!-- ✅ TODO 2 解答：錯誤日誌顯示區 -->
    <section class="demo-section">
      <div class="log-header">
        <h4>錯誤日誌（{{ errorLog.length }} 筆）</h4>
        <button v-if="errorLog.length > 0" class="btn btn-sm btn-outline" @click="clearLog">
          🗑️ 清除日誌
        </button>
      </div>

      <p v-if="errorLog.length === 0" class="hint">尚無捕捉到的錯誤，點擊上方按鈕觸發</p>

      <!-- onErrorCaptured 捕捉的每筆錯誤 -->
      <div v-for="(log, i) in errorLog" :key="i" class="log-item">
        <span class="log-time">{{ log.time }}</span>
        <span class="log-msg">{{ log.message }}</span>
        <span class="log-info">位置：{{ log.info }}</span>
      </div>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section">
      <h4>✅ 完整解答</h4>
      <pre v-pre class="code-block">// ── 元件層：onErrorCaptured（本題解答）──────────────────
const errorLog = ref([])

onErrorCaptured((err, instance, info) => {
  errorLog.value.push({
    message: err.message,
    info,
    time: new Date().toLocaleTimeString()
  })
  return false  // 已處理，停止傳播
})

// ── 應用層：main.js（全域兜底）──────────────────────────
// app.config.errorHandler = (err, instance, info) => {
//   console.error('[全域錯誤]', err.message)
//   // 送到 Sentry 等錯誤追蹤服務
// }</pre>
    </section>

    <!-- app.config.errorHandler 說明 -->
    <section class="demo-section">
      <h4>app.config.errorHandler — main.js 設定（應用層）</h4>
      <pre v-pre class="code-block">// main.js
const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('[全域錯誤]', err.message)
  console.info('來源元件：', instance?.$options.name)
  console.info('錯誤位置：', info)
  // 在此整合 Sentry / 自訂錯誤追蹤服務
}

app.mount('#app')</pre>
    </section>
  </div>
</template>

<style scoped>
.error-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.log-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
:deep(.buggy-widget) { padding: var(--space-sm); background: #fef9c3; border: 1px solid #fde047; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--space-sm); }
:deep(.widget-title) { font-size: var(--font-size-sm); font-weight: 600; color: #854d0e; margin: 0; }
:deep(.error-btns) { display: flex; gap: 6px; flex-wrap: wrap; }
:deep(.err-btn) { padding: 4px 12px; border: 1px solid #f59e0b; border-radius: var(--radius-sm); background: #fff; color: #92400e; cursor: pointer; font-size: 0.8rem; font-weight: 500; }
:deep(.err-btn:hover) { background: #fef3c7; }
.log-item { display: flex; gap: 8px; align-items: flex-start; padding: 6px 10px; background: #fef2f2; border-left: 3px solid #ef4444; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.8rem; flex-wrap: wrap; }
.log-time { color: var(--color-text-muted); flex-shrink: 0; font-family: var(--font-mono); }
.log-msg { color: #dc2626; font-weight: 600; flex: 1; }
.log-info { width: 100%; color: var(--color-text-muted); font-size: 0.75rem; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-text-muted); border: 1.5px solid var(--color-border); }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
