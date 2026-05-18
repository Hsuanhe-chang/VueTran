<script setup>
/** Q04 — Teleport 傳送門（解答）
 *
 *  TODO 解答：
 *  TODO 1：<Teleport to="body"> — 傳送到 body 頂層
 *  TODO 2：:disabled="windowWidth < 768" — 窄螢幕停用傳送
 *
 *  重點：
 *  - Teleport 只改變 DOM 位置，不影響邏輯上的父子關係
 *  - 事件、provide/inject、資料綁定仍然運作
 *  - DevTools 中可在 <body> 底部看到 Teleport 的 DOM
 */
import { ref } from 'vue'

const showModal  = ref(false)
const modalTitle = ref('確認刪除')
const modalMsg   = ref('此操作無法復原，確定要繼續嗎？')
const resultText = ref('')

// 模擬視窗寬度（實際應用可使用 useWindowSize composable）
const windowWidth = ref(1024)

function confirm() {
  resultText.value = '✅ 使用者按下了確認'
  showModal.value  = false
}
function cancel() {
  resultText.value = '❌ 使用者取消了操作'
  showModal.value  = false
}
</script>

<template>
  <div class="teleport-demo">
    <h3>🚀 Q04 — Teleport 傳送門（解答）</h3>

    <section class="demo-section">
      <h4>模擬操作（Modal 已 Teleport 到 body）</h4>
      <div class="action-row">
        <button class="btn btn-danger" @click="showModal = true">刪除項目</button>
        <p v-if="resultText" class="result-text">{{ resultText }}</p>
      </div>
      <p class="hint">點擊後用 DevTools 查看 &lt;body&gt; 底部，可見 Modal 的 DOM 元素</p>

      <!-- ✅ TODO 1 解答：to="body" 傳送到 body 頂層 -->
      <!-- ✅ TODO 2 解答：:disabled 讓窄螢幕不傳送（在原位渲染）-->
      <Teleport to="body" :disabled="windowWidth < 768">
        <div v-if="showModal" class="modal-overlay" @click.self="cancel">
          <div class="modal-box">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <p class="modal-msg">{{ modalMsg }}</p>
            <div class="modal-actions">
              <button class="btn btn-sm btn-outline" @click="cancel">取消</button>
              <button class="btn btn-sm btn-danger" @click="confirm">確認刪除</button>
            </div>
          </div>
        </div>
      </Teleport>
    </section>

    <!-- ── disabled 示範 ── -->
    <section class="demo-section">
      <h4>:disabled 條件切換</h4>
      <div class="width-row">
        <span class="hint">模擬視窗寬度：</span>
        <button
          v-for="w in [480, 768, 1024]"
          :key="w"
          class="width-btn"
          :class="{ active: windowWidth === w }"
          @click="windowWidth = w"
        >{{ w }}px</button>
      </div>
      <p class="hint">
        目前寬度 {{ windowWidth }}px —
        <strong>{{ windowWidth < 768 ? '停用傳送（disabled=true，在原位渲染）' : 'Teleport 到 body（disabled=false）' }}</strong>
      </p>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section">
      <h4>✅ 完整 Teleport 寫法</h4>
      <pre v-pre class="code-block"><!-- ① 傳送到 body（Modal 標準做法）-->
<Teleport to="body">
  <div v-if="showModal" class="modal-overlay">
    <!-- Modal 內容可照常存取父元件資料與方法 -->
    <button @click="confirm">確認</button>
  </div>
</Teleport>

<!-- ② disabled：false 時傳送，true 時在原位渲染 -->
<Teleport to="body" :disabled="windowWidth < 768">
  ...
</Teleport>

<!-- ③ 傳送到指定元素（需在 DOM 中存在）-->
<Teleport to="#modal-root">
  ...
</Teleport></pre>
    </section>
  </div>
</template>

<style scoped>
.teleport-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.action-row { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.result-text { font-size: var(--font-size-sm); color: var(--color-text-muted); }
/* Modal 本身的 CSS 需在全域或非 scoped 才能在 body 下生效 */
/* 但由於我們只做 Demo，position:fixed 已能正確顯示 */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-box { background: var(--color-bg-card); border-radius: var(--radius-lg); padding: var(--space-lg); min-width: 280px; max-width: 400px; display: flex; flex-direction: column; gap: var(--space-md); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
.modal-title { font-size: 1.1rem; font-weight: 700; margin: 0; }
.modal-msg { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
h5 { margin: 0; }
.width-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.width-btn { padding: 4px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.width-btn.active { border-color: var(--color-primary); background: rgba(99,102,241,0.1); color: var(--color-primary); font-weight: 600; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
