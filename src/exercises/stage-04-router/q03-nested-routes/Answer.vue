<script setup lang="ts">
/** Q03 — 巢狀路由（Nested Routes）（解答）
 *
 *  核心概念：
 *  1. children 陣列定義子路由，path 為相對路徑（不加 /）
 *  2. 父元件必須有 <RouterView /> 才能渲染子路由元件
 *  3. path: '' 是預設子路由（進入父路由時顯示）
 *  4. 子路由 path 加了前導 / 會變成「根路徑」，是常見 Bug
 */
import { ref } from 'vue'

const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: '總覽' },
  { id: 'posts',    label: '文章' },
  { id: 'settings', label: '設定' },
]
</script>

<template>
  <div class="nested-routes-demo">
    <h3>🗂️ Q03 — 巢狀路由（Nested Routes）（解答）</h3>

    <!-- ── Bug 解析 ──────────────────────────────────────── -->
    <section class="demo-section bug-section">
      <h4>Bug A 解析：子路由 path 不應加前導 /</h4>
      <pre v-pre class="code-block">// ❌ 錯誤（/overview 是絕對路徑，會嘗試匹配根路由 /overview）
{ path: '/overview', component: UserOverview }

// ✅ 正確（'overview' 是相對路徑，拼接後為 /user/overview）
{ path: 'overview', component: UserOverview }</pre>
    </section>

    <section class="demo-section bug-section">
      <h4>Bug B 解析：父元件缺少 &lt;RouterView /&gt;</h4>
      <pre v-pre class="code-block">// ❌ 錯誤：沒有 RouterView，子路由無法渲染
&lt;template&gt;
  &lt;div class="user-layout"&gt;
    &lt;nav&gt;...Tab 導覽&lt;/nav&gt;
    &lt;!-- 子路由的元件找不到地方顯示！ --&gt;
  &lt;/div&gt;
&lt;/template&gt;

// ✅ 正確：加上 RouterView 讓子路由有地方渲染
&lt;template&gt;
  &lt;div class="user-layout"&gt;
    &lt;nav&gt;...Tab 導覽&lt;/nav&gt;
    &lt;RouterView /&gt;  &lt;!-- 子路由的元件在這裡出現 --&gt;
  &lt;/div&gt;
&lt;/template&gt;</pre>
    </section>

    <!-- ── 正確的巢狀路由設定 ─────────────────────────────── -->
    <section class="demo-section answer-section">
      <h4>✅ 完整正確的巢狀路由設定</h4>
      <pre v-pre class="code-block">routes: [
  {
    path: '/user',
    component: UserLayout,  // 父元件（template 必須含 &lt;RouterView /&gt;）
    children: [
      // 預設子路由：path 為空字串，訪問 /user 時自動顯示
      { path: '',         name: 'user-overview',  component: UserOverview  },

      // 子路由 path 不加 / → 完整路徑為 /user/posts
      { path: 'posts',    name: 'user-posts',     component: UserPosts    },
      { path: 'settings', name: 'user-settings',  component: UserSettings },
    ]
  }
]

// 對應的 URL 結構：
// /user           → UserLayout + UserOverview（預設）
// /user/posts     → UserLayout + UserPosts
// /user/settings  → UserLayout + UserSettings

// UserLayout.vue（父元件）：
// &lt;template&gt;
//   &lt;div class="user-layout"&gt;
//     &lt;nav&gt;
//       &lt;RouterLink :to="{ name: 'user-overview'  }"&gt;總覽&lt;/RouterLink&gt;
//       &lt;RouterLink :to="{ name: 'user-posts'     }"&gt;文章&lt;/RouterLink&gt;
//       &lt;RouterLink :to="{ name: 'user-settings'  }"&gt;設定&lt;/RouterLink&gt;
//     &lt;/nav&gt;
//     &lt;RouterView /&gt;   ← 子路由渲染在這裡
//   &lt;/div&gt;
// &lt;/template&gt;</pre>
    </section>

    <!-- ── 互動模擬 ────────────────────────────────────────── -->
    <section class="demo-section">
      <h4>互動模擬</h4>
      <div class="user-layout-mock">
        <div class="user-header">
          <div class="user-avatar">👤</div>
          <div>
            <p class="user-name">Vue 學習者</p>
            <p class="user-email">student@vue.dev</p>
          </div>
        </div>
        <nav class="tab-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>
        <div class="router-view-mock">
          <p class="router-view-label">&lt;RouterView /&gt; — 子路由渲染區域</p>
          <div v-if="activeTab === 'overview'" class="tab-content">📊 總覽：統計資料（UserOverview）</div>
          <div v-else-if="activeTab === 'posts'" class="tab-content">📝 文章列表（UserPosts）</div>
          <div v-else-if="activeTab === 'settings'" class="tab-content">⚙️ 帳號設定（UserSettings）</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.nested-routes-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.bug-section { border-color: #fca5a5; }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
.user-layout-mock { border: 2px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
.user-header { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--color-bg); border-bottom: 1px solid var(--color-border); }
.user-avatar { font-size: 2rem; }
.user-name { font-weight: 600; margin: 0; }
.user-email { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }
.tab-nav { display: flex; border-bottom: 1px solid var(--color-border); background: var(--color-bg); }
.tab-btn { padding: 10px var(--space-md); border: none; background: transparent; cursor: pointer; color: var(--color-text-muted); font-size: var(--font-size-sm); font-weight: 500; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.tab-btn.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
.router-view-mock { padding: var(--space-md); background: var(--color-bg-card); }
.router-view-label { font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-bottom: var(--space-sm); border-bottom: 1px dashed var(--color-border); padding-bottom: 6px; }
.tab-content { padding: var(--space-sm); color: var(--color-text); font-size: var(--font-size-sm); }
</style>
