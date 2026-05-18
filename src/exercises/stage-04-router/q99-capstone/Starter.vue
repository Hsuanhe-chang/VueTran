<script setup>
/** Q99 — 綜合題：含權限控制的多頁面路由系統（練習）
 *
 *  本題整合 Stage 4 所有 Vue Router 概念：
 *  - 路由 meta（requiresAuth, title, breadcrumb）
 *  - 導航守衛（checkAuth）
 *  - 動態 params（文章 :id）
 *  - query params（Posts 搜尋）
 *  - 程式化導航（simulateNav）
 */
import { ref, computed } from 'vue'

// ── Mock Auth 狀態 ────────────────────────────────────────────
const isLoggedIn = ref(false)
const userRole   = ref('guest')  // 'guest' / 'user' / 'admin'

// ── Mock 路由設定 ─────────────────────────────────────────────
const mockRoutes = [
  { name: 'home',    meta: { title: '首頁',       requiresAuth: false, roles: null,              breadcrumb: ['首頁'] } },
  { name: 'posts',   meta: { title: '文章列表',   requiresAuth: true,  roles: ['user','admin'],   breadcrumb: ['首頁', '文章'] } },
  { name: 'post',    meta: { title: '文章詳情',   requiresAuth: true,  roles: ['user','admin'],   breadcrumb: ['首頁', '文章', '詳情'] } },
  { name: 'profile', meta: { title: '個人資料',   requiresAuth: true,  roles: ['user','admin'],   breadcrumb: ['首頁', '個人資料'] } },
  { name: 'admin',   meta: { title: '後台管理',   requiresAuth: true,  roles: ['admin'],          breadcrumb: ['首頁', '後台'] } },
]

// ── 模擬 Posts 資料 ───────────────────────────────────────────
const posts = [
  { id: '1', title: 'Vue 3 Composition API 基礎', category: '前端' },
  { id: '2', title: 'Pinia 狀態管理實戰',         category: '前端' },
  { id: '3', title: 'Vue Router 4 深度解析',      category: '前端' },
  { id: '4', title: 'Node.js 後端 REST API',      category: '後端' },
]

// ── 當前路由狀態 ──────────────────────────────────────────────
const currentRoute = ref(mockRoutes[0])  // 當前頁面
const currentPostId = ref(null)          // 文章詳情的 :id
const searchQuery   = ref('')            // Posts 搜尋 query
const pendingRoute  = ref(null)          // 被守衛攔截前想去的路由（用於 login 後 redirect）
const accessResult  = ref(null)          // 最近一次守衛結果：null / 'allowed' / 'denied' / 'login'

// ── TODO：實作 checkAuth 導航守衛 ────────────────────────────
// 回傳：'allowed' / 'denied' / 'login'（需要重定向到登入）
function checkAuth(target) {
  // TODO：參考 Q04 的邏輯實作
  return 'allowed'  // ← 替換這行
}

// ── simulateNav：模擬路由切換（含守衛） ──────────────────────
function simulateNav(routeName, postId = null) {
  const target = mockRoutes.find(r => r.name === routeName)
  if (!target) return

  const result = checkAuth(target)
  accessResult.value = result

  if (result === 'allowed') {
    currentRoute.value  = target
    currentPostId.value = postId
    pendingRoute.value  = null
  } else if (result === 'login') {
    // 守衛攔截：記住想去的路由，等登入後跳過去
    pendingRoute.value  = { name: routeName, postId }
    currentRoute.value  = { name: 'login-page', meta: { title: '請登入', breadcrumb: ['登入'] } }
  }
}

// ── 登入操作 ──────────────────────────────────────────────────
function login(role) {
  isLoggedIn.value = true
  userRole.value   = role
  // TODO：登入後若有 pendingRoute，自動導向（實作 redirect 邏輯）
  currentRoute.value = mockRoutes.find(r => r.name === 'home')
}

function logout() {
  isLoggedIn.value = false
  userRole.value   = 'guest'
  currentRoute.value = mockRoutes.find(r => r.name === 'home')
}

// ── Posts 搜尋過濾 ────────────────────────────────────────────
const filteredPosts = computed(() => {
  if (!searchQuery.value.trim()) return posts
  return posts.filter(p => p.title.includes(searchQuery.value))
})

// ── 當前文章（詳情頁用）──────────────────────────────────────
const currentPost = computed(() =>
  posts.find(p => p.id === currentPostId.value) ?? null
)
</script>

<template>
  <div class="capstone-demo">
    <h3>🏗️ Q99 — 多頁面路由系統（練習）</h3>

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
    </section>

    <!-- ── 模擬導覽列 ── -->
    <section class="demo-section">
      <h4>導覽（模擬 RouterLink）</h4>
      <nav class="mock-nav">
        <button v-for="r in mockRoutes" :key="r.name"
          class="nav-btn"
          :class="{ active: currentRoute.name === r.name }"
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

    <!-- ── 頁面內容區 ── -->
    <section class="demo-section content-area">
      <h4>{{ currentRoute.meta?.title ?? '頁面' }}</h4>

      <!-- 首頁 -->
      <div v-if="currentRoute.name === 'home'">
        <p>歡迎來到 Vue Router 綜合練習系統！</p>
        <p class="hint">點擊上方導覽按鈕切換頁面，觀察守衛行為。</p>
      </div>

      <!-- 登入提示頁 -->
      <div v-else-if="currentRoute.name === 'login-page'" class="login-page">
        <p>你嘗試訪問的頁面需要登入。</p>
        <div class="login-buttons">
          <button class="btn" @click="login('user')">以 user 登入</button>
          <button class="btn btn-outline" @click="login('admin')">以 admin 登入</button>
        </div>
      </div>

      <!-- 文章列表 -->
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

      <!-- 文章詳情 -->
      <div v-else-if="currentRoute.name === 'post'">
        <div v-if="currentPost" class="post-detail">
          <p class="post-id">#{{ currentPost.id }}</p>
          <h5>{{ currentPost.title }}</h5>
          <p>分類：{{ currentPost.category }}</p>
          <button class="btn btn-sm btn-outline" @click="simulateNav('posts')">← 返回列表</button>
        </div>
        <p v-else>找不到文章</p>
      </div>

      <!-- 個人資料 -->
      <div v-else-if="currentRoute.name === 'profile'">
        <p>使用者角色：<strong>{{ userRole }}</strong></p>
      </div>

      <!-- 後台管理 -->
      <div v-else-if="currentRoute.name === 'admin'">
        <p>⚙️ 後台管理介面（只有 admin 可見）</p>
        <div v-if="accessResult === 'denied'" class="denied-msg">
          <p>403 Forbidden — 你沒有 admin 權限</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.capstone-demo { display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
h4 { color: var(--color-secondary); margin-bottom: var(--space-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.auth-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-sm); }
.auth-status { display: flex; align-items: center; gap: 8px; font-size: var(--font-size-sm); font-weight: 500; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-dot.online { background: #4ade80; }
.status-dot.offline { background: #94a3b8; }
.login-buttons { display: flex; gap: 6px; }
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
.denied-msg { padding: var(--space-sm); background: rgba(239,68,68,0.08); border: 1px solid #fca5a5; border-radius: var(--radius-md); color: #dc2626; font-size: var(--font-size-sm); margin-top: var(--space-sm); }
.btn { padding: 6px 16px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 500; background: var(--color-primary); color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
</style>
