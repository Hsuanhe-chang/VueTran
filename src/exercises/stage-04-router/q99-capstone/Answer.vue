<script setup lang="ts">
/** Q99 — 綜合題：含權限控制的多頁面路由系統（解答）
 *
 *  整合概念：
 *  1. 路由 meta（requiresAuth, roles, title, breadcrumb）
 *  2. 導航守衛（checkAuth 返回 allowed / denied / login）
 *  3. 動態 params（文章 :id → currentPostId）
 *  4. query params（Posts 搜尋 → searchQuery）
 *  5. 程式化導航（simulateNav + redirect 功能）
 *  6. 登入後自動 redirect（pendingRoute 記住被攔截的目標）
 */
import { ref, computed } from 'vue'

// ── 路由 meta 的形狀（requiresAuth/roles 為可選，允許 login-page 等特殊路由） ──────
interface RouteMeta {
  title: string             // 頁面標題（必填）
  requiresAuth?: boolean    // 是否需要登入（選填）
  roles?: string[] | null   // 允許的角色清單（選填）
  breadcrumb?: string[]     // 麵包屑路徑陣列（選填）
}

// ── Mock 路由項目的形狀 ──────────────────────────────────────────────
interface MockRoute {
  name: string   // 路由名稱
  meta: RouteMeta
}

// ── 導航守衛回傳值的型別 ───────────────────────────────────────────
type AuthResult = 'allowed' | 'denied' | 'login'

// ── 被守衛攔截後暫存的目標路由 ─────────────────────────────────────
interface PendingRoute {
  name: string          // 路由名稱
  postId: string | null // 文章 ID（對應動態 params）
}

const isLoggedIn = ref(false)
const userRole   = ref('guest')

const mockRoutes: MockRoute[] = [  // 明確標註型別，避免 TS 推斷過鬼
  { name: 'home',    meta: { title: '首頁',     requiresAuth: false, roles: null,            breadcrumb: ['首頁'] } },
  { name: 'posts',   meta: { title: '文章列表', requiresAuth: true,  roles: ['user','admin'], breadcrumb: ['首頁', '文章'] } },
  { name: 'post',    meta: { title: '文章詳情', requiresAuth: true,  roles: ['user','admin'], breadcrumb: ['首頁', '文章', '詳情'] } },
  { name: 'profile', meta: { title: '個人資料', requiresAuth: true,  roles: ['user','admin'], breadcrumb: ['首頁', '個人資料'] } },
  { name: 'admin',   meta: { title: '後台管理', requiresAuth: true,  roles: ['admin'],        breadcrumb: ['首頁', '後台'] } },
]

const posts = [
  { id: '1', title: 'Vue 3 Composition API 基礎', category: '前端' },
  { id: '2', title: 'Pinia 狀態管理實戰',         category: '前端' },
  { id: '3', title: 'Vue Router 4 深度解析',      category: '前端' },
  { id: '4', title: 'Node.js 後端 REST API',      category: '後端' },
]

const currentRoute  = ref<MockRoute>(mockRoutes[0])   // 明確型別，允許後續賴入特殊路由（e.g. login-page）
const currentPostId = ref<string | null>(null)         // 文章詳情的 :id（null = 未選中文章）
const searchQuery   = ref('')                          // Posts 搜尋 query
const pendingRoute  = ref<PendingRoute | null>(null)  // 被守衛攔截的目標路由，登入後 redirect
const accessResult  = ref<AuthResult | null>(null)    // 最近一次守衛結果：null / 'allowed' / 'denied' / 'login'

// 導航守衛：整合 meta.requiresAuth、meta.roles、isLoggedIn、userRole
function checkAuth(target: MockRoute): AuthResult {
  // 公開頁面，直接允許
  if (!target.meta.requiresAuth) return 'allowed'

  // 需要認證但未登入 → 重導向到登入
  if (!isLoggedIn.value) return 'login'

  // 已登入但角色不在允許清單 → 拒絕
  const allowed = target.meta.roles ?? []
  if (allowed.length > 0 && !allowed.includes(userRole.value)) return 'denied'

  // 通過所有檢查
  return 'allowed'
}

