<script setup lang="ts">
/** Q99 — 綜合題：帶動畫的頁面轉場與彈窗系統（練習）
 *
 *  整合 Stage 6 的三個核心技術：
 *  - Transition：頁面切換時有滑動動畫（mode="out-in"）
 *  - KeepAlive：NotesPage 和 SettingsPage 保留狀態，HomePage 每次重置
 *  - Teleport：Modal 與 Toast 渲染在 <body> 層級，不受 overflow 限制
 *
 *  TODO 1：用 <Transition name="page" mode="out-in"> 包住 <component :is>
 *  TODO 2：用 <KeepAlive :include="['NotesPage', 'SettingsPage']"> 包住 <Transition>
 *  TODO 3：用 <Teleport to="body"> 包住 Modal 的 overlay div
 *  TODO 4：用 <Teleport to="body"> 包住 Toast 容器 div
 */
import { ref, defineComponent, onMounted, type Component } from 'vue'

// ── 頁面元件定義 ─────────────────────────────────────────
// 重點：KeepAlive 的 include 比對的是元件的 name 選項（非變數名稱）

// 公告頁：每次進入都重置（不快取）
const HomePage = defineComponent({
  name: 'HomePage',  // KeepAlive include 不含此名稱 → 不快取
  setup() {
    const mountTime = ref('')
    // 每次掛載都重新記錄時間（驗證快取是否生效）
    onMounted(() => {
      mountTime.value = new Date().toLocaleTimeString('zh-TW')
    })
    return { mountTime }
  },
  template: `
    <div class="page home-page">
      <h5>📢 公告欄</h5>
      <p class="page-hint">每次切回此頁都會重新掛載（不快取）</p>
      <div class="mount-time">
        <span>本次掛載時間：</span>
        <strong>{{ mountTime }}</strong>
      </div>
      <ul class="notice-list">
        <li>系統維護通知：本週六 02:00–04:00</li>
        <li>新功能上線：深色模式已支援</li>
        <li>版本更新：v2.1.0 已發布</li>
      </ul>
    </div>
  `
})

// 筆記本：保留輸入內容（快取）
const NotesPage = defineComponent({
  name: 'NotesPage',  // KeepAlive include 含此名稱 → 快取
  setup() {
    const note = ref('')
    const savedAt = ref('')
    function saveNote() {
      savedAt.value = new Date().toLocaleTimeString('zh-TW')
    }
    return { note, savedAt, saveNote }
  },
  template: `
    <div class="page notes-page">
      <h5>📝 我的筆記</h5>
      <p class="page-hint">切換頁面後再回來，文字應該保留（KeepAlive 快取）</p>
      <textarea
        v-model="note"
        class="note-textarea"
        placeholder="在此輸入筆記…"
        rows="4"
      ></textarea>
      <div class="note-actions">
        <button class="page-btn" @click="saveNote">💾 儲存</button>
        <span v-if="savedAt" class="saved-hint">已於 {{ savedAt }} 儲存</span>
      </div>
    </div>
  `
})

// 設定頁：保留設定值（快取）
const SettingsPage = defineComponent({
  name: 'SettingsPage',  // KeepAlive include 含此名稱 → 快取
  setup() {
    const darkMode      = ref(false)
    const notifications = ref(true)
    const autoSave      = ref(true)
    return { darkMode, notifications, autoSave }
  },
  template: `
    <div class="page settings-page">
      <h5>⚙️ 系統設定</h5>
      <p class="page-hint">切換頁面後再回來，設定值應該保留（KeepAlive 快取）</p>
      <div class="setting-list">
        <label class="setting-item">
          <span>深色模式</span>
          <input type="checkbox" v-model="darkMode" />
        </label>
        <label class="setting-item">
          <span>推播通知</span>
          <input type="checkbox" v-model="notifications" />
        </label>
        <label class="setting-item">
          <span>自動儲存</span>
          <input type="checkbox" v-model="autoSave" />
        </label>
      </div>
    </div>
  `
})

// ── Tab 導航 ─────────────────────────────────────────────
const tabs = [
  { id: 'home',     label: '🏠 公告', component: HomePage },
  { id: 'notes',   label: '📝 筆記', component: NotesPage },
  { id: 'settings', label: '⚙️ 設定', component: SettingsPage }
]

const currentTab  = ref('home')
// 使用 Component 基礎型別，允許儲存三種頁面元件中的任意一種
const currentPage = ref<Component>(HomePage)

function switchTab(tab: typeof tabs[0]): void {
  currentTab.value  = tab.id
  currentPage.value = tab.component
}

// ── Modal 彈窗 ────────────────────────────────────────────
const showModal    = ref(false)
const modalTitle   = ref('確認操作')
const modalMsg     = ref('此操作將清除所有筆記，確定繼續嗎？')
const modalResult  = ref('')

function openModal() {
  modalResult.value = ''
  showModal.value   = true
}
function confirmModal() {
  modalResult.value = '✅ 使用者確認了操作'
  showModal.value   = false
}
function cancelModal() {
  modalResult.value = '❌ 使用者取消了操作'
  showModal.value   = false
}

// ── Toast 通知 ────────────────────────────────────────────
const toasts = ref<{ id: number; msg: string; type: string }[]>([])  // 明確標注，避免推斷為 never[]
let toastId  = 0

function addToast(msg: string, type = 'info'): void {
  const id = ++toastId
  toasts.value.push({ id, msg, type })
  // 3 秒後自動移除
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}
</script>

