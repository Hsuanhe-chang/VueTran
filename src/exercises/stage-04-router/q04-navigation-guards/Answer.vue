<script setup lang="ts">
/** Q04 — 導航守衛（beforeEach / beforeEnter）（解答）
 *
 *  核心概念：
 *  1. router.beforeEach((to, from) => result) — 每次路由切換前執行
 *  2. 回傳 true / undefined → 允許；false → 取消；路由物件 → 重導向
 *  3. to.meta.requiresAuth → 讀取路由 meta 判斷是否需要認證
 *  4. to.matched.some(r => r.meta.xxx) → 正確讀取巢狀路由的 meta
 */
import { ref } from 'vue'

// ── 導航日誌每筆紀錄的形狀 ──────────────────────────────────
interface NavLog {
  from: string        // 來源頁面名稱
  to: string          // 目標頁面名稱
  result: string      // 守衛結果：'allow' | 'deny' | 'redirect'
  isLoggedIn: boolean // 執行時的登入狀態
  role: string        // 執行時的使用者角色
  time: string        // 執行時間（格式化字串）
}

// ── 路由 meta 的形狀 ─────────────────────────────────────────
interface RouteMeta {
  requiresAuth: boolean   // 是否需要登入
  roles?: string[]        // 允許的角色清單（選填）
}

// ── 路由項目的形狀（routes 陣列中每個元素） ──────────────────
interface RouteItem {
  name: string   // 路由名稱
  path: string   // 路由路徑
  meta: RouteMeta
}

const isLoggedIn = ref(false)
const userRole   = ref('guest')

const routes = [
  { name: 'home',     path: '/',        meta: { requiresAuth: false } },
  { name: 'login',    path: '/login',   meta: { requiresAuth: false } },
  { name: 'profile',  path: '/profile', meta: { requiresAuth: true,  roles: ['user', 'admin'] } },
  { name: 'admin',    path: '/admin',   meta: { requiresAuth: true,  roles: ['admin'] } },
  { name: 'posts',    path: '/posts',   meta: { requiresAuth: true,  roles: ['user', 'admin'] } },
]

const currentPage = ref({ name: 'home', path: '/' })
const navLog      = ref<NavLog[]>([])  // 明確指定元素型別，避免 TS 推斷為 never[]

// ── checkAuth：模擬 router.beforeEach 守衛邏輯 ────────────────
function checkAuth(target: RouteItem) {
  // 1. 公開頁面（requiresAuth = false）— 直接允許，不做任何檢查
  if (!target.meta.requiresAuth) return 'allow'

  // 2. 需要認證但尚未登入 — 重導向到登入頁
  if (!isLoggedIn.value) return 'redirect'

  // 3. 已登入但角色不在允許清單中 — 拒絕（403）
  const allowedRoles = target.meta.roles ?? []
  if (!allowedRoles.includes(userRole.value)) return 'deny'

  // 4. 通過所有檢查 — 允許導航
  return 'allow'
}

function simulateNavigation(target: RouteItem): void {
  const result = checkAuth(target)
  navLog.value.unshift({
    from: currentPage.value.name,
    to:   target.name,
    result,
    isLoggedIn: isLoggedIn.value,
    role: userRole.value,
    time: new Date().toLocaleTimeString(),
  })

  if (result === 'allow') currentPage.value = target
}
</script>

