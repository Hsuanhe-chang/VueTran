<script setup>
/** Q02 — defineEmits 事件宣告與觸發（從零撰寫）
 *  你正在實作 FeedbackWidget 元件。
 *  父層會這樣監聽事件：
 *    <FeedbackWidget
 *      @feedback="(type) => console.log('收到評價：', type)"
 *      @reset="() => console.log('已重置')"
 *    />
 */
import { ref } from 'vue'

// 本地狀態：追蹤使用者是否已送出評價
const submitted   = ref(false)
const lastFeedback = ref('')      // 'positive' | 'negative' | ''
// 模擬「父層收到 emit 後的反應」記錄
const emitLog     = ref([])

// ── TODO 1：宣告 emit ──────────────────────────────────────
// 使用 defineEmits 宣告此元件會發出的事件：
//   - 'feedback'：攜帶 payload，字串 'positive' 或 'negative'
//   - 'reset'   ：無 payload
//
// 寫法：
// const emit = defineEmits(['feedback', 'reset'])

// ── TODO 2：實作 sendFeedback(type) ──────────────────────────
// a. 設定 lastFeedback.value = type
// b. 設定 submitted.value = true
// c. 把 `[時間] emit('feedback', type)` 加入 emitLog
// d. 呼叫 emit('feedback', type)
function sendFeedback(type) {
  // 請實作這裡
}

// ── TODO 3：實作 resetFeedback() ─────────────────────────────
// a. 設定 submitted.value = false
// b. 設定 lastFeedback.value = ''
// c. 把 `[時間] emit('reset')` 加入 emitLog
// d. 呼叫 emit('reset')
function resetFeedback() {
  // 請實作這裡
}
</script>

<template>
  <div class="emits-demo">
    <h3>📣 Q02 — defineEmits 練習</h3>

    <!-- ── 互動區 ── -->
    <section class="demo-section">
      <!-- 尚未送出：顯示評價按鈕 -->
      <div v-if="!submitted" class="feedback-buttons">
        <p class="prompt">你覺得這門課程如何？</p>
        <!--
          TODO：為以下兩個按鈕加上 @click，分別呼叫
            sendFeedback('positive') 和 sendFeedback('negative')
        -->
        <button class="btn btn-feedback positive">
          👍 推薦
        </button>
        <button class="btn btn-feedback negative">
          👎 不推薦
        </button>
      </div>

      <!-- 已送出：顯示感謝訊息與重置按鈕 -->
      <div v-else class="feedback-result">
        <p class="result-text">
          {{ lastFeedback === 'positive' ? '👍 感謝您的推薦！' : '👎 感謝您的回饋，我們會持續改進！' }}
        </p>
        <!--
          TODO：為以下按鈕加上 @click，呼叫 resetFeedback()
        -->
        <button class="btn btn-outline">
          🔄 重置評價
        </button>
      </div>
    </section>

    <!-- ── Emit 記錄（模擬父層收到事件） ── -->
    <section class="demo-section log-section">
      <h4>📋 Emit 記錄（父層收到的事件）</h4>
      <ul class="log-list">
        <li v-for="(log, i) in emitLog" :key="i" class="log-item">{{ log }}</li>
      </ul>
      <p v-if="emitLog.length === 0" class="hint">點擊按鈕後這裡會出現 emit 記錄</p>
    </section>
  </div>
</template>

<style scoped>
.emits-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
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
.log-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.log-item { font-family: var(--font-mono); font-size: var(--font-size-sm); color: var(--color-primary); padding: 4px 8px; background: rgba(66,184,131,0.08); border-radius: var(--radius-sm); }
</style>