function simulateNav(routeName: string, postId: string | null = null): void {
  const target = mockRoutes.find(r => r.name === routeName)
  if (!target) return

  const result = checkAuth(target)
  accessResult.value = result

  if (result === 'allowed') {
    currentRoute.value  = target
    currentPostId.value = postId
    pendingRoute.value  = null
  } else if (result === 'login') {
    // 記住想去的路由，待登入後自動跳過去
    pendingRoute.value = { name: routeName, postId }
    currentRoute.value = { name: 'login-page', meta: { title: '請登入', breadcrumb: ['登入'] } }
  } else if (result === 'denied') {
    // 已登入但無權限：留在當前頁面，只改 accessResult（會顯示 403）
    currentRoute.value = target  // 進入頁面但顯示 403 訊息
  }
}

function login(role: string): void {
  isLoggedIn.value = true
  userRole.value   = role

  // 若有被攔截的 pending 路由 → 登入後自動跳過去（redirect 功能）
  if (pendingRoute.value) {
    const { name, postId } = pendingRoute.value
    pendingRoute.value = null
    simulateNav(name, postId)
  } else {
    currentRoute.value = mockRoutes.find(r => r.name === 'home')!  // home 必存於 mockRoutes
  }
}

function logout(): void {
  isLoggedIn.value   = false
  userRole.value     = 'guest'
  pendingRoute.value = null
  currentRoute.value = mockRoutes.find(r => r.name === 'home')!  // home 必存於 mockRoutes
}

const filteredPosts = computed(() => {
  const q = searchQuery.value.trim()
  return q ? posts.filter(p => p.title.includes(q)) : posts
})

const currentPost = computed(() =>
  posts.find(p => p.id === currentPostId.value) ?? null
)
</script>

