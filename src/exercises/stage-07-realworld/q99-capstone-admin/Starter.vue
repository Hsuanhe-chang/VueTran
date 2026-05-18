<script setup>
/** Q99 — 綜合題：小型後台管理系統（練習）
 *
 *  整合 Stage 7 核心知識點：
 *  TODO 1：完成 useFetch 的 execute() 函式（try/catch/finally）
 *  TODO 2：加入 onErrorCaptured 捕捉子元件錯誤
 *  TODO 3：完成 errors computed（表單欄位驗證邏輯）
 *  TODO 4：將靜態 StatsPanel 改為 defineAsyncComponent
 */
import {
  ref, reactive, computed, onMounted, toValue,
  defineComponent, defineAsyncComponent
} from 'vue'

// ── Mock API（模擬後端）───────────────────────────────────
// Q05 回顧：使用 import.meta.env 讀取環境變數，未設定時 fallback 至 'mock'
const API_BASE = import.meta.env.VITE_API_URL ?? 'mock'

/** 可變動的使用者資料（新增會即時反映）*/
const _mockUsers = ref([
  { id: 1, name: 'Alice Wang',  email: 'alice@example.com',  role: 'admin',  status: 'active'   },
  { id: 2, name: 'Bob Chen',    email: 'bob@example.com',    role: 'editor', status: 'active'   },
  { id: 3, name: 'Carol Li',    email: 'carol@example.com',  role: 'viewer', status: 'inactive' },
  { id: 4, name: 'David Huang', email: 'david@example.com',  role: 'editor', status: 'active'   },
])

/**
 * 模擬 API 呼叫（延遲 800ms）
 * @param {string} endpoint - '/users' | '/users/add' | '/stats'
 * @param {object|null} body - POST 資料（null 表示 GET）
 * @returns {Promise}
 */
