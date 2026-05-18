<script setup>
/** Q05 — Suspense 與非同步元件（解答）
 *
 *  TODO 解答：
 *  TODO 1：<Suspense> 包住 <AsyncCard>，提供 #default 與 #fallback 插槽
 *  TODO 2：onErrorCaptured((err) => { errorMsg.value = err.message; return false })
 *
 *  重點：
 *  - Suspense 等待 async setup() 中所有 await 完成後，才切換到 #default slot
 *  - onErrorCaptured 回傳 false 代表「已處理，不繼續向上傳播」
 *  - :key 改變時，子元件完全重建（可用於重試非同步載入）
 */
import { ref, defineComponent, onErrorCaptured } from 'vue'

// ── 控制旗標 ─────────────────────────────────────────────
const shouldFail = ref(false)
const loadKey   = ref(0)
const errorMsg  = ref('')
const triggered = ref(false)

// ── 模擬非同步 API ────────────────────────────────────────
function mockFetchUser() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail.value) {
        reject(new Error('伺服器錯誤 (500)：無法取得使用者資料'))
      } else {
        resolve({ name: '王小明', role: '前端工程師', level: 'Senior', avatar: '👨‍💻' })
      }
    }, 1500)
  })
}

// ── 非同步子元件（async setup）───────────────────────────
const AsyncCard = defineComponent({
  async setup() {
    // 此 await 讓 Suspense 知道需要等待
    const user = await mockFetchUser()
    return { user }
  },
  template: `
    <div class="user-card">
      <div class="avatar">{{ user.avatar }}</div>
      <div class="user-info">
        <p class="user-name">{{ user.name }}</p>
        <p class="user-role">{{ user.role }}</p>
        <span class="user-badge">{{ user.level }}</span>
      </div>
    </div>
  `
})

// 重新載入：清除錯誤並遞增 key
function reload() {
  errorMsg.value = ''
  triggered.value = true
  loadKey.value++
}

// ✅ TODO 2 解答：捕捉子元件非同步錯誤
// return false → 告訴 Vue 此錯誤已被處理，停止向上傳播
onErrorCaptured((err) => {
  errorMsg.value = err.message
  return false
})
</script>

<template>
  <div class="suspense-demo">
    <h3>⏳ Q05 — Suspense 與非同步元件（解答）</h3>

    <section class="demo-section">
      <h4>非同步使用者卡片（含骨架屏）</h4>

      <div class="controls">
        <button class="btn btn-sm" @click="reload">🔄 載入 / 重新載入</button>
        <label class="toggle-label">
          <input type="checkbox" v-model="shouldFail" />
          <span>模擬錯誤</span>
        </label>
      </div>

      <div v-if="errorMsg" class="error-box">❌ {{ errorMsg }}</div>

      <div class="card-area">
        <p v-if="!triggered" class="hint">點擊上方按鈕開始載入</p>

        <!-- ✅ TODO 1 解答：<Suspense> 提供 #default 和 #fallback 插槽 -->
        <!-- 載入期間（1.5s）顯示骨架屏；載入完成後顯示 AsyncCard       -->
        <Suspense v-if="triggered && !errorMsg">
          <template #default>
            <!-- :key="loadKey" → key 改變時強制重建元件（重試機制）-->
            <AsyncCard :key="loadKey" />
          </template>
          <template #fallback>
            <!-- 骨架屏：閃爍動畫模擬「內容正在載入」的視覺效果 -->
            <div class="skeleton">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-lines">
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
              </div>
            </div>
          </template>
        </Suspense>
      </div>
    </section>

    <!-- ── 解答說明 ── -->
    <section class="demo-section">
      <h4>✅ 完整 Suspense 寫法</h4>
      <pre v-pre class="code-block"><!-- TODO 1：Suspense 包住 async setup() 元件 -->
<Suspense>
  <template #default>
    <AsyncCard :key="loadKey" />   <!-- key 改變 → 重試 -->
  </template>
  <template #fallback>
    <div class="skeleton">載入中…</div>
  </template>
</Suspense>

// TODO 2：捕捉非同步子元件的錯誤
onErrorCaptured((err) => {
  errorMsg.value = err.message
  return false  // false = 已處理，停止向上傳播
})</pre>
    </section>
  </div>
</template>

<style scoped>
.suspense-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.controls { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.toggle-label { display: flex; align-items: center; gap: 6px; font-size: var(--font-size-sm); cursor: pointer; }
.card-area { min-height: 80px; display: flex; align-items: center; padding: var(--space-sm) 0; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.error-box { background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); padding: var(--space-sm) var(--space-md); color: #dc2626; font-size: var(--font-size-sm); }
/* 子元件（defineComponent template）的 DOM 不在 scoped 範圍，需用 :deep() */
:deep(.user-card) { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-lg); border: 1px solid var(--color-border); min-width: 260px; }
:deep(.avatar) { font-size: 2.5rem; line-height: 1; }
:deep(.user-info) { display: flex; flex-direction: column; gap: 4px; }
:deep(.user-name) { font-weight: 700; font-size: 1rem; margin: 0; }
:deep(.user-role) { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }
:deep(.user-badge) { font-size: 0.75rem; padding: 2px 8px; background: rgba(99,102,241,0.12); color: var(--color-primary); border-radius: 99px; align-self: flex-start; }
/* 骨架屏閃爍動畫 */
.skeleton { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); min-width: 260px; }
.skeleton-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; flex-shrink: 0; }
.skeleton-lines { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.skeleton-line { height: 14px; border-radius: 4px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.skeleton-line.short { width: 60%; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
