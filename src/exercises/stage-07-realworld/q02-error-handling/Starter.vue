<script setup>
/** Q02 — 全域錯誤處理（app.config.errorHandler）（練習）
 *
 *  Vue 提供兩層錯誤捕捉機制：
 *  1. app.config.errorHandler — 應用層（在 main.js 設定）
 *  2. onErrorCaptured — 元件層（捕捉子元件樹的錯誤）
 *
 *  TODO 1：加入 onErrorCaptured 捕捉 BuggyWidget 拋出的錯誤
 *           → err.message 推入 errorLog；return false 阻止傳播
 *  TODO 2：建立 errorLog ref 陣列，在 template 中 v-for 顯示
 *  TODO 3：加入「清除日誌」按鈕
 */
import { ref, defineComponent } from 'vue'
// TODO 1：補上 onErrorCaptured import
// import { ref, defineComponent, onErrorCaptured } from 'vue'

// ── 模擬一個會拋出錯誤的子元件 ──────────────────────────
// BuggyWidget：點擊按鈕時拋出不同類型的錯誤
const BuggyWidget = defineComponent({
  name: 'BuggyWidget',
  setup() {
    const errorTypes = [
      { label: '型別錯誤',   fn: () => { null.toString() } },
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

// ── TODO 1：在這裡加入 onErrorCaptured ──────────────────
// 提示：
// const errorLog = ref([])  ← TODO 2：先建立日誌陣列
//
// onErrorCaptured((err, instance, info) => {
//   errorLog.value.push({
//     message: err.message,
//     info,
//     time: new Date().toLocaleTimeString('zh-TW')
//   })
//   return false  // 阻止錯誤繼續向上傳播
// })

// 暫時空陣列（完成 TODO 後替換為 ref([])）
const errorLog = ref([])

// TODO 3：清除日誌
function clearLog() {
  errorLog.value = []
}
</script>

<template>
  <div class="error-demo">
    <h3>🛡️ Q02 — 全域錯誤處理（練習）</h3>

    <!-- 子元件：會拋出錯誤 -->
    <section class="demo-section">
      <h4>子元件（BuggyWidget）</h4>
      <BuggyWidget />
      <p class="hint">點擊上方按鈕觸發錯誤，觀察父元件如何捕捉</p>
    </section>

    <!-- TODO 2：錯誤日誌顯示區 -->
    <section class="demo-section">
      <div class="log-header">
        <h4>錯誤日誌（{{ errorLog.length }} 筆）</h4>
        <button v-if="errorLog.length > 0" class="btn btn-sm btn-outline" @click="clearLog">
          🗑️ 清除日誌
        </button>
      </div>

      <!-- 尚未有錯誤時的提示 -->
      <p v-if="errorLog.length === 0" class="hint">
        尚無捕捉到的錯誤（完成 TODO 1 後才會顯示）
      </p>

      <!-- TODO 2：用 v-for 顯示 errorLog -->
      <!-- <div v-for="(log, i) in errorLog" :key="i" class="log-item">
        <span class="log-time">{{ log.time }}</span>
        <span class="log-msg">{{ log.message }}</span>
        <span class="log-info">{{ log.info }}</span>
      </div> -->
    </section>

    <!-- app.config.errorHandler 說明 -->
    <section class="demo-section">
      <h4>app.config.errorHandler — 在 main.js 設定（應用層）</h4>
      <pre v-pre class="code-block">// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 應用層全域錯誤處理（所有未被 onErrorCaptured 處理的錯誤）
app.config.errorHandler = (err, instance, info) => {
  console.error('[全域錯誤]', err.message)
  console.info('來源元件：', instance?.$options.name)
  console.info('錯誤位置：', info)
  // 可在此送到 Sentry / 自訂錯誤追蹤服務
}

app.mount('#app')</pre>
    </section>

    <!-- onErrorCaptured 提示 -->
    <section class="demo-section">
      <h4>onErrorCaptured — 元件層錯誤邊界（語法提示）</h4>
      <pre v-pre class="code-block">// 在父元件中捕捉子元件樹的錯誤
onErrorCaptured((err, instance, info) => {
  // err      → Error 物件
  // instance → 發生錯誤的元件實例
  // info     → 錯誤來源描述（'setup function' / 'v-on handler' 等）
  errorLog.value.push({
    message: err.message,
    info,
    time: new Date().toLocaleTimeString()
  })
  return false  // false = 已處理，阻止向上傳播到 app.config.errorHandler
})</pre>
    </section>
  </div>
</template>

<style scoped>
.error-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.log-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
/* 子元件樣式 */
:deep(.buggy-widget) { padding: var(--space-sm); background: #fef9c3; border: 1px solid #fde047; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--space-sm); }
:deep(.widget-title) { font-size: var(--font-size-sm); font-weight: 600; color: #854d0e; margin: 0; }
:deep(.error-btns) { display: flex; gap: 6px; flex-wrap: wrap; }
:deep(.err-btn) { padding: 4px 12px; border: 1px solid #f59e0b; border-radius: var(--radius-sm); background: #fff; color: #92400e; cursor: pointer; font-size: 0.8rem; font-weight: 500; }
:deep(.err-btn:hover) { background: #fef3c7; }
/* 日誌項目 */
.log-item { display: flex; gap: 8px; align-items: flex-start; padding: 6px 10px; background: #fef2f2; border-left: 3px solid #ef4444; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.8rem; flex-wrap: wrap; }
.log-time { color: var(--color-text-muted); flex-shrink: 0; }
.log-msg { color: #dc2626; font-weight: 600; flex: 1; }
.log-info { color: var(--color-text-muted); font-size: 0.75rem; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-text-muted); border: 1.5px solid var(--color-border); }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
