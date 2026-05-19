<script setup lang="ts">
/** Q99 — 綜合題：帶動畫的頁面轉場與彈窗系統（解答）
 *
 *  TODO 解答：
 *  TODO 1：<Transition name="page" mode="out-in"> + page-* CSS 動畫
 *  TODO 2：<KeepAlive :include="['NotesPage', 'SettingsPage']">
 *  TODO 3：<Teleport to="body"> 包住 Modal overlay
 *  TODO 4：<Teleport to="body"> 包住 Toast 容器
 *
 *  重點：
 *  - KeepAlive include 比對的是元件的 name 選項（必須精確匹配）
 *  - Transition 的 mode="out-in" → 舊頁先離開，新頁再進入（避免重疊）
 *  - Teleport 讓 Modal / Toast 脫離父元件的 overflow 和 z-index 限制
 */
import { ref, defineComponent, onMounted, type Component } from 'vue'

// ── 頁面元件定義 ─────────────────────────────────────────
// 每個元件必須有 name 選項，KeepAlive 才能用 include 比對

const HomePage = defineComponent({
  name: 'HomePage',
  setup() {
    const mountTime = ref('')
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

const NotesPage = defineComponent({
  name: 'NotesPage',  // include 中有此名稱 → 快取
  setup() {
    const note    = ref('')
    const savedAt = ref('')
    function saveNote() { savedAt.value = new Date().toLocaleTimeString('zh-TW') }
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

const SettingsPage = defineComponent({
  name: 'SettingsPage',  // include 中有此名稱 → 快取
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
const showModal   = ref(false)
const modalTitle  = ref('確認操作')
const modalMsg    = ref('此操作將清除所有筆記，確定繼續嗎？')
const modalResult = ref('')

function openModal() { modalResult.value = ''; showModal.value = true }
function confirmModal() { modalResult.value = '✅ 使用者確認了操作'; showModal.value = false }
function cancelModal()  { modalResult.value = '❌ 使用者取消了操作'; showModal.value = false }

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
    <h3>🎯 Q99 — 綜合題：帶動畫的頁面轉場與彈窗系統（解答）</h3>

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
    <!-- ✅ TODO 2 解答：KeepAlive 快取 NotesPage 和 SettingsPage         -->
    <!--   include 必須精確匹配元件的 name 選項，HomePage 不在其中 → 不快取 -->
    <!-- ✅ TODO 1 解答：Transition mode="out-in" → 舊頁先離開再進入新頁  -->
    <div class="page-container">
      <KeepAlive :include="['NotesPage', 'SettingsPage']">
        <Transition name="page" mode="out-in">
          <!-- :key="currentTab" → key 改變時觸發 Transition 動畫 -->
          <component :is="currentPage" :key="currentTab" />
        </Transition>
      </KeepAlive>
    </div>

    <!-- ── 觸發列 ── -->
    <div class="action-row">
      <button class="btn btn-sm" @click="openModal">🗑️ 開啟確認 Modal</button>
      <button class="btn btn-sm btn-outline" @click="addToast('操作成功！', 'success')">✅ 成功通知</button>
      <button class="btn btn-sm btn-outline" @click="addToast('發生錯誤！', 'error')">❌ 錯誤通知</button>
      <span v-if="modalResult" class="result-text">{{ modalResult }}</span>
    </div>

    <!-- ✅ TODO 3 解答：Modal 用 Teleport 傳送到 body              -->
    <!-- 效果：Modal DOM 出現在 <body> 底部，不受父元件 overflow 影響 -->
    <Teleport to="body">
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
    </Teleport>

    <!-- ✅ TODO 4 解答：Toast 容器用 Teleport 傳送到 body          -->
    <!-- 效果：Toast 固定在視窗右下角，z-index 不受父元件堆疊影響    -->
    <Teleport to="body">
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
    </Teleport>
  </div>
</template>

<style scoped>
.capstone-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
/* Tab 導航 */
.tab-nav { display: flex; gap: 4px; border-bottom: 2px solid var(--color-border); padding-bottom: var(--space-sm); }
.tab-btn { padding: 6px 16px; border: none; border-radius: var(--radius-md) var(--radius-md) 0 0; cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: transparent; color: var(--color-text-muted); transition: all 0.2s; }
.tab-btn.active { background: var(--color-primary); color: #fff; }
/* 頁面容器 */
.page-container { min-height: 220px; }
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
/* Modal（Teleport 到 body 後，scoped 仍可透過 :global 或 position:fixed 生效）*/
/* 由於 Modal 是透過 Teleport 到 body，scoped 選擇器不需要 :deep() */
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
/* ✅ TODO 1 解答：page 轉場動畫（mode="out-in" 確保不重疊）*/
.page-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.page-enter-from   { opacity: 0; transform: translateX(16px); }
.page-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-leave-to     { opacity: 0; transform: translateX(-16px); }
/* 按鈕 */
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
</style>
