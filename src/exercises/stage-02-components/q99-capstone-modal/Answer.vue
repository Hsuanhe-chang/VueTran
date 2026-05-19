<script setup lang="ts">
/** Q99 — 可配置 Modal 系統（解答）
 *
 *  整合技術：
 *  - defineModel：控制 Modal 的 v-model 開關
 *  - Slots（default + named）：自訂標題與內容
 *  - Teleport：渲染到 body 避免 z-index 問題
 *  - Transition：加入開關動畫
 */
import { ref, defineComponent, h, Teleport, Transition } from 'vue'

// ── AppModal 元件定義（使用 defineComponent + render function）─
// 在實務中，這應該是獨立的 AppModal.vue 檔案
const AppModal = defineComponent({
  name: 'AppModal',

  // 使用 defineModel 接受 v-model 控制顯示/隱藏
  // 等同：props: ['modelValue'] + emit('update:modelValue')
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type:    Boolean,
      default: false,
    },
  },

  setup(props, { emit, slots }) {
    // 關閉 Modal：觸發 update:modelValue 事件，通知父層更新 v-model
    function close() {
      emit('update:modelValue', false)
    }

    return () => h(Teleport, { to: 'body' }, [
      h(Transition, { name: 'modal' }, {
        default: () => props.modelValue
          ? h('div', {
              class: 'modal-backdrop',
              // 點擊背景（非 dialog）時關閉
              onClick: (e) => { if (e.target === e.currentTarget) close() },
            }, [
              h('div', { class: 'modal-dialog', role: 'dialog' }, [
                // Header：具名插槽 header
                h('header', { class: 'modal-header' }, [
                  h('div', { class: 'modal-title' },
                    slots.header ? slots.header() : ['Modal']
                  ),
                  h('button', { class: 'modal-close', onClick: close }, '✕'),
                ]),
                // Body：預設插槽
                h('main', { class: 'modal-body' },
                  slots.default ? slots.default() : []
                ),
              ]),
            ])
          : null,
      }),
    ])
  },
})

// ── 父層使用示意 ─────────────────────────────────────────────
const showConfirm = ref(false)
const showForm    = ref(false)
const formName    = ref('')
const formMessage = ref('')

function handleDelete() {
  showConfirm.value = false
  alert('已刪除！')
}

function handleSubmit() {
  showForm.value = false
  alert(`已送出！姓名：${formName.value}`)
  formName.value    = ''
  formMessage.value = ''
}
</script>

<template>
  <div class="capstone-demo">
    <h3>🎭 Q99 — 可配置 Modal 系統（解答）</h3>

    <!-- 觸發按鈕 -->
    <section class="demo-section">
      <h4>Modal 系統展示</h4>
      <div class="btn-group">
        <button class="btn btn-primary" @click="showConfirm = true">📋 確認 Modal</button>
        <button class="btn btn-outline" @click="showForm = true">📝 表單 Modal</button>
      </div>
    </section>

    <!-- 確認 Modal：使用 v-model 控制顯示，具名 slot 自訂標題 -->
    <AppModal v-model="showConfirm">
      <template #header>⚠️ 確認刪除</template>
      <p style="margin-bottom: var(--space-md);">確定要刪除這筆資料嗎？此操作無法復原。</p>
      <div class="modal-actions">
        <button class="btn btn-outline" @click="showConfirm = false">取消</button>
        <button class="btn btn-danger" @click="handleDelete">確認刪除</button>
      </div>
    </AppModal>

    <!-- 表單 Modal：使用預設 slot 放入表單內容 -->
    <AppModal v-model="showForm">
      <template #header>📬 聯絡我們</template>
      <form @submit.prevent="handleSubmit" class="modal-form">
        <input v-model="formName" placeholder="姓名" class="form-input" required />
        <textarea v-model="formMessage" placeholder="訊息..." rows="4" class="form-input"></textarea>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" @click="showForm = false">取消</button>
          <button type="submit" class="btn btn-primary">送出</button>
        </div>
      </form>
    </AppModal>

    <!-- 解答說明 -->
    <section class="demo-section answer-section">
      <h4>✅ Modal 系統關鍵技術</h4>
      <pre class="code-block">// 1. Teleport：渲染到 body 外層，避免 z-index/overflow 問題
&lt;Teleport to="body"&gt;
  &lt;div v-if="isOpen" class="modal-backdrop"&gt;...&lt;/div&gt;
&lt;/Teleport&gt;

// 2. defineModel 或 emit('update:modelValue')
//    控制 v-model 的開關狀態

// 3. Slots：header + default
//    讓每個 Modal 有不同的標題和內容

// 4. Transition + CSS：
//    .modal-enter-active / .modal-leave-active 加動畫</pre>
    </section>
  </div>
</template>

<style scoped>
.capstone-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.btn-group { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
.modal-form { display: flex; flex-direction: column; gap: var(--space-sm); }
.modal-actions { display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-sm); }
.btn-danger { background: #ef4444; color: white; border: none; padding: 8px 20px; border-radius: var(--radius-sm); cursor: pointer; }
</style>

<!-- Modal 全域樣式（非 scoped，確保 Teleport 到 body 的元素也能套用） -->
<style>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-md);
}
.modal-dialog {
  background: white;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}
.modal-title { font-weight: 600; font-size: 1.1rem; }
.modal-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #64748b; padding: 4px 8px; border-radius: 4px; }
.modal-close:hover { background: #e2e8f0; }
.modal-body { padding: 20px; }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 1rem; font-family: inherit; box-sizing: border-box; }
textarea.form-input { resize: vertical; }

/* Modal 進場/退場動畫 */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-dialog, .modal-leave-active .modal-dialog { transition: transform 0.25s ease; }
.modal-enter-from .modal-dialog, .modal-leave-to .modal-dialog { transform: scale(0.9) translateY(-20px); }
</style>