<template>
  <div class="capstone-demo">
    <h3>🏗️ Q99 — 多頁面路由系統（解答）</h3>

    <!-- ── Auth 控制 ── -->
    <section class="demo-section">
      <div class="auth-bar">
        <div class="auth-status">
          <span :class="['status-dot', isLoggedIn ? 'online' : 'offline']" />
          <span>{{ isLoggedIn ? `已登入（${userRole}）` : '未登入' }}</span>
        </div>
        <div v-if="!isLoggedIn" class="login-buttons">
          <button class="btn btn-sm" @click="login('user')">以 user 登入</button>
          <button class="btn btn-sm btn-outline" @click="login('admin')">以 admin 登入</button>
        </div>
        <button v-else class="btn btn-sm btn-danger" @click="logout">登出</button>
      </div>

      <!-- 登入後 redirect 提示 -->
      <div v-if="pendingRoute" class="pending-hint">
        將在登入後自動跳轉到：<strong>{{ pendingRoute.name }}</strong>
      </div>
    </section>

    <!-- ── 模擬導覽列 ── -->
    <section class="demo-section">
      <h4>導覽列（模擬 RouterLink + 守衛）</h4>
      <nav class="mock-nav">
        <button v-for="r in mockRoutes" :key="r.name"
          class="nav-btn" :class="{ active: currentRoute.name === r.name }"
          @click="simulateNav(r.name)">
          {{ r.meta.title }}
          <span v-if="r.meta.requiresAuth" class="lock">🔒</span>
        </button>
      </nav>
    </section>

    <!-- ── 麵包屑 ── -->
    <div class="breadcrumb">
      <span v-for="(crumb, i) in currentRoute.meta?.breadcrumb ?? []" :key="i" class="crumb-item">
        <span v-if="i > 0" class="crumb-sep">›</span>
        <span :class="['crumb', { active: i === (currentRoute.meta?.breadcrumb?.length ?? 0) - 1 }]">{{ crumb }}</span>
      </span>
    </div>

    <!-- ── 頁面內容 ── -->
    <section class="demo-section content-area">
      <h4>{{ currentRoute.meta?.title ?? '頁面' }}</h4>

      <div v-if="currentRoute.name === 'home'">
        <p>歡迎來到 Vue Router 綜合練習系統！</p>
        <p class="hint">點擊上方導覽按鈕切換頁面，觀察守衛行為。</p>
        <ul class="feature-list">
          <li>🔒 文章、個人資料 — 需登入（user 或 admin）</li>
          <li>🔐 後台管理 — 只有 admin 可訪問</li>
          <li>🔀 未登入時點擊受保護頁面 → 顯示登入，登入後自動回到原頁</li>
        </ul>
      </div>

      <div v-else-if="currentRoute.name === 'login-page'" class="login-page">
        <p>你嘗試訪問的頁面需要登入。</p>
        <p v-if="pendingRoute" class="hint">登入後將自動跳轉到：<strong>{{ pendingRoute.name }}</strong></p>
        <div class="login-buttons">
          <button class="btn" @click="login('user')">以 user 登入</button>
          <button class="btn btn-outline" @click="login('admin')">以 admin 登入</button>
        </div>
      </div>

      <div v-else-if="currentRoute.name === 'posts'">
        <input v-model="searchQuery" class="search-input" placeholder="搜尋文章…" />
        <ul class="post-list">
          <li v-for="post in filteredPosts" :key="post.id" class="post-item"
            @click="simulateNav('post', post.id)">
            <span class="post-title">{{ post.title }}</span>
            <span class="post-cat">{{ post.category }}</span>
          </li>
        </ul>
      </div>

      <div v-else-if="currentRoute.name === 'post'">
        <div v-if="currentPost" class="post-detail">
          <p class="post-id">#{{ currentPost.id }} — 文章詳情（動態 params :id）</p>
          <h5>{{ currentPost.title }}</h5>
          <p>分類：{{ currentPost.category }}</p>
          <button class="btn btn-sm btn-outline" @click="simulateNav('posts')">← 返回列表</button>
        </div>
      </div>

      <div v-else-if="currentRoute.name === 'profile'">
        <p>使用者角色：<strong>{{ userRole }}</strong></p>
        <p class="hint">profile 頁需要 user 或 admin 角色</p>
      </div>

      <div v-else-if="currentRoute.name === 'admin'">
        <div v-if="accessResult === 'denied'" class="denied-msg">
          <p>403 Forbidden — 你的角色（{{ userRole }}）沒有後台管理權限</p>
        </div>
        <div v-else>
          <p>⚙️ 後台管理介面（只有 admin 可見）</p>
          <p class="hint">你以 admin 身份登入，所以可以看到這個頁面</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.capstone-demo { display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
h4 { color: var(--color-secondary); margin-bottom: var(--space-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }
.auth-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-sm); }
.auth-status { display: flex; align-items: center; gap: 8px; font-size: var(--font-size-sm); font-weight: 500; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-dot.online { background: #4ade80; }
.status-dot.offline { background: #94a3b8; }
.login-buttons { display: flex; gap: 6px; }
.pending-hint { font-size: var(--font-size-sm); color: #f59e0b; margin-top: 6px; }
.mock-nav { display: flex; gap: 6px; flex-wrap: wrap; }
.nav-btn { display: flex; align-items: center; gap: 4px; padding: 6px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.nav-btn.active { border-color: var(--color-primary); background: rgba(99,102,241,0.08); color: var(--color-primary); font-weight: 600; }
.lock { font-size: 0.75rem; }
.breadcrumb { display: flex; align-items: center; gap: 4px; font-size: var(--font-size-sm); padding: 0 4px; }
.crumb-item { display: flex; align-items: center; gap: 4px; }
.crumb-sep { color: var(--color-text-muted); }
.crumb { color: var(--color-text-muted); }
.crumb.active { color: var(--color-primary); font-weight: 600; }
.content-area { min-height: 160px; }
.feature-list { font-size: var(--font-size-sm); display: flex; flex-direction: column; gap: 4px; padding-left: var(--space-md); margin-top: var(--space-sm); }
.login-page { display: flex; flex-direction: column; gap: var(--space-sm); }
.search-input { width: 100%; padding: 8px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); outline: none; margin-bottom: var(--space-sm); box-sizing: border-box; }
.post-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.post-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); cursor: pointer; }
.post-item:hover { border-color: var(--color-primary); }
.post-title { font-size: var(--font-size-sm); font-weight: 500; }
.post-cat { font-size: 0.7rem; padding: 2px 8px; background: var(--color-border); border-radius: 999px; color: var(--color-text-muted); }
.post-detail { display: flex; flex-direction: column; gap: 6px; }
.post-id { font-family: var(--font-mono); color: var(--color-text-muted); font-size: var(--font-size-sm); }
h5 { font-size: 1.1rem; margin: 0; }
.denied-msg { padding: var(--space-sm); background: rgba(239,68,68,0.08); border: 1px solid #fca5a5; border-radius: var(--radius-md); color: #dc2626; font-size: var(--font-size-sm); }
.btn { padding: 6px 16px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 500; background: var(--color-primary); color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
</style>
