<script setup>
/** Q03 — 非同步 Composable（useFetch pattern）（練習）
 *
 *  目標：實作 useFetch(url) composable，封裝完整的非同步資料獲取流程。
 *  使用 JSONPlaceholder API (https://jsonplaceholder.typicode.com) 作為測試後端。
 *
 *  你需要完成：
 *  1. 宣告 data、error、isLoading 三個 ref
 *  2. 用 watchEffect 監聽 url 變化，自動重新 fetch
 *  3. fetch 前重置狀態（isLoading = true, error = null, data = null）
 *  4. fetch 後更新對應 ref（成功 → data；失敗 → error）
 *  5. finally 確保 isLoading 歸回 false
 */
import { ref, watchEffect, toValue } from 'vue'

// ── TODO：實作 useFetch composable ─────────────────────────────
// 參數 url 可為：字串、Ref<string>、或 getter 函式 () => string
// 回傳 { data, error, isLoading }
//
// 提示：
// function useFetch(url) {
//   const data      = ref(null)
//   const error     = ref(null)
//   const isLoading = ref(false)
//
//   watchEffect(async () => {
//     // 1. 每次 URL 改變前，先重置狀態
//     isLoading.value = true
//     error.value     = null
//     data.value      = null
//
//     try {
//       // 2. toValue(url) 取得當前字串（支援 ref/getter）
//       const res = await fetch(toValue(url))
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       data.value = await res.json()
//     } catch (e) {
//       error.value = e.message
//     } finally {
//       isLoading.value = false
//     }
//   })
//
//   return { data, error, isLoading }
// }

function useFetch(url) {
  // 請在此實作
  const data      = ref(null)
  const error     = ref(null)
  const isLoading = ref(false)

  // TODO：用 watchEffect 監聽 url，自動 fetch

  return { data, error, isLoading }
}

// ── 換頁邏輯（驅動 useFetch 重新觸發）────────────────────────
// page 是響應式 ref；url 是 computed getter，page 改變 → url 改變 → watchEffect 重新執行
const page = ref(1)

// 傳入 getter 函式——page.value 是 watchEffect 的依賴
const { data, error, isLoading } = useFetch(
  () => `https://jsonplaceholder.typicode.com/posts?_page=${page.value}&_limit=5`
)

// 下一頁：將 page + 1，觸發 url 改變，watchEffect 重新 fetch
function nextPage() {
  page.value++
}

// 上一頁：最小為第 1 頁
function prevPage() {
  if (page.value > 1) page.value--
}
</script>

<template>
  <div class="use-fetch-demo">
    <h3>📡 Q03 — useFetch 非同步 Composable（練習）</h3>

    <!-- 換頁控制列 -->
    <div class="page-controls">
      <button class="btn btn-outline" :disabled="page === 1" @click="prevPage">← 上一頁</button>
      <span class="page-indicator">第 {{ page }} 頁</span>
      <button class="btn btn-primary" @click="nextPage">下一頁 →</button>
    </div>

    <!-- 載入中狀態 -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner" />
      <p>載入中…</p>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="error-state">
      <p>⚠️ 發生錯誤：{{ error }}</p>
    </div>

    <!-- 資料顯示 -->
    <ul v-else-if="data" class="post-list">
      <li v-for="post in data" :key="post.id" class="post-card">
        <p class="post-id">#{{ post.id }}</p>
        <p class="post-title">{{ post.title }}</p>
        <p class="post-body">{{ post.body }}</p>
      </li>
    </ul>

    <!-- 初始狀態（尚未實作時顯示） -->
    <div v-else class="empty-state">
      <p>尚未實作 useFetch — 完成 TODO 後資料將在這裡顯示</p>
    </div>
  </div>
</template>

<style scoped>
.use-fetch-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.page-controls { display: flex; align-items: center; gap: var(--space-md); justify-content: center; }
.page-indicator { font-weight: 600; color: var(--color-primary); min-width: 60px; text-align: center; }
.loading-state { display: flex; flex-direction: column; align-items: center; gap: var(--space-sm); padding: var(--space-xl); color: var(--color-text-muted); }
.spinner { width: 40px; height: 40px; border: 4px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.error-state { padding: var(--space-md); background: rgba(239,68,68,0.08); border: 1px solid #fca5a5; border-radius: var(--radius-md); color: #dc2626; }
.post-list { display: flex; flex-direction: column; gap: var(--space-sm); list-style: none; margin: 0; padding: 0; }
.post-card { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.post-id { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: 4px; }
.post-title { font-weight: 600; color: var(--color-text); margin-bottom: 4px; text-transform: capitalize; }
.post-body { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.5; }
.empty-state { padding: var(--space-lg); text-align: center; color: var(--color-text-muted); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px dashed var(--color-border); }
.btn { padding: 8px 18px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 500; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
