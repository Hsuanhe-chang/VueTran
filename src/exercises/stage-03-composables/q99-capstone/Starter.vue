<script setup lang="ts">
/** Q99 — 綜合題：useLocalStorage + useDebouncedRef（練習）
 *
 *  本題組合兩個進階 Composable：
 *
 *  1. useLocalStorage(key, defaultValue)
 *     - 回傳一個 ref，初始值從 localStorage 讀取
 *     - 用 watch 監聽 ref，自動寫回 localStorage
 *     - 讓資料在重新整理後不會消失
 *
 *  2. useDebouncedRef(value, delay = 500)
 *     - 回傳一個特殊 ref（用 customRef 實作）
 *     - setter 有防抖：停止輸入後 delay ms 才真正更新值
 *     - 適合搜尋框、自動完成等場景（減少不必要的計算）
 */
import { ref, computed, watch, customRef } from 'vue'

// ── TODO 1：實作 useLocalStorage ──────────────────────────────
// 功能：讀取 localStorage，返回可響應的 ref；修改時自動寫回 localStorage
//
// 提示：
// function useLocalStorage(key, defaultValue) {
//   // 嘗試從 localStorage 讀取；若不存在則使用 defaultValue
//   const stored = localStorage.getItem(key)
//   const storageRef = ref(stored ? JSON.parse(stored) : defaultValue)
//
//   // 用 watch 監聽 ref，每次值改變都寫入 localStorage
//   watch(storageRef, (newVal) => {
//     localStorage.setItem(key, JSON.stringify(newVal))
//   })
//
//   return storageRef
// }

function useLocalStorage<T>(key: string, defaultValue: T) {
  // 請實作這裡
  return ref(defaultValue)  // ← 替換這行
}

// ── TODO 2：實作 useDebouncedRef ──────────────────────────────
// 功能：用 customRef 建立防抖 ref — 停止設值後 delay ms 才更新
//
// 提示：
// function useDebouncedRef(value, delay = 500) {
//   let timer = null
//   return customRef((track, trigger) => ({
//     get() {
//       track()           // 告訴 Vue：讀取此 ref，請追蹤依賴
//       return value
//     },
//     set(newVal) {
//       clearTimeout(timer)          // 清除上次的延遲
//       timer = setTimeout(() => {
//         value = newVal             // 延遲後才真正更新值
//         trigger()                  // 告訴 Vue：值已改變，請重新渲染
//       }, delay)
//     }
//   }))
// }

function useDebouncedRef<T>(value: T, delay = 500) {
  // 請實作這裡（使用 customRef）
  return ref(value)  // ← 替換這行（目前沒有防抖效果）
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

// ── TODO 3：使用兩個 Composable 組合應用 ──────────────────────
// 3-A：筆記應用標題（用 useLocalStorage 儲存，key = 'note-app-title'）
const appTitle = useLocalStorage('note-app-title', '我的筆記本')

// 3-B：搜尋關鍵字（用 useDebouncedRef，延遲 300ms）
const searchQuery = useDebouncedRef('', 300)

// 3-C：根據 searchQuery 過濾筆記（用 computed）
const filteredNotes = computed(() => {
  // TODO：根據 searchQuery 的值過濾 notes
  // 提示：searchQuery 是 ref，取值需要 searchQuery.value
  //       filter 條件：note.title 或 note.content 包含關鍵字（不分大小寫）
  return notes  // ← 替換這行
})
</script>

<template>
  <div class="capstone-demo">
    <h3>🗒️ Q99 — 綜合題：useLocalStorage + useDebouncedRef（練習）</h3>

    <!-- 應用標題（useLocalStorage）-->
    <section class="demo-section">
      <h4>應用標題（useLocalStorage）</h4>
      <p class="hint">修改標題後重新整理頁面，標題應保留不消失</p>
      <div class="input-row">
        <label>標題：</label>
        <input v-model="appTitle" type="text" class="demo-input" placeholder="輸入筆記本標題" />
      </div>
      <p class="storage-hint">
        localStorage key: <code>note-app-title</code>
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
          @input="searchQuery = ($event.target as HTMLInputElement).value"
          type="text"
          class="demo-input"
          placeholder="搜尋筆記…（停止輸入 300ms 後才過濾）"
        />
      </div>

      <!-- 筆記清單 -->
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
</style>
