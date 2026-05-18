<script setup>
/** Q99 — 綜合題：可配置 Modal 系統（功能實作）
 *
 *  目標：從零實作一個 AppModal 元件，並在此父層中使用它。
 *
 *  AppModal 應具備：
 *  1. 透過 v-model（defineModel）控制顯示/隱藏
 *  2. header 具名插槽 + default 內容插槽
 *  3. 點擊關閉按鈕或背景（backdrop）時關閉
 *  4. 使用 <Teleport to="body"> 渲染到 body
 */
import { ref } from 'vue'

// ── TODO：實作 AppModal 元件 ──────────────────────────────────
// 方法一：在同一檔案用 defineComponent 定義（練習用）
// 方法二：新增 _AppModal.vue 再 import（較符合實務）
//
// AppModal 最終結構：
//   <Teleport to="body">
//     <div v-if="isOpen" class="modal-backdrop" @click.self="isOpen = false">
//       <div class="modal-dialog">
//         <header>
//           <slot name="header">Modal 標題</slot>
//           <button @click="isOpen = false">✕</button>
//         </header>
//         <main><slot /></main>
//       </div>
//     </div>
//   </Teleport>

// 示意資料
const showModal   = ref(false)
const showModal2  = ref(false)
const formName    = ref('')
const formMessage = ref('')
</script>

<template>
  <div class="capstone-demo">
    <h3>🎭 Q99 — 可配置 Modal 系統</h3>

    <!-- ── 觸發按鈕 ── -->
    <section class="demo-section">
      <h4>測試你的 Modal 系統</h4>

      <div class="btn-group">
        <button class="btn btn-primary" @click="showModal = true">
          📋 開啟確認 Modal
        </button>
        <button class="btn btn-outline" @click="showModal2 = true">
          📝 開啟表單 Modal
        </button>
      </div>

      <p class="hint">
        完成 AppModal 後，點擊以上按鈕應分別彈出兩種 Modal，<br>
        各 Modal 的標題與內容透過 slot 自訂。
      </p>
    </section>

    <!-- ── 使用 AppModal（完成後取消以下註解） ── -->
    <!--
    <AppModal v-model="showModal">
      <template #header>
        <span>確認刪除</span>
      </template>
      <p>確定要刪除這筆資料嗎？此操作無法復原。</p>
      <div class="modal-actions">
        <button class="btn btn-outline" @click="showModal = false">取消</button>
        <button class="btn btn-danger" @click="showModal = false">確認刪除</button>
      </div>
    </AppModal>

    <AppModal v-model="showModal2">
      <template #header>聯絡我們</template>
      <form @submit.prevent="showModal2 = false">
        <input v-model="formName" placeholder="姓名" class="form-input" />
        <textarea v-model="formMessage" placeholder="訊息..." rows="3" class="form-input"></textarea>
        <button type="submit" class="btn btn-primary">送出</button>
      </form>
    </AppModal>
    -->
  </div>
</template>

<style scoped>
.capstone-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }
.btn-group { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
</style>
