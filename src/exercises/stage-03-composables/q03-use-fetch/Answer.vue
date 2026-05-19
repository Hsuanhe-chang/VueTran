<script setup lang="ts">
/** Q03 — 非同步 Composable（useFetch pattern）（解答）
 *
 *  核心概念：
 *  - watchEffect 自動追蹤回調內所有響應式依賴，依賴改變時自動重新執行
 *  - toValue(url) 統一支援 string | Ref<string> | (() => string)
 *  - try/catch/finally 確保 isLoading 無論成敗都會歸回 false
 *  - 每次重新 fetch 前重置所有狀態，避免舊資料短暫殘留
 */
import { ref, watchEffect, toValue, type MaybeRefOrGetter } from 'vue'

// ── useFetch composable ───────────────────────────────────────
// 參數 url：可傳入字串、ref、或 getter 函式（MaybeRefOrGetter<string>）
function useFetch(url: MaybeRefOrGetter<string>) {
  // 三個核心狀態 ref，初始值皆為「無資料」
  // data 用 any 避免 template 中存取陣列元素屬性時的型別錯誤
  const data      = ref<any>(null)            // 成功後存放 API 回應資料
  const error     = ref<string | null>(null)  // 失敗後存放錯誤訊息字串
  const isLoading = ref(false)  // 是否正在等待回應

  // watchEffect 會在第一次執行、以及每次 toValue(url) 的依賴改變時重新執行
  watchEffect(async () => {
    // 每次 fetch 前先重置所有狀態（避免上次的資料殘留在畫面上）
    isLoading.value = true
    error.value     = null
    data.value      = null

    try {
      // toValue(url) 取得當前 URL 字串，不論 url 是純字串、ref 或 getter
      const res = await fetch(toValue(url))

      // HTTP 錯誤（4xx / 5xx）不會觸發 catch，需手動檢查 ok 旗標
      if (!res.ok) throw new Error(`HTTP ${res.status}：${res.statusText}`)

      // 解析 JSON 並寫入 data
      data.value = await res.json()
    } catch (e: unknown) {
      // 網路錯誤或上方手動拋出的 HTTP 錯誤都會在這裡被捕捉
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      // 無論成功或失敗，都要關閉 loading 狀態
      isLoading.value = false
    }
  })

  return { data, error, isLoading }
}

// ── 換頁邏輯 ─────────────────────────────────────────────────
const page = ref(1)

// 傳入 getter 函式：當 page.value 改變 → getter 回傳新 URL → watchEffect 重新執行
const { data, error, isLoading } = useFetch(
  () => `https://jsonplaceholder.typicode.com/posts?_page=${page.value}&_limit=5`
)

function nextPage() { page.value++ }
function prevPage() { if (page.value > 1) page.value-- }
</script>

<template>
  <div class="use-fetch-demo">
    <h3>📡 Q03 — useFetch 非同步 Composable（解答）</h3>

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

    <!-- 解答說明 -->
    <section class="answer-section">
      <h4>✅ useFetch 完整實作</h4>
      <pre class="code-block">import { ref, watchEffect, toValue } from 'vue'

function useFetch(url) {
  const data      = ref(null)
  const error     = ref(null)
  const isLoading = ref(false)

  watchEffect(async () => {
    isLoading.value = true   // 開始 loading
    error.value     = null   // 清除舊錯誤
    data.value      = null   // 清除舊資料

    try {
      const res = await fetch(toValue(url))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false  // 無論成敗都關閉 loading
    }
  })

  return { data, error, isLoading }
}

// 使用方式：傳入 getter，page 變化時自動重新 fetch
const page = ref(1)
const { data, error, isLoading } = useFetch(
  () => `https://api.example.com/posts?page=${page.value}`
)</pre>
    </section>
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
.answer-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-primary); }
h4 { color: var(--color-secondary); margin-bottom: var(--space-sm); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
.btn { padding: 8px 18px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 500; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
