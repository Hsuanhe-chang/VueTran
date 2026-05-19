<script setup lang="ts">
/** Q99 — 綜合題：小型後台管理系統（解答）
 *
 *  TODO 解答：
 *  1. useFetch execute() — 完整的 try/catch/finally 非同步呼叫
 *  2. onErrorCaptured  — 捕捉子元件錯誤並推入 componentErrors
 *  3. errors computed  — name / email / role 三欄位驗證邏輯
 *  4. defineAsyncComponent — StatsPanel 動態載入，帶骨架屏
 */
import {
  ref, reactive, computed, onMounted, onErrorCaptured, toValue,
  defineComponent, defineAsyncComponent
} from 'vue'

// ── 型別定義 ───────────────────────────────────────────────────
/** 元件錯誤日誌的資料結構 */
interface ErrorLog {
  message: string
  info: string
  time: string
}

/** 使用者資料結構 */
interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
}

// ── Mock API（與 Starter.vue 相同）───────────────────────
const API_BASE = import.meta.env.VITE_API_URL ?? 'mock'

const _mockUsers = ref([
  { id: 1, name: 'Alice Wang',  email: 'alice@example.com',  role: 'admin',  status: 'active'   },
  { id: 2, name: 'Bob Chen',    email: 'bob@example.com',    role: 'editor', status: 'active'   },
  { id: 3, name: 'Carol Li',    email: 'carol@example.com',  role: 'viewer', status: 'inactive' },
  { id: 4, name: 'David Huang', email: 'david@example.com',  role: 'editor', status: 'active'   },
])