<template>
  <div class="capstone-demo">
    <h3>🎯 Q99 — 綜合題：帶動畫的頁面轉場與彈窗系統（練習）</h3>

    <!-- ── Tab 導航列 ── -->
    <nav class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: currentTab === tab.id }"
        @click="switchTab(tab)"
      >{{ tab.label }}</button>
    </nav>

    <!-- ── 頁面內容區 ── -->
    <!-- TODO 2：用 <KeepAlive :include="['NotesPage', 'SettingsPage']"> 包住 Transition -->
    <!-- TODO 1：用 <Transition name="page" mode="out-in"> 包住 <component :is>          -->
    <div class="page-container">
      <component :is="currentPage" :key="currentTab" />
    </div>
    <!-- 完成後的結構：
      <KeepAlive :include="['NotesPage', 'SettingsPage']">
        <Transition name="page" mode="out-in">
          <component :is="currentPage" :key="currentTab" />
        </Transition>
      </KeepAlive>
    -->

    <!-- ── 觸發列 ── -->
    <div class="action-row">
      <button class="btn btn-sm" @click="openModal">🗑️ 開啟確認 Modal</button>
      <button class="btn btn-sm btn-outline" @click="addToast('操作成功！', 'success')">✅ 成功通知</button>
      <button class="btn btn-sm btn-outline" @click="addToast('發生錯誤！', 'error')">❌ 錯誤通知</button>
      <span v-if="modalResult" class="result-text">{{ modalResult }}</span>
    </div>

    <!-- ── TODO 3：確認 Modal（需用 Teleport 傳送到 body）── -->
    <!-- 目前在元件內渲染，可能被 overflow 裁切                -->
    <!-- 請用 <Teleport to="body"> 包住以下 modal-overlay div  -->
    <div v-if="showModal" class="modal-overlay" @click.self="cancelModal">
      <div class="modal-box">
        <h5 class="modal-title">{{ modalTitle }}</h5>
        <p class="modal-msg">{{ modalMsg }}</p>
        <div class="modal-actions">
          <button class="btn btn-sm btn-outline" @click="cancelModal">取消</button>
          <button class="btn btn-sm btn-danger" @click="confirmModal">確認</button>
        </div>
      </div>
    </div>

    <!-- ── TODO 4：Toast 通知容器（需用 Teleport 傳送到 body）── -->
    <!-- 目前在元件內渲染，z-index 堆疊和位置可能不正確             -->
    <!-- 請用 <Teleport to="body"> 包住以下 toast-container div   -->
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.type}`"
        >{{ toast.msg }}</div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.capstone-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
/* Tab 導航 */
.tab-nav { display: flex; gap: 4px; border-bottom: 2px solid var(--color-border); padding-bottom: var(--space-sm); }
.tab-btn { padding: 6px 16px; border: none; border-radius: var(--radius-md) var(--radius-md) 0 0; cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: transparent; color: var(--color-text-muted); transition: all 0.2s; }
.tab-btn.active { background: var(--color-primary); color: #fff; }
/* 頁面容器 */
.page-container { min-height: 200px; }
/* 子元件（defineComponent template）需 :deep() */
:deep(.page) { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
:deep(.page h5) { font-size: 1rem; font-weight: 700; margin: 0; color: var(--color-secondary); }
:deep(.page-hint) { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }
:deep(.mount-time) { font-size: var(--font-size-sm); display: flex; gap: 8px; }
:deep(.notice-list) { margin: 0; padding-left: 20px; font-size: var(--font-size-sm); display: flex; flex-direction: column; gap: 4px; }
:deep(.note-textarea) { width: 100%; padding: 8px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); font-family: inherit; resize: vertical; box-sizing: border-box; }
:deep(.note-actions) { display: flex; align-items: center; gap: var(--space-sm); }
:deep(.page-btn) { padding: 5px 14px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
:deep(.saved-hint) { font-size: 0.8rem; color: var(--color-text-muted); }
:deep(.setting-list) { display: flex; flex-direction: column; gap: 10px; }
:deep(.setting-item) { display: flex; align-items: center; justify-content: space-between; font-size: var(--font-size-sm); cursor: pointer; padding: 6px 0; border-bottom: 1px dashed var(--color-border); }
/* 觸發列 */
.action-row { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; }
.result-text { font-size: var(--font-size-sm); color: var(--color-text-muted); }
/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-box { background: var(--color-bg-card); border-radius: var(--radius-lg); padding: var(--space-lg); min-width: 280px; max-width: 400px; display: flex; flex-direction: column; gap: var(--space-md); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
.modal-title { font-size: 1.05rem; font-weight: 700; margin: 0; }
.modal-msg { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
/* Toast */
.toast-container { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 9998; pointer-events: none; }
.toast-item { padding: 10px 16px; border-radius: var(--radius-md); font-size: var(--font-size-sm); font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15); pointer-events: auto; }
.toast-success { background: #dcfce7; color: #16a34a; border: 1px solid #86efac; }
.toast-error   { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }
.toast-info    { background: #eff6ff; color: #2563eb; border: 1px solid #93c5fd; }
/* Toast TransitionGroup 動畫 */
.toast-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(20px); }
.toast-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; position: absolute; }
.toast-leave-to     { opacity: 0; transform: translateX(20px); }
/* TODO 1：完成後補上 page 轉場動畫 CSS */
/* .page-enter-active { ... } */
/* .page-enter-from   { ... } */
/* .page-leave-active { ... } */
/* .page-leave-to     { ... } */
/* 按鈕 */
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
</style>
