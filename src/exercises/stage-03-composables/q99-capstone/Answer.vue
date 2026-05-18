<script setup>
/** Q99 — 綜合題：useLocalStorage + useDebouncedRef（解答）
 *
 *  核心概念：
 *  - useLocalStorage：將 ref 與 localStorage 雙向同步，實現資料持久化
 *  - useDebouncedRef：用 customRef 自訂 getter/setter，在 setter 加入 debounce 邏輯
 *  - customRef：Vue 提供的低階 API，讓你完全掌控 ref 的追蹤（track）與觸發（trigger）時機
 *  - computed：根據 debouncedRef 的值派生過濾後的列表
 */
import { ref, computed, watch, customRef } from 'vue'

// ── useLocalStorage：資料持久化 ───────────────────────────────
// 將 ref 初始值讀自 localStorage，並在值改變時自動寫回
function useLocalStorage(key, defaultValue) {
  // 嘗試從 localStorage 讀取已儲存的值（JSON 反序列化）
  // 若 key 不存在，localStorage.getItem 回傳 null，改用 defaultValue
  const stored = localStorage.getItem(key)
  const storageRef = ref(stored !== null ? JSON.parse(stored) : defaultValue)

  // 監聽 ref 的變化，每次值改變都寫回 localStorage（JSON 序列化）
  // { immediate: false }（預設）— 初始化時不觸發，避免重複寫入
  watch(storageRef, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  })

  return storageRef
}

// ── useDebouncedRef：防抖 ref ─────────────────────────────────
// 使用 customRef 自訂 get/set 行為：setter 延遲 delay ms 才更新值
function useDebouncedRef(value, delay = 500) {
  let timer = null  // 儲存 setTimeout 的 ID，用於清除上次的計時器

  return customRef((track, trigger) => ({
    // get：每次讀取 ref 時呼叫
    // track() 告訴 Vue：「這個 ref 被讀取了，請把當前的 computed/watchEffect 加入依賴」
    get() {
      track()
      return value  // 回傳當前值（尚未防抖的真實值）
    },

    // set：每次設定 ref 時呼叫（如 searchQuery.value = 'xxx' 或 v-model 賦值）
    set(newVal) {
      clearTimeout(timer)  // 清除上次還未執行的延遲（防抖核心）

      timer = setTimeout(() => {
        value = newVal  // 延遲後才真正更新閉包中的 value 變數
        trigger()       // 告訴 Vue：「值已改變，依賴此 ref 的 computed/template 請重新計算」
      }, delay)
    }
  }))
}

// ── 靜態筆記資料 ──────────────────────────────────────────────
const notes = [
  { id: 1, title: 'Vue 3 Composition API',  content: '學習 ref、reactive、computed、watch 的使用方式' },
  { id: 2, title: 'Composable 設計原則',    content: '函式以 use 開頭，回傳響應式物件，邏輯封裝在函式內部' },
  { id: 3, title: 'Pinia 狀態管理',         content: '取代 Vuex，支援 Composition API，型別推導更好' },
  { id: 4, title: 'Vue Router 4',           content: '動態路由、巢狀路由、導航守衛、懶載入' },
  { id: 5, title: 'TypeScript 與 Vue 3',    content: 'defineProps 配合泛型宣告型別，ref 自動推導' },
  { id: 6, title: 'Vite 建置工具',          content: '基於原生 ESM，開發啟動速度極快，HMR 即時更新' },
]

// 用 useLocalStorage 儲存標題（重新整理後不消失）
const appTitle = useLocalStorage('note-app-title-answer', '我的筆記本')

// 用 useDebouncedRef 建立搜尋欄（停止輸入 300ms 後才觸發過濾）
const searchQuery = useDebouncedRef('', 300)

// 根據 debounced 搜尋詞過濾筆記
const filteredNotes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return notes  // 無搜尋詞時顯示全部

  return notes.filter(note =>
    note.title.toLowerCase().includes(query) ||
    note.content.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="capstone-demo">
    <h3>🗒️ Q99 — 綜合題：useLocalStorage + useDebouncedRef（解答）</h3>

    <!-- 應用標題（useLocalStorage）-->
    <section class="demo-section">
      <h4>應用標題（useLocalStorage）</h4>
      <p class="hint">修改標題後重新整理頁面，標題應保留不消失</p>
      <div class="input-row">
        <label>標題：</label>
        <input v-model="appTitle" type="text" class="demo-input" placeholder="輸入筆記本標題" />
      </div>
      <p class="storage-hint">
        localStorage key: <code>note-app-title-answer</code>
        &nbsp;|&nbsp;
        目前值：<strong>{{ appTitle }}</strong>
      </p>
    </section>

    <!-- 搜尋欄（useDebouncedRef）-->
    <section class="demo-section">
      <h4>{{ appTitle }}</h4>

      <div class="search-row">
        <input
          :value="searchQuery"
          @input="searchQuery = $event.target.value"
          type="text"
          class="demo-input"
          placeholder="搜尋筆記…（停止輸入 300ms 後才過濾）"
        />
      </div>

      <div v-if="filteredNotes.length === 0" class="empty-state">
        <p>沒有符合「{{ searchQuery }}」的筆記</p>
      </div>
      <ul v-else class="note-list">
        <li v-for="note in filteredNotes" :key="note.id" class="note-card">
          <p class="note-title">{{ note.title }}</p>
          <p class="note-content">{{ note.content }}</p>
        </li>
      </ul>

      <p class="hint">共 {{ filteredNotes.length }} / {{ notes.length }} 則筆記</p>
    </section>

    <!-- 解答說明 -->
    <section class="demo-section answer-section">
      <h4>✅ 兩個 Composable 的完整實作</h4>
      <pre class="code-block">// 1. useLocalStorage：持久化 ref
function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key)
  const storageRef = ref(stored !== null ? JSON.parse(stored) : defaultValue)

  watch(storageRef, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  })

  return storageRef
}

// 2. useDebouncedRef：防抖 ref（用 customRef）
function useDebouncedRef(value, delay = 500) {
  let timer = null
  return customRef((track, trigger) => ({
    get() {
      track()    // 讓 Vue 追蹤這個 ref 的依賴
      return value
    },
    set(newVal) {
      clearTimeout(timer)            // 清除上次計時器（防抖核心）
      timer = setTimeout(() => {
        value = newVal               // 真正更新值
        trigger()                    // 通知 Vue 重新渲染
      }, delay)
    }
  }))
}

// 組合使用：
const appTitle    = useLocalStorage('note-app-title', '我的筆記本')
const searchQuery = useDebouncedRef('', 300)
const filtered    = computed(() => notes.filter(n =>
  n.title.includes(searchQuery.value)
))</pre>
    </section>
  </div>
</template>

<style scoped>
.capstone-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.input-row { display: flex; align-items: center; gap: var(--space-sm); }
.input-row label { white-space: nowrap; font-size: var(--font-size-sm); color: var(--color-text-muted); }
.search-row { display: flex; gap: var(--space-sm); }
.demo-input { flex: 1; padding: 10px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem; background: var(--color-bg); color: var(--color-text); outline: none; }
.demo-input:focus { border-color: var(--color-primary); }
.storage-hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.note-list { display: flex; flex-direction: column; gap: var(--space-sm); list-style: none; margin: 0; padding: 0; }
.note-card { padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.note-title { font-weight: 600; color: var(--color-text); margin-bottom: 4px; }
.note-content { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.5; }
.empty-state { padding: var(--space-md); text-align: center; color: var(--color-text-muted); background: var(--color-bg); border-radius: var(--radius-md); border: 1px dashed var(--color-border); }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