// 加上 endpoint: string 避免隐式 any，body 加上聯合型別避免 spread null 額錯誤
function mockApiCall(endpoint: string, body: Record<string, unknown> | null = null) {
  console.log(`[${API_BASE}] ${body ? 'POST' : 'GET'} ${endpoint}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint === '/users') {
        resolve([..._mockUsers.value])
      } else if (endpoint === '/users/add' && body) {
        // body 在 && body 檢查後被 TypeScript 縮小為 Record，可安全 spread
        // 用 as User 型別斷言，因為 spread Record<string,unknown> 無法自動推斷必要欄位
        const newUser = { id: Date.now(), ...body, status: 'active' } as User
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

// ── ✅ TODO 1 解答：useFetch Composable ──────────────────
// toValue() 讓 endpoint 同時支援 ref 與純字串（reactive 端點）

/**
 * 通用 Fetch Composable
 * @param {string | import('vue').Ref<string>} endpoint
 * @returns {{ data: Ref, isLoading: Ref<boolean>, error: Ref<string|null>, execute: Function }}
 */
function useFetch(endpoint: string) {
  // data: any 避免 Ref<null> 導致的 spread 與資料讀取型別衝突
  const data = ref<any>(null)
  const isLoading = ref(false)
  // error 需要接受 string，加上聯合型別避免 Ref<null> 資料設定失敗
  const error = ref<string | null>(null)

  async function execute() {
    // 1. 開始載入：設定 loading 旗標，清除前次錯誤
    isLoading.value = true
    error.value = null
    try {
      // 2. toValue() 解包 ref，讓 endpoint 可以是響應式的
      data.value = await mockApiCall(toValue(endpoint))
    } catch (e: unknown) {
      // 3. e: unknown 是 TS 嚴格模式預設，用 instanceof 安全取得錯誤訊息
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      // 4. 無論成功或失敗，都關閉載入狀態
      isLoading.value = false
    }
  }

  onMounted(execute)   // 元件掛載時自動執行第一次
  return { data, isLoading, error, execute }
}

const users = useFetch('/users')

// ── ✅ TODO 2 解答：onErrorCaptured 錯誤邊界 ─────────────
// 攔截所有子元件（包含孫層）的錯誤，防止整頁崩潰

// 加上 ErrorLog[] 泛型，避免 ref([]) 導致的 Ref<never[]> 型別錯誤
const componentErrors = ref<ErrorLog[]>([])

// onErrorCaptured 的三個參數：err（錯誤物件）、instance（出錯的元件實例）、info（錯誤位置說明）
onErrorCaptured((err, _instance, info) => {
  // 將錯誤記錄到陣列，供模板顯示
  componentErrors.value.push({
    message: err.message,
    info,
    time: new Date().toLocaleTimeString(),
  })
  // return false：阻止錯誤繼續向上傳播（不讓 app.config.errorHandler 再次處理）
  return false
})

const BuggyWidget = defineComponent({
  name: 'BuggyWidget',
  props: { shouldFail: Boolean },
  setup(props) {
    if (props.shouldFail) {
      throw new Error('BuggyWidget 拋出錯誤！（這應被 onErrorCaptured 捕捉到）')
    }
    return {}
  },
  template: `<div class="widget-ok">✅ BuggyWidget 正常運作中</div>`
})

const triggerError = ref(false)

// ── ✅ TODO 3 解答：表單驗證 ──────────────────────────────

const form = reactive({ name: '', email: '', role: '' })
const touched = reactive({ name: false, email: false, role: false })

// keyof typeof touched 限定 field 必須是 touched 的已知鍵名，避免索引型別錯誤
function touch(field: keyof typeof touched): void { touched[field] = true }

const errors = computed(() => {
  // Record<string, string> 明確宣告 e 可接受任意字串 key，避免 TypeScript 索引錯誤
  const e: Record<string, string> = {}

  // name：必填，且至少需要 2 個字
  if (touched.name) {
    if (!form.name.trim()) {
      e.name = '姓名為必填'
    } else if (form.name.trim().length < 2) {
      e.name = '姓名至少需要 2 個字'
    }
  }

  // email：必填，格式需包含 @ 符號（使用簡單正則驗證）
  if (touched.email) {
    if (!form.email.trim()) {
      e.email = 'Email 為必填'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Email 格式不正確'
    }
  }

  // role：必填（不能是空字串）
  if (touched.role && !form.role) {
    e.role = '請選擇角色'
  }

  return e
})

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

const isSubmitting = ref(false)
const submitSuccess = ref(false)

async function handleSubmit() {
  // 強制所有欄位標記為已觸碰，讓所有錯誤訊息顯示
  // keyof typeof touched 限定 k 索引型別，避免字串索引安全性錯誤
  Object.keys(touched).forEach(k => (touched[k as keyof typeof touched] = true))
  if (hasErrors.value) return

  isSubmitting.value = true
  try {
    const newUser = await mockApiCall('/users/add', { ...form })
    // 直接更新本地列表，不需要重新 fetch（效能較佳）
    if (users.data.value) {
      users.data.value = [...users.data.value, newUser]
    }
    Object.assign(form, { name: '', email: '', role: '' })
    Object.assign(touched, { name: false, email: false, role: false })
    submitSuccess.value = true
    setTimeout(() => (submitSuccess.value = false), 3000)
  } catch (e: unknown) {
    // e: unknown 用 instanceof 確保安全取得 message
    componentErrors.value.push({ message: e instanceof Error ? e.message : String(e), info: 'handleSubmit', time: new Date().toLocaleTimeString() })
  } finally {
    isSubmitting.value = false
  }
}

// ── ✅ TODO 4 解答：defineAsyncComponent StatsPanel ──────
// loader 是一個回傳 Promise<ComponentDefinition> 的函式
// Vite 在真實場景中會將 () => import('./Stats.vue') 打包成獨立 chunk

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

// 模擬「新增後統計面板資料也會更新」：每次 StatsPanel 掛載都重新 fetch
const StatsPanel = defineAsyncComponent({
  // loader 是回傳 Promise<{ template, setup, ... }> 的函式
  // 真實場景：loader: () => import('./StatsPanel.vue')
  loader: async () => {
    const stats = await mockApiCall('/stats')
    return {
      name: 'StatsPanel',
      setup() {
        // 將 API 結果暴露給 template
        return { stats }
      },
      template: `
        <div class="stats-panel">
          <h5>📊 系統統計（動態載入 ✅）</h5>
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
    }
  },
  // 載入期間顯示骨架屏，避免空白閃爍
  loadingComponent: StatsPanelSkeleton,
  // 超過 200ms 才顯示 loading（避免快速網路下的閃爍）
  delay: 200,
})

