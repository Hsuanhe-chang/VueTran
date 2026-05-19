<script setup lang="ts">
/** Q07 — 路由懶載入（動態 import）（找錯誤 + 重構）
 *
 *  懶載入的優點：
 *  - 不懶載入：所有元件打包進一個 main.js → 首次載入慢
 *  - 懶載入：每個路由獨立 chunk → 只下載當前需要的代碼 → 首次載入快
 *
 *  Vite 對動態 import 的限制：
 *  路徑字串必須含有靜態字面量，讓 Vite 在 build time 就能解析需要的檔案。
 *  完全動態的路徑（如 import(variable)）會讓 build 失敗。
 */
</script>

<template>
  <div class="lazy-loading-demo">
    <h3>⚡ Q07 — 路由懶載入（找錯誤 + 重構）</h3>

    <!-- ── Part A：找出 3 個 Bug ─────────────────────────── -->
    <section class="demo-section bug-section">
      <h4>Part A — 找出 3 個懶載入 Bug</h4>
      <p class="hint">下方路由設定有 3 個錯誤，說明每個錯誤的原因</p>

      <pre v-pre class="code-block">// ❌ 有問題的路由設定：
import HomeView from './views/HomeView.vue'   // Bug A
import AboutView from './views/AboutView.vue' // Bug A

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,  // Bug A：為何這樣不好？
  },
  {
    path: '/about',
    name: 'about',
    // Bug B：語法錯誤！為何這樣不能運作？
    component: () => { import('./views/AboutView.vue') },
  },
  {
    path: '/user/:id',
    name: 'user',
    // Bug C：為何這樣 Vite build 時會失敗？
    component: () => import(`./views/${pageName}.vue`),
  },
]</pre>

      <!-- 找錯誤回答區 -->
      <div class="bug-explanations">
        <div class="bug-explain">
          <p class="bug-title">Bug A 的問題：</p>
          <p>靜態 import 讓所有元件在 main.js 初始化時就全部載入，
            即使使用者根本不訪問這些頁面。
            大型應用會讓首次載入 bundle 非常大，
            應改為 <code>() =&gt; import('./views/HomeView.vue')</code>。</p>
        </div>
        <div class="bug-explain">
          <p class="bug-title">Bug B 的問題：</p>
          <p>箭頭函式使用大括號 <code>{ }</code> 時，內部的 import() 沒有 return，
            所以函式回傳 undefined 而非 Promise。
            Vue Router 需要函式回傳 Promise（resolve 為元件）。
            修正：<code>() =&gt; import('./views/AboutView.vue')</code>（省略大括號）。</p>
        </div>
        <div class="bug-explain">
          <p class="bug-title">Bug C 的問題：</p>
          <p>Vite（Rolldown）在 build time 靜態分析 import 路徑，
            完全動態的模板字串（如 <code>${'pageName'}</code>）讓 Vite 無法確定需要打包哪些檔案。
            Build 時會報錯或產生警告。
            解法：路徑中保留部分靜態字面量，例如 <code>./views/${'id'}/index.vue</code>（Vite 可解析目錄範圍）。</p>
        </div>
      </div>
    </section>

    <!-- ── Part B：填入正確寫法 ──────────────────────────── -->
    <section class="demo-section">
      <h4>Part B — 填入修正後的正確懶載入設定</h4>

      <pre v-pre class="code-block">// ✅ 修正後的路由設定（請在 /* TODO */ 處填入正確寫法）：
const routes = [
  {
    path: '/',
    name: 'home',
    // TODO A：改成懶載入
    component: /* ??? */,
  },
  {
    path: '/about',
    name: 'about',
    // TODO B：修正 Bug B 的語法
    component: /* ??? */,
  },
  {
    path: '/user/:id',
    name: 'user',
    // TODO C：改為靜態路徑懶載入（不使用動態變數）
    component: /* ??? */,
  },
]</pre>
    </section>

    <!-- ── Part C：效能對比說明 ──────────────────────────── -->
    <section class="demo-section">
      <h4>Part C — 靜態 import vs 懶載入效能對比</h4>

      <div class="compare-cards">
        <div class="compare-card bad">
          <p class="card-title">❌ 靜態 import（全部打包）</p>
          <pre v-pre class="code-mini">// main.js（700kb）
import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'
import AdminView from './AdminView.vue'
// 使用者只訪問首頁，但 AboutView / AdminView 也全部下載了</pre>
        </div>
        <div class="compare-card good">
          <p class="card-title">✅ 懶載入（按需下載）</p>
          <pre v-pre class="code-mini">// main.js（100kb）+各路由獨立 chunk
{ path: '/about', component: () => import('./AboutView.vue') }
// 使用者訪問 /about 才下載 AboutView chunk（50kb）
// 首次載入 100kb vs 700kb — 快 7 倍！</pre>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lazy-loading-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.bug-section { border-color: #fca5a5; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
.bug-explanations { display: flex; flex-direction: column; gap: var(--space-sm); }
.bug-explain { padding: var(--space-sm) var(--space-md); background: rgba(239,68,68,0.06); border-left: 3px solid #ef4444; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: var(--font-size-sm); }
.bug-title { font-weight: 600; color: #dc2626; margin-bottom: 4px; }
.compare-cards { display: flex; flex-direction: column; gap: var(--space-md); }
.compare-card { padding: var(--space-sm); border-radius: var(--radius-md); border: 1.5px solid var(--color-border); }
.compare-card.bad { border-color: #fca5a5; }
.compare-card.good { border-color: #4ade80; }
.card-title { font-weight: 600; margin-bottom: 6px; font-size: var(--font-size-sm); }
.code-mini { background: #1e293b; color: #e2e8f0; padding: var(--space-sm); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.75rem; white-space: pre-wrap; line-height: 1.5; margin: 0; }
</style>
