<script setup lang="ts">
/** Q01 — API 整合模式（useFetch Composable）（練習）
 *
 *  真實專案中，API 呼叫邏輯封裝成 Composable 以便複用。
 *  useFetch 管理三個核心狀態：data / isLoading / error
 *
 *  TODO 1：補齊 useFetch(endpoint) 的完整實作
 *    - execute() 中用 try/catch/finally 管理三個狀態
 *    - onMounted 自動執行第一次請求
 *    - 回傳 { data, isLoading, error, execute }
 *
 *  TODO 2：在元件中呼叫 useFetch，並在 template 渲染資料
 */
import { ref, onMounted, type Ref } from 'vue'

// ── 模擬 API（不需要真實網路連線）──────────────────────
// 延遲 800ms 後回傳假資料（或拋出錯誤）
const shouldFail = ref(false)  // 模擬錯誤開關

const MOCK_DATA = {
  '/users': [
    { id: 1, name: '王小明', email: 'ming@example.com', role: 'Admin' },
    { id: 2, name: '李小美', email: 'mei@example.com',  role: 'Editor' },
    { id: 3, name: '張大偉', email: 'wei@example.com',  role: 'Viewer' },
  ],
  '/posts': [
    { id: 1, title: 'Vue 3 響應式深入解析',  views: 1240 },
    { id: 2, title: 'Pinia vs Vuex 完整比較', views: 3820 },
    { id: 3, title: 'Vite 建置效能優化指南',  views: 2150 },
  ]
}

function mockApi(endpoint: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail.value) {
        reject(new Error('Network Error：API 伺服器無回應'))
      } else {
        // 使用 as keyof typeof MOCK_DATA 確保型別安全索引
        resolve(MOCK_DATA[endpoint as keyof typeof MOCK_DATA] ?? [])
      }
    }, 800)
  })
}

// ═══════════════════════════════════════════════════════
// TODO 1：實作 useFetch composable
// 支援傳入 string 或 Ref<string>，內部用 toValue 統一讀取
function useFetch(endpoint: string | Ref<string>) {
  // 三個核心狀態
  const data      = ref(null)   // 請求成功後的資料
  const isLoading = ref(false)  // 請求進行中
  const error     = ref(null)   // 錯誤訊息（null = 無錯誤）

  // TODO 1-A：實作 execute()
  // 流程：isLoading=true → 清除 error → await mockApi → 存入 data
  //       catch: 將 e.message 存入 error
  //       finally: isLoading=false（無論成功失敗都要執行）
  async function execute() {
    // 在這裡實作...
  }

  // TODO 1-B：在 onMounted 中自動執行第一次請求
  // onMounted(execute)

  // 回傳供元件使用的狀態與方法
  return { data, isLoading, error, execute }
}

// ═══════════════════════════════════════════════════════
// TODO 2：在元件中呼叫 useFetch
// ═══════════════════════════════════════════════════════

// 目前切換的 API 端點
const currentEndpoint = ref('/users')

// TODO 2：呼叫 useFetch，解構出 data, isLoading, error, execute
// const { data, isLoading, error, execute } = useFetch(currentEndpoint)
// 提示：currentEndpoint 是 ref，傳入後 useFetch 應用 toValue() 讀取值
//       或直接傳字串：useFetch('/users')，切換時手動呼叫 execute

// 暫時使用假狀態（完成 TODO 後請刪除）
const data      = ref(null)
const isLoading = ref(false)
const error     = ref(null)
function execute() {}

// 切換端點並重新載入
function switchEndpoint(ep: string): void {
  currentEndpoint.value = ep
  execute()
}
</script>

