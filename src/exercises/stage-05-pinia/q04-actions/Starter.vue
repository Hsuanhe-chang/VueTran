<script setup>
/** Q04 — Actions 與非同步操作（功能實作）
 *
 *  Pinia Actions：
 *  - 同步 action：直接修改 state
 *  - 非同步 action：async/await，搭配 isLoading / error 狀態
 *  - action 可以呼叫其他 action（this.otherAction()）
 */
import { ref }       from 'vue'
import { defineStore } from 'pinia'

// ── Mock API（模擬延遲 + 偶爾失敗）────────────────────────────────
async function mockFetchUsers() {
  await new Promise(r => setTimeout(r, 800)) // 模擬 800ms 延遲
  // 每次呼叫有 20% 機率回傳錯誤，讓你測試 error 狀態
  if (Math.random() < 0.2) throw new Error('Network error: 無法連線到伺服器')
  return [
    { id: 1, name: '小明', role: 'user' },
    { id: 2, name: '小華', role: 'admin' },
    { id: 3, name: '小美', role: 'user' },
  ]
}

let nextId = 4 // 用於自動遞增新使用者的 id

// ── TODO：實作 useUserListStore ──────────────────────────────────
const useUserListStore = defineStore('user-list-q04', {
  state: () => ({
    users:     [],    // 使用者陣列
    isLoading: false, // 載入中狀態
    error:     null,  // 錯誤訊息（null 表示無錯誤）
  }),

  actions: {
    // ── TODO 1：fetchUsers（非同步）────────────────────────────────
    // 1. isLoading = true，error = null
    // 2. 呼叫 mockFetchUsers()，結果存到 this.users
    // 3. 若拋出例外，將 error.message 存到 this.error
    // 4. finally：isLoading = false
    async fetchUsers() {
      /* TODO */
    },

    // ── TODO 2：addUser（同步）─────────────────────────────────────
    // 新增 { id: nextId++, name, role: 'user' } 到 this.users
    addUser(name) {
      /* TODO */
    },

    // ── TODO 3：removeUser（同步）──────────────────────────────────
    // 從 this.users 移除 id 符合的使用者
    removeUser(id) {
      /* TODO */
    },

    // ── TODO 4：toggleRole（同步）──────────────────────────────────
    // 找到 id 符合的使用者，將 role 在 'user' / 'admin' 之間切換
    toggleRole(id) {
      /* TODO */
    },
  },
})

// ── 使用 Store ────────────────────────────────────────────────────
const store = useUserListStore()

// 頁面載入時自動 fetch（TODO 1 完成後才有效）
store.fetchUsers()

// ── 新增使用者的輸入框 ────────────────────────────────────────────
const newName = ref('')

function handleAdd() {
  if (!newName.value.trim()) return
  store.addUser(newName.value.trim())
  newName.value = ''
}
</script>

<template>
  <div class="actions-demo">
    <h3>🍍 Q04 — Actions 與非同步操作（練習）</h3>

    <!-- ── 載入 / 錯誤狀態 ── -->
    <section class="demo-section">
      <div class="toolbar">
        <h4>使用者列表</h4>
        <button class="btn btn-sm btn-outline" @click="store.fetchUsers">重新載入</button>
      </div>

      <!-- 載入中 -->
      <div v-if="store.isLoading" class="loading-state">
        <span class="spinner" />
        <span>載入中…</span>
      </div>

      <!-- 錯誤 -->
      <div v-else-if="store.error" class="error-state">
        <p>❌ {{ store.error }}</p>
        <button class="btn btn-sm" @click="store.fetchUsers">重試</button>
      </div>

      <!-- 使用者列表 -->
      <div v-else-if="store.users.length" class="user-list">
        <div v-for="u in store.users" :key="u.id" class="user-row">
          <span class="user-name">{{ u.name }}</span>
          <span class="role-badge" :class="u.role">{{ u.role }}</span>
          <button class="btn btn-xs btn-outline" @click="store.toggleRole(u.id)">切換角色</button>
          <button class="btn btn-xs btn-danger" @click="store.removeUser(u.id)">刪除</button>
        </div>
      </div>

      <p v-else class="hint">尚無使用者（完成 TODO 1 後自動載入）</p>
    </section>

    <!-- ── 新增使用者 ── -->
    <section class="demo-section">
      <h4>新增使用者</h4>
      <div class="add-row">
        <input
          v-model="newName"
          class="name-input"
          placeholder="輸入姓名…"
          @keydown.enter="handleAdd"
        />
        <button class="btn" @click="handleAdd">新增</button>
      </div>
    </section>

    <!-- ── Action 模式說明 ── -->
    <section class="demo-section">
      <h4>非同步 Action 模式</h4>
      <pre v-pre class="code-block">actions: {
  async fetchUsers() {
    this.isLoading = true
    this.error     = null
    try {
      this.users = await mockFetchUsers()
    } catch (e) {
      this.error = e.message
    } finally {
      this.isLoading = false   // 無論成功或失敗都關閉 loading
    }
  },
}</pre>
    </section>
  </div>
</template>

<style scoped>
.actions-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.toolbar { display: flex; align-items: center; justify-content: space-between; }
.loading-state { display: flex; align-items: center; gap: 8px; color: var(--color-text-muted); font-size: var(--font-size-sm); padding: var(--space-sm); }
.spinner { width: 16px; height: 16px; border: 2px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.error-state { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm); background: rgba(239,68,68,0.08); border: 1px solid #fca5a5; border-radius: var(--radius-md); color: #dc2626; font-size: var(--font-size-sm); }
.user-list { display: flex; flex-direction: column; gap: 6px; }
.user-row { display: flex; align-items: center; gap: var(--space-sm); padding: 8px 12px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.user-name { flex: 1; font-weight: 500; font-size: var(--font-size-sm); }
.role-badge { padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.role-badge.admin { background: rgba(99,102,241,0.15); color: var(--color-primary); }
.role-badge.user  { background: rgba(74,222,128,0.15); color: #16a34a; }
.add-row { display: flex; gap: var(--space-sm); }
.name-input { flex: 1; padding: 8px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); outline: none; }
.name-input:focus { border-color: var(--color-primary); }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.8rem; }
.btn-xs { padding: 3px 10px; font-size: 0.75rem; border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 500; }
.btn-xs.btn-outline { border: 1px solid var(--color-primary); color: var(--color-primary); background: transparent; }
.btn-xs.btn-danger { background: #ef4444; color: #fff; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
