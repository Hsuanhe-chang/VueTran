<script setup>
/** Q04 — 導航守衛（beforeEach / beforeEnter）（從零撰寫）
 *
 *  守衛回傳值代表的意思：
 *  - return true / undefined  → 允許導航（繼續）
 *  - return false             → 取消導航（留在原頁面）
 *  - return { name: 'login' } → 重新導向到 login 路由
 *  - return '/login'          → 重新導向到 /login 路徑
 *
 *  本元件在元件內模擬守衛邏輯，概念與真實 beforeEach 完全相同。
 */
import { ref } from 'vue'

// ── 模擬 Auth 狀態 ────────────────────────────────────────────
const isLoggedIn = ref(false)   // 模擬登入狀態
const userRole   = ref('guest') // 可選：'guest' / 'user' / 'admin'

// ── 模擬路由設定（含 meta 欄位）──────────────────────────────
// 這是真實路由設定的縮寫版本，用來說明守衛如何讀取 meta
const routes = [
  { name: 'home',     path: '/',        meta: { requiresAuth: false } },
  { name: 'login',    path: '/login',   meta: { requiresAuth: false } },
  { name: 'profile',  path: '/profile', meta: { requiresAuth: true,  roles: ['user', 'admin'] } },
  { name: 'admin',    path: '/admin',   meta: { requiresAuth: true,  roles: ['admin'] } },
  { name: 'posts',    path: '/posts',   meta: { requiresAuth: true,  roles: ['user', 'admin'] } },
]

// ── 模擬當前頁面（守衛執行前的「from」）─────────────────────
const currentPage = ref({ name: 'home', path: '/' })

// ── 導航日誌（記錄守衛執行結果）─────────────────────────────
const navLog = ref([])

// ── TODO：實作 checkAuth（模擬 beforeEach 守衛）──────────────
// 參數 target：模擬 `to`（導航目標路由）
// 回傳值規則：
//   'allow'    → 允許導航（通過）
//   'deny'     → 拒絕導航（403，留在原頁面）
//   'redirect' → 重導向到登入頁
function checkAuth(target) {
  // TODO 1：若 target.meta.requiresAuth 為 false，直接允許（公開頁面）
  // TODO 2：若需要認證但 isLoggedIn.value 為 false → 重導向到登入頁
  // TODO 3：若已登入但 userRole.value 不在 target.meta.roles 中 → 拒絕（403）
  // TODO 4：其他情況 → 允許

  return 'allow'  // ← 替換這行
}

// ── simulateNavigation：點擊頁面按鈕時呼叫 ───────────────────
function simulateNavigation(target) {
  const result = checkAuth(target)
  const logEntry = {
    from: currentPage.value.name,
    to:   target.name,
    result,
    isLoggedIn: isLoggedIn.value,
    role: userRole.value,
    time: new Date().toLocaleTimeString(),
  }
  navLog.value.unshift(logEntry)  // 最新的在最上面

  if (result === 'allow') {
    currentPage.value = target    // 實際更新當前頁面
  }
}
</script>

<template>
  <div class="guards-demo">
    <h3>🚦 Q04 — 導航守衛（Navigation Guards）（練習）</h3>

    <!-- ── Auth 狀態控制 ──────────────────────────────────── -->
    <section class="demo-section">
      <h4>Auth 狀態（模擬 store / session）</h4>

      <div class="auth-controls">
        <div class="control-row">
          <label>登入狀態：</label>
          <button
            class="toggle-btn"
            :class="{ 'logged-in': isLoggedIn }"
            @click="isLoggedIn = !isLoggedIn"
          >
            {{ isLoggedIn ? '✅ 已登入' : '❌ 未登入' }}
          </button>
        </div>
        <div class="control-row">
          <label>使用者角色：</label>
          <div class="role-buttons">
            <button
              v-for="role in ['guest', 'user', 'admin']"
              :key="role"
              class="role-btn"
              :class="{ active: userRole === role }"
              @click="userRole = role"
            >
              {{ role }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 頁面導航（模擬 RouterLink）────────────────────── -->
    <section class="demo-section">
      <h4>點擊頁面（模擬 RouterLink 導航）</h4>
      <p class="hint">目前在：<strong>{{ currentPage.name }}</strong> ({{ currentPage.path }})</p>

      <div class="page-buttons">
        <button
          v-for="r in routes"
          :key="r.name"
          class="page-btn"
          :class="{ current: currentPage.name === r.name }"
          @click="simulateNavigation(r)"
        >
          <span class="page-name">{{ r.name }}</span>
          <span class="page-path">{{ r.path }}</span>
          <span class="page-meta">
            {{ r.meta.requiresAuth ? '🔒' : '🌐' }}
            {{ r.meta.roles ? r.meta.roles.join(', ') : '公開' }}
          </span>
        </button>
      </div>
    </section>

    <!-- ── 導航日誌 ───────────────────────────────────────── -->
    <section class="demo-section">
      <h4>導航日誌</h4>
      <div v-if="navLog.length === 0" class="empty-log">
        <p>點擊上方頁面按鈕，此處會顯示守衛執行結果</p>
      </div>
      <div v-else class="log-list">
        <div v-for="(entry, i) in navLog" :key="i" class="log-entry" :class="entry.result">
          <span class="log-result">
            {{ entry.result === 'allow' ? '✅ 允許' : entry.result === 'redirect' ? '🔀 重導向' : '❌ 拒絕' }}
          </span>
          <span class="log-nav">{{ entry.from }} → {{ entry.to }}</span>
          <span class="log-meta">{{ entry.isLoggedIn ? '已登入' : '未登入' }} / {{ entry.role }}</span>
          <span class="log-time">{{ entry.time }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.guards-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.auth-controls { display: flex; flex-direction: column; gap: var(--space-sm); }
.control-row { display: flex; align-items: center; gap: var(--space-sm); }
.toggle-btn { padding: 6px 18px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); font-weight: 500; }
.toggle-btn.logged-in { background: #dcfce7; border-color: #4ade80; color: #16a34a; }
.role-buttons { display: flex; gap: 6px; }
.role-btn { padding: 4px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.role-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.page-buttons { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-sm); }
.page-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: var(--space-sm); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); text-align: center; }
.page-btn.current { border-color: var(--color-primary); background: rgba(var(--color-primary-rgb, 99,102,241), 0.06); }
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
</style>