<template>
  <div class="api-demo">
    <h3>🌐 Q01 — useFetch Composable（練習）</h3>

    <!-- 控制列 -->
    <section class="demo-section">
      <h4>API 控制</h4>
      <div class="controls">
        <div class="endpoint-tabs">
          <button
            v-for="ep in ['/users', '/posts']"
            :key="ep"
            class="ep-btn"
            :class="{ active: currentEndpoint === ep }"
            @click="switchEndpoint(ep)"
          >{{ ep }}</button>
        </div>
        <button class="btn btn-sm" :disabled="isLoading" @click="execute">
          {{ isLoading ? '載入中…' : '🔄 重新載入' }}
        </button>
        <label class="toggle-label">
          <input type="checkbox" v-model="shouldFail" />
          <span>模擬錯誤</span>
        </label>
      </div>
    </section>

    <!-- 結果區 -->
    <section class="demo-section">
      <h4>API 結果（<code>{{ currentEndpoint }}</code>）</h4>

      <!-- Loading 狀態 -->
      <div v-if="isLoading" class="loading-box">
        <div class="spinner"></div>
        <span>請求中…</span>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="error-box">❌ {{ error }}</div>

      <!-- 資料尚未載入 -->
      <p v-else-if="!data" class="hint">點擊「重新載入」或完成 TODO 後自動載入</p>

      <!-- 成功：Users -->
      <ul v-else-if="currentEndpoint === '/users'" class="data-list">
        <li v-for="u in data" :key="u.id" class="data-item">
          <span class="item-avatar">{{ u.name[0] }}</span>
          <span class="item-info">
            <strong>{{ u.name }}</strong>
            <small>{{ u.email }}</small>
          </span>
          <span class="item-badge">{{ u.role }}</span>
        </li>
      </ul>

      <!-- 成功：Posts -->
      <ul v-else-if="currentEndpoint === '/posts'" class="data-list">
        <li v-for="p in data" :key="p.id" class="data-item">
          <span class="item-info"><strong>{{ p.title }}</strong></span>
          <span class="item-views">👁 {{ p.views.toLocaleString() }}</span>
        </li>
      </ul>
    </section>

    <!-- 語法提示 -->
    <section class="demo-section">
      <h4>useFetch 骨架提示</h4>
      <pre v-pre class="code-block">function useFetch(endpoint) {
  const data      = ref(null)
  const isLoading = ref(false)
  const error     = ref(null)

  async function execute() {
    isLoading.value = true     // 開始 loading
    error.value = null         // 清除舊錯誤
    try {
      const result = await mockApi(endpoint)
      data.value = result      // 存入資料
    } catch (e) {
      error.value = e.message  // 存入錯誤訊息
    } finally {
      isLoading.value = false  // 無論成功失敗，結束 loading
    }
  }

  onMounted(execute)  // 元件掛載時自動執行

  return { data, isLoading, error, execute }
}</pre>
    </section>
  </div>
</template>

<style scoped>
.api-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
code { background: var(--color-border); padding: 1px 5px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; }
.controls { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.endpoint-tabs { display: flex; gap: 4px; }
.ep-btn { padding: 4px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); font-family: var(--font-mono); }
.ep-btn.active { border-color: var(--color-primary); background: rgba(99,102,241,0.1); color: var(--color-primary); font-weight: 600; }
.toggle-label { display: flex; align-items: center; gap: 6px; font-size: var(--font-size-sm); cursor: pointer; }
.loading-box { display: flex; align-items: center; gap: var(--space-sm); color: var(--color-text-muted); font-size: var(--font-size-sm); padding: var(--space-md) 0; }
.spinner { width: 18px; height: 18px; border: 2px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.error-box { background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); padding: var(--space-sm) var(--space-md); color: #dc2626; font-size: var(--font-size-sm); }
.data-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.data-item { display: flex; align-items: center; gap: var(--space-sm); padding: 10px 12px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.item-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; flex-shrink: 0; }
.item-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.item-info strong { font-size: var(--font-size-sm); }
.item-info small { font-size: 0.75rem; color: var(--color-text-muted); }
.item-badge { font-size: 0.75rem; padding: 2px 8px; background: rgba(99,102,241,0.12); color: var(--color-primary); border-radius: 99px; }
.item-views { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
