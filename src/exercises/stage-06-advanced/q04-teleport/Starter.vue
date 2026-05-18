<script setup>
/** Q04 — Teleport 傳送門（填空）
 *
 *  Teleport 讓元件的 DOM 輸出到指定的 DOM 節點，
 *  但邏輯上（事件、資料）仍屬於父元件。
 *
 *  常見應用：Modal、Tooltip、Dropdown、Toast
 *  原因：避免被父元件的 overflow:hidden / z-index 堆疊問題影響
 */
import { ref } from 'vue'

const showModal   = ref(false)
const modalTitle  = ref('確認刪除')
const modalMsg    = ref('此操作無法復原，確定要繼續嗎？')
const resultText  = ref('')

// 模擬視窗寬度（實際應用用 window.innerWidth 或 useWindowSize）
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
    <h3>🚀 Q04 — Teleport 傳送門（練習）</h3>

    <!-- ── 觸發按鈕 ── -->
    <section class="demo-section">
      <h4>模擬操作（按鈕觸發 Modal）</h4>
      <div class="action-row">
        <button class="btn btn-danger" @click="showModal = true">刪除項目</button>
        <p v-if="resultText" class="result-text">{{ resultText }}</p>
      </div>

      <!-- ── TODO 1：用 Teleport 包住 Modal，目標傳送到 body ──────── -->
      <!-- 提示：<Teleport to="____"> -->
      <!-- 目前 Modal 渲染在元件內，完成後應渲染到 <body> 頂層 -->

      <!-- TODO 2：:disabled 計算條件 — windowWidth < 768 時停用傳送 -->
      <!-- 提示：<Teleport to="body" :disabled="____"> -->

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
    </section>

    <!-- ── 說明：為什麼要 Teleport ── -->
    <section class="demo-section overflow-demo">
      <h4>為什麼要 Teleport？— overflow 問題展示</h4>
      <p class="hint">如果父容器有 <code>overflow: hidden</code>，Modal 可能被裁切：</p>
      <div class="overflow-container">
        <p class="overflow-label">overflow: hidden 容器</p>
        <div class="inner-box">
          <p>元件內容</p>
          <!-- 這個 Modal 會被 overflow:hidden 裁切 -->
          <div class="mock-modal-cropped">
            ⚠️ 未使用 Teleport 的 Modal（可能被裁切）
          </div>
        </div>
      </div>
    </section>

    <!-- ── Teleport 語法說明 ── -->
    <section class="demo-section">
      <h4>Teleport 語法</h4>
      <pre v-pre class="code-block"><!-- 傳送到 body（最常見）-->
<Teleport to="body">
  <div class="modal">...</div>
</Teleport>

<!-- 傳送到指定 id 的元素 -->
<Teleport to="#portal-target">
  <div class="tooltip">...</div>
</Teleport>

<!-- 條件性停用（disabled=true 時渲染在原位）-->
<Teleport to="body" :disabled="windowWidth < 768">
  <div class="modal">...</div>
</Teleport></pre>
    </section>
  </div>
</template>

<style scoped>
.teleport-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
code { background: var(--color-border); padding: 1px 5px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; }
.action-row { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.result-text { font-size: var(--font-size-sm); color: var(--color-text-muted); }
/* Modal（在元件內的版本，未 Teleport）*/
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-box { background: var(--color-bg-card); border-radius: var(--radius-lg); padding: var(--space-lg); min-width: 280px; max-width: 400px; display: flex; flex-direction: column; gap: var(--space-md); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
.modal-title { font-size: 1.1rem; font-weight: 700; margin: 0; }
.modal-msg { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
h5 { margin: 0; }
/* overflow 示範 */
.overflow-demo { border-color: #fca5a5; }
.overflow-container { border: 2px solid #fca5a5; border-radius: var(--radius-md); overflow: hidden; position: relative; padding: var(--space-sm); }
.overflow-label { font-size: 0.75rem; color: #dc2626; margin-bottom: var(--space-sm); font-weight: 600; }
.inner-box { padding: var(--space-sm); background: var(--color-bg); border-radius: var(--radius-sm); position: relative; }
.mock-modal-cropped { position: absolute; top: 40px; left: 20px; background: var(--color-bg-card); border: 2px solid #f59e0b; border-radius: var(--radius-md); padding: 10px 16px; font-size: var(--font-size-sm); font-weight: 500; color: #92400e; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
