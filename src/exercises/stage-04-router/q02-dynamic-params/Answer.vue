<script setup>
/** Q02 — 動態路由參數（:id）與 useRoute（解答）
 *
 *  核心概念：
 *  - :paramName 在 path 中定義動態段
 *  - useRoute() 取得當前路由實例（包含 params、query、meta 等）
 *  - route.params 是響應式物件，可直接用在 computed / watch
 *  - params 值型別永遠是字串（即使 URL 看起來像數字）
 */
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// 取得當前路由實例（本 App 的 router 提供）
const route = useRoute()

// 模擬文章資料
const articles = [
  { id: '1', title: 'Vue 3 Composition API 完全指南', author: '小明', tags: ['Vue', '前端'] },
  { id: '2', title: 'Pinia 狀態管理入門',            author: '小華', tags: ['Pinia', '狀態管理'] },
  { id: '3', title: 'Vue Router 4 深度解析',          author: '小美', tags: ['Router', '導航'] },
  { id: '4', title: 'TypeScript 與 Vue 3 最佳實踐',  author: '小強', tags: ['TypeScript', 'Vue'] },
]

// 用 ref 模擬「當前查看的文章 ID」（實際應用是 route.params.id）
const simulatedId = ref('1')

// 根據 simulatedId 查找文章
// 注意：params 值是字串，articles.id 也設為字串，所以直接用 === 比對
const currentArticle = computed(() =>
  articles.find(a => a.id === simulatedId.value) ?? null
)
</script>

<template>
  <div class="dynamic-params-demo">
    <h3>🔗 Q02 — 動態路由參數（:id）與 useRoute（解答）</h3>

    <!-- ── 本 App 的真實路由 params ── -->
    <section class="demo-section">
      <h4>Part A — 本 App 的當前路由 params</h4>
      <p class="hint">這些值來自 App 現有的 /stage/:stageId/:questionId 路由</p>

      <div class="route-info">
        <div class="info-row">
          <span class="info-label">route.params</span>
          <span class="info-value">{{ route.params }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">route.params.stageId</span>
          <span class="info-value">{{ route.params.stageId }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">route.params.questionId</span>
          <span class="info-value">{{ route.params.questionId }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">typeof stageId</span>
          <span class="info-value">{{ typeof route.params.stageId }}</span>
        </div>
      </div>
    </section>

    <!-- ── 模擬文章詳情頁 ── -->
    <section class="demo-section">
      <h4>Part B — 模擬「文章詳情頁」根據 :id 顯示內容</h4>

      <div class="id-picker">
        <span>切換文章 ID：</span>
        <div class="id-buttons">
          <button
            v-for="a in articles"
            :key="a.id"
            class="id-btn"
            :class="{ active: simulatedId === a.id }"
            @click="simulatedId = a.id"
          >
            {{ a.id }}
          </button>
        </div>
        <span class="hint">params 型別：string（{{ typeof simulatedId }}）</span>
      </div>

      <div v-if="currentArticle" class="article-card">
        <p class="article-id">#{{ currentArticle.id }}</p>
        <h5 class="article-title">{{ currentArticle.title }}</h5>
        <p class="article-author">作者：{{ currentArticle.author }}</p>
        <div class="article-tags">
          <span v-for="tag in currentArticle.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section answer-section">
      <h4>✅ useRoute 完整 API 說明</h4>
      <pre v-pre class="code-block">import { useRoute } from 'vue-router'

const route = useRoute()

// 路由基本資訊
route.name       // 路由名稱（如 'home'）
route.path       // 當前路徑（如 '/about'）
route.fullPath   // 完整 URL（含 query/hash）

// 動態段參數（型別永遠是 string）
route.params.id       // ':id' 動態段的值
route.params.userId   // ':userId' 動態段的值

// 查詢字串（?key=value）
route.query.search    // '?search=vue' 的值

// 路由 Meta 欄位（Q05 主題）
route.meta.requiresAuth  // true / false

// 監聽 params 變化（元件不重建，只有 params 改變）
watch(
  () => route.params.id,
  (newId) => { /* 重新取得資料 */ }
)</pre>
    </section>
  </div>
</template>

<style scoped>
.dynamic-params-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
h5 { color: var(--color-text); margin: 0; font-size: 1rem; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.answer-section { border-color: var(--color-primary); }
.route-info { display: flex; flex-direction: column; gap: 6px; }
.info-row { display: flex; gap: var(--space-sm); align-items: flex-start; font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 200px; }
.info-value { font-family: var(--font-mono); color: var(--color-primary); word-break: break-all; }
.id-picker { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; }
.id-buttons { display: flex; gap: 6px; }
.id-btn { padding: 4px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); font-weight: 500; }
.id-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.article-card { padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 6px; }
.article-id { font-size: var(--font-size-sm); color: var(--color-text-muted); font-family: var(--font-mono); }
.article-title { font-size: 1.1rem; }
.article-author { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.article-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tag { padding: 2px 10px; background: var(--color-primary); color: #fff; border-radius: 999px; font-size: 0.75rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
