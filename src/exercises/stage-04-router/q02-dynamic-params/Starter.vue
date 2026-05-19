<script setup lang="ts">
/** Q02 — 動態路由參數（:id）與 useRoute（從零撰寫）
 *
 *  動態路由：在 path 中用 `:名稱` 定義可變片段
 *    { path: '/posts/:id', component: PostDetail }
 *
 *  上面的設定能匹配：
 *    /posts/1   → route.params.id = '1'
 *    /posts/abc → route.params.id = 'abc'
 *
 *  重要：params 的值型別永遠是字串（string），即使 URL 看起來像數字。
 */
import { ref, computed } from 'vue'
// TODO：也需要從 'vue-router' 匯入 useRoute
// import { useRoute } from 'vue-router'

// ── TODO 1：取得路由實例 ──────────────────────────────────────
// const route = useRoute()

// ── 模擬文章資料（實務中通常從 API 取得） ────────────────────
const articles = [
  { id: '1', title: 'Vue 3 Composition API 完全指南', author: '小明', tags: ['Vue', '前端'] },
  { id: '2', title: 'Pinia 狀態管理入門',            author: '小華', tags: ['Pinia', '狀態管理'] },
  { id: '3', title: 'Vue Router 4 深度解析',          author: '小美', tags: ['Router', '導航'] },
  { id: '4', title: 'TypeScript 與 Vue 3 最佳實踐',  author: '小強', tags: ['TypeScript', 'Vue'] },
]

// ── TODO 2：用 ref 模擬「當前查看的文章 ID」──────────────────
// 實際應用中這會是 route.params.id，這裡用 ref 讓你可以互動切換
const simulatedId = ref('1')

// ── TODO 3：根據 simulatedId 查找文章 ──────────────────────
// 提示：articles.find(a => a.id === simulatedId.value)
const currentArticle = computed(() => {
  // 請實作
  return null
})
</script>

<template>
  <div class="dynamic-params-demo">
    <h3>🔗 Q02 — 動態路由參數（:id）與 useRoute（練習）</h3>

    <!-- ── 當前路由資訊（TODO 1 完成後會有值）── -->
    <section class="demo-section">
      <h4>Part A — 本 App 的當前路由 params</h4>
      <p class="hint">完成 TODO 1 後，下方會顯示真實的路由參數</p>

      <!-- TODO：把 null 換成 route.params -->
      <div class="route-info">
        <div class="info-row">
          <span class="info-label">route.params</span>
          <span class="info-value">{{ /* route.params */ null }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">route.params.stageId</span>
          <span class="info-value">{{ /* route.params.stageId */ '（尚未實作）' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">route.params.questionId</span>
          <span class="info-value">{{ /* route.params.questionId */ '（尚未實作）' }}</span>
        </div>
      </div>
    </section>

    <!-- ── 模擬文章詳情頁（TODO 2、3 完成後運作）── -->
    <section class="demo-section">
      <h4>Part B — 模擬「文章詳情頁」根據 :id 顯示內容</h4>
      <p class="hint">動態路由中，:id 的值決定顯示哪篇文章（這裡用 ref 模擬）</p>

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
        <span class="hint">當前 ID：{{ simulatedId }}（型別：{{ typeof simulatedId }}）</span>
      </div>

      <!-- 文章顯示（TODO 3 完成後顯示真實內容） -->
      <div v-if="currentArticle" class="article-card">
        <p class="article-id">#{{ currentArticle.id }}</p>
        <h5 class="article-title">{{ currentArticle.title }}</h5>
        <p class="article-author">作者：{{ currentArticle.author }}</p>
        <div class="article-tags">
          <span v-for="tag in currentArticle.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>找不到 ID 為「{{ simulatedId }}」的文章（或尚未實作 TODO 3）</p>
      </div>
    </section>

    <!-- ── 路由設定說明 ── -->
    <section class="demo-section">
      <h4>動態路由定義範例</h4>
      <pre v-pre class="code-block">// router/index.js
routes: [
  // 動態段 :id — 匹配任意值
  { path: '/posts/:id',          component: PostDetail },

  // 多個動態段
  { path: '/users/:userId/posts/:postId', component: UserPost },

  // 可選動態段（加 ? — 有或沒有都能匹配）
  { path: '/posts/:id?',         component: PostList },
]

// 元件中讀取：
const route = useRoute()
console.log(route.params.id)      // '1'（字串，非數字）
console.log(typeof route.params.id) // 'string'</pre>
    </section>
  </div>
</template>

<style scoped>
.dynamic-params-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
h5 { color: var(--color-text); margin: 0; font-size: 1rem; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.route-info { display: flex; flex-direction: column; gap: 6px; }
.info-row { display: flex; gap: var(--space-sm); align-items: flex-start; font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 180px; }
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
.empty-state { padding: var(--space-md); text-align: center; color: var(--color-text-muted); background: var(--color-bg); border-radius: var(--radius-md); border: 1px dashed var(--color-border); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
