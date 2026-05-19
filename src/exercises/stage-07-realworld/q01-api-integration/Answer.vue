<script setup lang="ts">
/** Q01 — API 整合模式（useFetch Composable）（解答）
 *
 *  TODO 解答：
 *  1. useFetch：try/catch/finally 三段式 + onMounted 自動執行
 *  2. 元件中呼叫 useFetch(currentEndpoint) 並渲染結果
 *
 *  重點：
 *  - finally 確保 isLoading=false 無論成功或失敗
 *  - 傳入 ref 讓 composable 能響應端點切換
 *  - execute 作為手動重試的入口
 */
import { ref, onMounted, toValue, type Ref } from 'vue'

// ── 模擬 API ─────────────────────────────────────────────
const shouldFail = ref(false)

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
// ✅ TODO 1 解答：useFetch composable 完整實作
// ═══════════════════════════════════════════════════════
// 支援傳入 string 或 Ref<string>，內部用 toValue 統一讀取
function useFetch(endpoint: string | Ref<string>) {
  // any 允許模板動態存取 /users 與 /posts 不同欄位（教學演示用）
  const data      = ref<any>(null)
  const isLoading = ref(false)
  const error     = ref<string | null>(null)  // null = 無錯誤，string = 錯誤訊息

  async function execute() {
    // 步驟 1：進入 loading 狀態，清除舊錯誤
    isLoading.value = true
    error.value     = null

    try {
      // 步驟 2：呼叫 API（toValue 支援傳入 ref 或純字串）
      const result = await mockApi(toValue(endpoint))
      data.value = result  // 步驟 3：存入資料
    } catch (e) {
      // e 在 TypeScript strict 模式下是 unknown，需斷言為 Error 才能讀取 message
      error.value = (e as Error).message
    } finally {
      // 步驟 5：無論成功或失敗，都結束 loading
      isLoading.value = false
    }
  }

  // 元件掛載時自動執行第一次請求
  onMounted(execute)

  return { data, isLoading, error, execute }
}

// ═══════════════════════════════════════════════════════
// ✅ TODO 2 解答：在元件中使用 useFetch
// ═══════════════════════════════════════════════════════
const currentEndpoint = ref('/users')

// 傳入 ref 讓 execute 每次都讀取最新端點
const { data, isLoading, error, execute } = useFetch(currentEndpoint)

// 切換端點後重新載入
function switchEndpoint(ep: string): void {
  currentEndpoint.value = ep
  execute()
}
</script>

<template>
  <div class="api-demo">
    <h3>🌐 Q01 — useFetch Composable（解答）</h3>

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

      <div v-if="isLoading" class="loading-box">
        <div class="spinner"></div>
        <span>請求中…</span>
      </div>

      <div v-else-if="error" class="error-box">❌ {{ error }}</div>

      <ul v-else-if="currentEndpoint === '/users' && data" class="data-list">
        <li v-for="u in data" :key="u.id" class="data-item">
          <span class="item-avatar">{{ u.name[0] }}</span>
          <span class="item-info">
            <strong>{{ u.name }}</strong>
            <small>{{ u.email }}</small>
          </span>
          <span class="item-badge">{{ u.role }}</span>
        </li>
      </ul>

      <ul v-else-if="currentEndpoint === '/posts' && data" class="data-list">
        <li v-for="p in data" :key="p.id" class="data-item">
          <span class="item-info"><strong>{{ p.title }}</strong></span>
          <span class="item-views">👁 {{ p.views.toLocaleString() }}</span>
        </li>
      </ul>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section">
      <h4>✅ useFetch 完整解答</h4>
      <pre v-pre class="code-block">function useFetch(endpoint) {
  const data      = ref(null)
  const isLoading = ref(false)
  const error     = ref(null)

  async function execute() {
    isLoading.value = true   // 開始 loading
    error.value = null       // 清除舊錯誤
    try {
      data.value = await mockApi(toValue(endpoint))  // toValue → 支援 ref 或字串
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false  // 無論如何都結束 loading
    }
  }

  onMounted(execute)  // 掛載時自動執行

  return { data, isLoading, error, execute }
}

// 元件中使用
const { data, isLoading, error, execute } = useFetch(currentEndpoint)</pre>
    </section>
  </div>
</template>

<style scoped>
.api-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
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