/** 用於強制重新載入 StatsPanel（新增使用者後重整統計）*/
const statsKey = ref(0)
function refreshStats() { statsKey.value++ }

// 根據角色回傳對應的 CSS badge class
// role: string 避免元素隱式任意索引型別錯誤
function getRoleClass(role: string): string {
  return { admin: 'badge-admin', editor: 'badge-editor', viewer: 'badge-viewer' }[role] ?? ''
}
</script>

<template>
  <div class="admin-panel">
    <h3>🖥️ Q99 — 小型後台管理系統（解答）</h3>

    <!-- ── 錯誤邊界顯示 ── -->
    <div v-if="componentErrors.length" class="error-boundary">
      <h4>⚠️ 元件錯誤已被 onErrorCaptured 捕捉</h4>
      <div v-for="(err, i) in componentErrors" :key="i" class="error-item">
        <span class="error-time">{{ err.time }}</span>
        <span class="error-msg">{{ err.message }}</span>
        <span class="error-info">（{{ err.info }}）</span>
      </div>
      <button class="btn btn-sm btn-clear" @click="componentErrors = []">清除</button>
    </div>

    <div class="main-grid">
      <!-- ── 左欄：統計面板（defineAsyncComponent）── -->
      <aside class="panel-side">
        <div class="panel-side-header">
          <h4>統計面板</h4>
          <!-- :key 改變會強制重新掛載（重新觸發 loader）-->
          <button class="btn btn-sm" @click="refreshStats">↺ 重新整理</button>
        </div>
        <StatsPanel :key="statsKey" />
      </aside>

      <!-- ── 右欄：使用者列表 ── -->
      <main class="panel-main">
        <h4>使用者列表</h4>

        <div v-if="users.isLoading.value" class="loading-row">
          <span class="spinner"></span> 載入中…
        </div>
        <div v-else-if="users.error.value" class="fetch-error">
          ❌ {{ users.error.value }}
          <button class="btn btn-sm" @click="users.execute()">重試</button>
        </div>
        <table v-else-if="users.data.value" class="user-table">
          <thead>
            <tr>
              <th>ID</th><th>姓名</th><th>Email</th><th>角色</th><th>狀態</th>
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
      </main>
    </div>

    <!-- ── 新增使用者表單 ── -->
    <section class="form-section">
      <h4>新增使用者</h4>
      <div v-if="submitSuccess" class="success-msg">✅ 新增成功！使用者已加入列表。</div>

      <form class="user-form" @submit.prevent="handleSubmit">
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

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            class="input"
            :class="{ 'input-error': errors.email }"
            placeholder="user@example.com"
            @blur="touch('email')"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

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
    </section>

    <!-- ── 錯誤處理測試區 ── -->
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
        <span class="hint">切換後觀察上方錯誤面板（onErrorCaptured 已攔截）</span>
      </div>
      <BuggyWidget :should-fail="triggerError" :key="String(triggerError)" />
    </section>

    <!-- ── 解答程式碼說明 ── -->
    <section class="answer-section">
      <h4>✅ 四個 TODO 的解答</h4>
      <pre v-pre class="code-block">// TODO 1：useFetch execute() — try/catch/finally
async function execute() {
  isLoading.value = true
  error.value = null
  try {
    data.value = await mockApiCall(toValue(endpoint))  // toValue() 解包 ref
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false  // 無論成功失敗都關閉 loading
  }
}

// TODO 2：onErrorCaptured（在 &lt;script setup&gt; 頂層呼叫）
onErrorCaptured((err, instance, info) => {
  componentErrors.value.push({ message: err.message, info, time: new Date().toLocaleTimeString() })
  return false  // 阻止繼續向上傳播
})

// TODO 3：errors computed（觸碰後才驗證）
const errors = computed(() => {
  const e = {}
  if (touched.name && !form.name.trim()) e.name = '姓名為必填'
  if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email 格式不正確'
  if (touched.role && !form.role) e.role = '請選擇角色'
  return e
})

// TODO 4：defineAsyncComponent（StatsPanel 動態載入）
const StatsPanel = defineAsyncComponent({
  loader: async () => {
    const stats = await mockApiCall('/stats')
    return { name: 'StatsPanel', setup() { return { stats } }, template: `...` }
  },
  loadingComponent: StatsPanelSkeleton,
  delay: 200,
})</pre>
    </section>
  </div>