<template>
  <div class="guards-demo">
    <h3>🚦 Q04 — 導航守衛（Navigation Guards）（解答）</h3>

    <!-- ── Auth 狀態控制 ── -->
    <section class="demo-section">
      <h4>Auth 狀態</h4>
      <div class="auth-controls">
        <div class="control-row">
          <label>登入狀態：</label>
          <button class="toggle-btn" :class="{ 'logged-in': isLoggedIn }" @click="isLoggedIn = !isLoggedIn">
            {{ isLoggedIn ? '✅ 已登入' : '❌ 未登入' }}
          </button>
        </div>
        <div class="control-row">
          <label>使用者角色：</label>
          <div class="role-buttons">
            <button v-for="role in ['guest', 'user', 'admin']" :key="role"
              class="role-btn" :class="{ active: userRole === role }" @click="userRole = role">
              {{ role }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 頁面導航 ── -->
    <section class="demo-section">
      <h4>點擊頁面（模擬導航）</h4>
      <p class="hint">目前在：<strong>{{ currentPage.name }}</strong></p>
      <div class="page-buttons">
        <button v-for="r in routes" :key="r.name"
          class="page-btn" :class="{ current: currentPage.name === r.name }"
          @click="simulateNavigation(r)">
          <span class="page-name">{{ r.name }}</span>
          <span class="page-path">{{ r.path }}</span>
          <span class="page-meta">
            {{ r.meta.requiresAuth ? '🔒' : '🌐' }}
            {{ r.meta.roles ? r.meta.roles.join(', ') : '公開' }}
          </span>
        </button>
      </div>
    </section>

    <!-- ── 導航日誌 ── -->
    <section class="demo-section">
      <h4>導航日誌</h4>
      <div v-if="navLog.length === 0" class="empty-log"><p>點擊上方頁面按鈕</p></div>
      <div v-else class="log-list">
        <div v-for="(entry, i) in navLog" :key="i" class="log-entry" :class="entry.result">
          <span class="log-result">{{ entry.result === 'allow' ? '✅ 允許' : entry.result === 'redirect' ? '🔀 重導向' : '❌ 拒絕' }}</span>
          <span class="log-nav">{{ entry.from }} → {{ entry.to }}</span>
          <span class="log-meta">{{ entry.isLoggedIn ? '已登入' : '未登入' }} / {{ entry.role }}</span>
          <span class="log-time">{{ entry.time }}</span>
        </div>
      </div>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section answer-section">
      <h4>✅ 真實 router.beforeEach 寫法</h4>
      <pre v-pre class="code-block">// router/index.js
const router = createRouter({ ... })

// 全域前置守衛：每次導航前執行
router.beforeEach((to, from) => {
  // 1. 公開頁面直接放行
  if (!to.meta.requiresAuth) return true

  // 2. 需要登入但未登入 → 重導向登入頁
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 3. 角色不符 → 拒絕
  if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
    return false  // 取消導航，留在原頁面
  }

  // 4. 通過 → 繼續導航（return true 或不 return）
})

export default router</pre>
    </section>
  </div>
</template>

<style scoped>
.guards-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.answer-section { border-color: var(--color-primary); }
.auth-controls { display: flex; flex-direction: column; gap: var(--space-sm); }
.control-row { display: flex; align-items: center; gap: var(--space-sm); }
.toggle-btn { padding: 6px 18px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); font-weight: 500; }
.toggle-btn.logged-in { background: #dcfce7; border-color: #4ade80; color: #16a34a; }
.role-buttons { display: flex; gap: 6px; }
.role-btn { padding: 4px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.role-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.page-buttons { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-sm); }
.page-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: var(--space-sm); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); text-align: center; }
.page-btn.current { border-color: var(--color-primary); background: rgba(99,102,241,0.06); }
.page-name { font-weight: 600; color: var(--color-text); font-size: var(--font-size-sm); }
.page-path { font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-text-muted); }
.page-meta { font-size: 0.7rem; color: var(--color-text-muted); }
.empty-log { padding: var(--space-md); text-align: center; color: var(--color-text-muted); border: 1px dashed var(--color-border); border-radius: var(--radius-md); }
.log-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; }
.log-entry { display: flex; align-items: center; gap: var(--space-sm); padding: 6px var(--space-sm); border-radius: var(--radius-sm); font-size: var(--font-size-sm); }
.log-entry.allow    { background: rgba(16,185,129,0.08); }
.log-entry.redirect { background: rgba(245,158,11,0.08); }
.log-entry.deny     { background: rgba(239,68,68,0.08); }
.log-result { font-weight: 600; min-width: 80px; }
.log-nav { font-family: var(--font-mono); flex: 1; }
.log-meta { color: var(--color-text-muted); min-width: 120px; }
.log-time { color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.7rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
