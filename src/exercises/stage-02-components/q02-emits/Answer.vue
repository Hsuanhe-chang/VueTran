<script setup>
/** Q02 — defineEmits 事件宣告與觸發（解答）
 *
 *  核心概念：
 *  - defineEmits(['event1', 'event2']) 宣告元件會發出哪些事件
 *  - const emit = defineEmits([...]) 取得 emit 函式
 *  - emit('事件名稱', payload) 觸發事件，父層透過 @事件名稱 接收
 *  - payload 可以是任何值（字串、物件、陣列等）
 */
import { ref } from 'vue'

const submitted    = ref(false)
const lastFeedback = ref('')
const emitLog      = ref([])

// ── 宣告此元件會發出的事件 ─────────────────────────────────
// 寫法一（簡單陣列）：
const emit = defineEmits(['feedback', 'reset'])

// 寫法二（帶型別，TypeScript 友好）：
// const emit = defineEmits<{
//   feedback: [type: 'positive' | 'negative']
//   reset: []
// }>()

// ── sendFeedback：更新本地狀態並 emit 事件 ───────────────────
function sendFeedback(type) {
  lastFeedback.value = type     // 記錄使用者選擇
  submitted.value    = true     // 切換到「已送出」畫面

  // 模擬父層接收到 emit 的記錄
  const time = new Date().toLocaleTimeString()
  emitLog.value.push(`[${time}] emit('feedback', '${type}')`)

  // 真正觸發事件，父層透過 @feedback="handler" 接收
  emit('feedback', type)
}

// ── resetFeedback：重置狀態並 emit 重置事件 ──────────────────
function resetFeedback() {
  submitted.value    = false    // 回到初始畫面
  lastFeedback.value = ''       // 清除選擇記錄

  const time = new Date().toLocaleTimeString()
  emitLog.value.push(`[${time}] emit('reset')`)

  // 觸發 reset 事件，父層可做對應清理
  emit('reset')
}
</script>

<template>
  <div class="emits-demo">
    <h3>📣 Q02 — defineEmits 解答</h3>

    <!-- ── 互動區 ── -->
    <section class="demo-section">
      <!-- 尚未送出：顯示評價按鈕 -->
      <div v-if="!submitted" class="feedback-buttons">
        <p class="prompt">你覺得這門課程如何？</p>
        <!-- @click 呼叫 sendFeedback 並傳入對應 payload -->
        <button class="btn btn-feedback positive" @click="sendFeedback('positive')">
          👍 推薦
        </button>
        <button class="btn btn-feedback negative" @click="sendFeedback('negative')">
          👎 不推薦
        </button>
      </div>

      <!-- 已送出：顯示感謝訊息 -->
      <div v-else class="feedback-result">
        <p class="result-text">
          {{ lastFeedback === 'positive' ? '👍 感謝您的推薦！' : '👎 感謝您的回饋，我們會持續改進！' }}
        </p>
        <button class="btn btn-outline" @click="resetFeedback()">
          🔄 重置評價
        </button>
      </div>
    </section>

    <!-- ── Emit 記錄 ── -->
    <section class="demo-section log-section">
      <h4>📋 Emit 記錄（父層收到的事件）</h4>
      <ul class="log-list">
        <li v-for="(log, i) in emitLog" :key="i" class="log-item">{{ log }}</li>
      </ul>
      <p v-if="emitLog.length === 0" class="hint">點擊按鈕後這裡會出現 emit 記錄</p>

      <!-- 解答說明 -->
      <div class="answer-block card">
        <h5>✅ defineEmits 使用方式</h5>
        <pre class="code-block">// 宣告事件
const emit = defineEmits(['feedback', 'reset'])

// 觸發事件（帶 payload）
emit('feedback', 'positive')

// 觸發事件（無 payload）
emit('reset')

// 父層監聽
// &lt;FeedbackWidget @feedback="fn" @reset="fn" /&gt;</pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.emits-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4, h5 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.prompt { font-size: var(--font-size-lg); font-weight: 500; }
.feedback-buttons { display: flex; flex-direction: column; gap: var(--space-sm); }
.btn-feedback { padding: 12px 24px; border-radius: var(--radius-md); font-size: var(--font-size-lg); border: 2px solid; cursor: pointer; background: none; transition: all 0.2s; }
.btn-feedback.positive { border-color: var(--color-primary); color: var(--color-primary); }
.btn-feedback.positive:hover { background: rgba(66,184,131,0.1); }
.btn-feedback.negative { border-color: #ef4444; color: #ef4444; }
.btn-feedback.negative:hover { background: rgba(239,68,68,0.1); }
.feedback-result { display: flex; flex-direction: column; gap: var(--space-sm); align-items: flex-start; }
.result-text { font-size: var(--font-size-lg); font-weight: 500; }
.answer-block { margin-top: var(--space-sm); }
.log-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.log-item { font-family: var(--font-mono); font-size: var(--font-size-sm); color: var(--color-primary); padding: 4px 8px; background: rgba(66,184,131,0.08); border-radius: var(--radius-sm); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
