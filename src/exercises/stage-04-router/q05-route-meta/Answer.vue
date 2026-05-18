<script setup>
/** Q05 — 路由 Meta 欄位與權限控制（解答）
 *
 *  核心概念：
 *  - meta 欄位可存放任意自訂資料，在守衛 / 元件 / afterEach 中讀取
 *  - to.meta（守衛內）/ route.meta（元件內）讀取方式相同
 *  - router.afterEach 常用於更新 document.title
 *  - to.matched.some(r => r.meta.requiresAuth) 用於巢狀路由繼承 meta
 */
import { ref, computed } from 'vue'

const routeMap = [
  { name: 'home',        path: '/',             meta: { title: '首頁',        requiresAuth: false, breadcrumb: ['首頁'] } },
  { name: 'posts',       path: '/posts',         meta: { title: '文章列表',    requiresAuth: false, breadcrumb: ['首頁', '文章'] } },
  { name: 'profile',     path: '/profile',       meta: { title: '個人資料',    requiresAuth: true,  roles: ['user', 'admin'], breadcrumb: ['首頁', '個人資料'] } },
  { name: 'admin',       path: '/admin',         meta: { title: '後台管理',    requiresAuth: true,  roles: ['admin'],         breadcrumb: ['首頁', '後台'] } },
  { name: 'admin-users', path: '/admin/users',   meta: { title: '使用者管理',  requiresAuth: true,  roles: ['admin'],         breadcrumb: ['首頁', '後台', '使用者'] } },
]

const currentRoute = ref(routeMap[0])

// 從 meta.title 讀取頁面標題
const pageTitle = computed(() => currentRoute.value.meta.title ?? '未知頁面')

// 從 meta.breadcrumb 讀取麵包屑陣列
const breadcrumb = computed(() => currentRoute.value.meta.breadcrumb ?? [])

// 從 meta.requiresAuth 判斷是否為受保護頁面
const isProtected = computed(() => currentRoute.value.meta.requiresAuth === true)
</script>

<template>
  <div class="route-meta-demo">
    <h3>🏷️ Q05 — 路由 Meta 欄位（解答）</h3>

    <section class="demo-section">
      <h4>麵包屑導航（meta.breadcrumb）</h4>
      <div class="breadcrumb">
        <span v-for="(crumb, i) in breadcrumb" :key="i" class="crumb-item">
          <span class="crumb-separator" v-if="i > 0">›</span>
          <span class="crumb-text" :class="{ active: i === breadcrumb.length - 1 }">{{ crumb }}</span>
        </span>
      </div>
    </section>

    <section class="demo-section">
      <h4>頁面標題（meta.title + meta.requiresAuth）</h4>
      <div class="page-header">
        <span v-if="isProtected" class="lock-icon" title="需要登入">🔒</span>
        <h2 class="page-title-display">{{ pageTitle }}</h2>
      </div>
    </section>

    <section class="demo-section">
      <h4>切換頁面</h4>
      <div class="route-buttons">
        <button v-for="r in routeMap" :key="r.name"
          class="route-btn" :class="{ active: currentRoute.name === r.name }"
          @click="currentRoute = r">
          <span class="route-name">{{ r.name }}</span>
          <span class="route-path">{{ r.path }}</span>
        </button>
      </div>
    </section>

    <section class="demo-section">
      <h4>當前路由 meta 資料</h4>
      <div class="meta-table">
        <div v-for="(val, key) in currentRoute.meta" :key="key" class="meta-row">
          <span class="meta-key">meta.{{ key }}</span>
          <span class="meta-val">{{ JSON.stringify(val) }}</span>
        </div>
      </div>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section answer-section">
      <h4>✅ Meta 欄位完整用法</h4>
      <pre v-pre class="code-block">// 1. 路由設定時加入 meta
routes: [
  {
    path: '/admin',
    component: AdminView,
    meta: {
      requiresAuth: true,    // 需要登入
      roles: ['admin'],      // 允許角色
      title: '後台管理',       // 頁面標題
      breadcrumb: ['首頁', '後台'],  // 麵包屑
    }
  }
]

// 2. 守衛中讀取（beforeEach）
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }
})

// 3. 元件中讀取
const route = useRoute()
const title = route.meta.title

// 4. afterEach 更新頁面 title
router.afterEach((to) => {
  document.title = to.meta.title ?? 'My App'
})

// 5. 巢狀路由繼承 meta（用 matched）
const requiresAuth = to.matched.some(r => r.meta.requiresAuth)</pre>
    </section>
  </div>
</template>

<style scoped>
.route-meta-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.answer-section { border-color: var(--color-primary); }
.breadcrumb { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; font-size: var(--font-size-sm); }
.crumb-item { display: flex; align-items: center; gap: 4px; }
.crumb-separator { color: var(--color-text-muted); }
.crumb-text { color: var(--color-text-muted); }
.crumb-text.active { color: var(--color-primary); font-weight: 600; }
.page-header { display: flex; align-items: center; gap: var(--space-sm); }
.lock-icon { font-size: 1.4rem; }
.page-title-display { font-size: 1.6rem; font-weight: 700; color: var(--color-text); margin: 0; }
.route-buttons { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--space-sm); }
.route-btn { display: flex; flex-direction: column; align-items: center; padding: var(--space-sm); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); }
.route-btn.active { border-color: var(--color-primary); background: rgba(99,102,241,0.06); }
.route-name { font-weight: 600; font-size: var(--font-size-sm); color: var(--color-text); }
.route-path { font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-text-muted); }
.meta-table { display: flex; flex-direction: column; gap: 6px; }
.meta-row { display: flex; gap: var(--space-sm); font-size: var(--font-size-sm); align-items: flex-start; }
.meta-key { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 160px; }
.meta-val { font-family: var(--font-mono); color: var(--color-primary); word-break: break-all; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
