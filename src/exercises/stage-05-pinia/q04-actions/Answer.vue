<script setup>
/** Q04 — Actions 與非同步操作（解答）
 *
 *  重點：
 *  1. 非同步 action 必須用 async/await，同步用 try/catch/finally 包住
 *  2. 永遠在 finally 關閉 isLoading，無論成功失敗
 *  3. action 可以直接呼叫其他 action：this.otherAction()
 *  4. Pinia action 不需要 commit/dispatch，直接呼叫即可
 */
import { ref }        from 'vue'
import { defineStore } from 'pinia'

// ── Mock API ─────────────────────────────────────────────────────
async function mockFetchUsers() {
  await new Promise(r => setTimeout(r, 800))
  if (Math.random() < 0.2) throw new Error('Network error: 無法連線到伺服器')
  return [
    { id: 1, name: '小明', role: 'user' },
    { id: 2, name: '小華', role: 'admin' },
    { id: 3, name: '小美', role: 'user' },
  ]
}

let nextId = 4

// ── 完整的 Actions 實作 ───────────────────────────────────────────
const useUserListStore = defineStore('user-list-q04-ans', {
  state: () => ({
    users:     [],
    isLoading: false,
    error:     null,
  }),

  actions: {
    // ① 非同步 action：標準三步驟 — 設 loading → 執行 → 清 loading
    async fetchUsers() {
      this.isLoading = true
      this.error     = null
      try {
        // 等待 API 回傳，成功後更新 state
        this.users = await mockFetchUsers()
      } catch (e) {
        // 失敗時把錯誤訊息存到 state，讓 template 顯示
        this.error = e.message
      } finally {
        // 無論成功或失敗都關閉 loading
        this.isLoading = false
      }
    },

    // ② 同步 action：直接操作 state
    addUser(name) {
      this.users.push({ id: nextId++, name, role: 'user' })
    },

    // ③ 同步 action：filter 產生新陣列並覆蓋
    removeUser(id) {
      this.users = this.users.filter(u => u.id !== id)
    },

    // ④ 同步 action：找到對象後切換 role
    toggleRole(id) {
      const user = this.users.find(u => u.id === id)
      if (user) {
        // 三元運算切換兩個值
        user.role = user.role === 'user' ? 'admin' : 'user'
      }
    },
  },
})

// ── 使用 Store ────────────────────────────────────────────────────
const store = useUserListStore()

// onMounted 等效：defineStore 外直接呼叫（元件 setup 期間執行）
store.fetchUsers()

const newName = ref('')

function handleAdd() {
  if (!newName.value.trim()) return
  store.addUser(newName.value.trim())
  newName.value = ''
}
</script>

<template>
  <div class="actions-demo">
    <h3>🍍 Q04 — Actions 與非同步操作（解答）</h3>

    <!-- ── 載入 / 錯誤狀態 ── -->
    <section class="demo-section">
      <div class="toolbar">
        <h4>使用者列表</h4>
        <button class="btn btn-sm btn-outline" @click="store.fetchUsers" :disabled="store.isLoading">
          {{ store.isLoading ? '載入中…' : '重新載入' }}
        </button>
      </div>

      <div v-if="store.isLoading" class="loading-state">
        <span class="spinner" />
        <span>載入中…（模擬 800ms + 20% 機率失敗）</span>
      </div>

      <div v-else-if="store.error" class="error-state">
        <p>❌ {{ store.error }}</p>
        <button class="btn btn-sm" @click="store.fetchUsers">重試</button>
      </div>

      <div v-else-if="store.users.length" class="user-list">
        <div v-for="u in store.users" :key="u.id" class="user-row">
          <span class="user-name">{{ u.name }}</span>
          <span class="role-badge" :class="u.role">{{ u.role }}</span>
          <button class="btn btn-xs btn-outline" @click="store.toggleRole(u.id)">切換角色</button>
          <button class="btn btn-xs btn-danger" @click="store.removeUser(u.id)">刪除</button>
        </div>
      </div>
      <p v-else class="hint">使用者列表為空</p>
    </section>

    <!-- ── 新增使用者 ── -->
    <section class="demo-section">
      <h4>新增使用者</h4>
      <div class="add-row">
        <input
          v-model="newName"
          class="name-input"
          placeholder="輸入姓名，按 Enter 或點新增…"
          @keydown.enter="handleAdd"
        />
        <button class="btn" @click="handleAdd">新增</button>
      </div>
    </section>

    <!-- ── 完整 Action 說明 ── -->
    <section class="demo-section">
      <h4>✅ 完整非同步 Action 範式</h4>
      <pre v-pre class="code-block">actions: {
  async fetchUsers() {
    this.isLoading = true   // ① 開始：顯示 loading
    this.error     = null   // ① 清除舊錯誤

    try {
      this.users = await mockFetchUsers()  // ② 執行非同步操作
    } catch (e) {
      this.error = e.message               // ③ 失敗：記錄錯誤
    } finally {
      this.isLoading = false               // ④ 無論成敗都關 loading
    }
  },

  // 同步 action：直接修改 state
  addUser(name) {
    this.users.push({ id: nextId++, name, role: 'user' })
  },

  // action 可以呼叫其他 action
  async refreshAndAdd(name) {
    await this.fetchUsers()  // 先 fetch
    this.addUser(name)       // 再新增
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
.spinner { width: 16px; height: 16px; border: 2px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
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
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.8rem; }
.btn-xs { padding: 3px 10px; font-size: 0.75rem; border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 500; }
.btn-xs.btn-outline { border: 1px solid var(--color-primary); color: var(--color-primary); background: transparent; }
.btn-xs.btn-danger { background: #ef4444; color: #fff; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
