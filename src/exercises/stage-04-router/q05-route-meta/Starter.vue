<script setup>
/** Q05 — 路由 Meta 欄位與權限控制（功能實作）
 *
 *  路由 meta 是附加在路由設定上的自訂資料，可以放任何值：
 *  { path: '/admin', meta: { requiresAuth: true, title: '後台', roles: ['admin'] } }
 *
 *  讀取方式：
 *  - 在守衛中：to.meta.xxx
 *  - 在元件中：route.meta.xxx（useRoute() 取得）
 *  - 在 router.afterEach 中：to.meta.title → document.title = to.meta.title
 */
import { ref, computed } from 'vue'

// ── 模擬路由表（含 meta 欄位）────────────────────────────────
const routeMap = [
  {
    name: 'home',
    path: '/',
    meta: {
      title:        '首頁',
      requiresAuth: false,
      breadcrumb:   ['首頁'],
    }
  },
  {
    name: 'posts',
    path: '/posts',
    meta: {
      title:        '文章列表',
      requiresAuth: false,
      breadcrumb:   ['首頁', '文章'],
    }
  },
  {
    name: 'profile',
    path: '/profile',
    meta: {
      title:        '個人資料',
      requiresAuth: true,
      roles:        ['user', 'admin'],
      breadcrumb:   ['首頁', '個人資料'],
    }
  },
  {
    name: 'admin',
    path: '/admin',
    meta: {
      title:        '後台管理',
      requiresAuth: true,
      roles:        ['admin'],
      breadcrumb:   ['首頁', '後台'],
    }
  },
  {
    name: 'admin-users',
    path: '/admin/users',
    meta: {
      title:        '使用者管理',
      requiresAuth: true,
      roles:        ['admin'],
      breadcrumb:   ['首頁', '後台', '使用者'],
    }
  },
]

// ── 模擬當前路由 ──────────────────────────────────────────────
const currentRoute = ref(routeMap[0])

// ── TODO 1：從 currentRoute.meta 讀取頁面標題 ─────────────────
// 提示：currentRoute.value.meta.title
const pageTitle = computed(() => {
  return '（尚未實作）'  // ← 替換這行
})

// ── TODO 2：從 currentRoute.meta.breadcrumb 組合麵包屑 ────────
// 格式：['首頁', '後台', '使用者'] → 顯示帶箭頭的路徑
const breadcrumb = computed(() => {
  return []  // ← 替換為 currentRoute.value.meta.breadcrumb
})

// ── TODO 3：讀取 requiresAuth 旗標 ───────────────────────────
// 提示：currentRoute.value.meta.requiresAuth
const isProtected = computed(() => {
  return false  // ← 替換這行
})
</script>

<template>
  <div class="route-meta-demo">
    <h3>🏷️ Q05 — 路由 Meta 欄位（練習）</h3>

    <!-- ── 麵包屑導航（TODO 2）── -->
    <section class="demo-section">
      <h4>麵包屑導航（由 meta.breadcrumb 驅動）</h4>

      <div class="breadcrumb">
        <template v-if="breadcrumb.length > 0">
          <span v-for="(crumb, i) in breadcrumb" :key="i" class="crumb-item">
            <span class="crumb-separator" v-if="i > 0">›</span>
            <span class="crumb-text" :class="{ active: i === breadcrumb.length - 1 }">{{ crumb }}</span>
          </span>
        </template>
        <span v-else class="crumb-empty">（尚未實作 TODO 2）</span>
      </div>
    </section>

    <!-- ── 頁面標題（TODO 1 + 3）── -->
    <section class="demo-section">
      <h4>頁面標題（由 meta.title 和 meta.requiresAuth 驅動）</h4>

      <div class="page-header">
        <span v-if="isProtected" class="lock-icon" title="需要登入">🔒</span>
        <h2 class="page-title-display">{{ pageTitle }}</h2>
      </div>
    </section>

    <!-- ── 頁面切換 ── -->
    <section class="demo-section">
      <h4>切換頁面（觀察 meta 資料變化）</h4>

      <div class="route-buttons">
        <button
          v-for="r in routeMap"
          :key="r.name"
          class="route-btn"
          :class="{ active: currentRoute.name === r.name }"
          @click="currentRoute = r"
        >
          <span class="route-name">{{ r.name }}</span>
          <span class="route-path">{{ r.path }}</span>
        </button>
      </div>
    </section>

    <!-- ── 當前 Meta 資料一覽 ── -->
    <section class="demo-section">
      <h4>當前路由 meta 資料</h4>
      <div class="meta-table">
        <div v-for="(val, key) in currentRoute.meta" :key="key" class="meta-row">
          <span class="meta-key">meta.{{ key }}</span>
          <span class="meta-val">{{ JSON.stringify(val) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.route-meta-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.breadcrumb { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; font-size: var(--font-size-sm); }
.crumb-item { display: flex; align-items: center; gap: 4px; }
.crumb-separator { color: var(--color-text-muted); }
.crumb-text { color: var(--color-text-muted); }
.crumb-text.active { color: var(--color-primary); font-weight: 600; }
.crumb-empty { color: var(--color-text-muted); font-style: italic; }
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
</style>
