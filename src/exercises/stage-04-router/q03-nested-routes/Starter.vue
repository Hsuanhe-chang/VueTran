<script setup>
/** Q03 — 巢狀路由（Nested Routes）（填空 + 找錯誤）
 *
 *  巢狀路由的關鍵：
 *  1. router 設定中的 children 陣列定義子路由
 *  2. 父元件的 template 中必須有 <RouterView /> 才能渲染子頁面
 *  3. 子路由的 path 是相對路徑（不加 /），自動拼接父路由
 *
 *  本題模擬一個「使用者中心」頁面，有三個 Tab 子頁面。
 */
import { ref } from 'vue'

// 模擬當前 Tab（實際用 <RouterLink> 和巢狀 <RouterView> 處理）
const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: '總覽' },
  { id: 'posts',    label: '文章' },
  { id: 'settings', label: '設定' },
]
</script>

<template>
  <div class="nested-routes-demo">
    <h3>🗂️ Q03 — 巢狀路由（Nested Routes）（找錯誤 + 填空）</h3>

    <!-- ── Part A：找錯誤 ────────────────────────────────── -->
    <section class="demo-section bug-section">
      <h4>Part A — 找出 2 個 Bug</h4>
      <p class="hint">下方路由設定有 2 個錯誤，找出並說明原因</p>

      <pre v-pre class="code-block">// ❌ 有 Bug 的巢狀路由設定：
routes: [
  {
    path: '/user',
    component: UserLayout,    // 父元件
    children: [
      // Bug A：子路由 path 的問題
      { path: '/overview', component: UserOverview },  // ← 錯誤在哪？
      { path: '/posts',    component: UserPosts    },
      { path: '/settings', component: UserSettings },
    ]
  }
]

// ❌ 父元件 UserLayout.vue 的 template：
// &lt;template&gt;
//   &lt;div class="user-layout"&gt;
//     &lt;nav&gt;...Tab 導覽&lt;/nav&gt;
//     &lt;!-- Bug B：缺少了什麼？ --&gt;
//   &lt;/div&gt;
// &lt;/template&gt;</pre>

      <div class="bug-fields">
        <div class="bug-field">
          <p class="bug-label">Bug A 的問題是：</p>
          <p class="bug-answer">子路由 path 加了前導 <code>/</code>，變成絕對路徑。<br>Vue Router 會把它當成根路徑（/overview），不是 /user/overview。<br>修正：移除前導 /，改為 <code>path: 'overview'</code></p>
        </div>
        <div class="bug-field">
          <p class="bug-label">Bug B 的問題是：</p>
          <p class="bug-answer">父元件 UserLayout.vue 的 template 中沒有 <code>&lt;RouterView /&gt;</code>。<br>沒有 RouterView，子路由的元件就沒有地方渲染，畫面永遠只顯示父層 UI。</p>
        </div>
      </div>
    </section>

    <!-- ── Part B：填入正確設定 ──────────────────────────── -->
    <section class="demo-section">
      <h4>Part B — 填入正確的巢狀路由設定</h4>

      <pre v-pre class="code-block">// ✏️ 請在 /* TODO */ 處填入正確的值：
routes: [
  {
    path: '/user',
    component: UserLayout,
    children: [
      // 預設子路由（進入 /user 時顯示）
      { path: /* TODO: 空字串代表預設 */, component: UserOverview },

      // 子路由 path 不加 /（自動拼接為 /user/posts）
      { path: /* TODO */, component: UserPosts    },
      { path: /* TODO */, component: UserSettings },
    ]
  }
]

// ✏️ 父元件 UserLayout.vue 的 template：
// &lt;template&gt;
//   &lt;div class="user-layout"&gt;
//     &lt;nav&gt;...Tab 導覽&lt;/nav&gt;
//     /* TODO：加上什麼讓子路由可以渲染？ */
//   &lt;/div&gt;
// &lt;/template&gt;</pre>
    </section>

    <!-- ── Part C：互動模擬 ───────────────────────────────── -->
    <section class="demo-section">
      <h4>Part C — 互動模擬（巢狀頁面 UI 效果）</h4>
      <p class="hint">下方模擬了「父層 UI + 子路由 RouterView 的概念」</p>

      <!-- 父層 UI（UserLayout）-->
      <div class="user-layout-mock">
        <div class="user-header">
          <div class="user-avatar">👤</div>
          <div>
            <p class="user-name">Vue 學習者</p>
            <p class="user-email">student@vue.dev</p>
          </div>
        </div>

        <!-- 模擬 Tab 導覽（實際用 RouterLink）-->
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

        <!-- 這裡是子路由的 RouterView 位置 -->
        <div class="router-view-mock">
          <p class="router-view-label">&lt;RouterView /&gt; → 子路由在這裡渲染</p>
          <div v-if="activeTab === 'overview'" class="tab-content">
            <p>📊 總覽：顯示統計資料（對應 UserOverview 元件）</p>
          </div>
          <div v-else-if="activeTab === 'posts'" class="tab-content">
            <p>📝 文章：顯示文章列表（對應 UserPosts 元件）</p>
          </div>
          <div v-else-if="activeTab === 'settings'" class="tab-content">
            <p>⚙️ 設定：顯示帳號設定（對應 UserSettings 元件）</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.nested-routes-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.bug-section { border-color: #fca5a5; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
.bug-fields { display: flex; flex-direction: column; gap: var(--space-sm); }
.bug-field { padding: var(--space-sm) var(--space-md); background: rgba(239,68,68,0.06); border-left: 3px solid #ef4444; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.bug-label { font-weight: 600; color: #dc2626; margin-bottom: 4px; font-size: var(--font-size-sm); }
.bug-answer { font-size: var(--font-size-sm); color: var(--color-text); margin: 0; line-height: 1.6; }
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