</template>

<style scoped>
.admin-panel { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h4 { color: var(--color-secondary); margin: 0 0 var(--space-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }

.error-boundary { padding: var(--space-md); background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 6px; }
.error-boundary h4 { color: #dc2626; margin: 0; font-size: var(--font-size-sm); }
.error-item { display: flex; gap: 8px; font-size: var(--font-size-sm); flex-wrap: wrap; }
.error-time { color: #9ca3af; flex-shrink: 0; }
.error-msg  { color: #dc2626; font-weight: 600; }
.error-info { color: #6b7280; font-size: 0.75rem; }

.main-grid { display: grid; grid-template-columns: 220px 1fr; gap: var(--space-md); }
@media (max-width: 640px) { .main-grid { grid-template-columns: 1fr; } }
.panel-side { display: flex; flex-direction: column; gap: var(--space-sm); }
.panel-side-header { display: flex; align-items: center; justify-content: space-between; }
.panel-main { display: flex; flex-direction: column; gap: var(--space-sm); }

:deep(.stats-panel) { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
:deep(.stats-panel h5) { font-size: var(--font-size-sm); font-weight: 700; color: var(--color-secondary); margin: 0 0 var(--space-sm); }
:deep(.stats-grid) { display: flex; flex-direction: column; gap: 8px; }
:deep(.stat-item) { padding: 8px; background: var(--color-bg); border-radius: var(--radius-sm); border: 1px solid var(--color-border); text-align: center; }
:deep(.stat-label) { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }
:deep(.stat-value) { font-size: 1.2rem; font-weight: 700; margin: 2px 0 0; color: var(--color-primary); }
:deep(.widget-ok) { font-size: var(--font-size-sm); color: #16a34a; padding: 8px; background: #f0fdf4; border-radius: var(--radius-sm); }

:deep(.stats-skeleton) { padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm); }
:deep(.skel-title) { height: 14px; width: 60%; border-radius: 4px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
:deep(.skel-row) { display: flex; flex-direction: column; gap: 8px; }
:deep(.skel-card) { height: 50px; border-radius: var(--radius-sm); background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.loading-row { display: flex; align-items: center; gap: 8px; font-size: var(--font-size-sm); color: var(--color-text-muted); padding: var(--space-md); }
.spinner { width: 16px; height: 16px; border: 2px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.fetch-error { padding: var(--space-sm) var(--space-md); background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); color: #dc2626; font-size: var(--font-size-sm); display: flex; align-items: center; gap: var(--space-sm); }

.user-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.user-table th { padding: 6px 10px; background: var(--color-bg-card); color: var(--color-secondary); font-weight: 600; text-align: left; border-bottom: 2px solid var(--color-border); }
.user-table td { padding: 7px 10px; border-bottom: 1px solid var(--color-border); }
.td-id    { color: var(--color-text-muted); width: 40px; }
.td-email { color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8rem; }
.badge { padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.badge-admin  { background: #fef3c7; color: #92400e; }
.badge-editor { background: #dbeafe; color: #1e40af; }
.badge-viewer { background: #f3f4f6; color: #374151; }
.status { font-size: 0.75rem; font-weight: 600; }
.status.active   { color: #16a34a; }
.status.inactive { color: #9ca3af; }

.form-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
.user-form { display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: var(--space-sm); align-items: end; }
@media (max-width: 640px) { .user-form { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: var(--color-secondary); }
.input { padding: 7px 10px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: var(--font-size-sm); background: var(--color-bg); color: var(--color-text); }
.input-error { border-color: #f87171; }
.field-error { font-size: 0.75rem; color: #dc2626; }
.success-msg { padding: 8px 12px; background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-sm); color: #16a34a; font-size: var(--font-size-sm); font-weight: 600; }

.error-test-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
.error-controls { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }

.answer-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }

.btn { padding: 8px 18px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-sm { padding: 5px 12px; font-size: 0.8rem; }
.btn-danger { background: #dc2626; }
.btn-clear  { background: #6b7280; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