function mockApiCall(endpoint, body = null) {
  console.log(`[${API_BASE}] ${body ? 'POST' : 'GET'} ${endpoint}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint === '/users') {
        resolve([..._mockUsers.value])
      } else if (endpoint === '/users/add' && body) {
        const newUser = { id: Date.now(), ...body, status: 'active' }
        _mockUsers.value.push(newUser)
        resolve(newUser)
      } else if (endpoint === '/stats') {
        const users = _mockUsers.value
        resolve({
          total:  users.length,
          active: users.filter(u => u.status === 'active').length,
          admins: users.filter(u => u.role === 'admin').length,
        })
      } else {
        reject(new Error(`404: endpoint "${endpoint}" not found`))
      }
    }, 800)
  })
}

// ── TODO 1：完成 useFetch Composable ─────────────────────
// Q01 回顧：useFetch 封裝 API 呼叫狀態（data / isLoading / error）

/**
 * 通用 Fetch Composable
 * @param {string | import('vue').Ref<string>} endpoint
 */
function useFetch(endpoint) {
  const data = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function execute() {
    // TODO 1：完成以下步驟：
    // 1. isLoading.value = true
    // 2. error.value = null
    // 3. data.value = await mockApiCall(toValue(endpoint))
    // 4. catch(e): error.value = e.message
    // 5. finally: isLoading.value = false
  }

  onMounted(execute)   // 元件掛載時自動執行
  return { data, isLoading, error, execute }
}

// 抓取使用者列表
const users = useFetch('/users')

// ── TODO 2：onErrorCaptured 錯誤邊界 ─────────────────────
// Q02 回顧：捕捉子元件在 setup() 或生命週期中拋出的錯誤

/** 收集到的元件錯誤（顯示在頁面頂部）*/
const componentErrors = ref([])

// TODO 2：在此加入 onErrorCaptured hook
// 捕捉到錯誤時：
// 1. 將 { message: err.message, time: new Date().toLocaleTimeString() } push 進 componentErrors
// 2. return false  ← 阻止錯誤繼續向上傳播（防止破壞父元件）

/** 可觸發錯誤的問題元件 */
const BuggyWidget = defineComponent({
  name: 'BuggyWidget',
  props: { shouldFail: Boolean },
  setup(props) {
    // 根據 prop 決定是否拋出錯誤（模擬元件異常）
    if (props.shouldFail) {
      throw new Error('BuggyWidget 拋出錯誤！（這應被 onErrorCaptured 捕捉到）')
    }
    return {}
  },
  template: `<div class="widget-ok">✅ BuggyWidget 正常運作中</div>`
})

const triggerError = ref(false)

// ── TODO 3：表單驗證 ──────────────────────────────────────
// Q03 回顧：reactive 表單 + touched 追蹤 + computed errors

const form = reactive({ name: '', email: '', role: '' })
const touched = reactive({ name: false, email: false, role: false })

/** 標記欄位已被碰觸（blur 時觸發，控制何時顯示錯誤）*/
function touch(field) { touched[field] = true }

// TODO 3：完成 errors computed
// 驗證規則：
//   name：touched 後才驗證；必填，至少 2 個字
//   email：touched 後才驗證；必填，必須包含 @ 符號
//   role：touched 後才驗證；必填（不能為空字串）
const errors = computed(() => {
  return {}  // TODO 3：填入驗證邏輯，回傳 { name?: string, email?: string, role?: string }
})

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

// 表單提交狀態
const isSubmitting = ref(false)
const submitSuccess = ref(false)

async function handleSubmit() {
  // 強制觸碰所有欄位，讓錯誤訊息全部顯示
  Object.keys(touched).forEach(k => (touched[k] = true))
  if (hasErrors.value) return

  isSubmitting.value = true
  try {
    const newUser = await mockApiCall('/users/add', { ...form })
    // 新增成功後，直接把新使用者加到列表（不重新 fetch）
    if (users.data.value) {
      users.data.value = [...users.data.value, newUser]
    }
    // 重設表單狀態
    Object.assign(form, { name: '', email: '', role: '' })
    Object.assign(touched, { name: false, email: false, role: false })
    submitSuccess.value = true
    setTimeout(() => (submitSuccess.value = false), 3000)
  } catch (e) {
    componentErrors.value.push({ message: e.message, time: new Date().toLocaleTimeString() })
  } finally {
    isSubmitting.value = false
  }
}

// ── TODO 4：StatsPanel 改為 defineAsyncComponent ─────────
// Q06 回顧：將靜態元件改為 defineAsyncComponent，讓首次載入更快

// SkeletonLoader（TODO 4 完成後作為 loadingComponent 使用）
const StatsPanelSkeleton = defineComponent({
  template: `
    <div class="stats-skeleton">
      <div class="skel-title"></div>
      <div class="skel-row">
        <div class="skel-card"></div>
        <div class="skel-card"></div>
        <div class="skel-card"></div>
      </div>
    </div>
  `
})

// TODO 4：請將下方靜態元件改為 defineAsyncComponent
// const StatsPanel = defineAsyncComponent({
//   loader: async () => {
//     const stats = await mockApiCall('/stats')
//     return { name: 'StatsPanel', setup() { ... }, template: `...` }
//   },
//   loadingComponent: StatsPanelSkeleton,
//   delay: 200,
// })

// 目前使用靜態元件（完成 TODO 4 後替換）
const StatsPanel = defineComponent({
  name: 'StatsPanel',
  setup() {
    // 靜態資料，不反映真實使用者數量
    return { stats: { total: 4, active: 3, admins: 1 } }
  },
  template: `
    <div class="stats-panel">
      <h5>📊 系統統計（靜態資料，TODO 4 完成後改為動態）</h5>
      <div class="stats-grid">
        <div class="stat-item">
          <p class="stat-label">使用者總數</p>
          <p class="stat-value">{{ stats.total }}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">活躍</p>
          <p class="stat-value">{{ stats.active }}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">管理員</p>
          <p class="stat-value">{{ stats.admins }}</p>
        </div>
      </div>
    </div>
  `
})

/** 角色顯示顏色 */
function getRoleClass(role) {
  return { admin: 'badge-admin', editor: 'badge-editor', viewer: 'badge-viewer' }[role] ?? ''
}
</script>

<template>
  <div class="admin-panel">
    <h3>🖥️ Q99 — 小型後台管理系統（練習）</h3>

    <!-- ── 錯誤邊界顯示（TODO 2 完成後才會有內容）── -->
    <div v-if="componentErrors.length" class="error-boundary">
      <h4>⚠️ 元件錯誤捕捉（onErrorCaptured）</h4>
      <div v-for="(err, i) in componentErrors" :key="i" class="error-item">
        <span class="error-time">{{ err.time }}</span>
        <span class="error-msg">{{ err.message }}</span>
      </div>
      <button class="btn btn-sm btn-clear" @click="componentErrors = []">清除</button>
    </div>

    <div class="main-grid">
      <!-- ── 左欄：統計面板（TODO 4 改為 async）── -->
      <aside class="panel-side">
        <h4>統計面板</h4>
        <StatsPanel />
        <p class="hint">TODO 4：改為 defineAsyncComponent（顯示骨架屏動畫）</p>
      </aside>

      <!-- ── 右欄：使用者列表 ── -->
      <main class="panel-main">
        <h4>使用者列表</h4>

        <!-- 載入中 -->
        <div v-if="users.isLoading.value" class="loading-row">
          <span class="spinner"></span> 載入中…
        </div>

        <!-- 載入失敗 -->
        <div v-else-if="users.error.value" class="fetch-error">
          ❌ {{ users.error.value }}
          <button class="btn btn-sm" @click="users.execute()">重試</button>
        </div>

        <!-- 使用者表格 -->
        <table v-else-if="users.data.value" class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>Email</th>
              <th>角色</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users.data.value" :key="user.id">
              <td class="td-id">{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td class="td-email">{{ user.email }}</td>
              <td><span class="badge" :class="getRoleClass(user.role)">{{ user.role }}</span></td>
              <td><span class="status" :class="user.status">{{ user.status }}</span></td>
            </tr>
          </tbody>
        </table>

        <!-- TODO 1 尚未完成時顯示提示 -->
        <p v-else class="hint">⬆️ 請完成 TODO 1（useFetch execute 函式）才能載入資料</p>
      </main>
    </div>

    <!-- ── 新增使用者表單（TODO 3 加入驗證）── -->
    <section class="form-section">
      <h4>新增使用者</h4>

      <div v-if="submitSuccess" class="success-msg">✅ 新增成功！使用者已加入列表。</div>

      <form class="user-form" @submit.prevent="handleSubmit">
        <!-- 姓名 -->
        <div class="form-group">
          <label>姓名</label>
          <input
            v-model="form.name"
            class="input"
            :class="{ 'input-error': errors.name }"
            placeholder="至少 2 個字"
            @blur="touch('name')"
          />
          <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            class="input"
            :class="{ 'input-error': errors.email }"
            type="email"
            placeholder="user@example.com"
            @blur="touch('email')"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- 角色 -->
        <div class="form-group">
          <label>角色</label>
          <select
            v-model="form.role"
            class="input"
            :class="{ 'input-error': errors.role }"
            @blur="touch('role')"
          >
            <option value="">-- 請選擇 --</option>
            <option value="admin">admin</option>
            <option value="editor">editor</option>
            <option value="viewer">viewer</option>
          </select>
          <span v-if="errors.role" class="field-error">{{ errors.role }}</span>
        </div>

        <button type="submit" class="btn" :disabled="isSubmitting">
          {{ isSubmitting ? '新增中…' : '+ 新增使用者' }}
        </button>
      </form>

      <p class="hint">TODO 3：完成 errors computed，讓欄位空白或格式錯誤時顯示紅字</p>
    </section>

    <!-- ── 錯誤處理測試區（TODO 2 練習）── -->
    <section class="error-test-section">
      <h4>錯誤邊界測試（onErrorCaptured）</h4>
      <div class="error-controls">
        <button
          class="btn btn-sm"
          :class="triggerError ? 'btn-danger' : ''"
          @click="triggerError = !triggerError"
        >
          {{ triggerError ? '🔴 關閉錯誤元件' : '⚡ 觸發子元件錯誤' }}
        </button>
        <span class="hint">切換後觀察錯誤面板（TODO 2 完成前：錯誤只在 console 顯示）</span>
      </div>

      <!-- :key 強制在切換時重新掛載（讓錯誤重新觸發）-->
      <BuggyWidget :should-fail="triggerError" :key="String(triggerError)" />
    </section>
  </div>
</template>

<style scoped>
.admin-panel { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h4 { color: var(--color-secondary); margin: 0 0 var(--space-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }

/* 錯誤邊界 */
.error-boundary { padding: var(--space-md); background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 6px; }
.error-boundary h4 { color: #dc2626; margin: 0; font-size: var(--font-size-sm); }
.error-item { display: flex; gap: 8px; font-size: var(--font-size-sm); }
.error-time { color: #9ca3af; flex-shrink: 0; }
.error-msg { color: #dc2626; }

/* 主網格 */
.main-grid { display: grid; grid-template-columns: 220px 1fr; gap: var(--space-md); }
@media (max-width: 640px) { .main-grid { grid-template-columns: 1fr; } }
.panel-side { display: flex; flex-direction: column; gap: var(--space-sm); }
.panel-main { display: flex; flex-direction: column; gap: var(--space-sm); }

/* 統計面板（子元件內部樣式）*/
:deep(.stats-panel) { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
:deep(.stats-panel h5) { font-size: var(--font-size-sm); font-weight: 700; color: var(--color-secondary); margin: 0 0 var(--space-sm); }
:deep(.stats-grid) { display: flex; flex-direction: column; gap: 8px; }
:deep(.stat-item) { padding: 8px; background: var(--color-bg); border-radius: var(--radius-sm); border: 1px solid var(--color-border); text-align: center; }
:deep(.stat-label) { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }
:deep(.stat-value) { font-size: 1.2rem; font-weight: 700; margin: 2px 0 0; color: var(--color-primary); }
:deep(.widget-ok) { font-size: var(--font-size-sm); color: #16a34a; padding: 8px; background: #f0fdf4; border-radius: var(--radius-sm); }

/* 骨架屏（defineAsyncComponent 載入期間）*/
:deep(.stats-skeleton) { padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm); }
:deep(.skel-title) { height: 14px; width: 60%; border-radius: 4px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
:deep(.skel-row) { display: flex; flex-direction: column; gap: 8px; }
:deep(.skel-card) { height: 50px; border-radius: var(--radius-sm); background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* 載入中 */
.loading-row { display: flex; align-items: center; gap: 8px; font-size: var(--font-size-sm); color: var(--color-text-muted); padding: var(--space-md); }
.spinner { width: 16px; height: 16px; border: 2px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.fetch-error { padding: var(--space-sm) var(--space-md); background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); color: #dc2626; font-size: var(--font-size-sm); display: flex; align-items: center; gap: var(--space-sm); }

/* 使用者表格 */
.user-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.user-table th { padding: 6px 10px; background: var(--color-bg-card); color: var(--color-secondary); font-weight: 600; text-align: left; border-bottom: 2px solid var(--color-border); }
.user-table td { padding: 7px 10px; border-bottom: 1px solid var(--color-border); }
.td-id { color: var(--color-text-muted); width: 40px; }
.td-email { color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8rem; }
.badge { padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.badge-admin  { background: #fef3c7; color: #92400e; }
.badge-editor { background: #dbeafe; color: #1e40af; }
.badge-viewer { background: #f3f4f6; color: #374151; }
.status { font-size: 0.75rem; font-weight: 600; }
.status.active   { color: #16a34a; }
.status.inactive { color: #9ca3af; }

/* 表單 */
.form-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
.user-form { display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: var(--space-sm); align-items: end; }
@media (max-width: 640px) { .user-form { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: var(--color-secondary); }
.input { padding: 7px 10px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: var(--font-size-sm); background: var(--color-bg); color: var(--color-text); }
.input-error { border-color: #f87171; }
.field-error { font-size: 0.75rem; color: #dc2626; }
.success-msg { padding: 8px 12px; background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-sm); color: #16a34a; font-size: var(--font-size-sm); font-weight: 600; }

/* 錯誤測試區 */
.error-test-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
.error-controls { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }

/* 按鈕 */
.btn { padding: 8px 18px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-sm { padding: 5px 12px; font-size: 0.8rem; }
.btn-danger { background: #dc2626; }
.btn-clear { background: #6b7280; }
</style>
